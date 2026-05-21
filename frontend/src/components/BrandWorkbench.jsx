import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';

// Snappy 3D perspective tilt wrapper
function Card3DTilt({ children, className }) {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [shadow, setShadow] = useState('0px 10px 30px rgba(0,0,0,0.5)');

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;
    // Map mouse position to angle
    const rX = -(mouseY / height) * 25; // max 25 deg
    const rY = (mouseX / width) * 25;
    setRotateX(rX);
    setRotateY(rY);
    setShadow('0px 25px 50px rgba(204,255,0,0.15)');
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setShadow('0px 10px 30px rgba(0,0,0,0.5)');
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ rotateX, rotateY, z: 15, scale: rotateX !== 0 ? 1.03 : 1 }}
      style={{ transformStyle: 'preserve-3d', perspective: 1000 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      className={`transition-shadow duration-300 ${className}`}
      layout
    >
      <div style={{ transform: 'translateZ(20px)' }} className="h-full">
        {children}
      </div>
    </motion.div>
  );
}

export default function BrandWorkbench() {
  const { user } = useContext(AuthContext);
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [creators, setCreators] = useState([]);
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form Fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [campaignType, setCampaignType] = useState('Paid');
  const [budget, setBudget] = useState(5000);
  const [engagementTarget, setEngagementTarget] = useState(4.5);
  const [followersTarget, setFollowersTarget] = useState(10000);
  const [nicheInput, setNicheInput] = useState('');

  // Notifications
  const [statusMsg, setStatusMsg] = useState('');

  const fetchCampaignsAndApplicants = async () => {
    try {
      const headers = { 'Authorization': `Bearer ${user.token}` };
      
      // Fetch Brand's Campaigns
      const resCamp = await fetch('/api/campaigns', { headers });
      const campData = await resCamp.json();
      // Filter campaigns belonging to this brand
      const brandCamps = campData.filter(c => c.brandId?._id === user._id || c.brandId === user._id);
      setCampaigns(brandCamps);

      if (brandCamps.length > 0 && !selectedCampaign) {
        setSelectedCampaign(brandCamps[0]);
      }

      // Fetch creators for fallback vetting listing
      const resCreators = await fetch('/api/auth/creators', { headers });
      const creatorsData = await resCreators.json();
      setCreators(creatorsData);

      // Fetch Brand's Deals
      const resDeals = await fetch('/api/deals', { headers });
      const dealsData = await resDeals.json();
      setDeals(dealsData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchCampaignsAndApplicants();
    }
  }, [user]);

  const handleCreateCampaign = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const payload = {
      title,
      description,
      campaignType,
      budget: Number(budget),
      nicheTags: nicheInput.split(',').map(n => n.trim()).filter(Boolean),
      metricsTarget: {
        engagementRate: Number(engagementTarget),
        followersMin: Number(followersTarget)
      }
    };

    try {
      const res = await fetch('/api/campaigns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const newCamp = await res.json();
        setCampaigns(prev => [newCamp, ...prev]);
        setSelectedCampaign(newCamp);
        setTitle('');
        setDescription('');
        setNicheInput('');
        setStatusMsg('Brief published successfully!');
        setTimeout(() => setStatusMsg(''), 3000);
      } else {
        alert('Failed to publish campaign');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleApproveAlliance = async (creatorId, creatorName) => {
    if (!selectedCampaign) {
      alert('Select or create a campaign brief first.');
      return;
    }

    try {
      const res = await fetch('/api/deals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({
          campaignId: selectedCampaign._id,
          creatorId,
          contractAmount: selectedCampaign.budget
        })
      });

      if (res.ok) {
        const newDeal = await res.json();
        setStatusMsg(`Alliance Approved with ${creatorName}! Deal Room established.`);
        setDeals(prev => [...prev, newDeal]);
        setTimeout(() => setStatusMsg(''), 4000);
      } else {
        const d = await res.json();
        alert(d.message || 'Alliance establish failed');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeclineApplication = (creatorName) => {
    setStatusMsg(`Declined application from ${creatorName}.`);
    setTimeout(() => setStatusMsg(''), 3000);
  };

  // Determine list of applicants: use campaign's applied creators, or fallback to all registered creators, then filter out approved ones
  const displayApplicants = (selectedCampaign && selectedCampaign.appliedCreators && selectedCampaign.appliedCreators.length > 0
    ? creators.filter(c => selectedCampaign.appliedCreators.includes(c._id))
    : creators
  ).filter(c => {
    if (!selectedCampaign) return true;
    const hasDeal = deals.some(d => {
      const dCampaignId = d.campaignId?._id || d.campaignId;
      const dCreatorId = d.creatorId?._id || d.creatorId;
      return dCampaignId === selectedCampaign._id && dCreatorId === c._id;
    });
    return !hasDeal;
  });

  return (
    <div className="pt-24 pb-20 px-8 max-w-7xl mx-auto space-y-8 bg-black min-h-screen text-white">
      
      {/* Header */}
      <div className="space-y-2">
        <span className="font-label text-xs tracking-widest text-[#CCFF00] uppercase">ROLE: BRAND WORKSPACE</span>
        <h1 className="font-display text-4xl md:text-6xl uppercase tracking-tighter">BRAND WORKBENCH</h1>
        <p className="font-body text-white/50 text-sm max-w-xl">
          Deploy campaign briefs into escrow systems, adjust analytical performance filters, and lock alliances with vetted elite creators.
        </p>
      </div>

      {/* Grid panels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT PANEL: CAMPAIGN PIPELINE EDITOR */}
        <div className="lg:col-span-5 bg-[#080809] border border-white/5 p-8 rounded-3xl shadow-2xl space-y-6">
          <span className="font-label text-xs tracking-widest text-[#CCFF00] block border-b border-white/5 pb-2">
            DEPLOY CAMPAIGN BRIEF
          </span>

          <form onSubmit={handleCreateCampaign} className="space-y-4">
            {/* Title */}
            <div className="space-y-1">
              <label className="font-label text-[10px] text-white/50 tracking-wider">CAMPAIGN TITLE</label>
              <input
                type="text"
                placeholder="e.g., Cyberpunk 2077 Night City"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-black border border-white/10 rounded-lg py-3 px-4 font-body text-xs text-white focus:outline-none focus:border-[#CCFF00] transition-colors"
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-1">
              <label className="font-label text-[10px] text-white/50 tracking-wider">BRIEF DESCRIPTION</label>
              <textarea
                placeholder="Describe creative direction, deliverables, and aesthetic themes..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-black border border-white/10 rounded-lg p-4 font-body text-xs text-white focus:outline-none focus:border-[#CCFF00] transition-colors min-h-[100px]"
                required
              />
            </div>

            {/* Configs */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-label text-[10px] text-white/50 tracking-wider">CAMPAIGN MODEL</label>
                <select
                  value={campaignType}
                  onChange={(e) => setCampaignType(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-lg py-3 px-4 font-label text-xs text-white focus:outline-none focus:border-[#CCFF00]"
                >
                  <option value="Paid">Paid Escrow</option>
                  <option value="Barter">Barter Trade</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="font-label text-[10px] text-white/50 tracking-wider">BUDGET (USD)</label>
                <input
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-lg py-3 px-4 font-body text-xs text-white focus:outline-none focus:border-[#CCFF00]"
                  required
                />
              </div>
            </div>

            {/* Niche tags */}
            <div className="space-y-1">
              <label className="font-label text-[10px] text-white/50 tracking-wider">NICHE TAGS (COMMA SEPARATED)</label>
              <input
                type="text"
                placeholder="e.g. lifestyle, tech, luxury"
                value={nicheInput}
                onChange={(e) => setNicheInput(e.target.value)}
                className="w-full bg-black border border-white/10 rounded-lg py-3 px-4 font-body text-xs text-white focus:outline-none focus:border-[#CCFF00]"
              />
            </div>

            {/* Custom slider inputs for metricsTarget */}
            <div className="p-4 bg-black/40 border border-white/5 rounded-xl space-y-4">
              <span className="font-label text-[9px] text-[#CCFF00] tracking-widest block">METRICS TARGET CRITERIA</span>
              
              <div className="space-y-2">
                <div className="flex justify-between font-label text-[9px]">
                  <span>MIN ENGAGEMENT RATE</span>
                  <span className="text-[#CCFF00]">{engagementTarget}%</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="15"
                  step="0.1"
                  value={engagementTarget}
                  onChange={(e) => setEngagementTarget(e.target.value)}
                  className="w-full accent-[#CCFF00] bg-neutral-800 h-1 rounded-lg cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between font-label text-[9px]">
                  <span>MIN INSTAGRAM FOLLOWERS</span>
                  <span className="text-[#CCFF00]">{Number(followersTarget).toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="1000"
                  max="100000"
                  step="1000"
                  value={followersTarget}
                  onChange={(e) => setFollowersTarget(e.target.value)}
                  className="w-full accent-[#CCFF00] bg-neutral-800 h-1 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-4 bg-[#CCFF00] text-black font-display text-sm tracking-widest uppercase font-bold rounded-xl hover:scale-95 active:scale-90 transition-transform shadow-[0_0_20px_rgba(204,255,0,0.2)]"
            >
              INITIALIZE BRIEF & SEED CAPITAL
            </button>
          </form>
        </div>

        {/* RIGHT PANEL: MULTI-CREATOR SELECTION PANEL */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Brief tabs selector */}
          <div className="flex flex-col gap-2">
            <span className="font-label text-xs tracking-widest text-white/50 block">SELECT ACTIVE CAMPAIGN</span>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
              {campaigns.length > 0 ? (
                campaigns.map(camp => (
                  <button
                    key={camp._id}
                    onClick={() => setSelectedCampaign(camp)}
                    className={`px-4 py-2 border rounded font-label text-[10px] tracking-wider uppercase transition-all whitespace-nowrap ${
                      selectedCampaign && selectedCampaign._id === camp._id
                        ? 'border-[#CCFF00] bg-[#CCFF00]/10 text-[#CCFF00]'
                        : 'border-white/10 text-white/60 hover:text-white'
                    }`}
                  >
                    {camp.title}
                  </button>
                ))
              ) : (
                <div className="font-label text-[10px] text-white/40">No active briefs deployed. Create one on the left.</div>
              )}
            </div>
          </div>

          <div className="border-t border-white/5 pt-4">
            <div className="flex justify-between items-center mb-4">
              <span className="font-label text-xs tracking-widest text-[#CCFF00] uppercase">
                CANDIDATE GRID ({displayApplicants.length})
              </span>
              {statusMsg && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="font-label text-[9px] text-[#CCFF00] border border-[#CCFF00]/20 bg-[#CCFF00]/10 px-3 py-1 rounded"
                >
                  {statusMsg}
                </motion.span>
              )}
            </div>

            {loading ? (
              <div className="text-center font-label text-xs text-white/40 py-12">LOADING ELITE VETTING LISTS...</div>
            ) : displayApplicants.length === 0 ? (
              <div className="text-center font-label text-xs text-white/40 py-12">NO APPLICANTS SUBMITTED YET.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {displayApplicants.map(c => {
                  const hasApplied = selectedCampaign?.appliedCreators?.includes(c._id);
                  return (
                    <Card3DTilt
                      key={c._id}
                      className="bg-[#0b0b0c]/90 border border-white/10 hover:border-white/20 rounded-3xl p-6 flex flex-col justify-between h-[360px] relative overflow-hidden group"
                    >
                      {/* Top Header Card */}
                      <div className="space-y-4">
                        <div className="flex gap-4 items-center">
                          <img
                            src={c.creatorProfile?.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100'}
                            alt={c.name}
                            className="w-12 h-12 rounded-full border border-white/10 object-cover"
                          />
                          <div>
                            <h4 className="font-display text-lg uppercase leading-none">{c.name}</h4>
                            <p className="font-label text-[9px] text-[#CCFF00] tracking-wider mt-1">
                              @{c.creatorProfile?.instagramUsername || 'anonymous'}
                            </p>
                          </div>
                        </div>

                        {/* Clout metrics bento chip */}
                        <div className="grid grid-cols-3 gap-2 bg-black/40 border border-white/5 p-3 rounded-xl text-center">
                          <div>
                            <span className="font-label text-[7px] text-white/40 block">ENGAGEMENT</span>
                            <span className="font-display text-sm text-white">{c.creatorProfile?.engagementRate || 3.5}%</span>
                          </div>
                          <div>
                            <span className="font-label text-[7px] text-white/40 block">REACH</span>
                            <span className="font-display text-sm text-white">
                              {c.creatorProfile?.followersCount ? (c.creatorProfile.followersCount / 1000).toFixed(0) + 'K' : '10K'}
                            </span>
                          </div>
                          <div>
                            <span className="font-label text-[7px] text-white/40 block">ROI PREDICTED</span>
                            <span className="font-display text-sm text-[#CCFF00]">
                              {c.creatorProfile?.aiInsights?.predictedRoiMultiplier || '2.8'}x
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Small visual chip portfolio carousel simulation */}
                      <div className="flex gap-1.5 overflow-hidden py-2 opacity-60 group-hover:opacity-100 transition-opacity">
                        <div className="w-12 h-10 bg-neutral-900 border border-white/5 rounded overflow-hidden">
                          <img src="https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=100&q=50" className="w-full h-full object-cover" />
                        </div>
                        <div className="w-12 h-10 bg-neutral-900 border border-white/5 rounded overflow-hidden">
                          <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=100&q=50" className="w-full h-full object-cover" />
                        </div>
                        <div className="w-12 h-10 bg-neutral-900 border border-white/5 rounded overflow-hidden">
                          <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=100&q=50" className="w-full h-full object-cover" />
                        </div>
                        <div className="font-label text-[7px] text-white/30 flex items-center justify-center pl-2">
                          +5 POSTS
                        </div>
                      </div>

                      {/* Alliance buttons */}
                      <div className="flex gap-3 pt-2">
                        <button
                          onClick={() => handleDeclineApplication(c.name)}
                          className="flex-1 py-2.5 bg-neutral-900 border border-white/5 text-white/60 font-label text-[9px] tracking-widest uppercase rounded-lg hover:bg-neutral-800 hover:text-white transition-colors"
                        >
                          Decline App
                        </button>
                        <button
                          onClick={() => handleApproveAlliance(c._id, c.name)}
                          className="flex-1 py-2.5 bg-[#CCFF00] text-black font-label text-[9px] font-bold tracking-widest uppercase rounded-lg hover:shadow-[0_0_15px_rgba(204,255,0,0.4)] transition-shadow"
                        >
                          APPROVE ALLIANCE
                        </button>
                      </div>

                      {/* Tag denoting official applicant */}
                      {hasApplied && (
                        <div className="absolute top-2 right-2 bg-[#FF007A]/20 border border-[#FF007A]/40 text-[#FF007A] font-label text-[7px] px-2 py-0.5 rounded-full uppercase tracking-wider">
                          APPLICANT
                        </div>
                      )}
                    </Card3DTilt>
                  );
                })}
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
