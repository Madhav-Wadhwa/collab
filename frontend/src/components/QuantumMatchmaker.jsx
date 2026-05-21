import React, { useState, useEffect, useRef, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

// 3D Canvas Wireframe Rotating Globe/Orb component (Vanilla HTML5 Canvas)
function CanvasZeroGOrb({ isCreator }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let animationFrameId;
    let width = (canvas.width = 240);
    let height = (canvas.height = 240);
    let angleX = 0.005;
    let angleY = 0.01;
    let angleZ = 0.008;

    // Generate 3D points on a sphere
    const points = [];
    const numPoints = 80;
    const radius = 70;

    for (let i = 0; i < numPoints; i++) {
      const theta = Math.acos(Math.random() * 2 - 1);
      const phi = Math.random() * Math.PI * 2;
      points.push({
        x: radius * Math.sin(theta) * Math.cos(phi),
        y: radius * Math.sin(theta) * Math.sin(phi),
        z: radius * Math.cos(theta),
      });
    }

    // 3D Rotation function
    const rotate = (point, ax, ay, az) => {
      // Rotate X
      let y1 = point.y * Math.cos(ax) - point.z * Math.sin(ax);
      let z1 = point.y * Math.sin(ax) + point.z * Math.cos(ax);
      // Rotate Y
      let x2 = point.x * Math.cos(ay) - z1 * Math.sin(ay);
      let z2 = point.x * Math.sin(ay) + z1 * Math.cos(ay);
      // Rotate Z
      let x3 = x2 * Math.cos(az) - y1 * Math.sin(az);
      let y3 = x2 * Math.sin(az) + y1 * Math.cos(az);

      return { x: x3, y: y3, z: z2 };
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.translate(width / 2, height / 2);

      // Draw background glow aura
      const gradient = ctx.createRadialGradient(0, 0, 10, 0, 0, radius + 30);
      gradient.addColorStop(0, isCreator ? 'rgba(255, 0, 122, 0.15)' : 'rgba(157, 0, 255, 0.15)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(0, 0, radius + 40, 0, Math.PI * 2);
      ctx.fill();

      // Project and draw lines
      const projected = points.map((p, idx) => {
        const r = rotate(p, angleX, angleY, angleZ);
        // Save back into points for continuous rotation
        points[idx] = r;
        
        // Perspective projection
        const fov = 200;
        const scale = fov / (fov + r.z);
        return {
          x: r.x * scale,
          y: r.y * scale,
          z: r.z,
          scale
        };
      });

      // Draw connected paths/orbits
      ctx.strokeStyle = isCreator ? 'rgba(255, 0, 122, 0.25)' : 'rgba(157, 0, 255, 0.25)';
      ctx.lineWidth = 1;
      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          const dist = Math.hypot(projected[i].x - projected[j].x, projected[i].y - projected[j].y);
          if (dist < 35) {
            ctx.beginPath();
            ctx.moveTo(projected[i].x, projected[i].y);
            ctx.lineTo(projected[j].x, projected[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw node particles
      projected.forEach((p) => {
        const size = Math.max(1, p.scale * 2.2);
        // Alpha based on depth
        const alpha = Math.max(0.1, (p.z + radius) / (radius * 2));
        ctx.fillStyle = isCreator 
          ? `rgba(255, 0, 122, ${alpha * 0.9})` 
          : `rgba(157, 0, 255, ${alpha * 0.9})`;
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.translate(-width / 2, -height / 2);
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isCreator]);

  return <canvas ref={canvasRef} className="mx-auto block" />;
}

export default function QuantumMatchmaker() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [calibrating, setCalibrating] = useState(false);
  const [matches, setMatches] = useState([]);
  const [telemetry, setTelemetry] = useState([]);
  const [activeTab, setActiveTab] = useState('Engine');
  const [errorMessage, setErrorMessage] = useState('');
  const [poolCount, setPoolCount] = useState(0);
  const [activeBudget, setActiveBudget] = useState('1.8M');
  const [successMsg, setSuccessMsg] = useState('');

  const isCreator = user?.role === 'creator';
  const themeAccent = isCreator ? '#FF007A' : '#9D00FF';

  // Telemetry loop setup
  const telemetryLogs = isCreator 
    ? [
        ">> ANALYZING_ENGAGEMENT_VECTORS...",
        ">> SYNCING_ESCROW_CREDENTIALS...",
        ">> CALIBRATING_MATCH_SCORES...",
        ">> SCANNING 15,402 BRAND CAMPAIGNS IN REAL-TIME...",
        ">> COMPILING CONVERSION MILESTONES...",
        ">> IDENTIFYING 3 EASIEST TO CRACK DEALS...",
        ">> OPTIMIZING INTERACTION PIPELINE... [READY]"
      ]
    : [
        ">> Ingesting Meta Graph Data...",
        ">> Ingesting Instagram Graph API Token Data...",
        ">> Syncing Grok LLM Multi-Tenant Context Windows...",
        ">> Filtering Financial Escrow Thresholds...",
        ">> Calibrating Liquid Capital Escrow Thresholds...",
        ">> Isolating Top 3 Compatibility Clusters...",
        ">> OPTIMIZING ALLIANCE PAIRS... [READY]"
      ];

  const fetchMatches = async () => {
    try {
      setErrorMessage('');
      setSuccessMsg('');
      setCalibrating(true);
      setTelemetry([]);

      // Start typing telemetry logs
      let logIndex = 0;
      const logInterval = setInterval(() => {
        if (logIndex < telemetryLogs.length) {
          setTelemetry(prev => [...prev, telemetryLogs[logIndex]]);
          logIndex++;
        } else {
          clearInterval(logInterval);
        }
      }, 450);

      // Perform MERN fetch route
      const res = await fetch('/api/ai/quantum-match', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token || ''}`
        }
      });

      let data;
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await res.json();
      } else {
        const textResponse = await res.text();
        throw new Error(`Non-JSON response (Status ${res.status}): ${textResponse.substring(0, 150)}`);
      }
      
      // Delay resolution by 3.5s to show loading telemetry properly
      setTimeout(() => {
        clearInterval(logInterval);
        if (res.ok) {
          setMatches(data.matches || []);
          setPoolCount(data.poolCount || 0);
          if (data.campaignBudget) {
            setActiveBudget((data.campaignBudget / 1000).toFixed(0) + 'K');
          }
        } else {
          // If session is invalid, prompt user
          if (res.status === 401) {
            setErrorMessage(`Session Invalid (401): ${data.message || 'Please log in again.'}`);
          } else {
            setErrorMessage(data.message || 'Calibration engine failed.');
          }
        }
        setCalibrating(false);
      }, 3500);

    } catch (err) {
      console.error('Calibration engine connection failure:', err);
      setErrorMessage(`Failed to connect to Quantum Calibration engine: ${err.message}`);
      setCalibrating(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchMatches();
    }
  }, [user]);

  // Propose Alliance & Lock Escrow (Brand Action)
  const handleProposeAlliance = async (creatorId, creatorName, matchScore) => {
    try {
      const res = await fetch('/api/deals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({
          creatorId,
          contractAmount: 15000 // default contract amount for matchmaking proposal
        })
      });

      if (res.ok) {
        setSuccessMsg(`Escrow Locked & Deal Room established with ${creatorName} (${matchScore}% match ratio)!`);
        setTimeout(() => {
          setSuccessMsg('');
          navigate('/deal-room');
        }, 3000);
      } else {
        const d = await res.json();
        alert(d.message || 'Escrow lock failed');
      }
    } catch (error) {
      console.error("Escrow lock err:", error);
      alert('Network failure locking escrow');
    }
  };

  // Secure Deal Room & Apply (Creator Action)
  const handleSecureDealRoom = async (campaignId, brandName, matchScore) => {
    try {
      const res = await fetch(`/api/campaigns/${campaignId}/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        }
      });

      if (res.ok) {
        setSuccessMsg(`Applied to ${brandName} (${matchScore}% match ratio). Deal Room secured!`);
        setTimeout(() => {
          setSuccessMsg('');
          navigate('/deal-room');
        }, 3000);
      } else {
        const d = await res.json();
        alert(d.message || 'Application failed');
      }
    } catch (error) {
      console.error("Apply err:", error);
      alert('Network failure joining deal room');
    }
  };

  // Stagger & Spring transitions
  const springTransition = {
    type: "spring",
    stiffness: 60,
    damping: 26,
    mass: 1.1
  };

  const listVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.18,
        delayChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 35, scale: 0.96 },
    show: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: springTransition
    }
  };

  const sidebarLinks = [
    { name: 'Engine', icon: 'bolt' },
    { name: 'Analytics', icon: 'query_stats' },
    { name: 'Collabs', icon: 'hub' },
    { name: 'Assets', icon: 'folder_open' },
    { name: 'Settings', icon: 'settings' }
  ];

  return (
    <div className="min-h-screen bg-black text-white pt-20 flex">
      {/* LEFT SIDEBAR: NEURAL HUB LAYOUT */}
      <aside className="w-80 border-r border-white/5 bg-[#050505] p-8 flex flex-col justify-between select-none hidden lg:flex shrink-0">
        <div className="space-y-12">
          {/* Workspace Title */}
          <div className="space-y-1">
            <h3 className="font-display text-xl uppercase tracking-tighter font-bold">Neural Hub</h3>
            <p className="font-label text-[10px] text-white/40 tracking-wider">V.04 ACTIVE</p>
          </div>

          {/* Nav Cluster */}
          <nav className="space-y-2">
            {sidebarLinks.map(link => {
              const active = activeTab === link.name;
              return (
                <button
                  key={link.name}
                  onClick={() => setActiveTab(link.name)}
                  className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-label text-xs uppercase tracking-widest border transition-all ${
                    active 
                      ? isCreator 
                        ? 'border-[#FF007A]/20 bg-[#FF007A]/5 text-[#FF007A] font-bold shadow-[0_0_15px_rgba(255,0,122,0.05)]'
                        : 'border-[#9D00FF]/20 bg-[#9D00FF]/5 text-[#9D00FF] font-bold shadow-[0_0_15px_rgba(157,0,255,0.05)]'
                      : 'border-transparent text-white/55 hover:text-white hover:bg-white/[0.02]'
                  }`}
                >
                  <span className="material-symbols-outlined text-lg">{link.icon}</span>
                  <span>{link.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sync AI Button at bottom of sidebar */}
        <div className="pt-8 border-t border-white/5">
          <button
            onClick={fetchMatches}
            disabled={calibrating}
            className={`w-full py-4 rounded-2xl font-label text-[10px] font-bold tracking-widest uppercase transition-all ${
              isCreator 
                ? 'border border-[#FF007A] text-[#FF007A] hover:bg-[#FF007A]/10 active:scale-95'
                : 'bg-[#CCFF00] text-black hover:shadow-[0_0_20px_rgba(204,255,0,0.35)] active:scale-95'
            }`}
          >
            {calibrating ? 'CALIBRATING...' : 'SYNC_AI'}
          </button>
        </div>
      </aside>

      {/* MAIN CONTAINER WORKSPACE */}
      <main className="flex-1 bg-[#000000] p-8 md:p-12 overflow-y-auto max-w-7xl mx-auto flex flex-col justify-between min-h-[calc(100vh-80px)]">
        
        {/* UPPER PORTION */}
        <div className="space-y-12">
          {/* Header Info Block */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-8 border-b border-white/5">
            <div className="space-y-2">
              <span className={`font-label text-[10px] tracking-widest uppercase px-3 py-1 border rounded-full ${
                isCreator ? 'text-[#FF007A] border-[#FF007A]/20 bg-[#FF007A]/5' : 'text-[#9D00FF] border-[#9D00FF]/20 bg-[#9D00FF]/5'
              }`}>
                {isCreator ? 'CREATOR HUB' : 'BRAND HUB'}
              </span>
              <h1 className="font-display text-4xl uppercase tracking-tighter font-black">
                {isCreator ? '"Easy Crack" AI Analyzer' : 'AI Scout'}
              </h1>
              <p className="font-body text-white/50 text-xs max-w-2xl leading-relaxed">
                {isCreator 
                  ? "Matching audience velocity and category saturation to enterprise-tier brand budgets. Precision calibration for high-ROI conversions."
                  : "Calibrating MERN active databases with Grok LLM context windows to index matching creator candidates."
                }
              </p>
            </div>

            {/* Micro stats tokens */}
            <div className="flex gap-4">
              <div className="bg-[#080809] border border-white/5 p-4 rounded-2xl min-w-[140px] text-center">
                <span className="font-label text-[8px] text-white/40 block uppercase tracking-widest">
                  {isCreator ? 'AUDIENCE SIZE' : 'ACTIVE BUDGET'}
                </span>
                <span className="font-display text-lg font-bold text-white tracking-tight mt-1 block">
                  {isCreator ? '2.4M REACH' : `$${activeBudget} USD`}
                </span>
              </div>
              <div className="bg-[#080809] border border-white/5 p-4 rounded-2xl min-w-[140px] text-center">
                <span className="font-label text-[8px] text-white/40 block uppercase tracking-widest">
                  {isCreator ? 'TARGET BUDGET' : 'CREATOR POOL'}
                </span>
                <span className="font-display text-lg font-bold text-[#CCFF00] tracking-tight mt-1 block">
                  {isCreator ? '$12K-$50K' : poolCount.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="bg-[#FF007A]/10 border border-[#FF007A]/30 text-[#FF007A] font-label text-xs p-5 rounded-2xl text-center">
              {errorMessage}
            </div>
          )}

          {/* Success Banner */}
          {successMsg && (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-[#CCFF00]/10 border border-[#CCFF00]/30 text-[#CCFF00] font-label text-xs p-5 rounded-2xl text-center"
            >
              {successMsg}
            </motion.div>
          )}

          {/* PRESENTATION DISPLAY SWITCHER */}
          <AnimatePresence mode="wait">
            {calibrating ? (
              /* SCANNING TELEMETRY ORB SCREEN */
              <motion.div
                key="scanning"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className="max-w-2xl mx-auto text-center space-y-8 py-10"
              >
                {/* Zero-G drifting container */}
                <motion.div
                  animate={{ y: [-10, 10, -10] }}
                  transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
                  className="bg-white/[0.01] backdrop-blur-2xl border border-white/5 rounded-3xl p-10 shadow-2xl relative overflow-hidden"
                >
                  {/* Floating Orb particle mesh */}
                  <CanvasZeroGOrb isCreator={isCreator} />

                  <div className="space-y-2 mt-6">
                    <h3 className="font-display text-lg uppercase tracking-wider font-bold">
                      {isCreator ? 'QUANTUM_CALIBRATION_ACTIVE' : 'Quantum Calibration Active'}
                    </h3>
                    <p className="font-label text-[9px] text-white/30 uppercase tracking-widest">
                      {isCreator 
                        ? 'SCANNING 15,402 BRAND CAMPAIGNS IN REAL-TIME' 
                        : 'Calibrating multi-tenant database clusters'
                      }
                    </p>
                  </div>
                </motion.div>

                {/* Telemetry scrolling output console */}
                <div className="bg-[#050506] border border-white/5 p-6 rounded-2xl h-44 overflow-y-auto text-left font-mono text-[10px] text-white/50 space-y-1.5 scrollbar-thin">
                  {telemetry.map((log, idx) => (
                    <div key={idx} className="flex gap-2">
                      <span className="text-[#CCFF00]"></span>
                      <span>{log}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ) : matches.length > 0 ? (
              /* TOP 3 CALIBRATED MATCHES MATRIX */
              <motion.div
                key="results"
                initial="hidden"
                animate="show"
                variants={listVariants}
                className="space-y-6"
              >
                <div className="flex justify-between items-center mb-4">
                  <span className={`font-label text-xs tracking-widest uppercase ${
                    isCreator ? 'text-[#FF007A]' : 'text-[#9D00FF]'
                  }`}>
                    Top Calibrated Matches
                  </span>
                  <div className="flex items-center gap-2 px-3 py-1 bg-white/[0.02] border border-white/5 rounded-full font-label text-[8px] tracking-widest text-white/40 uppercase">
                    <span className="w-1 h-1 rounded-full bg-[#CCFF00] animate-pulse"></span>
                    REAL-TIME SYNC
                  </div>
                </div>

                <div className={isCreator ? "grid grid-cols-1 md:grid-cols-3 gap-6" : "space-y-6"}>
                  {matches.map((item, index) => {
                    // Stagger drift paths based on index
                    const driftY = index % 2 === 0 ? [-5, 5, -5] : [5, -5, 5];

                    return (
                      <motion.div
                        key={item.id}
                        variants={cardVariants}
                        animate={{ y: driftY }}
                        transition={{
                          y: {
                            repeat: Infinity,
                            duration: 4.5 + index * 0.5,
                            ease: "easeInOut"
                          }
                        }}
                        className={`bg-white/[0.01] hover:bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-3xl p-8 shadow-2xl relative transition-all duration-300 flex flex-col justify-between ${
                          isCreator ? 'h-[440px] text-center border-[#FF007A]/10 hover:border-[#FF007A]/30' : 'md:flex-row items-center gap-8 border-[#9D00FF]/10 hover:border-[#9D00FF]/30'
                        }`}
                      >
                        {/* LEFT/UPPER: MATCH BADGE OR AVATAR */}
                        <div className={`flex ${isCreator ? 'flex-col items-center' : 'items-center gap-6 flex-1'}`}>
                          {/* Circular match index badge */}
                          <div className="relative shrink-0 mb-4 md:mb-0">
                            {/* Inner circle glowing */}
                            <div className="w-20 h-20 rounded-full border-2 border-white/5 bg-black flex flex-col items-center justify-center relative overflow-hidden shadow-[0_0_20px_rgba(157,0,255,0.1)]">
                              <span className="font-display text-xl font-bold tracking-tight">{item.fitScore}%</span>
                              <span className="font-label text-[6px] text-white/40 uppercase tracking-widest mt-0.5">MATCH</span>
                            </div>
                            {/* Accent indicator glow */}
                            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-black animate-pulse" style={{ backgroundColor: themeAccent }} />
                          </div>

                          <div className={isCreator ? 'space-y-1.5' : 'space-y-2'}>
                            <div className="flex items-center justify-center md:justify-start gap-2.5">
                              <h2 className="font-display text-xl md:text-2xl font-black tracking-tighter uppercase">
                                {isCreator ? item.brandName : item.name}
                              </h2>
                              {isCreator ? (
                                <span className="font-label text-[8px] tracking-wider bg-[#FF007A]/10 border border-[#FF007A]/20 text-[#FF007A] px-2 py-0.5 rounded-full uppercase">
                                  BRAND
                                </span>
                              ) : (
                                <span className="font-label text-[8px] tracking-wider bg-[#9D00FF]/10 border border-[#9D00FF]/20 text-[#9D00FF] px-2 py-0.5 rounded-full uppercase">
                                  @{item.username}
                                </span>
                              )}
                            </div>

                            {/* Subtitle tag */}
                            <p className="font-label text-[9px] text-white/40 tracking-widest uppercase">
                              {isCreator ? item.title : `${item.niche?.slice(0, 3).join(' / ')}`}
                            </p>

                            {/* Metadata parameters block */}
                            <div className="flex justify-center md:justify-start gap-4 font-mono text-[9px] text-white/60">
                              <div>
                                <span className="text-white/30">BUDGET: </span>
                                <span className="text-[#CCFF00] font-bold">
                                  {isCreator ? `$${item.budget?.toLocaleString()}` : `$${(item.followersCount * 0.8 / 1000).toFixed(0)}K-$${(item.followersCount * 2.2 / 1000).toFixed(0)}K`}
                                </span>
                              </div>
                              <div>
                                <span className="text-white/30">ENGAGEMENT: </span>
                                <span className="text-white font-bold">{isCreator ? '12.4% (T1)' : `${item.engagementRate}% (T${item.engagementRate > 10 ? 1 : 2})`}</span>
                              </div>
                            </div>

                            {/* Reason details */}
                            <p className="font-body text-xs text-white/50 leading-relaxed max-w-xl md:text-left">
                              {item.reason}
                            </p>
                          </div>
                        </div>

                        {/* RIGHT/LOWER: MAGNETIC ACTION BUTTON */}
                        <div className={isCreator ? "w-full pt-6" : "shrink-0"}>
                          {isCreator ? (
                            <motion.button
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.97 }}
                              onClick={() => handleSecureDealRoom(item.id, item.brandName, item.fitScore)}
                              className="w-full py-3.5 border border-[#FF007A] text-[#FF007A] font-label text-[10px] font-bold tracking-widest uppercase rounded-2xl hover:bg-[#FF007A] hover:text-white transition-colors duration-300 hover:shadow-[0_0_20px_rgba(255,0,122,0.3)]"
                            >
                              INSTANTLY APPLY & DROP PORTFOLIO
                            </motion.button>
                          ) : (
                            <motion.button
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.97 }}
                              onClick={() => handleProposeAlliance(item.id, item.name, item.fitScore)}
                              className="px-8 py-4 border border-[#CCFF00] text-black bg-[#CCFF00] hover:bg-transparent hover:text-white font-label text-[10px] font-bold tracking-widest uppercase rounded-2xl transition-colors duration-300 hover:shadow-[0_0_20px_rgba(204,255,0,0.3)]"
                            >
                              PROPOSE ALLIANCE & LOCK ESCROW
                            </motion.button>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            ) : (
              /* EMPTY OR NOT YET SYNCED */
              <div className="text-center py-20 bg-white/[0.01] border border-white/5 rounded-3xl p-10 max-w-md mx-auto space-y-6">
                <span className="material-symbols-outlined text-4xl text-white/20">hub</span>
                <p className="font-label text-xs text-white/50 uppercase tracking-widest">Calibration Context Unloaded</p>
                <button
                  onClick={fetchMatches}
                  className="px-8 py-3.5 bg-white text-black font-label text-[10px] font-bold tracking-widest uppercase rounded-xl hover:bg-[#CCFF00] transition-colors"
                >
                  INITIALIZE CALIBRATION
                </button>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* FOOTER */}
        <div className="pt-12 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-white/30 font-label text-[8px] tracking-widest uppercase mt-12">
          <span>NEURAL CREATOR CORP © 2026</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white">System Status</a>
            <a href="#" className="hover:text-white">API Docs</a>
            <a href="#" className="hover:text-white">Terms of Service</a>
          </div>
        </div>
      </main>
    </div>
  );
}
