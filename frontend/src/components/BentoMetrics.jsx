import React, { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';

export default function BentoMetrics() {
  const [tickerVal, setTickerVal] = useState(1000);
  const [padlockExploded, setPadlockExploded] = useState(false);

  // 1. Followers Slot-machine Counter Animation
  useEffect(() => {
    let start = 1000;
    const end = 10245;
    const duration = 2500; // ms
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 4); // easeOutQuart
      
      const currentVal = Math.floor(start + easedProgress * (end - start));
      setTickerVal(currentVal);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    const timer = setTimeout(() => {
      requestAnimationFrame(animate);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="space-y-6 max-w-7xl mx-auto px-8 py-12 bg-black text-white">
      <div className="flex justify-between items-end border-b border-white/5 pb-4 mb-8">
        <div className="space-y-1">
          <span className="font-label text-xs tracking-widest text-[#CCFF00] uppercase">PLATFORM ANALYTICS</span>
          <h2 className="font-display text-3xl md:text-5xl uppercase tracking-tighter">LEVITAL METRICS GRID</h2>
        </div>
        <span className="font-label text-[9px] text-white/30 uppercase tracking-widest">
          SCROLL-DRIVEN VIEWPORT TELEMETRY
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 relative">
        
        {/* BENTO BOX 1: THE NANO FEED GRAVITY TICKER */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          animate={{ y: [-6, 6, -6] }}
          style={{ y: 0 }} // overriding standard y for nested motion control
          className="md:col-span-4 bg-white/[0.02] backdrop-blur-md border border-white/10 rounded-3xl p-6 flex flex-col justify-between h-[280px]"
        >
          <div className="flex justify-between items-start">
            <span className="font-label text-[9px] text-[#FF007A] tracking-widest uppercase">NANO FEED TICKER</span>
            <span className="material-symbols-outlined text-[#FF007A] text-sm">trending_up</span>
          </div>

          <div className="my-auto space-y-2">
            <div className="font-display text-6xl text-white tracking-tighter leading-none select-none">
              {tickerVal.toLocaleString()}+
            </div>
            <p className="font-body text-white/40 text-xs leading-relaxed">
              Monetized nano and micro creators injecting active conversions into the brand network.
            </p>
          </div>

          <div className="flex gap-2">
            <span className="w-2 h-2 rounded-full bg-[#FF007A] animate-pulse" />
            <span className="font-label text-[8px] tracking-wider text-white/50">Tiers: 1k - 100k Followers</span>
          </div>
        </motion.div>

        {/* BENTO BOX 2: ATMOSPHERIC GRAPH INGESTION MATRIX */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.15 }}
          animate={{ y: [6, -6, 6] }}
          className="md:col-span-8 bg-white/[0.02] backdrop-blur-md border border-white/10 rounded-3xl p-6 flex flex-col justify-between h-[280px]"
        >
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#CCFF00] text-sm">analytics</span>
              <span className="font-label text-[9px] text-white tracking-widest uppercase">INGESTION MATRIX</span>
            </div>
            <div className="flex gap-1.5">
              <span className="px-2 py-0.5 bg-white/5 rounded text-[8px] font-label text-white/40">API CONNECTED</span>
              <span className="px-2 py-0.5 bg-[#CCFF00]/10 border border-[#CCFF00]/20 text-[#CCFF00] rounded text-[8px] font-label font-bold">ACTIVE</span>
            </div>
          </div>

          {/* Telemetry info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-end">
            <div className="space-y-4">
              <div className="font-label text-[10px] text-white/50 space-y-1.5">
                <div className="flex justify-between">
                  <span>ENGAGEMENT RATE:</span>
                  <span className="text-[#CCFF00] font-bold">8.4%</span>
                </div>
                <div className="flex justify-between">
                  <span>STORIES IMPRESSION AVG:</span>
                  <span className="text-[#CCFF00] font-bold">14,250</span>
                </div>
                <div className="flex justify-between">
                  <span>DEMOGRAPHIC REACH:</span>
                  <span className="text-[#CCFF00] font-bold">94%</span>
                </div>
              </div>

              {/* Constants waves spline */}
              <div className="h-16 flex items-end relative overflow-hidden bg-neutral-900/40 border border-white/5 rounded-xl px-2">
                <svg viewBox="0 0 100 40" className="w-full h-full text-[#CCFF00]" fill="none" stroke="currentColor" strokeWidth="2">
                  {/* Fluctuation path */}
                  <motion.path
                    animate={{
                      d: [
                        "M0,35 Q10,10 20,30 T40,25 T60,15 T80,35 T100,20",
                        "M0,35 Q10,30 20,15 T40,35 T60,25 T80,10 T100,20",
                        "M0,35 Q10,10 20,30 T40,25 T60,15 T80,35 T100,20"
                      ]
                    }}
                    transition={{ repeat: Infinity, duration: 6, ease: 'linear' }}
                  />
                </svg>
              </div>
            </div>

            {/* Visual demographic circle */}
            <div className="flex flex-col items-center py-2">
              <span className="font-label text-[9px] text-white/40 mb-2">TARGET CLOUT MATRIX</span>
              <div className="relative w-24 h-24 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="15.915" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
                  <circle cx="18" cy="18" r="15.915" fill="none" stroke="#CCFF00" strokeWidth="3" strokeDasharray="94 6" strokeDashoffset="0" />
                </svg>
                <span className="absolute font-display text-xl text-[#CCFF00] tracking-tighter">94%</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* BENTO BOX 3: QUANTUM ESCROW SECURITY VAULT */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          animate={{ y: [-5, 5, -5] }}
          className="md:col-span-7 bg-white/[0.02] backdrop-blur-md border border-white/10 rounded-3xl p-6 flex flex-col justify-between h-[320px] relative overflow-hidden group cursor-pointer"
          onClick={() => setPadlockExploded(!padlockExploded)}
        >
          <div className="flex justify-between items-start">
            <span className="font-label text-[9px] text-[#CCFF00] tracking-widest uppercase">VAULT PROTOCOL</span>
            <span className="font-label text-[8px] text-white/40 uppercase">CLICK TO TRIGGER RELEASE</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div className="space-y-3">
              <h3 className="font-display text-2xl text-white tracking-wide leading-none uppercase">QUANTUM ESCROW</h3>
              <p className="font-body text-xs text-white/40 leading-relaxed">
                Platform funds are held locked. Upon milestone approval, cryptography releases liquidity instantly.
              </p>
              
              <div className="font-label text-[8px] text-[#CCFF00]/80 space-y-1">
                <div>● Programmatic Escrow Guard</div>
                <div>● Instantly Released Liquidity</div>
              </div>
            </div>

            {/* Line-drawing padlock vector that splits apart */}
            <div className="h-40 flex items-center justify-center relative select-none">
              <svg viewBox="0 0 100 100" className="w-28 h-28 text-white" fill="none" stroke="currentColor" strokeWidth="2">
                {/* Shackle: slides up/apart */}
                <motion.path
                  animate={padlockExploded ? { y: -25, rotate: -15, opacity: 0.5 } : { y: 0, rotate: 0, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 100, damping: 10 }}
                  d="M 35,45 L 35,30 C 35,20 65,20 65,30 L 65,45"
                  stroke={padlockExploded ? "#FF007A" : "#CCFF00"}
                />

                {/* Padlock Body Fragments */}
                <g>
                  {/* Left Body part */}
                  <motion.path
                    animate={padlockExploded ? { x: -20, y: 10, rotate: -25, opacity: 0.3 } : { x: 0, y: 0, rotate: 0, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 80, damping: 15 }}
                    d="M 25,45 L 50,45 L 50,85 L 25,85 Z"
                    fill="black"
                  />
                  {/* Right Body part */}
                  <motion.path
                    animate={padlockExploded ? { x: 20, y: 15, rotate: 25, opacity: 0.3 } : { x: 0, y: 0, rotate: 0, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 80, damping: 15 }}
                    d="M 50,45 L 75,45 L 75,85 L 50,85 Z"
                    fill="black"
                  />

                  {/* Core cryptographic locking keyhole */}
                  <motion.circle
                    animate={padlockExploded ? { scale: 0, opacity: 0 } : { scale: 1, opacity: 1 }}
                    cx="50"
                    cy="60"
                    r="4"
                    fill="#CCFF00"
                  />
                  <motion.path
                    animate={padlockExploded ? { scale: 0, opacity: 0 } : { scale: 1, opacity: 1 }}
                    d="M 50,64 L 50,74"
                    stroke="#CCFF00"
                  />
                </g>
              </svg>

              {/* Flying fragments effect */}
              {padlockExploded && (
                <div className="absolute font-label text-[8px] text-[#FF007A] uppercase bg-[#FF007A]/10 border border-[#FF007A]/40 px-2 py-0.5 rounded-full animate-bounce">
                  RELEASED
                </div>
              )}
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-3">
            <span className="font-label text-[8px] text-[#CCFF00]/70 block">MOCK BLOCKCHAIN TXHASH</span>
            <span className="font-label text-[10px] text-white/50 block truncate font-bold">
              0x91F56c11E7e388DDeF72b7a08A74de976B8e4897
            </span>
          </div>
        </motion.div>

        {/* BENTO BOX 4: FRICTIONLESS BARTER PIPELINE */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.45 }}
          animate={{ y: [5, -5, 5] }}
          className="md:col-span-5 bg-white/[0.02] backdrop-blur-md border border-white/10 rounded-3xl p-6 flex flex-col justify-between h-[320px]"
        >
          <div className="space-y-4">
            <span className="font-label text-[9px] text-[#CCFF00] tracking-widest block uppercase border-b border-white/5 pb-2">
              BARTER FULFILLMENT TIMELINE
            </span>

            {/* Zero-g layout tracking vertical timeline */}
            <div className="relative pl-6 space-y-4">
              {/* Vertical line indicator */}
              <div className="absolute left-2.5 top-2 bottom-2 w-[2px] bg-white/5">
                <div className="w-full h-1/2 bg-gradient-to-b from-[#FF007A] to-[#CCFF00]" />
              </div>

              {/* Locked */}
              <div className="relative flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="font-body text-xs text-white/80 block">Locked (Escrow Setup)</span>
                  <span className="font-label text-[8px] text-white/40 block">Escrow locked successfully.</span>
                </div>
                <div className="absolute left-[-21px] w-4 h-4 rounded-full border border-white/20 bg-neutral-950 flex items-center justify-center">
                  <div className="w-2 h-2 bg-[#FF007A] rounded-full" />
                </div>
              </div>

              {/* Shipped */}
              <div className="relative flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="font-body text-xs text-white block font-bold">Shipped (Courier Verified)</span>
                  <span className="font-label text-[8px] text-[#CCFF00]/80 block font-bold">Orb tracking active.</span>
                </div>
                {/* Pulsing weightless orb */}
                <div className="absolute left-[-23px] w-5 h-5 rounded-full bg-[#CCFF00]/20 border-2 border-[#CCFF00] flex items-center justify-center shadow-[0_0_10px_rgba(204,255,0,0.5)]">
                  <motion.div
                    animate={{ scale: [0.8, 1.2, 0.8] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="w-2.5 h-2.5 bg-[#CCFF00] rounded-full"
                  />
                </div>
              </div>

              {/* Live */}
              <div className="relative flex items-center justify-between opacity-40">
                <div className="space-y-0.5">
                  <span className="font-body text-xs text-white block">Live (Content Published)</span>
                  <span className="font-label text-[8px] text-white/40 block">Vetting post logs.</span>
                </div>
                <div className="absolute left-[-21px] w-4 h-4 rounded-full border border-white/20 bg-neutral-950 flex items-center justify-center" />
              </div>

              {/* Released */}
              <div className="relative flex items-center justify-between opacity-40">
                <div className="space-y-0.5">
                  <span className="font-body text-xs text-white block">Released (Escrow Complete)</span>
                  <span className="font-label text-[8px] text-white/40 block">Milestone release complete.</span>
                </div>
                <div className="absolute left-[-21px] w-4 h-4 rounded-full border border-white/20 bg-neutral-950 flex items-center justify-center" />
              </div>
            </div>
          </div>

          <div className="text-center font-label text-[8px] text-white/40 border-t border-white/5 pt-3">
            <span>Milestone: SHIPPED (2/4 Stages Completed)</span>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
