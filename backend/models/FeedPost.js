import mongoose from 'mongoose';

const feedPostSchema = new mongoose.Schema({
  creatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  image: String,
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: String,
    text: String,
    createdAt: { type: Date, default: Date.now }
  }],
  metricsData: {
    views: { type: Number, default: 0 },
    engagementRate: { type: Number, default: 0 },
    salesGenerated: { type: Number, default: 0 },
    roiMultiplier: { type: Number, default: 0 }
  },
  aiPerformanceScore: {
    type: Number,
    default: 75
  },
  aiAnalysisSummary: String
}, {
  timestamps: true
});

const FeedPost = mongoose.model('FeedPost', feedPostSchema);
export default FeedPost;
