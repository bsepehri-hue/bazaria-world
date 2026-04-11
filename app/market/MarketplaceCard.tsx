// app/market/MarketplaceCard.tsx

"use client";

import React from "react";
import { CategoryIcons } from "@/lib/categories";
import { Store, Gavel, ShoppingBag, BadgeCheck, Pencil, BedDouble, Droplets, Maximize2, ShieldCheck, Timer } from "lucide-react";
import { useRouter } from 'next/navigation';

export default function MarketplaceCard({ 
  id, 
  title, 
  make,        
  model,        
  price, 
  buyNowPrice,
  saleMode,
  currentBid,   
  emoji, 
  image,        
  imageUrl,   
  bidCount,
  timeLeft,
  onBid,
  category = "General",
  location = "Santo Domingo",
  featured,
  merchantName = "Sovereign Merchant",
  isVerifiedMerchant = true,
  // Property Specs
  bedrooms,
  bathrooms,
  lotSize           
}: any) {
  
  const router = useRouter();
  const Icon = CategoryIcons[category.toLowerCase()]?.default;
  const displayTitle = make && model ? `${make} ${model}` : title;
  
  const isAuction = saleMode?.includes("Auction");
  const hasBuyNow = saleMode?.includes("Buy Now") || saleMode === "Fixed Price";
  const displayPrice = isAuction ? (currentBid || price) : (buyNowPrice || price);

  return (
    <div 
      className={`group transition-all duration-500 hover:-translate-y-2 ${featured ? 'ring-2 ring-teal-500' : ''}`} 
      style={{ 
        background: 'rgba(255, 255, 255, 0.65)', 
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderRadius: '32px', 
        overflow: 'hidden', 
        border: '1px solid rgba(255, 255, 255, 0.5)', 
        display: 'flex', 
        flexDirection: 'column',
        position: 'relative',
        boxShadow: '0 20px 50px -15px rgba(0,0,0,0.08)'
      }}
    >
      {/* ✏️ EDIT BUTTON */}
      <button 
        onClick={(e) => {
          e.stopPropagation();
          router.push(`/market/create?edit=${id}`);
        }}
        className="absolute top-4 right-4 z-30 p-2 bg-white/80 hover:bg-slate-900 hover:text-white backdrop-blur-md rounded-full shadow-xl transition-all border border-white/50 text-slate-600"
      >
        <Pencil size={12} />
      </button>

      {/* 🖼️ IMAGE */}
      <div style={{ position: 'relative', height: '180px', overflow: 'hidden', backgroundColor: '#f8fafc' }}>
        {(image || imageUrl) ? (
          <img 
            src={image || imageUrl} 
            alt={displayTitle} 
            className="group-hover:scale-110 transition-transform duration-700 w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl">{emoji}</div>
        )}

        <div style={{
          position: 'absolute', top: '12px', left: '12px', 
          backgroundColor: isAuction ? 'rgba(255, 191, 0, 0.95)' : 'rgba(1, 77, 78, 0.95)', 
          backdropFilter: 'blur(4px)',
          color: isAuction ? '#014d4e' : '#ffffff',
          padding: '6px 12px', borderRadius: '12px', fontSize: '9px', fontWeight: '900', 
          display: 'flex', alignItems: 'center', gap: '6px', zIndex: 10
        }}>
          {isAuction ? <Gavel size={12} /> : <ShoppingBag size={12} />}
          {isAuction ? 'LIVE AUCTION' : 'DIRECT BUY'}
        </div>
      </div>

      {/* 🏙️ SELLER BAR */}
      <div className="px-6 py-3 bg-white/30 border-b border-white/20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {merchantName && merchantName !== "Sovereign Merchant" ? (
            <Store size={12} className="text-slate-500" />
          ) : (
            <ShieldCheck size={12} className="text-teal-500" />
          )}
          <span className="text-[9px] font-black uppercase tracking-widest text-slate-700">
            {merchantName || "Private Seller"}
          </span>
        </div>
        <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
          Bazaria Verified
        </div>
      </div>

      {/* 📄 CONTENT */}
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-1">
          <div className="font-black text-lg text-slate-900 uppercase tracking-tight">{displayTitle}</div>
          {Icon && <Icon className="w-4 h-4 text-slate-300" />}
        </div>
        
        <div className="text-[11px] font-bold text-slate-400 mb-4 flex items-center gap-1">
          <MapPin size={10} /> {location}
        </div>

        {/* 📐 SPECS ROW */}
        {(bedrooms || bathrooms || lotSize) && (
          <div className="flex items-center gap-4 py-3 mb-4 border-y border-slate-900/5">
            {bedrooms && (
              <div className="flex items-center gap-1.5">
                <BedDouble size={14} className="text-slate-400" />
                <span className="text-xs font-black text-slate-700">{bedrooms}</span>
              </div>
            )}
            {bathrooms && (
              <div className="flex items-center gap-1.5">
                <Droplets size={14} className="text-slate-400" />
                <span className="text-xs font-black text-slate-700">{bathrooms}</span>
              </div>
            )}
            {lotSize && (
              <div className="flex items-center gap-1.5 ml-auto">
                <Maximize2 size={14} className="text-slate-400" />
                <span className="text-[10px] font-black text-slate-700 italic uppercase">{lotSize} m²</span>
              </div>
            )}
          </div>
        )}

        {/* 💰 MONEY */}
        <div className="mt-auto flex justify-between items-end">
          <div>
            <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-1">
              {isAuction ? "Current Bid" : "Retail Price"}
            </p>
            <p className="text-2xl font-black text-[#014d4e] tracking-tighter">
              ${Number(displayPrice || 0).toLocaleString()}
            </p>
          </div>
          
          {isAuction && (
            <div className="text-right">
              <div className="text-[9px] font-black text-amber-600 bg-amber-50 px-2 py-1 rounded flex items-center gap-1 mb-1">
                <Timer size={10} /> {timeLeft || "24H LEFT"}
              </div>
              <p className="text-[10px] font-bold text-slate-400">{bidCount || 0} Bids</p>
            </div>
          )}
        </div>

        {/* 🎯 ACTION */}
        <button 
          onClick={() => onBid && onBid()}
          className="w-full mt-6 bg-[#014d4e] text-white py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] transition-all hover:bg-slate-900 active:scale-[0.98] shadow-lg shadow-teal-900/10"
        >
          View Asset
        </button>
      </div>
    </div>
  );
}

function MapPin({ size, ...props }: any) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
    </svg>
  );
}
