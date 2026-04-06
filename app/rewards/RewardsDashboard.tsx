
"use client";

import React, { useState, useEffect } from "react";
import { db } from "../../lib/firebase"; // Verified root path
import { doc, onSnapshot } from "firebase/firestore";
import { 
  ShieldCheck, 
  TrendingUp, 
  Award, 
  Clock, 
  MessageSquare, 
  FileText, 
  ChevronRight,
  Zap
} from "lucide-react";

export default function RewardsDashboard() {
  const [partnerData, setPartnerData] = useState({
    paid: 0,
    available: 0,
    credits: 0,
    listings: 0,
    tier: "Standard Partner (M1)",
    name: "Loading...",
    // 🚀 NEW: THE TRUST MATRIX FIELDS
    academyLevel: 1,
    volumeDelivered: 0,
    volumeCapacity: 100000, // Default M1 Capacity
    pendingAssignment: null as any // Will hold the 2-hour lead
  });

  useEffect(() => {
    // 🛰️ LIVE SYNC WITH THE BAZARIA MAIN FRAME
    const docRef = doc(db, "partners", "BO_SEPEHRI");
    const unsub = onSnapshot(docRef, (snap) => {
      if (snap.exists()) {
        setPartnerData(snap.data() as any);
      }
    }, (err) => console.error("❌ FIREBASE ERROR:", err.message));

    return () => unsub();
  }, []);

  return (
    <div className="min-h-screen bg-black text-slate-200 p-4 pb-20 font-sans tracking-tight">
      {/* 🏙️ HEADER: IDENTITY & REVENUE */}
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-black text-white italic tracking-tighter">
            {partnerData.name.toUpperCase()}
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" />
            <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Protocol Active</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-bold text-slate-500 uppercase">Total Paid</p>
          <p className="text-2xl font-black text-white">${partnerData.paid.toLocaleString()}</p>
        </div>
      </div>

      {/* 🚀 THE TRUST MATRIX (ACADEMY + VOLUME) */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="p-4 bg-slate-900/40 border border-slate-800 rounded-2xl">
          <div className="flex justify-between items-center mb-2">
            <Award size={14} className="text-amber-500" />
            <span className="text-[9px] font-black text-amber-500/80 bg-amber-500/10 px-1.5 py-0.5 rounded">ACADEMY L{partnerData.academyLevel}</span>
          </div>
          <p className="text-[10px] text-slate-500 uppercase font-bold">Certification</p>
          <p className="text-sm font-bold text-white italic">HIGH-TICKET REP</p>
          <div className="mt-2 h-1 bg-slate-800 rounded-full overflow-hidden">
            <div className="bg-amber-500 h-full w-[75%] shadow-[0_0_8px_#f59e0b]" />
          </div>
        </div>

        <div className="p-4 bg-slate-900/40 border border-slate-800 rounded-2xl">
          <div className="flex justify-between items-center mb-2">
            <TrendingUp size={14} className="text-blue-500" />
            <span className="text-[9px] font-black text-blue-500/80 bg-blue-500/10 px-1.5 py-0.5 rounded tracking-tighter">VOLUME</span>
          </div>
          <p className="text-[10px] text-slate-500 uppercase font-bold">Capacity Filled</p>
          <p className="text-sm font-bold text-white italic">${(partnerData.volumeDelivered / 1000).toFixed(0)}K / ${(partnerData.volumeCapacity / 1000).toFixed(0)}K</p>
          <div className="mt-2 h-1 bg-slate-800 rounded-full overflow-hidden">
            <div className="bg-blue-500 h-full w-[45%] shadow-[0_0_8px_#3b82f6]" />
          </div>
        </div>
      </div>

      {/* 📨 THE CUSTOMER CONCIERGE (2-HOUR WINDOW) */}
      {partnerData.tier.includes("M5") && (
        <div className="mb-6 p-5 bg-gradient-to-br from-slate-900 to-black border-2 border-amber-500/30 rounded-3xl shadow-[0_0_30px_rgba(245,158,11,0.05)]">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="flex items-center gap-2">
                <Zap size={12} className="text-amber-500 fill-amber-500" />
                <span className="text-[10px] text-amber-500 font-black uppercase tracking-widest">Incoming Deal assignment</span>
              </div>
              <h2 className="text-xl font-black text-white mt-1 italic tracking-tighter">PUNTA CANA ESTATE</h2>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 text-amber-500 font-mono font-bold">
                <Clock size={14} />
                <span>01:42:09</span>
              </div>
            </div>
          </div>

          <div className="bg-amber-500/5 p-3 rounded-xl border border-amber-500/10 mb-5">
            <p className="text-[10px] text-amber-500/60 font-black uppercase mb-1">Academy Guidance</p>
            <p className="text-xs text-amber-100/80 italic font-medium">
              "UHNW customers prioritize discretion. Prepare the Asset Dossier before opening chat."
            </p>
          </div>

          <div className="flex gap-2">
            <button className="flex-1 bg-amber-500 hover:bg-amber-400 text-black font-black py-4 rounded-xl transition-all uppercase text-xs tracking-widest flex items-center justify-center gap-2">
              <MessageSquare size={16} /> Accept & Attend
            </button>
            <button className="px-4 bg-slate-800 hover:bg-red-900/20 text-slate-500 hover:text-red-400 rounded-xl transition-all border border-slate-700">
              Decline
            </button>
          </div>
        </div>
      )}

      {/* 💰 PRIMARY WALLET CARD */}
      <div className="bg-white rounded-[2.5rem] p-8 text-black shadow-2xl relative overflow-hidden mb-6">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <ShieldCheck size={120} />
        </div>
        <p className="text-[11px] font-black uppercase tracking-[0.3em] opacity-40 mb-1">Available Rewards</p>
        <h2 className="text-6xl font-black tracking-tighter mb-8 italic">
          ${partnerData.available.toLocaleString()}
        </h2>
        
        <div className="flex items-center gap-4">
          <button className="flex-1 bg-black text-white py-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:scale-[1.02] active:scale-95 transition-all">
            Claim Payout
          </button>
          <div className="h-14 w-14 bg-slate-100 rounded-2xl flex items-center justify-center border border-slate-200">
            <ChevronRight />
          </div>
        </div>
      </div>

      {/* 📊 INFRASTRUCTURE STATUS */}
      <div className="p-4 bg-slate-900/20 border border-slate-800/50 rounded-2xl flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 bg-amber-500/10 rounded-lg flex items-center justify-center border border-amber-500/20">
            <ShieldCheck size={16} className="text-amber-500" />
          </div>
          <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase">Trust Status</p>
            <p className="text-xs font-bold text-white">{partnerData.tier}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-slate-500 font-bold uppercase">Network Fee</p>
          <p className="text-xs font-bold text-white">0.00%</p>
        </div>
      </div>
    </div>
  );
}
