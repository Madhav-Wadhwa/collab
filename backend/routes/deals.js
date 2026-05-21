import express from 'express';
import DealEscrow from '../models/DealEscrow.js';
import Message from '../models/Message.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Get active deals for user
router.get('/', protect, async (req, res) => {
  const query = req.user.role === 'brand' ? { brandId: req.user._id } : { creatorId: req.user._id };

  try {
    const deals = await DealEscrow.find(query)
      .populate('campaignId')
      .populate('brandId', 'name email')
      .populate('creatorId', 'name email creatorProfile');
    res.json(deals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single deal
router.get('/:id', protect, async (req, res) => {
  try {
    const deal = await DealEscrow.findById(req.params.id)
      .populate('campaignId')
      .populate('brandId', 'name email')
      .populate('creatorId', 'name email creatorProfile');
    
    if (!deal) {
      return res.status(404).json({ message: 'Deal not found' });
    }

    // Verify ownership
    if (deal.brandId._id.toString() !== req.user._id.toString() && deal.creatorId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to access this deal room' });
    }

    res.json(deal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get messages for deal
router.get('/:id/messages', protect, async (req, res) => {
  try {
    const messages = await Message.find({ dealId: req.params.id })
      .populate('senderId', 'name role');
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create active deal (Brand only)
router.post('/', protect, async (req, res) => {
  const { campaignId, creatorId, contractAmount, milestones } = req.body;

  try {
    // Prevent duplicate deal rooms for the same campaign and creator
    const existingDeal = await DealEscrow.findOne({ campaignId, creatorId });
    if (existingDeal) {
      return res.status(400).json({ message: 'A deal room has already been established with this creator for this campaign.' });
    }

    const deal = await DealEscrow.create({
      campaignId,
      brandId: req.user._id,
      creatorId,
      contractAmount,
      milestones: milestones || [
        { label: 'Concept & Script Approval', amount: contractAmount * 0.2 },
        { label: 'Video Production (Unboxing)', amount: contractAmount * 0.5 },
        { label: 'Final Release & Engagement', amount: contractAmount * 0.3 }
      ],
      status: 'Locked',
      escrowFundsPercent: 80
    });

    res.status(201).json(deal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update tracking number (for barter verification)
router.put('/:id/tracking', protect, async (req, res) => {
  const { trackingNumber } = req.body;

  try {
    const deal = await DealEscrow.findById(req.params.id);
    if (!deal) return res.status(404).json({ message: 'Deal not found' });

    deal.trackingNumber = trackingNumber;
    // When shipment is added, transition status to Shipped
    if (deal.status === 'Locked') {
      deal.status = 'Shipped';
    }
    await deal.save();

    res.json(deal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Toggle milestone completion (Both brand and creator triggers but brand approves)
router.put('/:id/milestones/:milestoneId', protect, async (req, res) => {
  try {
    const deal = await DealEscrow.findById(req.params.id);
    if (!deal) return res.status(404).json({ message: 'Deal not found' });

    const milestone = deal.milestones.id(req.params.milestoneId);
    if (!milestone) return res.status(404).json({ message: 'Milestone not found' });

    // Toggle completed
    milestone.completed = !milestone.completed;
    milestone.completedAt = milestone.completed ? new Date() : undefined;

    // Check if all milestones are completed to auto-transition status
    const allCompleted = deal.milestones.every(m => m.completed);
    if (allCompleted) {
      deal.status = 'Released';
      deal.escrowFundsPercent = 100;
    } else if (deal.milestones[0].completed) {
      deal.status = 'Live';
    }

    await deal.save();
    res.json(deal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Directly update status
router.put('/:id/status', protect, async (req, res) => {
  const { status } = req.body;

  try {
    const deal = await DealEscrow.findById(req.params.id);
    if (!deal) return res.status(404).json({ message: 'Deal not found' });

    deal.status = status;
    if (status === 'Released') {
      deal.escrowFundsPercent = 100;
    }
    await deal.save();

    res.json(deal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
