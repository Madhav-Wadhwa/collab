import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full py-8 px-grid-margin flex flex-col md:flex-row justify-between items-center gap-4 bg-surface-container-lowest border-t border-white/10 mt-auto">
      <div className="flex flex-col items-center md:items-start gap-1">
        <span className="text-primary font-bold font-label text-xs tracking-wider">CREATORCONNECT</span>
        <p className="font-label text-[10px] text-[#cfc4c5] opacity-60">© 2026 CREATORCONNECT. SECURED BY ESCROW.</p>
      </div>
      <nav className="flex gap-8">
        <a className="text-[#cfc4c5] hover:text-primary font-label text-[10px] tracking-widest transition-colors" href="#">Terms</a>
        <a className="text-[#cfc4c5] hover:text-primary font-label text-[10px] tracking-widest transition-colors" href="#">Privacy</a>
        <a className="text-[#cfc4c5] hover:text-primary font-label text-[10px] tracking-widest transition-colors" href="#">API</a>
        <a className="text-[#cfc4c5] hover:text-primary font-label text-[10px] tracking-widest transition-colors" href="#">System Status</a>
      </nav>
    </footer>
  );
}
