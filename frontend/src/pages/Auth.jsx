import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function Auth() {
  const { login, register, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Mode: brand or creator
  const [role, setRole] = useState(searchParams.get('mode') || 'brand');
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [instagramUsername, setInstagramUsername] = useState('');
  const [niche, setNiche] = useState('lifestyle');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      navigate('/feed');
    }
  }, [user, navigate]);

  const handleRoleSwitch = (newRole) => {
    setRole(newRole);
    setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      if (isRegister) {
        // Registering
        const profile = role === 'creator' ? {
          instagramUsername,
          followersCount: Math.floor(5000 + Math.random() * 500000),
          engagementRate: parseFloat((2.5 + Math.random() * 8).toFixed(1)),
          niche: [niche],
          bio: `Elite ${niche} digital content creator.`,
        } : undefined;

        await register(name, email, password, role, profile);
      } else {
        // Logging in
        await login(email, password);
      }
      navigate('/feed');
    } catch (err) {
      setErrorMsg(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const accentColor = role === 'brand' ? '#CCFF00' : '#FF007A';
  const glowStyle = {
    backgroundColor: role === 'brand' ? 'rgba(204, 255, 0, 0.08)' : 'rgba(255, 0, 122, 0.08)'
  };

  return (
    <div className="flex h-screen w-full bg-black overflow-hidden select-none">
      {/* Left Panel: Infinite Masonry Scroll */}
      <section className="hidden lg:flex w-1/2 h-full relative overflow-hidden bg-black border-r border-white/5">
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-transparent to-black/90 pointer-events-none" />
        
        <div className="flex gap-4 p-4 w-full h-full">
          {/* Column 1 */}
          <div className="flex-1 flex flex-col gap-4 animate-infinite-scroll">
            <div className="w-full aspect-[4/5] bg-neutral-900 rounded-xl overflow-hidden relative group">
              <img
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                alt="luxury sports car"
                src="https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&q=80&w=300"
              />
            </div>
            <div className="w-full aspect-square bg-[#0b0b0c]/80 border border-white/10 rounded-xl p-6 flex flex-col justify-between">
              <span className="material-symbols-outlined text-[#CCFF00] text-3xl">analytics</span>
              <div className="font-label text-xs tracking-wider text-[#CCFF00]">REACH: 4.2M+</div>
            </div>
            <div className="w-full aspect-[3/4] bg-neutral-900 rounded-xl overflow-hidden">
              <img
                className="w-full h-full object-cover"
                alt="mechanical watch movement"
                src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=300"
              />
            </div>
            {/* Duplicate for infinite loop */}
            <div className="w-full aspect-[4/5] bg-neutral-900 rounded-xl overflow-hidden">
              <img
                className="w-full h-full object-cover grayscale"
                alt="sports car"
                src="https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&q=80&w=300"
              />
            </div>
          </div>

          {/* Column 2 */}
          <div className="flex-1 flex flex-col gap-4 animate-infinite-scroll-reverse mt-12">
            <div className="w-full aspect-square bg-[#0b0b0c]/80 border border-white/10 rounded-xl p-6 flex flex-col justify-between">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-[#833ab4] via-[#fd1d1d] to-[#fcb045]" />
                <span className="font-label text-[10px] tracking-widest text-[#cfc4c5]">LIVE FEED</span>
              </div>
              <div className="font-display text-4xl text-white leading-none">
                98.2k<br /><span className="text-[10px] font-label text-white/50 tracking-wider">VIEWING</span>
              </div>
            </div>
            <div className="w-full aspect-[4/5] bg-neutral-900 rounded-xl overflow-hidden">
              <img
                className="w-full h-full object-cover"
                alt="minimalist digital workspace"
                src="https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&q=80&w=300"
              />
            </div>
            <div className="w-full aspect-[3/4] bg-neutral-900 rounded-xl overflow-hidden">
              <img
                className="w-full h-full object-cover"
                alt="VR headset"
                src="https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&q=80&w=300"
              />
            </div>
            <div className="w-full aspect-square bg-[#0b0b0c]/80 border border-white/10 rounded-xl p-6 flex items-center">
              <p className="font-body text-sm text-white/70 italic">
                "The speed of viral trends captured in a single transaction."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Right Panel: Auth Gateway */}
      <section className="w-full lg:w-1/2 h-full flex items-center justify-center p-grid-margin relative">
        {/* Glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 blur-[120px] rounded-full transition-colors duration-700 pointer-events-none"
          style={glowStyle}
        />

        <div className="w-full max-w-md z-20 flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <h1 className="font-display text-4xl md:text-5xl tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045]">
              CREATORCONNECT
            </h1>
            <p className="font-body text-sm text-[#cfc4c5]">
              The elite gateway for the digital economy.
            </p>
          </div>

          {/* Glassmorphic Switcher */}
          <div className="bg-[#0b0b0c]/80 border border-white/10 p-1 rounded-full flex relative">
            <div
              className="absolute inset-y-1 w-[calc(50%-4px)] rounded-full transition-all duration-500 ease-in-out"
              style={{
                left: role === 'brand' ? '4px' : 'calc(50% + 0px)',
                backgroundColor: accentColor
              }}
            />
            <button
              type="button"
              className={`relative z-10 flex-1 py-3 font-label text-[10px] tracking-widest transition-colors duration-500 ${
                role === 'brand' ? 'text-black font-bold' : 'text-white/50'
              }`}
              onClick={() => handleRoleSwitch('brand')}
            >
              BRAND MODE
            </button>
            <button
              type="button"
              className={`relative z-10 flex-1 py-3 font-label text-[10px] tracking-widest transition-colors duration-500 ${
                role === 'creator' ? 'text-black font-bold' : 'text-white/50'
              }`}
              onClick={() => handleRoleSwitch('creator')}
            >
              CREATOR MODE
            </button>
          </div>

          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4">
              {isRegister && (
                <div className="relative">
                  <input
                    className="w-full bg-[#0e0e0e] border-none py-4 px-6 font-label text-xs text-white placeholder:text-white/20 focus:ring-0 rounded-lg focus:outline-none"
                    placeholder="FULL NAME"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <div className="absolute left-0 bottom-0 right-0 h-[2px] scale-x-0 transition-transform origin-left duration-300 focus-within:scale-x-100 bg-[#CCFF00]" style={{ backgroundColor: accentColor }} />
                </div>
              )}

              <div className="relative">
                <input
                  className="w-full bg-[#0e0e0e] border-none py-4 px-6 font-label text-xs text-white placeholder:text-white/20 focus:ring-0 rounded-lg focus:outline-none"
                  placeholder="ACCESS KEY / EMAIL"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="relative">
                <input
                  className="w-full bg-[#0e0e0e] border-none py-4 px-6 font-label text-xs text-white placeholder:text-white/20 focus:ring-0 rounded-lg focus:outline-none"
                  placeholder="SECURE PASSCODE"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {isRegister && role === 'creator' && (
                <>
                  <div className="relative">
                    <input
                      className="w-full bg-[#0e0e0e] border-none py-4 px-6 font-label text-xs text-white placeholder:text-white/20 focus:ring-0 rounded-lg focus:outline-none"
                      placeholder="INSTAGRAM USERNAME"
                      type="text"
                      required
                      value={instagramUsername}
                      onChange={(e) => setInstagramUsername(e.target.value)}
                    />
                  </div>
                  <div className="relative">
                    <select
                      className="w-full bg-[#0e0e0e] border-none py-4 px-6 font-label text-xs text-white/50 focus:ring-0 rounded-lg focus:outline-none appearance-none"
                      value={niche}
                      onChange={(e) => setNiche(e.target.value)}
                    >
                      <option value="lifestyle">Lifestyle</option>
                      <option value="luxury">Luxury</option>
                      <option value="tech">Tech</option>
                      <option value="fitness">Fitness</option>
                      <option value="gaming">Gaming</option>
                    </select>
                  </div>
                </>
              )}
            </div>

            {errorMsg && (
              <p className="text-red-500 font-label text-[10px] tracking-wide uppercase">{errorMsg}</p>
            )}

            <div className="flex items-center justify-between font-label text-[9px] text-white/40 tracking-widest">
              <label className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors">
                <input className="rounded bg-white/10 border-white/20 text-[#CCFF00] focus:ring-0" type="checkbox" />
                REMEMBER SESSION
              </label>
              <button
                type="button"
                onClick={() => setIsRegister(!isRegister)}
                className="hover:text-white transition-colors underline decoration-white/20 underline-offset-4"
              >
                {isRegister ? 'EXISTING CLIENT? SIGN IN' : 'NEW TO ECOSYSTEM? CREATE'}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 text-black font-display text-lg tracking-widest transition-all duration-300 active:scale-[0.98] rounded-lg disabled:opacity-50"
              style={{
                backgroundColor: accentColor,
                boxShadow: `0 0 20px ${role === 'brand' ? 'rgba(204,255,0,0.2)' : 'rgba(255,0,122,0.2)'}`
              }}
            >
              {loading ? 'INITIALIZING...' : isRegister ? 'CREATE ACCOUNT' : 'INITIALIZE ACCESS'}
            </button>
          </form>

          {/* Social connections */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <div className="h-px flex-1 bg-white/10" />
              <span className="font-label text-[9px] text-white/20 tracking-wider">OR CONNECT VIA</span>
              <div className="h-px flex-1 bg-white/10" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-3 p-4 bg-[#0b0b0c]/80 border border-white/10 rounded-lg font-label text-[9px] tracking-widest hover:bg-white/5 transition-all text-white/80">
                <span className="material-symbols-outlined text-sm">alternate_email</span>
                INSTAGRAM
              </button>
              <button className="flex items-center justify-center gap-3 p-4 bg-[#0b0b0c]/80 border border-white/10 rounded-lg font-label text-[9px] tracking-widest hover:bg-white/5 transition-all text-white/80">
                <span className="material-symbols-outlined text-sm">account_balance_wallet</span>
                WEB3 AUTH
              </button>
            </div>
          </div>
        </div>

        {/* Floating footer info */}
        <div className="absolute bottom-6 left-grid-margin right-grid-margin flex justify-between items-center font-label text-[9px] text-white/20 tracking-wider">
          <div>© 2026 CREATORCONNECT. SECURED BY ESCROW.</div>
          <div className="flex gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" /> SYSTEMS LIVE
            </span>
            <span>V.2.06-ALFA</span>
          </div>
        </div>
      </section>
    </div>
  );
}
