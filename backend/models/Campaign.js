import mongoose from 'mongoose';

const campaignSchema = new mongoose.Schema({
  brandId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  campaignType: {
    type: String,
    enum: ['Paid', 'Barter', 'Unpaid'],
    required: true
  },
  budget: {
    type: Number,
    required: true,
    default: 0
  },
  nicheTags: [String],
  metricsTarget: {
    engagementRate: { type: Number, default: 0 },
    followersMin: { type: Number, default: 0 }
  },
  status: {
    type: String,
    enum: ['Active', 'Paused', 'Completed'],
    default: 'Active'
  },
  appliedCreators: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

const Campaign = mongoose.model('Campaign', campaignSchema);
export default Campaign;
