import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import GlassCard from '../components/GlassCard';
import { motion, AnimatePresence } from 'framer-motion';

export default function Feed() {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [showMetricsInput, setShowMetricsInput] = useState(false);
  const [views, setViews] = useState('');
  const [engagementRate, setEngagementRate] = useState('');
  const [salesGenerated, setSalesGenerated] = useState('');
  const [roiMultiplier, setRoiMultiplier] = useState('');
  const [commentTexts, setCommentTexts] = useState({});

  const fetchFeed = async () => {
    try {
      const res = await fetch('/api/feed', {
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchFeed();
    }
  }, [user]);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    const payload = {
      content,
      image: imageUrl.trim() || undefined,
      metricsData: showMetricsInput ? {
        views: Number(views) || undefined,
        engagementRate: Number(engagementRate) || undefined,
        salesGenerated: Number(salesGenerated) || undefined,
        roiMultiplier: Number(roiMultiplier) || undefined
      } : undefined
    };

    try {
      const res = await fetch('/api/feed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setContent('');
        setImageUrl('');
        setViews('');
        setEngagementRate('');
        setSalesGenerated('');
        setRoiMultiplier('');
        setShowMetricsInput(false);
        fetchFeed(); // reload
      } else {
        alert('Failed to submit performance post');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLike = async (postId) => {
    try {
      const res = await fetch(`/api/feed/${postId}/like`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      if (res.ok) {
        fetchFeed();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCommentSubmit = async (e, postId) => {
    e.preventDefault();
    const commentText = commentTexts[postId];
    if (!commentText || !commentText.trim()) return;

    try {
      const res = await fetch(`/api/feed/${postId}/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ text: commentText })
      });

      if (res.ok) {
        setCommentTexts(prev => ({ ...prev, [postId]: '' }));
        fetchFeed();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCommentTextChange = (postId, text) => {
    setCommentTexts(prev => ({ ...prev, [postId]: text }));
  };

  return (
    <div className="pt-24 pb-20 px-grid-margin max-w-4xl mx-auto space-y-10">
      <div className="space-y-4">
        <h1 className="font-display text-5xl md:text-7xl text-white uppercase tracking-tighter">
          CREATOR FEED
        </h1>
        <p className="font-body text-[#cfc4c5] max-w-xl text-sm">
          LinkedIn-style network verification engine. Review campaigns, showcase conversion metrics, and evaluate safety scores.
        </p>
      </div>

      {/* Post Creation Panel */}
      {user.role === 'creator' && (
        <GlassCard className="space-y-4">
          <span className="font-label text-xs tracking-widest text-accent-fuchsia block">LOG CAMPAIGN RESULTS</span>
          
          <form onSubmit={handleCreatePost} className="space-y-4">
            <textarea
              placeholder="What campaign results did you achieve? Outline metrics..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full bg-[#0e0e0e] border border-white/10 rounded-lg p-4 font-body text-sm text-white placeholder:text-white/20 focus:ring-0 focus:outline-none min-h-[100px]"
              required
            />

            <input
              type="text"
              placeholder="ATTACH CAMPAIGN BANNER IMAGE URL (OPTIONAL)"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full bg-[#0e0e0e] border border-white/10 rounded-lg py-3 px-4 font-label text-[10px] tracking-wider focus:ring-0 text-white placeholder:text-white/20"
            />

            <div className="flex justify-between items-center">
              <button
                type="button"
                onClick={() => setShowMetricsInput(!showMetricsInput)}
                className="font-label text-[10px] tracking-widest text-accent-lime hover:underline flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-sm">bar_chart</span>
                {showMetricsInput ? 'HIDE CAMPAIGN METRICS' : 'INJECT CONVERSION DATA'}
              </button>

              <button
                type="submit"
                className="bg-accent-fuchsia text-white font-display text-sm tracking-wider px-8 py-3 rounded-lg hover:scale-95 active:scale-90 transition-transform"
              >
                PUBLISH POST
              </button>
            </div>

            {/* Simulated Data Injections */}
            {showMetricsInput && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-white/5 rounded border border-white/5">
                <div className="space-y-1">
                  <label className="font-label text-[9px] text-[#cfc4c5]/60">VIEWS</label>
                  <input
                    type="number"
                    value={views}
                    onChange={(e) => setViews(e.target.value)}
                    className="w-full bg-[#0e0e0e] border border-white/10 rounded p-2 font-label text-[10px] text-white"
                    placeholder="e.g. 50000"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-label text-[9px] text-[#cfc4c5]/60">ENGAGEMENT %</label>
                  <input
                    type="number"
                    step="0.1"
                    value={engagementRate}
                    onChange={(e) => setEngagementRate(e.target.value)}
                    className="w-full bg-[#0e0e0e] border border-white/10 rounded p-2 font-label text-[10px] text-white"
                    placeholder="e.g. 4.8"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-label text-[9px] text-[#cfc4c5]/60">SALES VALUE ($)</label>
                  <input
                    type="number"
                    value={salesGenerated}
                    onChange={(e) => setSalesGenerated(e.target.value)}
                    className="w-full bg-[#0e0e0e] border border-white/10 rounded p-2 font-label text-[10px] text-white"
                    placeholder="e.g. 3500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-label text-[9px] text-[#cfc4c5]/60">ROI MULTIPLIER</label>
                  <input
                    type="number"
                    step="0.1"
                    value={roiMultiplier}
                    onChange={(e) => setRoiMultiplier(e.target.value)}
                    className="w-full bg-[#0e0e0e] border border-white/10 rounded p-2 font-label text-[10px] text-white"
                    placeholder="e.g. 3.2"
                  />
                </div>
              </div>
            )}
          </form>
        </GlassCard>
      )}

      {/* Feed List */}
      {loading ? (
        <div className="text-center font-label text-xs tracking-wider text-white/50 py-20">INGESTING FEED ENTRIES...</div>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <GlassCard key={post._id} className="space-y-6">
              {/* Creator details */}
              <div className="flex gap-4 items-center">
                <img
                  src={post.creatorId?.creatorProfile?.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
                  alt={post.creatorId?.name}
                  className="w-12 h-12 rounded-full object-cover border border-white/10"
                />
                <div>
                  <h3 className="font-display text-lg text-white uppercase tracking-tight leading-none">
                    {post.creatorId?.name}
                  </h3>
                  <p className="font-label text-[9px] text-accent-lime tracking-widest mt-1">
                    @{post.creatorId?.creatorProfile?.instagramUsername}
                  </p>
                </div>
              </div>

              {/* Post Content */}
              <div className="space-y-4">
                <p className="font-body text-sm text-[#cfc4c5] leading-relaxed">
                  {post.content}
                </p>

                {post.image && (
                  <div className="aspect-video w-full overflow-hidden bg-neutral-900 rounded-lg border border-white/5">
                    <img
                      src={post.image}
                      alt="Campaign Banner"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>

              {/* Conversion Statistics Dashboard */}
              {post.metricsData && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-white/5 rounded border border-white/5 text-center">
                  <div>
                    <p className="font-label text-[8px] text-[#cfc4c5]/60 tracking-wider">VIEWS VERIFIED</p>
                    <p className="font-display text-lg text-white mt-1">
                      {post.metricsData.views?.toLocaleString() || '120k'}
                    </p>
                  </div>
                  <div>
                    <p className="font-label text-[8px] text-[#cfc4c5]/60 tracking-wider">ENGAGEMENT</p>
                    <p className="font-display text-lg text-white mt-1">
                      {post.metricsData.engagementRate}%
                    </p>
                  </div>
                  <div>
                    <p className="font-label text-[8px] text-[#cfc4c5]/60 tracking-wider">SALES REVENUE</p>
                    <p className="font-display text-lg text-white mt-1">
                      ${post.metricsData.salesGenerated?.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="font-label text-[8px] text-[#cfc4c5]/60 tracking-wider">ROI MULTIPLIER</p>
                    <p className="font-display text-lg text-accent-lime mt-1">
                      {post.metricsData.roiMultiplier}x
                    </p>
                  </div>
                </div>
              )}

              {/* AI Performance Evaluation Shield */}
              {post.aiAnalysisSummary && (
                <div className="p-4 bg-accent-lime/5 border border-accent-lime/20 rounded-lg space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-label text-[9px] text-accent-lime tracking-widest font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">verified</span>
                      AI DIAGNOSTIC SHIELD
                    </span>
                    <span className="font-label text-[10px] text-accent-lime font-bold">
                      {post.aiPerformanceScore}% Performance Score
                    </span>
                  </div>
                  <p className="font-body text-xs text-[#cfc4c5] italic leading-relaxed">
                    "{post.aiAnalysisSummary}"
                  </p>
                </div>
              )}

              {/* Likes & Comments interface */}
              <div className="pt-4 border-t border-white/5 space-y-4">
                <div className="flex items-center gap-6">
                  <button
                    onClick={() => handleLike(post._id)}
                    className="flex items-center gap-1.5 font-label text-[10px] tracking-wider hover:text-white transition-colors"
                    style={{ color: post.likes.includes(user._id) ? '#FF007A' : '#cfc4c5' }}
                  >
                    <span className="material-symbols-outlined text-sm">favorite</span>
                    {post.likes.length} LIKES
                  </button>
                  <span className="font-label text-[10px] tracking-wider text-[#cfc4c5]">
                    {post.comments.length} COMMENTS
                  </span>
                </div>

                {/* Render Comments */}
                {post.comments.length > 0 && (
                  <div className="space-y-2 bg-white/5 p-4 rounded-lg border border-white/5 max-h-48 overflow-y-auto">
                    {post.comments.map((comment, index) => (
                      <div key={index} className="text-xs font-body leading-relaxed border-b border-white/5 pb-2 last:border-b-0">
                        <span className="font-bold text-white uppercase font-label text-[9px] tracking-wide block">
                          {comment.name}
                        </span>
                        <p className="text-[#cfc4c5] mt-0.5">{comment.text}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Comment Form */}
                <form onSubmit={(e) => handleCommentSubmit(e, post._id)} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Write a comment..."
                    value={commentTexts[post._id] || ''}
                    onChange={(e) => handleCommentTextChange(post._id, e.target.value)}
                    className="flex-1 bg-[#0e0e0e] border border-white/10 rounded py-2 px-3 font-body text-xs focus:ring-0 text-white placeholder:text-white/20"
                    required
                  />
                  <button type="submit" className="bg-[#131313] hover:bg-white/5 border border-white/10 text-white font-label text-[9px] tracking-widest px-4 py-2 rounded">
                    COMMENT
                  </button>
                </form>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}
