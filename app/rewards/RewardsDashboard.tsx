"use client";

import React, { useState, useEffect } from "react";
import { db } from "../../lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { 
  ShieldCheck, Award, Clock, MessageSquare, Zap, ChevronRight 
} from "lucide-react";

export default function RewardsDashboard() {
  const [partnerData, setPartnerData] = useState({
    paid: 15000,
    available: 540,
    pending: 263,
    withdrawn: 300,
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
        setPartnerData(prev => ({ ...prev, ...snap.data() }));
      }
    });
    return () => unsub();
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6 font-sans">
      
      {/* 🚀 1. URGENT ASSIGNMENT (THE 2-HOUR WINDOW) */}
      {partnerData.tier.includes("M5") && (
        <section className="mb-10 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="bg-gradient-to-r from-[#1a1a1a] to-[#2a2a2a] border-l-4 border-amber-500 p-6 rounded-r-2xl shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <Zap className="text-amber-500 fill-amber-500" size={20} />
                <h2 className="text-xl font-black italic tracking-tighter uppercase">Punta Cana Estate Inquiry</h2>
              </div>
              <div className="flex items-center gap-2 text-amber-500 font-mono font-bold bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                <Clock size={16} /> <span>01:42:09</span>
              </div>
            </div>
            <button className="w-full bg-amber-500 text-black font-black py-4 rounded-xl uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-amber-400 transition-all">
              <MessageSquare size={18} /> Accept & Open Relationship
            </button>
          </div>
        </section>
      )}

      {/* 💰 2. THE PAYABLE SECTION (RESTORED STYLING) */}
      <section className="mb-12">
        <h2 className="text-sm font-black uppercase tracking-[0.3em] text-gray-500 mb-6 italic">Payable Summary</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Pending", val: partnerData.pending, color: "text-gray-400" },
            { label: "Paid", val: partnerData.paid, color: "text-emerald-400" },
            { label: "Withdrawn", val: partnerData.withdrawn, color: "text-blue-400" },
            { label: "Available", val: partnerData.available, color: "text-white font-black" }
          ].map((item) => (
            <div key={item.label} className="bg-[#151515] p-5 rounded-2xl border border-white/5 shadow-inner">
              <p className="text-[10px] uppercase font-bold text-gray-600 mb-1">{item.label}</p>
              <p className={`text-xl font-mono ${item.color}`}>${item.val.toLocaleString()}</p>
            </div>
          ))}
        </div>
        <button className="w-full bg-white text-black font-black py-5 rounded-2xl flex items-center justify-center gap-3 hover:scale-[1.01] transition-transform shadow-lg shadow-white/5">
          Connect to Get Paid <ChevronRight size={18} />
        </button>
      </section>

      {/* 🎓 3. TRUST & VOLUME (THE NEW ENGINE) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
        <div className="bg-[#111] p-6 rounded-3xl border border-white/5">
          <div className="flex justify-between items-center mb-2">
            <Award className="text-amber-500" size={20} />
            <span className="text-[10px] font-black text-amber-500 bg-amber-500/10 px-2 py-1 rounded">L{partnerData.academyLevel} CERTIFIED</span>
          </div>
          <h3 className="text-lg font-black italic">HIGH-TICKET SPECIALIST</h3>
          <div className="mt-3 h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div className="bg-amber-500 h-full w-[75%] shadow-[0_0_12px_#f59e0b]" />
          </div>
        </div>
        <div className="bg-[#111] p-6 rounded-3xl border border-white/5">
          <p className="text-[10px] font-black text-blue-400 uppercase mb-1">Volume Capacity</p>
          <h3 className="text-lg font-black italic tracking-tighter">
            ${(partnerData.volumeDelivered / 1000000).toFixed(1)}M / ${(partnerData.volumeCapacity / 1000000).toFixed(1)}M
          </h3>
          <div className="mt-3 h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div className="bg-blue-500 h-full w-[25%] shadow-[0_0_12px_#3b82f6]" />
          </div>
        </div>
      </div>

      {/* 🏙️ 4. STOREFRONTS (ORIGINAL CARD STYLE) */}
      <section className="mb-12">
        <h2 className="text-sm font-black uppercase tracking-[0.3em] text-gray-500 mb-6 italic">Storefronts</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { name: "Emily's Crafts", owner: "Emily Peters" },
            { name: "Jumper's Outfits", owner: "Oscar Salgado" },
            { name: "Ultimate Pens", owner: "Sophia Chen" }
          ].map((store) => (
            <div key={store.name} className="bg-[#151515] p-6 rounded-2xl border border-white/5 hover:border-white/20 transition-all cursor-pointer group">
              <h3 className="text-lg font-bold text-white group-hover:text-amber-500 transition-colors">{store.name}</h3>
              <p className="text-xs text-gray-500 mt-1">{store.owner}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 🔨 5. AUCTIONS (ORIGINAL ROW STYLE) */}
      <section className="mb-12">
        <h2 className="text-sm font-black uppercase tracking-[0.3em] text-gray-500 mb-6 italic">Auctions</h2>
        <div className="space-y-3">
          {[
            { item: "Nintendo Switch", bid: 734, status: "Ends soon", color: "text-amber-500" },
            { item: "Jordan 4 Retro Black Cat", bid: 510, status: "Live", color: "text-emerald-500" },
            { item: "Adidas Yeezy Slide", bid: 90, status: "Live", color: "text-emerald-500" }
          ].map((auction) => (
            <div key={auction.item} className="flex justify-between items-center bg-[#151515] p-5 rounded-2xl border border-white/5">
              <div>
                <h3 className="font-bold text-white italic">{auction.item}</h3>
                <p className="text-xs text-gray-500">Highest bid: ${auction.bid}</p>
              </div>
              <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-white/5 border border-white/10 ${auction.color}`}>
                {auction.status}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 🛰️ 6. STATUS BAR */}
      <div className="flex justify-between items-center p-6 bg-white/5 rounded-3xl border border-white/10 opacity-60">
        <div className="flex items-center gap-3">
          <ShieldCheck className="text-amber-500" />
          <p className="text-xs font-black uppercase tracking-tighter">{partnerData.tier}</p>
        </div>
        <p className="text-[10px] font-mono uppercase text-gray-500">BAZARIA-WORLD v1.0.4</p>
      </div>
    </div>
  );
}
