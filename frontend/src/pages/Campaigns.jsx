import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import BrandWorkbench from '../components/BrandWorkbench';
import CampaignDiscovery from '../components/CampaignDiscovery';

export default function Campaigns() {
  const { user } = useContext(AuthContext);

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black text-white font-label text-xs">
        ESTABLISHING SESSION CONTEXT...
      </div>
    );
  }

  return user.role === 'brand' ? <BrandWorkbench /> : <CampaignDiscovery />;
}
