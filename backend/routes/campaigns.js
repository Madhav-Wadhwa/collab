import express from 'express';
import Campaign from '../models/Campaign.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Get campaigns (filtered or all)
router.get('/', protect, async (req, res) => {
  const { niche, type, search } = req.query;
  const filter = {};

  if (niche && niche !== 'ALL' && niche !== 'ALL CREATORS') {
    filter.nicheTags = { $regex: new RegExp(niche, 'i') };
  }
  if (type) {
    filter.campaignType = type;
  }
  if (search) {
    filter.title = { $regex: new RegExp(search, 'i') };
  }

  try {
    const campaigns = await Campaign.find(filter).populate('brandId', 'name email');
    res.json(campaigns);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create campaign (Brands only)
router.post('/', protect, authorize('brand'), async (req, res) => {
  const { title, description, campaignType, budget, nicheTags, metricsTarget } = req.body;

  try {
    const campaign = await Campaign.create({
      brandId: req.user._id,
      title,
      description,
      campaignType,
      budget,
      nicheTags,
      metricsTarget
    });

    res.status(201).json(campaign);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Apply to campaign (Creators only)
router.post('/:id/apply', protect, authorize('creator'), async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    if (campaign.appliedCreators.includes(req.user._id)) {
      return res.status(400).json({ message: 'You have already applied to this campaign' });
    }

    campaign.appliedCreators.push(req.user._id);
    await campaign.save();

    res.json({ message: 'Application submitted successfully', campaign });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete campaign (Brands only, Creator structurally blocked)
router.delete('/:id', protect, authorize('brand'), async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    // Ensure it belongs to this brand
    if (campaign.brandId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this campaign' });
    }

    await campaign.deleteOne();
    res.json({ message: 'Campaign successfully deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
