import React from 'react';
import OrbitHero from '../components/OrbitHero';
import BentoMetrics from '../components/BentoMetrics';

export default function Home() {
  return (
    <div className="bg-black min-h-screen">
      <OrbitHero />
      
      {/* Spacer and Bento Grid section */}
      <div className="pb-24">
        <BentoMetrics />
      </div>
    </div>
  );
}
