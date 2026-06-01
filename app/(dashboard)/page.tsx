"use client";

import React, { Suspense } from "react";
import { useRouter } from "next/navigation";
import { Zap, ShieldCheck, Layers, Award } from "lucide-react";

// --- 1. THE SOVEREIGN WRAPPER SHIELD ---
export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#022329] flex items-center justify-center">
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-[#2dd4bf] animate-pulse">
          Initializing Bazaria Node Grid...
        </p>
      </div>
    }>
      <BazariaLiteSplash />
    </Suspense>
  );
}

// --- 2. THE LITE SPLASH INTERFACE ---
function BazariaLiteSplash() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#022329] flex flex-col justify-between items-center p-6 text-center select-none font-sans relative overflow-hidden text-white">
      
      {/* 🔮 Background Ambient Tech Glows */}
      <div className="absolute top-[-10%] left-[-20%] w-[60vw] h-[60vw] bg-[#2dd4bf]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-20%] w-[60vw] h-[60vw] bg-[#FFBF00]/5 rounded-full blur-[120px] pointer-events-none" />

      {/* ─── HEADER LAYOUT ─── */}
      <header className="w-full max-w-5xl flex justify-center items-center py-4 z-10">
        <span className="text-xs font-black tracking-widest text-[#2dd4bf] uppercase font-mono bg-[#031a1e] px-4 py-1.5 rounded-md border border-[#1e293b]">
          BAZARIA v1.0 LIVE
        </span>
      </header>

      {/* ─── HERO MAIN MARKETING AREA ─── */}
      <main className="flex flex-col items-center justify-center flex-grow max-w-2xl z-10 my-12">
        
        {/* Animated Icon Container using your calibrated branding stack */}
        <div className="relative mb-8 animate-pulse">
          <div className="absolute inset-0 bg-[#FFBF00]/20 rounded-2xl blur-md" />
          <div className="w-20 h-20 bg-[#031a1e] border-2 border-[#FFBF00] rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(255,191,0,0.2)]">
            <span className="text-3xl font-black text-[#FFBF00] font-mono">B</span>
          </div>
        </div>

        {/* High Impact Headline Typography */}
        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight uppercase leading-none">
          Welcome to <br />
          <span className="text-[#FFBF00] drop-shadow-[0_4px_12px_rgba(255,191,0,0.15)]">Bazaria</span>
        </h1>

        <div className="w-24 h-[2px] bg-[#FFBF00] my-6 opacity-80" />

        <p className="text-sm md:text-base text-[#94a3b8] font-medium max-w-md leading-relaxed normal-case">
          The sovereign multi-tenant Web3 marketplace. Secure your digital storefront, list unique assets, and enter live bidding arenas instantly.
        </p>

        {/* ⚡ ONE SINGLE HIGH-CONVERSION CTA ACTION TARGET */}
        <button
          onClick={() => router.push("/market")}
          className="mt-10 px-10 py-4 bg-[#FFBF00] text-[#020617] font-black rounded-xl text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-[0_4px_25px_rgba(255,191,0,0.35)] hover:shadow-[0_4px_35px_rgba(255,191,0,0.5)] cursor-pointer"
        >
          Launch Marketplace ⚡
        </button>
      </main>

      {/* ─── LITE MOBILE-FRIENDLY FEATURE PILLS ─── */}
      <footer className="w-full max-w-5xl z-10 mt-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
          
          <div className="p-5 rounded-2xl border border-white/5 bg-[#0C364C]/40 backdrop-blur-sm text-left flex flex-col gap-2 group hover:border-[#2dd4bf]/40 transition-all">
            <div className="flex justify-between items-center">
              <span className="text-[9px] font-black text-[#2dd4bf] tracking-widest uppercase font-mono">PHASE 01</span>
              <Layers size={14} className="text-[#2dd4bf]" />
            </div>
            <h4 className="text-xs font-black text-white uppercase tracking-wider">Claim Storefront</h4>
            <p className="text-[11px] text-[#94a3b8] leading-snug normal-case">Launch your own modular marketplace corner and manage sovereign assets in clicks.</p>
          </div>

          <div className="p-5 rounded-2xl border border-white/5 bg-[#0C364C]/40 backdrop-blur-sm text-left flex flex-col gap-2 group hover:border-[#FFBF00]/40 transition-all">
            <div className="flex justify-between items-center">
              <span className="text-[9px] font-black text-[#FFBF00] tracking-widest uppercase font-mono">PHASE 02</span>
              <Zap size={14} className="text-[#FFBF00]" />
            </div>
            <h4 className="text-xs font-black text-white uppercase tracking-wider">Live Auction Rooms</h4>
            <p className="text-[11px] text-[#94a3b8] leading-snug normal-case">Real-time message streams sync interactive bids cleanly across the global grid.</p>
          </div>

          <div className="p-5 rounded-2xl border border-white/5 bg-[#0C364C]/40 backdrop-blur-sm text-left flex flex-col gap-2 group hover:border-[#2dd4bf]/40 transition-all">
            <div className="flex justify-between items-center">
              <span className="text-[9px] font-black text-[#2dd4bf] tracking-widest uppercase font-mono">PHASE 03</span>
              <Award size={14} className="text-[#2dd4bf]" />
            </div>
            <h4 className="text-xs font-black text-white uppercase tracking-wider">Collect Rewards</h4>
            <p className="text-[11px] text-[#94a3b8] leading-snug normal-case">Receive active operational bonuses connected directly to your decentralized user nodes.</p>
          </div>

        </div>

        <p className="text-[10px] text-[#64748b] tracking-wider uppercase font-mono mt-8 opacity-60">
          Powered by Polygon Blockchain Layer-2 Architecture
        </p>
      </footer>

    </div>
  );
}
