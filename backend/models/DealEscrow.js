import mongoose from 'mongoose';

const dealEscrowSchema = new mongoose.Schema({
  campaignId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Campaign',
    required: true
  },
  brandId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  creatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['Locked', 'Shipped', 'Live', 'Released'],
    default: 'Locked',
    required: true
  },
  contractAmount: {
    type: Number,
    required: true
  },
  trackingNumber: {
    type: String
  },
  escrowFundsPercent: {
    type: Number,
    default: 0
  },
  milestones: [{
    label: { type: String, required: true },
    amount: { type: Number, required: true },
    completed: { type: Boolean, default: false },
    completedAt: Date
  }]
}, {
  timestamps: true
});

const DealEscrow = mongoose.model('DealEscrow', dealEscrowSchema);
export default DealEscrow;
