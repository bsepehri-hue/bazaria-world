"use client";

import React, { useState } from "react";
import FadeIn from "@/app/components/ui/FadeIn";

export default function RewardsDashboard() {
  // --- STYLES ---
  const cardStyle = "bg-white border border-gray-100 rounded-[32px] p-8 shadow-sm hover:shadow-md transition-all duration-300 mb-8";
  const labelStyle = "text-[10px] font-black uppercase tracking-[0.3em] text-teal-600 mb-2 italic";
  const valueStyle = "text-2xl font-black text-gray-900 tracking-tighter";

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans text-gray-900">
      
      {/* 🚀 THE STEWARD COMMAND HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
        <div>
          <p className={labelStyle}>Ecosystem Rewards Protocol</p>
          <h2 className="text-5xl font-black tracking-tighter">
            Steward <span className="text-gray-300 italic">Command</span>
          </h2>
        </div>

        {/* THE VIRAL REFERRAL ENGINE */}
        <div className="bg-amber-50 border border-amber-100 p-6 rounded-3xl shadow-sm flex flex-col md:flex-row items-center gap-6">
          <div>
            <p className="text-[9px] font-black text-amber-700 uppercase tracking-widest mb-1">Your Lifetime Success Link</p>
            <p className="text-sm font-mono font-bold text-gray-900">bazaria.world/join?ref=BO_SEPEHRI</p>
          </div>
          <button className="w-full md:w-auto bg-amber-500 text-[#002d26] px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-amber-600 transition-all shadow-lg shadow-amber-500/20">
            Copy Link
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: PROFILE & STATS */}
        <div className="lg:col-span-1 space-y-8">
          
          {/* PROFILE CARD */}
          <div className={cardStyle}>
            <div className="flex items-center gap-4 mb-8">
              <div className="h-20 w-20 rounded-3xl bg-gray-100 overflow-hidden border-4 border-white shadow-lg">
                <img src="/profile-placeholder.png" alt="Bo" className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="text-xl font-black tracking-tighter">Bo Sepehri</h3>
                <span className="text-[10px] bg-teal-50 text-teal-600 px-3 py-1 rounded-full font-black uppercase">Trusted Steward</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-gray-50">
                <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">Credits Earned</span>
                <span className="font-black text-gray-900 text-lg">12</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-50">
                <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">Active Listings</span>
                <span className="font-black text-gray-900 text-lg">5</span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">Referral Strikes</span>
                <span className="font-black text-red-500 text-lg">2</span>
              </div>
            </div>
          </div>

          {/* BADGES / MILESTONES */}
          <div className="flex flex-col gap-3">
             <div className="bg-[#10b981]/10 text-[#10b981] p-4 rounded-2xl border border-[#10b981]/20 text-[10px] font-black uppercase tracking-widest text-center">
               Referral Constellation: Active
             </div>
             <div className="bg-amber-500 text-[#002d26] p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center shadow-lg shadow-amber-500/10">
               Unlocked: Orion (Milestone 5)
             </div>
          </div>
        </div>

        {/* MIDDLE COLUMN: STOREFRONTS & PAYABLE */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* PAYABLE SUMMARY */}
          <div className={cardStyle}>
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-black italic tracking-tighter uppercase">Capital Flow</h3>
              <button className="text-[10px] font-black text-teal-600 border border-teal-100 px-4 py-2 rounded-xl">CONNECT TO GET PAID</button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { label: "Pending", val: "$263.00", color: "text-amber-500" },
                { label: "Paid", val: "$540.00", color: "text-teal-600" },
                { label: "Withdrawn", val: "$300.00", color: "text-gray-400" },
                { label: "Available", val: "$240.00", color: "text-gray-900" }
              ].map((item, i) => (
                <div key={i}>
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">{item.label}</p>
                  <p className={`text-xl font-mono font-black ${item.color}`}>{item.val}</p>
                </div>
              ))}
            </div>
          </div>

          {/* STOREFRONTS GRID */}
          <div>
            <div className="flex justify-between items-center mb-6 px-2">
              <h3 className="text-xl font-black uppercase italic tracking-tighter">Your Storefront Network</h3>
              <span className="text-[10px] text-teal-600 font-bold uppercase tracking-widest">Active Revenue Locks</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { name: "Emily's Crafts", owner: "Emily Peters" },
                { name: "Jumper's Outfits", owner: "Oscar Salgado" },
                { name: "Ultimate Pens", owner: "Sophia Chen" }
              ].map((store, i) => (
                <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:translate-y-[-5px] transition-all cursor-pointer">
                  <div className="h-10 w-10 bg-gray-50 rounded-xl mb-4 flex items-center justify-center text-xl">🏬</div>
                  <h4 className="font-black text-gray-900">{store.name}</h4>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">{store.owner}</p>
                </div>
              ))}
            </div>
          </div>

          {/* BLESSING GRID */}
          <div className={cardStyle}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black uppercase italic tracking-tighter">Blessing Grid</h3>
              <div className="flex gap-2">
                <div className="px-3 py-1 bg-teal-50 text-teal-600 rounded-lg text-[9px] font-black uppercase tracking-widest">Echo: $242</div>
                <div className="px-3 py-1 bg-gray-50 text-gray-400 rounded-lg text-[9px] font-black uppercase tracking-widest">Rippled</div>
              </div>
            </div>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
              {/* This represents the Arca/Blessing cells visually */}
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className={`aspect-square rounded-2xl border-2 border-dashed ${i === 5 ? 'border-red-200 bg-red-50' : 'border-gray-100 bg-gray-50'} flex items-center justify-center`}>
                  {i === 5 && <span className="text-[8px] font-black text-red-500 uppercase text-center">Strike</span>}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
