
"use client";

import React, { useState, useEffect } from "react";
import { db } from "../../lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { 
  ShieldCheck, TrendingUp, Award, Clock, MessageSquare, 
  FileText, ChevronRight, Zap, ShoppingBag, Gavel, LayoutGrid 
} from "lucide-react";

export default function RewardsDashboard() {
  const [partnerData, setPartnerData] = useState({
    paid: 15000,
    available: 540,
    credits: 12,
    listings: 5,
    tier: "Elite Partner (M5)",
    name: "Bo Sepehri",
    academyLevel: 3,
    volumeDelivered: 1250000,
    volumeCapacity: 5000000,
  });

  useEffect(() => {
    const docRef = doc(db, "partners", "BO_SEPEHRI");
    const unsub = onSnapshot(docRef, (snap) => {
      if (snap.exists()) {
        setPartnerData(snap.data() as any);
      }
    }, (err) => console.error("❌ FIREBASE ERROR:", err.message));
    return () => unsub();
  }, []);

  return (
    <div className="min-h-screen bg-black text-slate-200 p-4 pb-24 font-sans tracking-tight">
      
      {/* 🚀 1. THE CUSTOMER CONCIERGE (TOP PRIORITY) */}
      {partnerData.tier.includes("M5") && (
        <div className="mb-8 p-6 bg-gradient-to-br from-slate-900 to-black border-2 border-amber-500/30 rounded-[2rem] shadow-2xl">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="flex items-center gap-2">
                <Zap size={14} className="text-amber-500 fill-amber-500" />
                <span className="text-[10px] text-amber-500 font-black uppercase tracking-[0.2em]">Urgent Assignment</span>
              </div>
              <h2 className="text-2xl font-black text-white mt-1 italic tracking-tighter text-shadow">PUNTA CANA ESTATE</h2>
            </div>
            <div className="bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
              <div className="flex items-center gap-1 text-amber-500 font-mono font-bold text-sm">
                <Clock size={14} /> <span>01:42:09</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="flex-1 bg-amber-500 hover:bg-amber-400 text-black font-black py-4 rounded-2xl transition-all uppercase text-xs tracking-widest flex items-center justify-center gap-2">
              <MessageSquare size={16} /> Accept & Attend
            </button>
          </div>
        </div>
      )}

      {/* 💰 2. THE WALLET & TRUST MATRIX */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
        <div className="bg-white rounded-[2.5rem] p-8 text-black shadow-2xl relative overflow-hidden">
          <p className="text-[11px] font-black uppercase tracking-[0.3em] opacity-40 mb-1">Available Rewards</p>
          <h2 className="text-6xl font-black tracking-tighter mb-6 italic">${partnerData.available.toLocaleString()}</h2>
          <button className="w-full bg-black text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:scale-[1.01] transition-transform">Claim Payout</button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-5 bg-slate-900/40 border border-slate-800 rounded-3xl">
            <Award size={18} className="text-amber-500 mb-2" />
            <p className="text-[10px] text-slate-500 uppercase font-black">Academy Cert</p>
            <p className="text-sm font-bold text-white italic mt-1 text-shadow">L{partnerData.academyLevel} SPECIALIST</p>
          </div>
          <div className="p-5 bg-slate-900/40 border border-slate-800 rounded-3xl">
            <TrendingUp size={18} className="text-blue-500 mb-2" />
            <p className="text-[10px] text-slate-500 uppercase font-black">Volume Cap</p>
            <p className="text-sm font-bold text-white italic mt-1 text-shadow">${(partnerData.volumeDelivered / 1000000).toFixed(1)}M / 5M</p>
          </div>
        </div>
      </div>

      {/* 🏙️ 3. STOREFRONTS (RESTORED) */}
      <section className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <ShoppingBag size={18} className="text-slate-400" />
          <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500 text-shadow">Your Storefronts</h3>
        </div>
        <div className="grid grid-cols-3 gap-3 font-medium">
          {["Emily's Crafts", "Jumper's Outfits", "Ultimate Pens"].map((store) => (
            <div key={store} className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800 text-center hover:bg-slate-800 transition-colors cursor-pointer">
              <p className="text-xs text-white truncate">{store}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 🔨 4. ACTIVE AUCTIONS (RESTORED) */}
      <section className="mb-10 text-shadow">
        <div className="flex items-center gap-2 mb-4">
          <Gavel size={18} className="text-slate-400 text-shadow" />
          <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500 text-shadow">Current Auctions</h3>
        </div>
        <div className="space-y-3">
          {["Nintendo Switch", "Jordan 4 Retro", "Adidas Yeezy"].map((item) => (
            <div key={item} className="flex justify-between items-center bg-slate-900/30 p-4 rounded-2xl border border-slate-800/50">
              <span className="text-sm font-bold text-white italic">{item}</span>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded border border-emerald-500/20 uppercase font-black tracking-tighter">Bidding Live</span>
            </div>
          ))}
        </div>
      </section>

      {/* 🌌 5. THE BLESSING GRID (RESTORED) */}
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <LayoutGrid size={18} className="text-slate-400" />
          <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500 italic">Blessing Grid Network</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-gradient-to-br from-slate-900 to-indigo-900/20 rounded-3xl border border-indigo-500/20">
            <p className="text-[9px] text-indigo-400 font-black uppercase tracking-widest mb-1">Echo Earnings</p>
            <p className="text-2xl font-black text-white italic">$242.00</p>
          </div>
          <div className="p-4 bg-slate-900/50 rounded-3xl border border-slate-800">
            <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1">Network Strikes</p>
            <p className="text-2xl font-black text-red-500 italic">2 Strikes</p>
          </div>
        </div>
      </section>

      {/* 📊 INFRASTRUCTURE STATUS */}
      <div className="p-5 bg-slate-900/50 border border-slate-800 rounded-3xl flex justify-between items-center opacity-60">
        <div className="flex items-center gap-3">
          <ShieldCheck size={20} className="text-amber-500" />
          <div>
            <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Protocol Trust</p>
            <p className="text-xs font-black text-white italic uppercase tracking-tighter">{partnerData.tier}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
