import React, { useState, useEffect, useRef, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import io from 'socket.io-client';
import { AuthContext } from '../context/AuthContext';

export default function DealEscrowMonitor() {
  const { user } = useContext(AuthContext);
  const [deals, setDeals] = useState([]);
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  
  // Tracking inputs
  const [trackingNumber, setTrackingNumber] = useState('');
  const [showTrackingInput, setShowTrackingInput] = useState(false);
  const [webhookLogs, setWebhookLogs] = useState([]);

  const socketRef = useRef(null);
  const chatEndRef = useRef(null);

  // Fetch all deals
  const fetchDeals = async () => {
    try {
      const res = await fetch('/api/deals', {
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      const data = await res.json();
      setDeals(data);
      if (data.length > 0 && !selectedDeal) {
        setSelectedDeal(data[0]);
      }
    } catch (err) {
      console.error('Error fetching deals:', err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchDeals();
    }
  }, [user]);

  // Fetch messages when deal is selected
  const fetchMessages = async (dealId) => {
    try {
      const res = await fetch(`/api/deals/${dealId}/messages`, {
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      const data = await res.json();
      setMessages(data);
      scrollToBottom();
    } catch (err) {
      console.error(err);
    }
  };

  // 1. Socket Lifecycle: Initialize once on mount
  useEffect(() => {
    const socketUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
      ? window.location.origin
      : 'https://collab-uru2.onrender.com';
    
    socketRef.current = io(socketUrl);

    socketRef.current.on('receive_deal_message', (message) => {
      setMessages((prev) => [...prev, message]);
      scrollToBottom();
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []); // Run ONLY once on mount

  // 2. Room & Subscription Lifecycle: Run when selectedDeal changes
  useEffect(() => {
    if (selectedDeal && socketRef.current) {
      fetchMessages(selectedDeal._id);
      
      // Setup mock webhooks simulation if barter and shipped
      if (selectedDeal.campaignId?.campaignType === 'Barter' && selectedDeal.status !== 'Locked') {
        simulateWebhooks();
      } else {
        setWebhookLogs([]);
      }

      // Join socket room
      socketRef.current.emit('join_deal_room', { dealId: selectedDeal._id });

      // Listen for updates on the selected deal
      socketRef.current.off('deal_updated');
      socketRef.current.on('deal_updated', (updatedDeal) => {
        if (updatedDeal._id === selectedDeal._id) {
          setSelectedDeal(updatedDeal);
        }
        fetchDeals();
      });
    }
  }, [selectedDeal]);

  const scrollToBottom = () => {
    setTimeout(() => {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedDeal) return;

    socketRef.current.emit('send_deal_message', {
      dealId: selectedDeal._id,
      senderId: user._id,
      text: messageText
    });

    setMessageText('');
  };

  const handleToggleMilestone = async (milestoneId) => {
    try {
      const res = await fetch(`/api/deals/${selectedDeal._id}/milestones/${milestoneId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        }
      });
      const updatedDeal = await res.json();
      setSelectedDeal(updatedDeal);

      // Notify other clients via WebSockets
      socketRef.current.emit('update_deal_milestone', { dealId: selectedDeal._id });
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddTracking = async (e) => {
    e.preventDefault();
    if (!trackingNumber.trim() || !selectedDeal) return;

    try {
      const res = await fetch(`/api/deals/${selectedDeal._id}/tracking`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ trackingNumber })
      });
      const updatedDeal = await res.json();
      setSelectedDeal(updatedDeal);
      setTrackingNumber('');
      setShowTrackingInput(false);

      // Trigger WebSockets update
      socketRef.current.emit('update_deal_milestone', { dealId: selectedDeal._id });
    } catch (err) {
      console.error(err);
    }
  };

  // Webhook Logs Simulator
  const simulateWebhooks = () => {
    const logs = [
      `[10:14:02] API WEBHOOK: Package received at brand sorting facility.`,
      `[12:30:15] API WEBHOOK: In-transit. Dispatched to creator region center.`,
      `[15:45:22] API WEBHOOK: Courier out for delivery in localized sector.`,
    ];
    setWebhookLogs(logs);
  };

  // Helpers for styling
  const isMilestoneCompleted = (index) => {
    if (!selectedDeal) return false;
    return selectedDeal.milestones[index]?.completed;
  };

  const getStatusOrder = (status) => {
    const order = { 'Locked': 1, 'Shipped': 2, 'Live': 3, 'Released': 4 };
    return order[status] || 1;
  };

  const opposingUser = selectedDeal
    ? (user.role === 'brand' ? selectedDeal.creatorId : selectedDeal.brandId)
    : null;

  return (
    <div className="pt-20 h-[calc(100vh-80px)] flex flex-col md:flex-row bg-[#000000] text-white">
      
      {/* 1. LEFT SIDE PANEL: DEALS DIRECTORY */}
      <section className="w-full md:w-80 bg-neutral-950 border-r border-white/5 flex flex-col p-4 space-y-4">
        <span className="font-label text-[10px] text-[#CCFF00] tracking-widest block px-2">Bilateral deal channels</span>
        <h2 className="font-display text-2xl tracking-tight text-white px-2">DEAL ROOM</h2>
        
        <div className="flex-1 overflow-y-auto space-y-2">
          {(() => {
            // Group deals by unique partner ID to ensure one inbox per partner
            const uniquePartnersMap = new Map();
            deals.forEach((d) => {
              const partner = user.role === 'brand' ? d.creatorId : d.brandId;
              const partnerId = partner?._id || partner;
              if (partnerId) {
                if (!uniquePartnersMap.has(partnerId)) {
                  uniquePartnersMap.set(partnerId, {
                    partner,
                    deals: [],
                  });
                }
                uniquePartnersMap.get(partnerId).deals.push(d);
              }
            });

            return Array.from(uniquePartnersMap.values()).map(({ partner, deals: partnerDeals }) => {
              const partnerId = partner?._id || partner;
              const isSelected = selectedDeal && partnerDeals.some(d => d._id === selectedDeal._id);
              const activeDeal = partnerDeals.find(d => selectedDeal && d._id === selectedDeal._id) || partnerDeals[0];

              return (
                <div
                  key={partnerId}
                  onClick={() => setSelectedDeal(activeDeal)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-white/5 border-white/20'
                      : 'bg-transparent border-white/5 hover:border-white/10'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="font-display text-xs text-white uppercase truncate max-w-[130px]">
                      {partner?.name || 'Partner'}
                    </span>
                    <span className="font-label text-[7px] text-white/40">
                      {partnerDeals.length > 1 ? `${partnerDeals.length} CAMPAIGNS` : 'ACTIVE'}
                    </span>
                  </div>
                  
                  {partner?.creatorProfile?.instagramUsername && (
                    <p className="font-label text-[8px] text-[#CCFF00] mt-0.5 tracking-wider truncate">
                      @{partner.creatorProfile.instagramUsername}
                    </p>
                  )}

                  <p className="font-label text-[9px] text-white/50 mt-1.5 uppercase truncate">
                    {activeDeal.campaignId?.title}
                  </p>

                  <div className="flex justify-between items-center mt-3 pt-2 border-t border-white/5">
                    <span className="font-label text-[8px] tracking-widest text-[#CCFF00] uppercase">
                      {activeDeal.status}
                    </span>
                    <div className={`w-1.5 h-1.5 rounded-full ${
                      activeDeal.status === 'Released' ? 'bg-[#CCFF00]' : 'bg-[#FF007A]'
                    }`} />
                  </div>
                </div>
              );
            });
          })()}
        </div>
      </section>

      {/* 2. CENTER PANEL: MESSAGING ROOM */}
      {selectedDeal ? (
        <section className="flex-1 flex flex-col justify-between bg-black/40 relative">
          
          {/* Header */}
          <div className="p-4 border-b border-white/5 bg-[#080809] flex justify-between items-center z-10">
            <div className="flex flex-col">
              <span className="font-display text-sm tracking-wider text-white uppercase">
                {opposingUser?.name || 'Partner'}
              </span>
              <p className="font-label text-[9px] text-[#CCFF00] tracking-widest uppercase mt-0.5">
                {user.role === 'brand' 
                  ? `@${opposingUser?.creatorProfile?.instagramUsername || 'instagram_handle'}`
                  : 'Verified Enterprise Client'}
              </p>
            </div>

            {/* Campaign switcher for multiple campaign deals with the same creator/partner */}
            {(() => {
              const partnerId = opposingUser?._id || opposingUser;
              const partnerDeals = deals.filter(d => {
                const p = user.role === 'brand' ? d.creatorId : d.brandId;
                const pId = p?._id || p;
                return pId === partnerId;
              });
              if (partnerDeals.length > 1) {
                return (
                  <div className="flex items-center gap-2 bg-black border border-white/10 rounded-xl px-3 py-1.5 text-white">
                    <span className="font-label text-[8px] text-white/40 uppercase tracking-widest">Active Campaign:</span>
                    <select
                      value={selectedDeal._id}
                      onChange={(e) => {
                        const found = partnerDeals.find(pd => pd._id === e.target.value);
                        if (found) setSelectedDeal(found);
                      }}
                      className="bg-transparent border-none text-white font-label text-[8px] tracking-wider uppercase focus:ring-0 focus:outline-none py-0 cursor-pointer"
                      style={{ colorScheme: 'dark' }}
                    >
                      {partnerDeals.map(pd => (
                        <option key={pd._id} value={pd._id} className="bg-neutral-950 text-white font-label text-[8px] uppercase">
                          {pd.campaignId?.title || 'Untitled Campaign'}
                        </option>
                      ))}
                    </select>
                  </div>
                );
              }
              return null;
            })()}

            <div className="flex gap-4 text-white/60">
              <span className="material-symbols-outlined text-sm cursor-pointer hover:text-white transition-colors">videocam</span>
              <span className="material-symbols-outlined text-sm cursor-pointer hover:text-white transition-colors">more_vert</span>
            </div>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <div className="text-center py-2">
              <span className="bg-white/5 border border-white/10 px-4 py-1 rounded-full font-label text-[8px] text-white/50 tracking-widest uppercase">
                SECURE DEAL ENCRYPTED SESSION
              </span>
            </div>

            <div className="space-y-4">
              {messages.map((m) => {
                const isMe = m.senderId?._id === user._id || m.senderId === user._id;
                const senderName = m.senderId?.name || 'Partner';
                
                return (
                  <motion.div
                    key={m._id}
                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 100, damping: 15 }}
                    className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-md p-4 rounded-2xl space-y-1.5 ${
                      isMe 
                        ? 'bg-[#CCFF00] text-black rounded-tr-none shadow-[0_0_15px_rgba(204,255,0,0.1)]' 
                        : 'bg-white/[0.02] border border-white/10 text-white rounded-tl-none'
                    }`}>
                      <span className={`font-label text-[7px] block font-bold uppercase tracking-wider ${isMe ? 'text-black/60' : 'text-white/40'}`}>
                        {senderName}
                      </span>
                      <p className="font-body text-xs leading-relaxed">{m.text}</p>
                    </div>
                  </motion.div>
                );
              })}
              <div ref={chatEndRef} />
            </div>
          </div>

          {/* Inline notification tag detailing status logs */}
          <div className="px-6 py-2 bg-neutral-950 border-t border-white/5 flex items-center justify-between">
            <span className="font-label text-[8px] text-white/40 uppercase tracking-widest flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-[#FF007A] rounded-full animate-ping" />
              Status: {selectedDeal.status === 'Locked' ? 'Contract Setup in Progress' : 'Shipped & Tracking Verification Active'}
            </span>
            <span className="font-label text-[8px] text-[#CCFF00] uppercase font-bold">
              Escrow: {selectedDeal.escrowFundsPercent}% Locked
            </span>
          </div>

          {/* Message Input bar */}
          <form onSubmit={handleSendMessage} className="p-4 bg-[#080809] border-t border-white/5 flex items-center gap-4">
            <input
              type="text"
              placeholder="Type alliance message or submit deliverables..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              className="flex-1 bg-black border-none py-3 px-5 font-body text-xs rounded-xl focus:ring-0 focus:outline-none text-white placeholder:text-white/20"
            />
            <button
              type="submit"
              className="bg-[#CCFF00] text-black p-3 rounded-full flex items-center justify-center hover:scale-95 active:scale-90 transition-transform shadow-[0_0_10px_rgba(204,255,0,0.2)]"
            >
              <span className="material-symbols-outlined text-sm font-bold">send</span>
            </button>
          </form>

        </section>
      ) : (
        <div className="flex-1 flex items-center justify-center text-white/30 font-label text-xs tracking-widest uppercase">
          Select a Deal Room Channel from the Left panel.
        </div>
      )}

      {/* 3. RIGHT PANEL: ESCROW MILESTONE MONITOR & LOGISTICS */}
      {selectedDeal && (
        <section className="w-full md:w-96 bg-neutral-950 border-l border-white/5 p-6 flex flex-col justify-between overflow-y-auto space-y-6">
          <div className="space-y-6">
            
            {/* Title */}
            <div className="space-y-1">
              <span className="font-label text-[9px] text-[#FF007A] tracking-widest uppercase block">TX AUDIT VAULT</span>
              <h2 className="font-display text-xl tracking-tight text-white uppercase leading-none">
                {selectedDeal.campaignId?.title}
              </h2>
            </div>

            {/* Escrow Funding status cards */}
            <div className="bg-black border border-white/10 rounded-2xl p-4 space-y-4">
              <div>
                <span className="font-label text-[7px] text-white/40 block">CONTRACT MODEL</span>
                <span className="font-label text-xs text-[#CCFF00] font-bold">
                  {selectedDeal.campaignId?.campaignType === 'Barter' ? 'BARTER COLLABORATION' : 'FINANCIAL ESCROW'}
                </span>
              </div>

              <div className="pt-3 border-t border-white/5 flex justify-between items-end">
                <div>
                  <span className="font-label text-[7px] text-white/40 block">CONTRACT VAL</span>
                  <span className="font-display text-xl text-white">${selectedDeal.contractAmount?.toLocaleString()}</span>
                </div>
                <span className="font-label text-[8px] text-[#CCFF00] border border-[#CCFF00]/30 bg-[#CCFF00]/5 px-2.5 py-0.5 rounded font-bold uppercase">
                  Escrow Locked
                </span>
              </div>

              {/* Progress fill bar */}
              <div className="space-y-1 pt-3 border-t border-white/5">
                <div className="flex justify-between font-label text-[8px] text-white/50">
                  <span>ESCROW FILL PROGRESS</span>
                  <span>{selectedDeal.escrowFundsPercent}%</span>
                </div>
                <div className="w-full bg-neutral-900 h-2 rounded-full overflow-hidden relative">
                  <div
                    className="bg-[#CCFF00] h-full rounded-full transition-all duration-700"
                    style={{ width: `${selectedDeal.escrowFundsPercent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Escrow Milestone Progress Monitor */}
            <div className="space-y-4">
              <span className="font-label text-xs tracking-widest text-white/50 block">MILESTONE TRACKS</span>
              
              <div className="space-y-3">
                {selectedDeal.milestones.map((m, index) => {
                  const isCreatorAction = index < 2; // Fuchsia overlay index 0,1; brand index 2
                  const isActiveGlow = m.completed;
                  
                  return (
                    <div
                      key={m._id}
                      className={`relative overflow-hidden p-4 rounded-xl border transition-all ${
                        m.completed 
                          ? 'border-white/20 text-[#cfc4c5]' 
                          : 'border-white/5 text-[#cfc4c5]/60'
                      }`}
                    >
                      {/* Color-fill dynamic overlay */}
                      {isActiveGlow && (
                        <div className={`absolute inset-0 opacity-[0.04] ${
                          isCreatorAction ? 'bg-[#FF007A]' : 'bg-[#CCFF00]'
                        }`} />
                      )}

                      <div className="flex items-start gap-3 relative z-10">
                        <input
                          type="checkbox"
                          checked={m.completed}
                          disabled={user.role !== 'brand'} // Only brand approves
                          onChange={() => handleToggleMilestone(m._id)}
                          className="rounded border-white/10 text-[#CCFF00] focus:ring-0 mt-0.5 cursor-pointer disabled:cursor-not-allowed"
                        />
                        <div className="flex-1 min-w-0">
                          <p className={`font-body text-xs font-bold ${m.completed ? 'text-white' : 'text-white/40'}`}>
                            {m.label}
                          </p>
                          <p className="font-label text-[8px] opacity-60 mt-0.5">${m.amount?.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Logistics webhook portal conditional layout slide */}
            <AnimatePresence>
              {selectedDeal.campaignId?.campaignType === 'Barter' && getStatusOrder(selectedDeal.status) >= 2 && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="space-y-4 border-t border-white/5 pt-4 overflow-hidden"
                >
                  <span className="font-label text-xs tracking-widest text-white/50 block">LOGISTICS PIPELINE</span>
                  
                  <div className="bg-[#080809] border border-[#CCFF00]/20 rounded-xl p-4 space-y-4 shadow-lg">
                    <div>
                      <span className="font-label text-[7px] text-white/40 block">COURIER TRACKING</span>
                      <span className="font-label text-xs text-[#CCFF00] font-bold block mt-1 uppercase">
                        {selectedDeal.trackingNumber || 'Unassigned'}
                      </span>
                    </div>

                    {/* Webhook logs feed */}
                    <div className="bg-black/60 rounded-lg p-3 border border-white/5 max-h-32 overflow-y-auto space-y-2">
                      <span className="font-label text-[8px] text-white/30 block mb-1">WEBHOOK INJECTIONS FEED</span>
                      {webhookLogs.map((log, lIdx) => (
                        <div key={lIdx} className="font-label text-[8px] text-[#CCFF00]/80 leading-tight">
                          {log}
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Add Shipment Tracking input portal for creators */}
            {selectedDeal.campaignId?.campaignType === 'Barter' && !selectedDeal.trackingNumber && (
              <div className="space-y-2 border-t border-white/5 pt-4">
                <span className="font-label text-xs tracking-widest text-white/50 block">COURIER ASSIGNMENT</span>
                
                {showTrackingInput ? (
                  <form onSubmit={handleAddTracking} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="ENTER TRACKING ID"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      className="flex-1 bg-black border border-white/10 rounded py-2 px-3 font-label text-[9px] focus:ring-0 text-white"
                      required
                    />
                    <button type="submit" className="bg-[#CCFF00] text-black px-4 py-2 font-label text-[9px] font-bold rounded">
                      SUBMIT
                    </button>
                  </form>
                ) : (
                  <button
                    onClick={() => setShowTrackingInput(true)}
                    className="w-full py-3 bg-white/5 border border-white/10 font-label text-[9px] tracking-widest text-[#CCFF00] rounded hover:bg-[#CCFF00]/10 transition-all uppercase"
                  >
                    ADD BARTER SHIPMENT ID
                  </button>
                )}
              </div>
            )}

          </div>

          <div className="pt-6 border-t border-white/5">
            <button
              onClick={() => alert('Contract validated and locked securely by platform escrow hashes.')}
              className="w-full py-4 bg-white text-black font-display tracking-widest text-sm font-bold hover:scale-95 transition-all rounded-xl"
            >
              GENERATE CONTRACT METRICS
            </button>
          </div>
        </section>
      )}

    </div>
  );
}
