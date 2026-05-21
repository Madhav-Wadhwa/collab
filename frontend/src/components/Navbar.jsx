import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-background/50 backdrop-blur-xl border-b border-white/10 flex justify-between items-center w-full px-grid-margin h-20 z-50 fixed top-0">
      <div className="flex items-center gap-8">
        <Link to="/" className="font-display text-2xl md:text-3xl tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045]">
          CREATORCONNECT
        </Link>
        <nav className="hidden md:flex gap-6">
          <Link
            to="/marketplace"
            className={`font-label text-xs tracking-widest ${
              isActive('/marketplace') ? 'text-primary font-bold border-b-2 border-primary pb-1' : 'text-[#cfc4c5] hover:text-primary transition-colors'
            }`}
          >
            Explore Network
          </Link>
          <Link
            to="/feed"
            className={`font-label text-xs tracking-widest ${
              isActive('/feed') ? 'text-primary font-bold border-b-2 border-primary pb-1' : 'text-[#cfc4c5] hover:text-primary transition-colors'
            }`}
          >
            Performance Feed
          </Link>
          {user && (
            <Link
              to="/deal-room"
              className={`font-label text-xs tracking-widest ${
                isActive('/deal-room') ? 'text-primary font-bold border-b-2 border-primary pb-1' : 'text-[#cfc4c5] hover:text-primary transition-colors'
              }`}
            >
              Live Deal Room
            </Link>
          )}
        </nav>
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <>
            <span className="hidden md:block px-4 py-1.5 border border-white/10 rounded-full text-xs font-label text-white/70">
              {user.role === 'creator' ? 'CREATOR MODE' : 'BRAND MODE'}
            </span>
            <div className="flex gap-4 items-center">
              <span className="material-symbols-outlined text-on-surface cursor-pointer hover:text-white transition-colors">notifications</span>
              <button 
                onClick={logout}
                className="bg-red-950/40 text-red-400 border border-red-900/30 px-4 py-1.5 rounded-full text-xs font-label hover:bg-red-900/30 transition-all active:scale-95"
              >
                Logout
              </button>
            </div>
          </>
        ) : (
          <Link to="/auth" className="bg-accent-lime text-black px-6 py-2 rounded-full font-display text-sm hover:scale-95 transition-transform">
            Initialize Access
          </Link>
        )}
      </div>
    </header>
  );
}
