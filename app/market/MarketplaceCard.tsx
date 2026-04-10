// app/market/MarketplaceCard.tsx

"use client";

import React from "react";
import { CategoryIcons } from "@/lib/categories";
import { Store, Gavel, ShoppingBag, BadgeCheck } from "lucide-react";

export default function MarketplaceCard({ 
  title, 
  make,        
  model,       
  price, 
  buyNowPrice, // 🎯 NEW
  saleMode,    // 🎯 NEW: "Auction + Buy Now", "Auction Only", "Fixed Price"
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
  merchantName = "Sovereign Merchant", // 🎯 NEW
  isVerifiedMerchant = true            // 🎯 NEW
}: any) {
  
  const Icon = CategoryIcons[category.toLowerCase()]?.default;
  const displayTitle = make && model ? `${make} ${model}` : title;
  
  // Logic to determine if it's an active auction
  const isAuction = saleMode?.includes("Auction");
  const hasBuyNow = saleMode?.includes("Buy Now") || saleMode === "Fixed Price";
  const displayPrice = isAuction ? (currentBid || price) : (buyNowPrice || price);

  return (
    <div className={`group transition-all duration-300 ${featured ? 'ring-2 ring-teal-500' : ''}`} style={{ 
      background: 'white', 
      borderRadius: '24px', // Softer, more modern corners
      overflow: 'hidden', 
      border: '1px solid #f1f5f9', 
      display: 'flex', 
      flexDirection: 'column',
      position: 'relative',
      boxShadow: '0 10px 30px -15px rgba(0,0,0,0.05)'
    }}>
      
      {/* 🖼️ THE IMAGE AREA */}
      <div style={{ 
        position: 'relative', 
        height: '180px', 
        backgroundColor: '#f8fafc', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        overflow: 'hidden'
      }}>
        
        {(image || imageUrl) ? (
          <img 
            src={image || imageUrl} 
            alt={displayTitle} 
            className="group-hover:scale-110 transition-transform duration-700"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
          />
        ) : (
          <span style={{ fontSize: '48px' }}>{emoji}</span>
        )}

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

      {/* 🏙️ MERCHANT BAR (The Investor Hook) */}
      <div style={{
        padding: '12px 20px',
        backgroundColor: '#f8fafc',
        borderBottom: '1px solid #f1f5f9',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div className="flex items-center gap-2">
          <Store size={12} className="text-slate-400" />
          <span style={{ fontSize: '10px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>
            {merchantName}
          </span>
          {isVerifiedMerchant && <BadgeCheck size={12} className="text-teal-500" />}
        </div>
        <div style={{ fontSize: '9px', fontWeight: '900', color: '#94a3b8' }}>ID: {String(title).slice(0,3).toUpperCase()}</div>
      </div>

      {/* 📄 CONTENT */}
      <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div className="flex justify-between items-start mb-1">
          <div style={{ fontWeight: '900', fontSize: '18px', color: '#0f172a', letterSpacing: '-0.5px' }}>{displayTitle}</div>
          {Icon && <Icon className="w-4 h-4 text-slate-300" />}
        </div>
        
        <div style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <MapPin size={10} /> {location}
        </div>

        {/* 💰 MONEY SECTION */}
        <div style={{ 
          marginTop: 'auto', 
          paddingTop: '16px', 
          borderTop: '1px solid #f1f5f9', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-end' 
        }}>
          <div>
            <p style={{ fontSize: '9px', color: '#94a3b8', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>
              {isAuction ? "Current Bid" : "Retail Price"}
            </p>
            <p style={{ color: '#0f172a', fontSize: '24px', fontWeight: '900', lineHeight: '1', letterSpacing: '-1px' }}>
              ${Number(displayPrice).toLocaleString()}
            </p>
          </div>
          
          {isAuction && (
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '10px', fontWeight: '900', color: '#014d4e', backgroundColor: '#ccfbf1', padding: '4px 8px', borderRadius: '8px', marginBottom: '4px' }}>
                {timeLeft || "24h Left"}
              </div>
              <p style={{ fontSize: '10px', fontWeight: '700', color: '#94a3b8' }}>{bidCount || 0} Bids</p>
            </div>
          )}
        </div>

        {/* 🎯 ACTION BUTTONS */}
        <div className="flex gap-2 mt-5">
          <button 
            onClick={() => onBid && onBid()}
            className="flex-1 hover:bg-slate-800 active:scale-95 transition-all"
            style={{
              backgroundColor: '#0f172a', color: 'white', padding: '14px', borderRadius: '14px',
              fontWeight: '900', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', border: 'none', cursor: 'pointer'
            }}
          >
            {isAuction ? 'Place Bid' : 'View Asset'}
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
