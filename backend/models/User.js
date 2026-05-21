import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['creator', 'brand'],
    required: true
  },
  creatorProfile: {
    instagramUsername: String,
    followersCount: { type: Number, default: 0 },
    engagementRate: { type: Number, default: 0 },
    niche: [String],
    bio: String,
    profileImage: String,
    aiInsights: {
      brandSafetyScore: { type: Number, default: 95 },
      predictedRoiMultiplier: { type: Number, default: 2.5 },
      audienceDemographics: {
        male: { type: Number, default: 45 },
        female: { type: Number, default: 55 }
      },
      nicheInsights: String
    }
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
