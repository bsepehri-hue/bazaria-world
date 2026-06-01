"use client";

import React, { Suspense } from "react";
import { useRouter } from "next/navigation";
import { Zap, Store, Gavel, Radio, ArrowRight } from "lucide-react";

// --- 1. THE SOVEREIGN WRAPPER SHIELD ---
export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="w-full min-h-screen bg-[#022329] flex items-center justify-center">
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-[#2dd4bf] anonymity-pulse">
          TUNING BAZARIA FREQUENCY...
        </p>
      </div>
    }>
      <BazariaHighEnergySplash />
    </Suspense>
  );
}

// --- 2. THE HIGH-ENERGY SPLASH INTERFACE ---
function BazariaHighEnergySplash() {
  const router = useRouter();

  return (
    /* 🚨 SELF-CONTAINED MASTER WRAPPER: Forces dark background and text reset */
    <div className="w-full min-h-screen bg-[#022329] text-white flex flex-col justify-between p-4 md:p-8 font-sans relative overflow-hidden select-none">
      
      {/* 🌌 VISUAL HYPE ENGINE: Video-Style Ambient Animation Overlays */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(45,212,191,0.12),transparent_60%)] pointer-events-none z-0" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,191,0,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,191,0,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none z-0" />
      
      {/* Moving Ambient Video Layer Sparks */}
      <div className="absolute top-[-20%] right-[-10%] w-[70vw] h-[70vw] bg-[#FFBF00]/5 rounded-full blur-[140px] animate-pulse pointer-events-none z-0" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[70vw] h-[70vw] bg-[#2dd4bf]/5 rounded-full blur-[140px] pointer-events-none z-0" />

      {/* ─── TOP STREAM LEVEL HEADER ─── */}
      <header className="w-full max-w-6xl mx-auto flex justify-between items-center z-10 py-2 relative">
        <div className="flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
          <span className="text-[10px] font-black tracking-widest text-[#2dd4bf] font-mono uppercase bg-[#031a1e] px-2.5 py-1 rounded-md border border-slate-800">
            LIVE AUCTION GRIDS ACTIVE
          </span>
        </div>
        <span className="text-[11px] font-bold text-slate-500 font-mono tracking-widest uppercase">
          POLYGON L2 ⚡
        </span>
      </header>

      {/* ─── MAIN HERO INTERACTIVE ZONE ─── */}
      <main className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 z-10 my-auto py-8 relative">
        
        {/* LEFT TEXT CONTAINER: High Impact Pitch */}
        <div className="flex flex-col text-left lg:w-1/2 items-start z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FFBF00]/10 text-[#FFBF00] rounded-full text-[10px] font-black tracking-widest uppercase mb-4 border border-[#FFBF00]/20">
            <Radio size={12} className="animate-pulse" /> THE LIVING ECONOMY HAS ARRIVED
          </div>
          
          <h1 className="text-5xl md:text-6xl font-black tracking-tight leading-none uppercase text-white">
            DROP THE NOISE.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFBF00] via-white to-[#2dd4bf] drop-shadow-[0_4px_20px_rgba(255,191,0,0.15)]">
              OWN THE BAZAR.
            </span>
          </h1>

          <div className="w-32 h-[3px] bg-gradient-to-r from-[#FFBF00] to-[#2dd4bf] my-6 rounded-full" />

          <p className="text-slate-400 font-medium text-sm md:text-base leading-relaxed normal-case max-w-lg">
            Welcome to the terminal for sovereign digital assets. Launch next-generation storefronts, initiate intense real-time auction loops, and tap direct node reward sequences instantly.
          </p>

          {/* 🔥 GIANT CONVERSION MASTER BUTTON */}
          <button
            onClick={() => router.push("/market")}
            className="group mt-8 px-8 py-4 bg-gradient-to-r from-[#FFBF00] to-[#ffa200] text-[#020617] font-black rounded-2xl text-xs uppercase tracking-widest flex items-center gap-3 transition-all transform hover:scale-[1.03] active:scale-[0.98] cursor-pointer shadow-[0_0_30px_rgba(255,191,0,0.3)] hover:shadow-[0_0_40px_rgba(255,191,0,0.5)]"
          >
            Launch Marketplace ⚡
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* RIGHT VISUAL ELEMENT: Glowing Auction Gavel & Storefront Card */}
        <div className="lg:w-1/2 flex items-center justify-center relative w-full z-10">
          {/* Layer Background Glow */}
          <div className="absolute w-[80%] h-[80%] bg-[#2dd4bf]/10 rounded-full blur-[60px] pointer-events-none" />
          
          <div className="w-full max-w-md bg-gradient-to-br from-[#031a1e] to-[#022329] border-2 border-slate-800 p-8 rounded-[2rem] flex flex-col gap-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative">
            
            <div className="absolute top-4 right-4 text-[9px] text-[#2dd4bf] font-mono tracking-widest uppercase">
              SYS_PRTCL_ON //
            </div>

            {/* THE HERO HAMMER EMBLEM */}
            <div className="w-full h-44 bg-[#022329] border border-slate-800 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,191,0,0.08),transparent_70%)]" />
              
              <div className="w-16 h-16 bg-[#FFBF00]/10 rounded-full flex items-center justify-center text-[#FFBF00] border border-[#FFBF00]/30 shadow-[0_0_20px_rgba(255,191,0,0.15)]">
                <Gavel size={28} className="-rotate-45" />
              </div>
              
              <span className="text-[10px] font-black font-mono text-[#FFBF00] tracking-[0.2em] uppercase mt-4">
                REALTIME BIDDING TERMINAL
              </span>
            </div>

            {/* LIVE MARKETPLACE SAMPLE PREVIEW BAR */}
            <div className="bg-[#022329]/80 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#2dd4bf]/10 rounded-lg text-[#2dd4bf]">
                  <Store size={18} />
                </div>
                <div className="text-left">
                  <h4 className="text-xs font-black uppercase text-white tracking-wider">Premium Nodes</h4>
                  <p className="text-[10px] text-slate-500">Storefront #0834 Verified</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[9px] font-black font-mono bg-[#2dd4bf]/10 text-[#2dd4bf] px-2 py-0.5 rounded">
                  9.8 MATIC
                </span>
                <p className="text-[9px] text-emerald-400 font-bold uppercase mt-1 tracking-tight animate-pulse">● BID LIVE</p>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* ─── FOOTER MARKETING ADVANTAGES GRID ─── */}
      <footer className="w-full max-w-6xl mx-auto z-10 mt-auto pt-6 border-t border-slate-800 relative">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          
          <div className="p-4 rounded-xl bg-[#031a1e]/60 border border-slate-800/80 flex items-start gap-4">
            <div className="p-2 bg-[#2dd4bf]/10 rounded-lg text-[#2dd4bf] shrink-0">
              <Store size={16} />
            </div>
            <div>
              <h4 className="text-xs font-black uppercase text-white tracking-wide">Instant Storefront Grid</h4>
              <p className="text-[11px] text-slate-400 mt-1 normal-case leading-snug">Claim your location, open modular market gates, and deploy curated inventories natively.</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#031a1e]/60 border border-slate-800/80 flex items-start gap-4">
            <div className="p-2 bg-[#FFBF00]/10 rounded-lg text-[#FFBF00] shrink-0">
              <Gavel size={16} />
            </div>
            <div>
              <h4 className="text-xs font-black uppercase text-white tracking-wide">Live Hammer Auctions</h4>
              <p className="text-[11px] text-slate-400 mt-1 normal-case leading-snug">High-frequency bid updates stream instantly cross-viewport with absolute precision.</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#031a1e]/60 border border-slate-800/80 flex items-start gap-4">
            <div className="p-2 bg-[#2dd4bf]/10 rounded-lg text-[#2dd4bf] shrink-0">
              <Zap size={16} />
            </div>
            <div>
              <h4 className="text-xs font-black uppercase text-white tracking-wide">Protocol Rewards</h4>
              <p className="text-[11px] text-slate-400 mt-1 normal-case leading-snug">Sync background push tracks straight to your active coordinates for immediate payouts.</p>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
