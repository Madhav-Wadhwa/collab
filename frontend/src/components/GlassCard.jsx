import React from 'react';

export default function GlassCard({ children, className = '' }) {
  return (
    <div className={`backdrop-filter backdrop-blur-xl bg-neutral-950/70 border border-white/10 rounded-2xl p-card-padding ${className}`}>
      {children}
    </div>
  );
}
