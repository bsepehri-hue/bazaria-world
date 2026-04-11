// app/market/MarketplaceCard.tsx

"use client";

import React from "react";
import { CategoryIcons } from "@/lib/categories";
import { Store, Gavel, ShoppingBag, BadgeCheck } from "lucide-react";
import { Pencil } from "lucide-react";
import { useRouter } from 'next/navigation';
import { BedDouble, Droplets, Maximize2, ShieldCheck, Timer } from 'lucide-react';

export default function MarketplaceCard({ 
  id, // 👈 1. Add 'id' here so we know which asset to edit
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
  isVerifiedMerchant = true            
}: any) {
  
  const router = useRouter(); // 👈 2. Add the router initialization here
  
  const Icon = CategoryIcons[category.toLowerCase()]?.default;
  const displayTitle = make && model ? `${make} ${model}` : title;
  
  // Logic to determine if it's an active auction
  const isAuction = saleMode?.includes("Auction");
  const hasBuyNow = saleMode?.includes("Buy Now") || saleMode === "Fixed Price";
  const displayPrice = isAuction ? (currentBid || price) : (buyNowPrice || price);

  
    
<div 
      className={`group transition-all duration-500 hover:-translate-y-2 ${featured ? 'ring-2 ring-teal-500' : ''}`} 
      style={{ 
        background: 'rgba(255, 255, 255, 0.6)', // 🧊 Semi-transparent
        backdropFilter: 'blur(16px)',           // 🧊 Frosting effect
        WebkitBackdropFilter: 'blur(16px)',
        borderRadius: '32px', 
        overflow: 'hidden', 
        border: '1px solid rgba(255, 255, 255, 0.5)', 
        display: 'flex', 
        flexDirection: 'column',
        position: 'relative',
        boxShadow: '0 20px 40px -15px rgba(0,0,0,0.1)'
      }}
    >
      
    {/* ✏️ MERCHANT EDIT BUTTON */}
      <button 
        onClick={(e) => {
          e.stopPropagation();
          router.push(`/market/create?edit=${id}`);
        }}
        className="absolute top-4 right-4 z-30 p-2 bg-white/80 hover:bg-slate-900 hover:text-white backdrop-blur-md rounded-full shadow-xl transition-all border border-white/50 text-slate-600"
      >
        <Pencil size={12} />
      </button>

        
     {/* 🖼️ IMAGE AREA */}
      <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
        {(image || imageUrl) ? (
          <img 
            src={image || imageUrl} 
            alt={displayTitle} 
            className="group-hover:scale-110 transition-transform duration-700 w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-slate-100 flex items-center justify-center text-4xl">{emoji}</div>
        )}

        <div style={{
          position: 'absolute', top: '12px', left: '12px', 
          backgroundColor: isAuction ? 'rgba(255, 191, 0, 0.9)' : 'rgba(1, 77, 78, 0.9)', 
          backdropFilter: 'blur(4px)',
          color: isAuction ? '#014d4e' : '#ffffff',
          padding: '6px 12px', borderRadius: '12px', fontSize: '9px', fontWeight: '900', 
          display: 'flex', alignItems: 'center', gap: '6px', zIndex: 10
        }}>
          {isAuction ? <Gavel size={12} /> : <ShoppingBag size={12} />}
          {isAuction ? 'LIVE AUCTION' : 'DIRECT BUY'}
        </div>
      </div>
  
        {/* SALE MODE BADGE */}
        <div style={{
          position: 'absolute', top: '12px', left: '12px', 
          backgroundColor: isAuction ? '#FFBF00' : '#014d4e', 
          color: isAuction ? '#014d4e' : '#ffffff',
          padding: '6px 12px', borderRadius: '12px', fontSize: '9px', fontWeight: '900', 
          display: 'flex', alignItems: 'center', gap: '6px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)', zIndex: 10
        }}>
          {isAuction ? <Gavel size={12} /> : <ShoppingBag size={12} />}
          {isAuction ? 'LIVE AUCTION' : 'DIRECT BUY'}
        </div>
      </div>

    {/* 🏙️ SELLER CLASSIFICATION BAR */}
      <div style={{
        padding: '12px 20px',
        backgroundColor: '#f8fafc',
        borderBottom: '1px solid #f1f5f9',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div className="flex items-center gap-2">
          {/* 🎯 Toggle Icon: Store for merchants, User for private sellers */}
          {merchantName && merchantName !== "Sovereign Merchant" ? (
            <Store size={12} className="text-slate-400" />
          ) : (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
          )}
          
          <span style={{ 
            fontSize: '9px', 
            fontWeight: '900', 
            color: merchantName && merchantName !== "Sovereign Merchant" ? '#0f172a' : '#64748b', 
            textTransform: 'uppercase', 
            letterSpacing: '1.5px' 
          }}>
            {merchantName && merchantName !== "Sovereign Merchant" 
              ? merchantName 
              : "Private Seller"} 
          </span>

          {isVerifiedMerchant && <BadgeCheck size={12} className="text-teal-500" />}
        </div>

        {/* 🛡️ PROVENANCE TAG */}
        <div style={{ 
          fontSize: '8px', 
          fontWeight: '900', 
          color: '#cbd5e1',
          letterSpacing: '1px' 
        }}>
          BAZARIA VERIFIED
        </div>
      </div>
  
     {/* 📄 CONTENT */}
      <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div className="flex justify-between items-start mb-1">
          <div style={{ fontWeight: '900', fontSize: '18px', color: '#0f172a', letterSpacing: '-0.5px', textTransform: 'uppercase' }}>{displayTitle}</div>
          <div className="flex items-center gap-1 text-[10px] font-black text-teal-600 uppercase">
             <ShieldCheck size={12} />
          </div>
        </div>
        
        <div style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <MapPin size={10} /> {location}
        </div>

        {/* 📐 NEW: PROPERTY SPECS (Only shows if it's a property) */}
        {(bedrooms || bathrooms || lotSize) && (
          <div className="flex items-center gap-4 py-3 mb-4 border-y border-slate-500/10">
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

       {/* 💰 MONEY SECTION */}
        <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <p style={{ fontSize: '9px', color: '#94a3b8', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>
              {isAuction ? "Current Bid" : "Retail Price"}
            </p>
            <p style={{ color: '#014d4e', fontSize: '24px', fontWeight: '900', lineHeight: '1', letterSpacing: '-1.5px' }}>
              ${Number(displayPrice).toLocaleString()}
            </p>
          </div>
          
          {isAuction && (
            <div className="flex flex-col items-end gap-1">
              <div className="flex items-center gap-1 text-[9px] font-black text-amber-600 bg-amber-50 px-2 py-1 rounded-md">
                <Timer size={10} /> {timeLeft || "24H LEFT"}
              </div>
            </div>
          )}
        </div>

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
        {/* 🎯 ACTION BUTTONS */}
        <div className="flex gap-2 mt-5">
         <button 
  onClick={() => {
    if (onBid) onBid(); 
  }}
  style={{
    width: '100%', // 🎯 Full width for authority
    marginTop: '20px', 
    backgroundColor: '#0f172a', // Deep Slate/Teal to match Sidebar
    color: 'white', 
    padding: '16px', // Slightly taller for better touch target
    borderRadius: '16px', // Matching the card's softer corners
    fontWeight: '900', 
    fontSize: '12px',
    textTransform: 'uppercase',
    letterSpacing: '1.5px',
    border: 'none', 
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  }}
  className="hover:bg-slate-800 active:scale-[0.98]"
>
  View Asset
</button>
          
          {hasBuyNow && isAuction && (
            <button 
              className="px-4 border-2 border-slate-100 rounded-xl hover:bg-slate-50 transition-colors"
              title="Buy Now Shortcut"
            >
              <ShoppingBag size={18} className="text-slate-600" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Sub-component for icons used in the card
function MapPin({ size, ...props }: any) {
  return (
    <svg 
      width={size} height={size} viewBox="0 0 24 24" fill="none" 
      stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...props}
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
    </svg>
  );
}
