import React from 'react';
import { motion } from 'framer-motion';

// Mock high-gloss video and luxury edits portfolio assets
const LUXURY_PORTFOLIO = [
  { id: 1, type: 'video', url: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&q=80&w=600', aspect: 'aspect-[3/4]', label: 'Hypercar Cinematic Edit' },
  { id: 2, type: 'image', url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600', aspect: 'aspect-[4/3]', label: 'Premium Watch Shoot' },
  { id: 3, type: 'video', url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=600', aspect: 'aspect-[3/4]', label: 'Cyberpunk Apparel Run' },
  { id: 4, type: 'image', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=600', aspect: 'aspect-[1/1]', label: 'Automotive Digital Art' },
];

export default function CreatorDossier({ creator, onClose }) {
  if (!creator) return null;

  // Calculate tier
  const followers = creator.creatorProfile?.followersCount || 10245;
  const isNano = followers < 10000;
  const tierLabel = isNano ? 'Nano (1k - 10k)' : 'Micro (10k - 100k)';

  // Engagement Spline path
  const splinePath = "M 5,20 Q 20,5 35,22 T 65,8 T 95,15";

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 md:p-8 overflow-y-auto">
      
      {/* Container */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-4xl bg-[#000000] border border-white/10 rounded-3xl p-6 md:p-8 space-y-8 relative max-h-[90vh] overflow-y-auto"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-white/50 hover:text-white p-1"
        >
          <span className="material-symbols-outlined text-xl">close</span>
        </button>

        {/* 1. VERIFIED HEADER EMBLEM BLOCK */}
        <div className="flex flex-col sm:flex-row gap-6 items-center border-b border-white/5 pb-6">
          
          {/* Pulsing avatar */}
          <div className="relative w-24 h-24 flex items-center justify-center">
            {/* Pulsing gradient ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 6, ease: 'linear' }}
              className="absolute inset-0 rounded-full border-2 border-dashed border-gradient bg-gradient-to-r from-[#FF007A] to-[#CCFF00]"
              style={{ padding: '2px' }}
            />
            <img
              src={creator.creatorProfile?.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
              alt={creator.name}
              className="w-[88px] h-[88px] rounded-full object-cover border-2 border-black z-10"
            />
          </div>

          <div className="text-center sm:text-left space-y-2">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
              <h3 className="font-display text-3xl uppercase tracking-wide text-white">{creator.name}</h3>
              <span className="bg-[#CCFF00]/10 border border-[#CCFF00]/30 text-[#CCFF00] font-label text-[8px] tracking-widest px-2.5 py-0.5 rounded-full uppercase font-bold">
                {tierLabel}
              </span>
            </div>

            <p className="font-label text-xs text-[#CCFF00] tracking-wider">
              @{creator.creatorProfile?.instagramUsername || 'instagram_creator'}
            </p>

            <div className="flex justify-center sm:justify-start gap-4 pt-1">
              <a
                href={`https://instagram.com/${creator.creatorProfile?.instagramUsername}`}
                target="_blank"
                rel="noreferrer"
                className="bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-1.5 rounded-full font-label text-[8px] tracking-widest uppercase text-white/80 flex items-center gap-1.5 transition-all"
              >
                <span>Instagram Profile</span>
                <span className="material-symbols-outlined text-[10px]">open_in_new</span>
              </a>
            </div>
          </div>
        </div>

        {/* 2. CLOUT PERFORMANCE SCORECARD (Asymmetric Bento Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Box A: Engagement Engine */}
          <div className="md:col-span-4 bg-[#080809] border border-white/5 p-5 rounded-2xl flex flex-col justify-between h-[160px]">
            <div>
              <span className="font-label text-[8px] text-white/40 tracking-widest uppercase block">ENGAGEMENT ENGINE</span>
              <span className="font-display text-4xl text-white block mt-2">
                {creator.creatorProfile?.engagementRate || '8.4'}%
              </span>
            </div>
            
            {/* Micro Spline graph */}
            <div className="w-full h-12 flex items-end">
              <svg viewBox="0 0 100 30" className="w-full h-full text-[#CCFF00]" fill="none" stroke="currentColor" strokeWidth="2.5">
                <motion.path
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, ease: 'easeInOut' }}
                  d={splinePath}
                />
              </svg>
            </div>
          </div>

          {/* Box B: Audience Matrix */}
          <div className="md:col-span-5 bg-[#080809] border border-white/5 p-5 rounded-2xl flex items-center justify-between h-[160px]">
            <div className="space-y-2">
              <span className="font-label text-[8px] text-white/40 tracking-widest uppercase block">AUDIENCE MATRIX</span>
              <div className="font-label text-[10px] text-white/80 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF007A]" />
                  <span>FEMALE: 60%</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#CCFF00]" />
                  <span>MALE: 40%</span>
                </div>
                <div className="text-[8px] text-white/40 mt-2 font-body uppercase">LOC: Global Luxury Segment</div>
              </div>
            </div>

            {/* Circular pie-chart vector */}
            <div className="relative w-20 h-20 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3.5" />
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#CCFF00" strokeWidth="3.5" strokeDasharray="40 60" strokeDashoffset="0" />
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#FF007A" strokeWidth="3.5" strokeDasharray="60 40" strokeDashoffset="40" />
              </svg>
              <div className="absolute font-label text-[9px] text-white/80">GEN-Z</div>
            </div>
          </div>

          {/* Box C: ROI Velocity Engine */}
          <div className="md:col-span-3 bg-[#080809] border border-white/5 p-5 rounded-2xl flex flex-col justify-between h-[160px]">
            <div>
              <span className="font-label text-[8px] text-white/40 tracking-widest uppercase block">ROI VELOCITY ENGINE</span>
              <span className="font-display text-4xl text-[#CCFF00] block mt-2">
                {creator.creatorProfile?.aiInsights?.predictedRoiMultiplier || '4.8'}x
              </span>
            </div>
            
            <div className="font-label text-[8px] text-white/40 border-t border-white/5 pt-2">
              <span>HISTORICAL CAMPAIGN MULTIPLIER</span>
            </div>
          </div>

        </div>

        {/* 3. CREATIVE MEDIA SHOWCASE MASONRY */}
        <div className="space-y-4">
          <span className="font-label text-xs tracking-widest text-[#CCFF00] uppercase block">
            CREATIVE PORTFOLIO SHOWCASE (3D SUSPENSION GRID)
          </span>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {LUXURY_PORTFOLIO.map((asset) => (
              <motion.div
                key={asset.id}
                whileHover={{ scale: 1.05, rotateX: 10, rotateY: -10, z: 15 }}
                transition={{ type: 'spring', stiffness: 150, damping: 15 }}
                style={{ transformStyle: 'preserve-3d', perspective: 1000 }}
                className={`relative bg-[#080809] border border-white/10 rounded-2xl overflow-hidden cursor-pointer ${asset.aspect} group shadow-lg`}
              >
                <img
                  src={asset.url}
                  alt={asset.label}
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-300"
                />
                
                {/* 3D label element overlay */}
                <div 
                  style={{ transform: 'translateZ(10px)' }}
                  className="absolute bottom-3 left-3 right-3 bg-black/60 backdrop-blur-md border border-white/5 p-2 rounded-lg text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
                  <span className="font-label text-[8px] text-white/80 uppercase tracking-widest">
                    {asset.label}
                  </span>
                </div>

                {/* Video icon design */}
                {asset.type === 'video' && (
                  <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-md p-1.5 rounded-full border border-white/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-white text-xs">play_arrow</span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

      </motion.div>

    </div>
  );
}
