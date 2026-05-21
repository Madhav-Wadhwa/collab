import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import GlassCard from '../components/GlassCard';
import { motion, AnimatePresence } from 'framer-motion';
import CreatorDossier from '../components/CreatorDossier';

export default function Marketplace() {
  const { user } = useContext(AuthContext);
  const [creators, setCreators] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeNiche, setActiveNiche] = useState('ALL');
  const [selectedCreator, setSelectedCreator] = useState(null);
  const [showPartnershipModal, setShowPartnershipModal] = useState(null);
  const [partnershipCampaignId, setPartnershipCampaignId] = useState('');
  const [partnershipAmount, setPartnershipAmount] = useState('5000');
  const [msgNotification, setMsgNotification] = useState('');

  const niches = [
    { label: 'ALL CREATORS', value: 'ALL' },
    { label: 'TECH GURUS', value: 'tech' },
    { label: 'LUXURY LIFESTYLE', value: 'luxury' },
    { label: 'GAMING ELITE', value: 'gaming' },
    { label: 'FITNESS PROS', value: 'fitness' }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = { 'Authorization': `Bearer ${user.token}` };
        
        // Fetch Creators
        const resCreators = await fetch('/api/auth/creators', { headers });
        const creatorsData = await resCreators.json();
        setCreators(creatorsData);

        // Fetch Campaigns if user is brand (to link to partnerships)
        if (user.role === 'brand') {
          const resCampaigns = await fetch('/api/campaigns', { headers });
          const campaignsData = await resCampaigns.json();
          setCampaigns(campaignsData);
          if (campaignsData.length > 0) {
            setPartnershipCampaignId(campaignsData[0]._id);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  const initiatePartnership = async (e) => {
    e.preventDefault();
    if (!partnershipCampaignId) return;

    try {
      const response = await fetch('/api/deals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({
          campaignId: partnershipCampaignId,
          creatorId: showPartnershipModal._id,
          contractAmount: Number(partnershipAmount)
        })
      });

      if (response.ok) {
        setMsgNotification('Deal room established! You can now navigate to Live Deal Room.');
        setTimeout(() => {
          setMsgNotification('');
          setShowPartnershipModal(null);
        }, 3000);
      } else {
        const d = await response.json();
        alert(d.message || 'Failed to establish deal room');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredCreators = creators.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) || 
                          c.creatorProfile?.instagramUsername?.toLowerCase().includes(search.toLowerCase());
    
    const nichesArray = c.creatorProfile?.niche?.map(n => n.toLowerCase()) || [];
    const matchesNiche = activeNiche === 'ALL' || nichesArray.includes(activeNiche.toLowerCase()) || 
                         (activeNiche.toLowerCase() === 'luxury' && nichesArray.includes('luxury')) ||
                         (activeNiche.toLowerCase() === 'luxury' && nichesArray.includes('lifestyle')) ||
                         (activeNiche.toLowerCase() === 'tech' && nichesArray.includes('tech-fashion'));
                         
    return matchesSearch && matchesNiche;
  });

  return (
    <div className="pt-24 pb-20 px-grid-margin max-w-7xl mx-auto space-y-12">
      <div className="flex flex-col gap-6 md:flex-row md:justify-between md:items-end">
        <div className="space-y-4">
          <h1 className="font-display text-5xl md:text-7xl text-white uppercase tracking-tighter">
            DISCOVERY <br />MARKETPLACE
          </h1>
          <p className="font-body text-[#cfc4c5] max-w-xl text-sm">
            Curated elite creators for the next generation of high-impact brand alliances. Filter by clout, engagement, and conversion ROI.
          </p>
        </div>

        {/* Filter Inputs */}
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              placeholder="Search elite creator..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#0e0e0e] border border-white/10 rounded-lg py-3 px-5 font-label text-xs focus:ring-accent-lime focus:border-accent-lime text-white placeholder:text-white/20"
            />
            <span className="material-symbols-outlined absolute right-4 top-3.5 text-white/40 text-sm">search</span>
          </div>
        </div>
      </div>

      {/* Categories Tabs */}
      <div className="flex gap-3 overflow-x-auto pb-2 border-b border-white/5 scrollbar-thin">
        {niches.map((n) => (
          <button
            key={n.value}
            onClick={() => setActiveNiche(n.value)}
            className={`px-6 py-2.5 rounded font-label text-[10px] tracking-widest border transition-all ${
              activeNiche === n.value
                ? 'bg-accent-lime text-black border-accent-lime font-bold'
                : 'text-[#cfc4c5] border-white/10 hover:border-white/20'
            }`}
          >
            {n.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center font-label text-xs tracking-wider text-white/50 py-20">LOAD IN PROGRESS...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
          {filteredCreators.map((c) => (
            <motion.div
              layout
              key={c._id}
              className="bg-[#0b0b0c]/80 border border-white/10 rounded-2xl overflow-hidden flex flex-col justify-between group hover:border-white/20 transition-all duration-300"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-neutral-900">
                <img
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  src={c.creatorProfile?.profileImage}
                  alt={c.name}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent pointer-events-none" />
                
                <div className="absolute bottom-4 left-6 right-6">
                  <h3 className="font-display text-2xl text-white tracking-wide uppercase leading-tight">{c.name}</h3>
                  <p className="font-label text-[10px] text-accent-lime tracking-wider mt-1 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-lime inline-block" />
                    @{c.creatorProfile?.instagramUsername}
                  </p>
                </div>

                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full flex items-center gap-1">
                  <span className="material-symbols-outlined text-accent-lime text-sm">verified</span>
                  <span className="font-label text-[8px] tracking-widest text-white/80">AI VERIFIED</span>
                </div>
              </div>

              <div className="p-card-padding space-y-6 flex-1 flex flex-col justify-between">
                <p className="font-body text-xs text-[#cfc4c5] line-clamp-2">
                  {c.creatorProfile?.bio}
                </p>

                <div className="grid grid-cols-3 gap-2 py-4 border-y border-white/5 text-center">
                  <div>
                    <p className="font-label text-[8px] text-[#cfc4c5]/60 tracking-wider">FOLLOWERS</p>
                    <p className="font-display text-lg text-white mt-1">
                      {(c.creatorProfile?.followersCount / 1000000).toFixed(1)}M
                    </p>
                  </div>
                  <div>
                    <p className="font-label text-[8px] text-[#cfc4c5]/60 tracking-wider">ENGAGEMENT</p>
                    <p className="font-display text-lg text-white mt-1">
                      {c.creatorProfile?.engagementRate}%
                    </p>
                  </div>
                  <div>
                    <p className="font-label text-[8px] text-[#cfc4c5]/60 tracking-wider">AVG ROI</p>
                    <p className="font-display text-lg text-white mt-1">
                      {c.creatorProfile?.aiInsights?.predictedRoiMultiplier || '2.8'}x
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setSelectedCreator(c)}
                    className="flex-1 py-3 bg-white/5 border border-white/10 text-white font-label text-[10px] tracking-widest rounded hover:bg-white/10 hover:border-white/20 transition-all"
                  >
                    VIEW PORTFOLIO
                  </button>
                  {user.role === 'brand' && (
                    <button
                      onClick={() => setShowPartnershipModal(c)}
                      className="flex-1 py-3 bg-accent-lime text-black font-label text-[10px] tracking-widest font-bold rounded hover:scale-95 transition-all neon-glow-lime"
                    >
                      PARTNERSHIP
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Portfolio/AI Insights Modal */}
      <AnimatePresence>
        {selectedCreator && (
          <CreatorDossier
            creator={selectedCreator}
            onClose={() => setSelectedCreator(null)}
          />
        )}
      </AnimatePresence>

      {/* Partnership Setup Modal */}
      <AnimatePresence>
        {showPartnershipModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-6 z-50">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0b0b0c] border border-white/10 rounded-2xl w-full max-w-md p-card-padding space-y-6 relative"
            >
              <button
                onClick={() => setShowPartnershipModal(null)}
                className="absolute top-4 right-4 text-white/50 hover:text-white"
              >
                <span className="material-symbols-outlined">close</span>
              </button>

              <h3 className="font-display text-2xl text-white uppercase tracking-tight">SECURE ALLIANCE</h3>
              <p className="font-body text-xs text-[#cfc4c5]">
                Establish a locked escrow room with <span className="text-accent-lime font-bold">@{showPartnershipModal.creatorProfile?.instagramUsername}</span>.
              </p>

              <form onSubmit={initiatePartnership} className="space-y-4">
                <div className="space-y-1">
                  <label className="font-label text-[10px] text-[#cfc4c5]/60 block">CAMPAIGN BRIEF</label>
                  <select
                    className="w-full bg-[#0e0e0e] border border-white/10 rounded-lg py-3 px-4 font-label text-xs text-white/80 focus:ring-accent-lime focus:border-accent-lime focus:outline-none"
                    value={partnershipCampaignId}
                    onChange={(e) => setPartnershipCampaignId(e.target.value)}
                    required
                  >
                    {campaigns.map(c => (
                      <option key={c._id} value={c._id}>{c.title}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-label text-[10px] text-[#cfc4c5]/60 block">CONTRACT AMOUNT ($)</label>
                  <input
                    type="number"
                    className="w-full bg-[#0e0e0e] border border-white/10 rounded-lg py-3 px-4 font-label text-xs focus:ring-accent-lime focus:border-accent-lime text-white focus:outline-none"
                    value={partnershipAmount}
                    onChange={(e) => setPartnershipAmount(e.target.value)}
                    required
                  />
                </div>

                {msgNotification && (
                  <p className="text-accent-lime font-label text-[10px] tracking-wide uppercase text-center">{msgNotification}</p>
                )}

                <button
                  type="submit"
                  className="w-full py-4 bg-accent-lime text-black font-display tracking-widest text-sm font-bold rounded-lg hover:scale-95 transition-all"
                >
                  INITIALIZE ESCROW ROOM
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
