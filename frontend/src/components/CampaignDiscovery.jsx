import React, { useState, useEffect, useRef, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';

// Simple Particle canvas explosion
function ParticleExplosion({ x, y, onComplete }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particles = [];
    const colors = ['#FF007A', '#CCFF00', '#FF00FF', '#ffffff'];

    for (let i = 0; i < 40; i++) {
      particles.push({
        x: x || canvas.width / 2,
        y: y || canvas.height / 2,
        vx: (Math.random() - 0.5) * 12,
        vy: (Math.random() - 0.5) * 12,
        radius: Math.random() * 4 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
        decay: Math.random() * 0.02 + 0.015
      });
    }

    let animationFrameId;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;

      particles.forEach(p => {
        if (p.alpha > 0) {
          alive = true;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.alpha;
          ctx.fill();

          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.1; // gravity
          p.alpha -= p.decay;
        }
      });

      if (alive) {
        animationFrameId = requestAnimationFrame(render);
      } else {
        onComplete();
      }
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, [x, y, onComplete]);

  return <canvas ref={canvasRef} className="fixed inset-0 z-50 pointer-events-none w-full h-full" />;
}

export default function CampaignDiscovery() {
  const { user } = useContext(AuthContext);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  
  // Drawer fields
  const [igHandle, setIgHandle] = useState('');
  const [portfolioLink, setPortfolioLink] = useState('');

  // Particle triggers
  const [explosionCoords, setExplosionCoords] = useState(null);

  // Local record of applied campaigns
  const [appliedIds, setAppliedIds] = useState([]);

  const fetchCampaigns = async () => {
    try {
      const res = await fetch('/api/campaigns', {
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      const data = await res.json();
      setCampaigns(data);

      // Save list of IDs user has already applied to
      const userApplied = data.filter(c => c.appliedCreators?.includes(user._id)).map(c => c._id);
      setAppliedIds(userApplied);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchCampaigns();
      if (user.creatorProfile?.instagramUsername) {
        setIgHandle(user.creatorProfile.instagramUsername);
      }
    }
  }, [user]);

  const handleProposeAlliance = (camp) => {
    setSelectedCampaign(camp);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCampaign || !igHandle.trim()) return;

    try {
      const res = await fetch(`/api/campaigns/${selectedCampaign._id}/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        }
      });

      if (res.ok) {
        // Trigger particle animation in center of screen
        setExplosionCoords({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
        // Mark applied locally
        setAppliedIds(prev => [...prev, selectedCampaign._id]);
        
        // Clear forms & close drawer
        setSelectedCampaign(null);
        setPortfolioLink('');
      } else {
        const d = await res.json();
        alert(d.message || 'Application failed');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="pt-24 pb-20 px-8 max-w-5xl mx-auto space-y-10 bg-black min-h-screen text-white relative">
      
      {explosionCoords && (
        <ParticleExplosion
          x={explosionCoords.x}
          y={explosionCoords.y}
          onComplete={() => setExplosionCoords(null)}
        />
      )}

      {/* Header */}
      <div className="space-y-3">
        <span className="font-label text-xs tracking-widest text-[#FF007A] uppercase">ROLE: CREATOR WORKSPACE</span>
        <h1 className="font-display text-4xl md:text-6xl uppercase tracking-tighter">CAMPAIGN DISCOVERY</h1>
        <p className="font-body text-white/50 text-sm max-w-xl">
          Browse active escrow-guaranteed brand campaigns, review metrics target conditions, and propose alliances instantly.
        </p>
      </div>

      {/* Discovery Feed Grid */}
      {loading ? (
        <div className="text-center font-label text-xs text-white/40 py-20">LOAD IN PROGRESS...</div>
      ) : campaigns.length === 0 ? (
        <div className="text-center font-label text-xs text-white/40 py-20">NO ACTIVE CAMPAIGNS IN SYSTEM.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {campaigns.map(camp => {
            const hasApplied = appliedIds.includes(camp._id);
            const isBarter = camp.campaignType === 'Barter';
            
            return (
              <div
                key={camp._id}
                className="bg-[#080809] border border-white/5 p-6 rounded-3xl flex flex-col justify-between h-[280px] hover:border-white/10 transition-colors duration-300"
              >
                {/* Upper Details */}
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    {/* Badge */}
                    <span className={`px-3 py-1 font-label text-[8px] tracking-wider uppercase rounded-full ${
                      isBarter
                        ? 'bg-[#CCFF00]/15 border border-[#CCFF00]/30 text-[#CCFF00]'
                        : 'bg-[#FF007A]/15 border border-[#FF007A]/30 text-[#FF007A]'
                    }`}>
                      {isBarter ? 'Barter Trade' : 'Paid Escrow'}
                    </span>
                    
                    <span className="font-label text-[9px] text-white/30 uppercase tracking-widest">
                      BY: {camp.brandId?.name || 'Enterprise Brand'}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-display text-2xl uppercase tracking-wide leading-none">{camp.title}</h3>
                    <p className="font-body text-xs text-white/50 mt-2 line-clamp-2">{camp.description}</p>
                  </div>
                </div>

                {/* Bottom details & action button */}
                <div className="space-y-4 pt-4 border-t border-white/5">
                  {/* Monospace details array */}
                  <div className="flex gap-4 font-label text-[9px] text-white/60">
                    <div>
                      <span>BUDGET: </span>
                      <span className="text-[#CCFF00] font-bold">${camp.budget?.toLocaleString()}</span>
                    </div>
                    <div>
                      <span>TARGET ENGAGEMENT: </span>
                      <span className="text-[#CCFF00] font-bold">{camp.metricsTarget?.engagementRate || 4.0}%</span>
                    </div>
                    <div>
                      <span>MIN FOLLOWERS: </span>
                      <span className="text-[#CCFF00] font-bold">
                        {camp.metricsTarget?.followersMin ? (camp.metricsTarget.followersMin / 1000).toFixed(0) + 'K' : '10K'}
                      </span>
                    </div>
                  </div>

                  {/* Trigger or pending status */}
                  {hasApplied ? (
                    <motion.div
                      animate={{ scale: [0.98, 1.02, 0.98], opacity: [0.8, 1, 0.8] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="w-full py-3 bg-[#FF007A]/20 border border-[#FF007A] text-[#FF007A] font-label text-[9px] tracking-widest font-bold uppercase rounded-lg text-center select-none"
                    >
                      APPLICATION PENDING REVIEW
                    </motion.div>
                  ) : (
                    <button
                      onClick={() => handleProposeAlliance(camp)}
                      className="w-full py-3 bg-white text-black font-label text-[9px] font-bold tracking-widest uppercase rounded-lg hover:bg-[#CCFF00] transition-colors"
                    >
                      PROPOSE ALLIANCE
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* FLOATING QUANTUM APPLICATION SIDEBAR DRAWER */}
      <AnimatePresence>
        {selectedCampaign && (
          <>
            {/* Overlay background */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCampaign(null)}
              className="fixed inset-0 bg-black z-40"
            />

            {/* Sidebar drawer content */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 180, damping: 20 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-[#080809] border-l border-white/5 z-50 p-8 flex flex-col justify-between shadow-2xl"
            >
              <div className="space-y-8">
                {/* Header of Drawer */}
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-label text-xs tracking-widest text-[#FF007A] uppercase block">APPLY TO BRIEF</span>
                    <h3 className="font-display text-2xl uppercase mt-1 tracking-tight">{selectedCampaign.title}</h3>
                  </div>
                  <button
                    onClick={() => setSelectedCampaign(null)}
                    className="text-white/40 hover:text-white p-1"
                  >
                    <span className="material-symbols-outlined text-xl">close</span>
                  </button>
                </div>

                {/* Minimal inputs grid */}
                <form id="drawer-apply-form" onSubmit={handleFormSubmit} className="space-y-6">
                  <div className="space-y-1">
                    <label className="font-label text-[10px] text-white/40 tracking-wider">VERIFIED IG HANDLE</label>
                    <div className="relative">
                      <span className="absolute left-4 top-3 text-white/30 text-xs">@</span>
                      <input
                        type="text"
                        placeholder="yourhandle"
                        value={igHandle}
                        onChange={(e) => setIgHandle(e.target.value)}
                        className="w-full bg-black border border-white/10 rounded-lg py-3 pl-8 pr-4 font-body text-xs text-white focus:outline-none focus:border-[#FF007A] transition-colors"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-label text-[10px] text-white/40 tracking-wider">PORTFOLIO DEED / LINK STRING</label>
                    <input
                      type="url"
                      placeholder="https://instagram.com/myportfolio"
                      value={portfolioLink}
                      onChange={(e) => setPortfolioLink(e.target.value)}
                      className="w-full bg-black border border-white/10 rounded-lg py-3 px-4 font-body text-xs text-white focus:outline-none focus:border-[#FF007A] transition-colors"
                      required
                    />
                  </div>

                  <div className="p-4 bg-black/40 border border-white/5 rounded-xl space-y-3">
                    <span className="font-label text-[9px] text-[#FF007A] tracking-widest block">CONTRACT MILESTONE PROJECTIONS</span>
                    <p className="font-body text-[11px] text-white/50 leading-relaxed">
                      By submitting this application, you agree to locking the campaign model into escrow and delivering metrics logs upon completion.
                    </p>
                  </div>
                </form>
              </div>

              {/* Submit CTA */}
              <div className="space-y-4 pt-6 border-t border-white/5">
                <button
                  type="submit"
                  form="drawer-apply-form"
                  className="w-full py-4 bg-[#FF007A] text-white font-display text-sm tracking-widest uppercase font-bold rounded-xl hover:scale-95 transition-transform shadow-[0_0_20px_rgba(255,0,122,0.2)]"
                >
                  SUBMIT ALLIANCE APPLICATION
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
