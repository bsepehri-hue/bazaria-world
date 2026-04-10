// app/market/MarketplaceCard.tsx

"use client";

import React from "react";
import { CategoryIcons } from "@/lib/categories";
import { Store, Gavel, ShoppingBag, BadgeCheck } from "lucide-react";
import { Pencil } from "lucide-react";
import { useRouter } from 'next/navigation';

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

  
    
return (
    <div className={`group transition-all duration-300 ${featured ? 'ring-2 ring-teal-500' : ''}`} style={{ 
      background: 'white', 
      borderRadius: '24px', 
      overflow: 'hidden', 
      border: '1px solid #f1f5f9', 
      display: 'flex', 
      flexDirection: 'column',
      position: 'relative',
      boxShadow: '0 10px 30px -15px rgba(0,0,0,0.05)'
    }}>
      
      {/* ✏️ MERCHANT EDIT BUTTON */}
      <button 
        onClick={(e) => {
          e.stopPropagation();
         router.push(`/market/create?edit=${id}`);
        }}
        className="absolute top-4 right-4 z-30 p-2 bg-white/90 hover:bg-slate-900 hover:text-white backdrop-blur-md rounded-full shadow-xl transition-all border border-slate-200"
        title="Edit Listing"
      >
        <Pencil size={14} />
      </button>

        
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
