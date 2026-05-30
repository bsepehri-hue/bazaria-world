import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaGavel, FaClock, FaShieldAlt, FaExternalLinkAlt } from 'react-icons/fa';

export default function RadarBiddingPage({ params, searchParams }) {
  const [currentBid, setCurrentBid] = useState(1250.00);
  const [timeLeft, setTimeLeft] = useState("09:58");
  
  // Dynamic Asset Information from Context
  const assetId = params?.auctionId || "XID-JU4VA";
  const assetName = "Standard High-Capacity Clearance Pack";
  const assetImageUrl = "/images/mock-asset.jpg"; // Replace with dynamic storage/public path
  
  const notificationReceivedAt = searchParams?.notifiedAt || new Date().toLocaleTimeString();
  const targetNextBid = currentBid + 50.00;

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4">
      
      <div className="w-full max-w-md bg-slate-900 border-2 border-red-500 rounded-2xl p-6 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
        
        {/* 📡 THE RADAR HEADER */}
        <div className="flex justify-between items-center border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-red-500 animate-ping" />
            <h2 className="text-sm font-black tracking-widest text-red-500 uppercase">RADAR ALERT</h2>
          </div>
          <div className="flex items-center gap-1.5 text-amber-400 font-mono text-sm font-bold bg-amber-950/40 px-3 py-1 rounded-full border border-amber-500/30">
            <FaClock />
            <span>{timeLeft}</span>
          </div>
        </div>

        {/* 🖼️ THE FOMO ASSET SHEET & IMMUTABLE ANCHOR LINK */}
        <div className="relative w-full h-36 rounded-xl overflow-hidden border border-slate-800 bg-slate-950 group mb-4">
          {/* Item Image */}
          <img 
            src={assetImageUrl} 
            alt={assetName}
            className="w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity"
            onError={(e) => {
              // Fallback if image fails to load
              e.currentTarget.src = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600";
            }}
          />
          
          {/* Gradient Overlay for Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
          
          {/* Asset Info Overlay */}
          <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-amber-400">Target Asset</p>
              <h3 className="text-sm font-black truncate max-w-[220px]">{assetName}</h3>
            </div>
            
            {/* ⚖️ Immutable Discrepancy Shield Link */}
            <Link 
              href={`/market/listings/${assetId}`}
              target="_blank"
              className="flex items-center gap-1 bg-slate-900/90 hover:bg-slate-800 text-[10px] font-mono text-slate-300 px-2 py-1 rounded border border-slate-700/60 transition-colors shadow-lg"
            >
              <span>SPEC: {assetId}</span>
              <FaExternalLinkAlt className="text-[8px]" />
            </Link>
          </div>
        </div>

        {/* The Price to Beat */}
        <div className="text-center my-4">
          <p className="text-xs uppercase tracking-wider text-slate-400">Current High Bid</p>
          <p className="text-4xl font-black font-mono text-white mt-0.5">
            ${currentBid.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
        </div>

        {/* ⚡ THE INSTANT HIT BUTTON */}
        <button 
          onClick={() => console.log("Executing Counter Bid")}
          className="w-full bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-black text-lg py-4 rounded-xl transition-all shadow-[0_4px_20px_rgba(220,38,38,0.4)] active:scale-[0.98] flex items-center justify-center gap-3"
        >
          <FaGavel />
          BID ${targetNextBid.toLocaleString('en-US', { minimumFractionDigits: 2 })} TO BEAT
        </button>

        {/* ⚖️ LEGAL / AUDIT TIMESTAMPS */}
        <div className="mt-5 pt-3 border-t border-slate-800 text-[10px] font-mono text-slate-500 flex flex-col gap-1 bg-slate-950/50 p-2.5 rounded-lg border border-slate-800/40">
          <div className="flex justify-between">
            <span className="flex items-center gap-1"><FaShieldAlt /> VERIFIED INCIDENT ID:</span>
            <span className="text-slate-300">{assetId}</span>
          </div>
          <div className="flex justify-between">
            <span>ALERT DISPATCH:</span>
            <span className="text-slate-300">{notificationReceivedAt}</span>
          </div>
          <div className="flex justify-between">
            <span>DEVICE LOCK-SYNC:</span>
            <span className="text-emerald-400 font-bold">SERVER-TIME SECURE</span>
          </div>
        </div>

      </div>
    </div>
  );
}
