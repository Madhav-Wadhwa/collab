import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret123', {
    expiresIn: '30d'
  });
};

// Register
router.post('/register', async (req, res) => {
  const { name, email, password, role, creatorProfile } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
      creatorProfile: role === 'creator' ? {
        instagramUsername: creatorProfile?.instagramUsername || '',
        followersCount: creatorProfile?.followersCount || 1000,
        engagementRate: creatorProfile?.engagementRate || 3.2,
        niche: creatorProfile?.niche || ['lifestyle'],
        bio: creatorProfile?.bio || '',
        profileImage: creatorProfile?.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
        aiInsights: {
          brandSafetyScore: 98,
          predictedRoiMultiplier: 2.8,
          audienceDemographics: { male: 40, female: 60 },
          nicheInsights: 'Excellent content consistency in niche and steady engagement growth.'
        }
      } : undefined
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      creatorProfile: user.creatorProfile,
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        creatorProfile: user.creatorProfile,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or passcode' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get profile
router.get('/me', protect, async (req, res) => {
  res.json(req.user);
});

// Toggle user role
router.put('/role', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.role = user.role === 'creator' ? 'brand' : 'creator';
    if (user.role === 'creator' && !user.creatorProfile?.instagramUsername) {
      user.creatorProfile = {
        instagramUsername: user.name.toLowerCase().replace(/\s+/g, '_') + '_connect',
        followersCount: 10245,
        engagementRate: 8.4,
        niche: ['lifestyle', 'tech'],
        bio: 'Premium creative technologist specializing in interactive visuals and cyber luxury.',
        profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
        aiInsights: {
          brandSafetyScore: 99,
          predictedRoiMultiplier: 4.8,
          audienceDemographics: { male: 52, female: 48 },
          nicheInsights: 'Maintains elite conversion velocity and clean Brand Safety ratings.'
        }
      };
    }
    await user.save();
    
    // Generate token or re-use existing
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret123', {
      expiresIn: '30d'
    });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      creatorProfile: user.creatorProfile,
      token
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all creators
router.get('/creators', protect, async (req, res) => {
  try {
    const creators = await User.find({ role: 'creator' }).select('-password');
    res.json(creators);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
