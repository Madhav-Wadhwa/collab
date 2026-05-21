import React, { useState, useEffect, useRef, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';

// ORBIT NAVIGATION BAR
export function OrbitNavbar() {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  const links = user?.role === 'brand' ? [
    { label: 'Explore Network', path: '/marketplace' },
    { label: 'Campaign Briefs', path: '/campaigns' },
    { label: 'AI Scout', path: '/ai-scout' },
    { label: 'Live Deal Room', path: '/deal-room' },
    { label: 'Performance Feed', path: '/feed' },
  ] : [
    { label: 'Campaign Briefs', path: '/campaigns' },
    { label: 'AI Scout', path: '/ai-scout' },
    { label: 'Live Deal Room', path: '/deal-room' },
    { label: 'Performance Feed', path: '/feed' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 h-20 z-50 bg-black/30 backdrop-blur-xl border-b border-white/5 flex justify-between items-center px-8">
      {/* Branding */}
      <Link to="/" className="flex items-center gap-2 select-none group">
        <span className="font-display text-2xl md:text-3xl tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-[#FF007A] via-[#FF00FF] to-[#CCFF00] font-bold">
          CREATOR
        </span>
        <span className="font-display text-2xl md:text-3xl tracking-tighter text-[#CCFF00] font-bold">
          CONNECT
        </span>
      </Link>

      {/* Navigation Link Cluster */}
      <nav className="hidden md:flex items-center gap-1.5 bg-white/[0.02] border border-white/5 p-1 rounded-full relative">
        {links.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`relative px-5 py-2 rounded-full font-label text-[10px] tracking-widest uppercase transition-colors duration-300 ${
              isActive(link.path) ? 'text-black font-bold' : 'text-white/60 hover:text-white'
            }`}
          >
            <span className="relative z-10">{link.label}</span>
            {isActive(link.path) && (
              <motion.div
                layoutId="hoverOrbit"
                className="absolute inset-0 bg-[#CCFF00] rounded-full -z-0"
                transition={{ type: 'spring', stiffness: 80, damping: 25, mass: 1 }}
              />
            )}
          </Link>
        ))}
      </nav>

      {/* Profile & Role Badge */}
      <div className="flex items-center gap-6">
        {user ? (
          <>
            {/* Status indicator badge instead of toggle */}
            <div className="flex items-center">
              <span className={`font-label text-[8px] tracking-widest px-3.5 py-1.5 rounded-full border bg-black font-bold select-none ${
                user.role === 'brand' 
                  ? 'text-[#CCFF00] border-[#CCFF00]/20 shadow-[0_0_10px_rgba(204,255,0,0.15)]' 
                  : 'text-[#FF007A] border-[#FF007A]/20 shadow-[0_0_10px_rgba(255,0,122,0.15)]'
              }`}>
                {user.role === 'brand' ? 'BRAND PORTAL' : 'CREATOR VAULT'}
              </span>
            </div>

            {/* Profile Avatar / Logout */}
            <div className="flex items-center gap-4 border-l border-white/10 pl-6">
              {user.creatorProfile?.profileImage ? (
                <img
                  src={user.creatorProfile.profileImage}
                  alt={user.name}
                  className="w-8 h-8 rounded-full border border-white/10 object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center font-display text-white text-xs">
                  {user.name[0].toUpperCase()}
                </div>
              )}
              <button
                onClick={logout}
                className="font-label text-[9px] tracking-widest text-[#FF007A] hover:underline"
              >
                DISCONNECT
              </button>
            </div>
          </>
        ) : (
          <Link
            to="/auth"
            className="px-6 py-2.5 bg-white text-black font-label text-[10px] tracking-widest uppercase font-bold rounded-full hover:bg-[#CCFF00] transition-colors duration-300"
          >
            INITIALIZE ACCESS
          </Link>
        )}
      </div>
    </header>
  );
}


// MAGNETIC BUTTON wrapper
function MagneticButton({ children, className, onClick, isFuchsia }) {
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const ref = useRef(null);

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = clientX - (left + width / 2);
    const y = clientY - (top + height / 2);
    // Apply 35% offset limit
    setCoords({ x: x * 0.35, y: y * 0.35 });
  };

  const handleMouseLeave = () => {
    setCoords({ x: 0, y: 0 });
  };

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      animate={{ x: coords.x, y: coords.y }}
      transition={{ type: 'spring', stiffness: 120, damping: 20, mass: 0.8 }}
      className={`relative px-10 py-5 rounded-xl font-display text-lg tracking-widest uppercase transition-all duration-300 border-2 overflow-hidden flex-1 ${
        isFuchsia 
          ? 'bg-black text-white border-[#FF007A] hover:shadow-[0_0_30px_rgba(255,0,122,0.4)]'
          : 'bg-black text-white border-[#CCFF00] hover:shadow-[0_0_30px_rgba(204,255,0,0.4)]'
      } ${className}`}
    >
      <span className="relative z-10">{children}</span>
      <div 
        className={`absolute inset-0 opacity-0 hover:opacity-10 transition-opacity duration-300 -z-0 ${
          isFuchsia ? 'bg-[#FF007A]' : 'bg-[#CCFF00]'
        }`} 
      />
    </motion.button>
  );
}

// ZERO-G "QUANTUM HANDSHAKE" HERO VIEWPORT
export default function OrbitHero() {
  const navigate = useNavigate();
  const [united, setUnited] = useState(false);
  const [showRipple, setShowRipple] = useState(false);

  // Auto-clasp the arms after 1.5 seconds for visual impact
  useEffect(() => {
    const timer = setTimeout(() => {
      setUnited(true);
      setShowRipple(true);
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-screen bg-black overflow-hidden flex flex-col justify-between pt-24 pb-12 px-8">
      {/* Floating background lights */}
      <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-[#FF007A]/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-[#CCFF00]/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Spacous Handshake Viewport */}
      <div className="relative flex-1 w-full max-w-5xl mx-auto flex items-center justify-center min-h-[360px] select-none">
        
        {/* Fuchsia Ripple circles */}
        <AnimatePresence>
          {showRipple && (
            <>
              <motion.div
                initial={{ scale: 0.8, opacity: 1 }}
                animate={{ scale: 3, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
                className="absolute w-40 h-40 rounded-full border-2 border-[#FF007A]/30 blur-sm pointer-events-none"
              />
              <motion.div
                initial={{ scale: 0.6, opacity: 1 }}
                animate={{ scale: 2.5, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.8, ease: 'easeOut', delay: 0.1 }}
                className="absolute w-40 h-40 rounded-full border-2 border-[#CCFF00]/30 blur-md pointer-events-none"
              />
            </>
          )}
        </AnimatePresence>

        {/* LEFT ARM (Creator Orbit) */}
        {!united && (
          <motion.div
            initial={{ x: '-100%', opacity: 0 }}
            animate={{ x: '-15%', opacity: 1, y: [-8, 8, -8] }}
            transition={{
              x: { duration: 1.5, ease: 'easeOut' },
              y: { repeat: Infinity, duration: 4, ease: 'easeInOut' }
            }}
            className="absolute left-0 w-[45%] h-56 flex justify-end items-center pointer-events-none filter drop-shadow-[0_0_20px_rgba(255,0,122,0.3)]"
          >
            {/* SVG mechanical left arm */}
            <svg viewBox="0 0 200 100" className="w-full h-full text-[#FF007A]" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M 0,50 Q 50,40 100,50 T 170,45" strokeDasharray="5,5" />
              <rect x="90" y="38" width="20" height="24" rx="4" fill="black" strokeWidth="2" />
              <circle cx="100" cy="50" r="4" fill="#FF007A" />
              <path d="M 170,45 L 185,45 M 175,40 L 190,50 M 170,50 L 180,55" strokeWidth="3" />
            </svg>

            {/* Anti-gravity particle badges */}
            <div className="absolute top-0 right-4 flex flex-col gap-2">
              <motion.div
                animate={{ y: [-10, -50], opacity: [0, 1, 0] }}
                transition={{ repeat: Infinity, duration: 3, delay: 0.5 }}
                className="bg-[#FF007A]/20 border border-[#FF007A]/40 rounded px-2 py-1 font-label text-[8px] text-[#FF007A]"
              >
                ❤️ LIKES
              </motion.div>
              <motion.div
                animate={{ y: [10, -30], opacity: [0, 1, 0] }}
                transition={{ repeat: Infinity, duration: 4, delay: 1.5 }}
                className="bg-[#FF007A]/20 border border-[#FF007A]/40 rounded-full w-5 h-5 flex items-center justify-center text-[9px]"
              >
                🔥
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* RIGHT ARM (Brand Orbit) */}
        {!united && (
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: '15%', opacity: 1, y: [8, -8, 8] }}
            transition={{
              x: { duration: 1.5, ease: 'easeOut' },
              y: { repeat: Infinity, duration: 4, ease: 'easeInOut' }
            }}
            className="absolute right-0 w-[45%] h-56 flex justify-start items-center pointer-events-none filter drop-shadow-[0_0_20px_rgba(204,255,0,0.3)]"
          >
            {/* SVG mechanical right arm */}
            <svg viewBox="0 0 200 100" className="w-full h-full text-[#CCFF00]" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M 200,50 Q 150,60 100,50 T 30,55" strokeDasharray="3,3" />
              <rect x="90" y="38" width="20" height="24" rx="4" fill="black" strokeWidth="2" />
              <circle cx="110" cy="50" r="4" fill="#CCFF00" />
              <path d="M 30,55 L 15,55 M 25,60 L 10,50 M 30,50 L 20,45" strokeWidth="3" />
            </svg>

            {/* Anti-gravity matrix particles */}
            <div className="absolute bottom-0 left-4 flex flex-col gap-2">
              <motion.div
                animate={{ y: [10, -30], opacity: [0, 1, 0] }}
                transition={{ repeat: Infinity, duration: 3, delay: 1 }}
                className="bg-[#CCFF00]/20 border border-[#CCFF00]/40 rounded px-2 py-1 font-label text-[8px] text-[#CCFF00]"
              >
                $ ESCROW SECURED
              </motion.div>
              <motion.div
                animate={{ y: [20, -20], opacity: [0, 1, 0] }}
                transition={{ repeat: Infinity, duration: 5, delay: 2.2 }}
                className="text-[#CCFF00] font-label text-[7px]"
              >
                [ROI: 4.8x]
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* LOCKED SINGLE WEIGHTLESS ENTITY */}
        {united && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1, y: [-10, 10, -10] }}
            transition={{
              scale: { duration: 0.4 },
              opacity: { duration: 0.4 },
              y: { repeat: Infinity, duration: 5, ease: 'easeInOut' }
            }}
            className="flex flex-col items-center justify-center relative cursor-pointer"
            onClick={() => {
              // Trigger ripple on manual click
              setShowRipple(false);
              setTimeout(() => setShowRipple(true), 50);
            }}
          >
            {/* Clasping Handshake Visual */}
            <div className="relative w-64 h-64 flex items-center justify-center">
              {/* Dual Glowing Halo */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#FF007A]/10 to-[#CCFF00]/10 rounded-full filter blur-2xl" />
              
              <svg viewBox="0 0 100 100" className="w-48 h-48 drop-shadow-[0_0_25px_rgba(204,255,0,0.4)]">
                {/* Mechanical hands joined in handshake */}
                <g strokeWidth="2.5" fill="none" stroke="white">
                  {/* Left hand details (Fuchsia highlight) */}
                  <path d="M 20,45 C 30,45 42,40 46,45 L 54,48" stroke="#FF007A" />
                  <path d="M 38,42 C 42,30 52,32 54,44" stroke="#FF007A" />
                  
                  {/* Right hand details (Lime highlight) */}
                  <path d="M 80,55 C 70,55 58,60 54,55 L 46,52" stroke="#CCFF00" />
                  <path d="M 62,58 C 58,70 48,68 46,56" stroke="#CCFF00" />

                  {/* Joined Knuckles */}
                  <circle cx="48" cy="48" r="3" fill="#FF007A" />
                  <circle cx="52" cy="52" r="3" fill="#CCFF00" />
                </g>
              </svg>
            </div>
            
            <span className="font-label text-[9px] tracking-widest text-[#CCFF00] uppercase mt-2 select-none border border-[#CCFF00]/20 px-4 py-1.5 rounded-full bg-black">
              ALLIANCE LOCKED // Programmatic Escrow Verified
            </span>
          </motion.div>
        )}

      </div>

      {/* TYPOGRAPHIC STACK & CTA ACTION HUB */}
      <div className="w-full max-w-4xl mx-auto text-center space-y-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-4"
        >
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl tracking-tighter uppercase leading-none text-white">
            CHASE INFLUENCE <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#FF007A] via-[#FF00FF] to-[#CCFF00] filter drop-shadow-[0_0_20px_rgba(255,0,255,0.2)]">
              // SECURE THE ESCROW
            </span>
          </h1>
          <p className="max-w-2xl mx-auto font-body text-white/50 text-sm md:text-base leading-relaxed">
            The high-trust multi-tenant digital ecosystem bridging decentralized Instagram creators with corporate market sectors via automated data-verified metrics.
          </p>
        </motion.div>

        {/* Dual Magnetic CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-6 max-w-2xl mx-auto pt-4"
        >
          <MagneticButton
            isFuchsia={true}
            onClick={() => navigate('/auth?mode=creator')}
          >
            START AS CREATOR
          </MagneticButton>
          <MagneticButton
            isFuchsia={false}
            onClick={() => navigate('/auth?mode=brand')}
          >
            START AS BRAND
          </MagneticButton>
        </motion.div>
      </div>
    </div>
  );
}
