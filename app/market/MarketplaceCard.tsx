// app/market/MarketplaceCard.tsx

"use client";

import React from "react";
import { Store, Gavel, ShoppingBag, BadgeCheck, Pencil, BedDouble, Droplets, Maximize2, ShieldCheck, Timer, MapPin } from "lucide-react";
import { useRouter } from 'next/navigation';

export default function MarketplaceCard({ 
  id, title, make, model, price, buyNowPrice, saleMode, currentBid, 
  emoji, image, imageUrl, bidCount, timeLeft, onBid, location = "Santo Domingo",
  merchantName = "Sovereign Merchant", isVerifiedMerchant = true,
  bedrooms, bathrooms, lotSize,
  category,        // 🎯 ADD THIS
  assetCategory    // 🎯 ADD THIS FOR BACKUP
}: any) {
  
  const router = useRouter();
  const displayTitle = make && model ? `${make} ${model}` : title;
  const isAuction = saleMode?.includes("Auction");
  const displayPrice = isAuction ? (currentBid || price) : (buyNowPrice || price);

  return (
 <div style={{ 
      // 1. Drop to 0.45-0.55 to let the background "bleed" through the frost
      background: 'rgba(255, 255, 255, 0.45)', 
      
      backdropFilter: 'blur(20px)', // Increased slightly for more "matte" feel
      WebkitBackdropFilter: 'blur(20px)',
      
      borderRadius: '24px', 
      overflow: 'hidden', 
      
      // 2. The "Shine": Using a semi-transparent white border creates a glass edge
      border: '1px solid rgba(255, 255, 255, 0.6)', 
      
      display: 'flex', 
      flexDirection: 'column',
      position: 'relative',
      
      // 3. Deeper, softer shadow for that "floating" look
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.08)',
      margin: '10px'
    }}>
      
     {/* ✏️ EDIT ICON */}
<button 
onClick={(e) => { 
  e.stopPropagation(); 
  
  // 🎯 1. Use the 'props' object to find the category safely
  // This looks at every possible place the category could be hiding
  const rawCategory = props?.category || props?.assetCategory || "";
  const cat = rawCategory.toString().toLowerCase().trim();

  let targetPath = "/market/create/properties/caribbean"; // Default

  // 🎯 2. The Smart Switchboard
  if (cat.includes("mobility") || cat.includes("car")) {
    targetPath = "/market/create/mobility";
  } 
  else if (cat.includes("general") || cat.includes("animal") || cat.includes("cat") || cat.includes("art")) {
    targetPath = "/market/create/general";
  }

  // 🚀 3. Execute with a leading slash
  router.push(`${targetPath}?edit=${props.id}`); 
}}
  
  style={{ 
    position: 'absolute', 
    top: '12px', 
    right: '12px', 
    zIndex: 40, 
    padding: '8px', 
    background: 'rgba(255,255,255,0.8)', 
    border: '1px solid #ddd', 
    borderRadius: '50%', 
    cursor: 'pointer' 
  }}
>
  <Pencil size={12} color="#666" />
</button>
      {/* 🖼️ IMAGE AREA */}
      <div style={{ position: 'relative', height: '200px', width: '100%', overflow: 'hidden' }}>
        {(image || imageUrl) ? (
          <img 
            src={image || imageUrl} 
            alt={displayTitle} 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
          />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f1f5f9', fontSize: '40px' }}>{emoji}</div>
        )}

        <div style={{
          position: 'absolute', top: '12px', left: '12px', 
          backgroundColor: isAuction ? 'rgba(255, 191, 0, 0.95)' : 'rgba(1, 77, 78, 0.95)', 
          color: isAuction ? '#014d4e' : '#ffffff',
          padding: '6px 12px', borderRadius: '10px', fontSize: '9px', fontWeight: '900', 
          display: 'flex', alignItems: 'center', gap: '6px', zIndex: 10
        }}>
          {isAuction ? <Gavel size={11} /> : <ShoppingBag size={11} />}
          {isAuction ? 'LIVE AUCTION' : 'DIRECT BUY'}
        </div>
      </div>

      {/* 📄 CONTENT SECTION */}
      <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'left' }}>
        
        {/* MERCHANT BAR */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <ShieldCheck size={12} color="#14b8a6" />
          <span style={{ fontSize: '9px', fontWeight: '900', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>
            {merchantName} • BAZARIA VERIFIED
          </span>
        </div>

        {/* TITLE */}
        <h3 style={{ fontSize: '20px', fontWeight: '900', color: '#0f172a', margin: '4px 0 0 0', textTransform: 'uppercase' }}>
          {displayTitle}
        </h3>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#94a3b8', fontWeight: '600' }}>
          <MapPin size={10} /> {location}
        </div>

        {/* 📐 SPECS ROW (Hidden if car, shows if villa) */}
        {(bedrooms || lotSize) && (
          <div style={{ display: 'flex', gap: '15px', padding: '12px 0', borderTop: '1px solid #eee', borderBottom: '1px solid #eee', margin: '8px 0' }}>
            {bedrooms && <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', fontWeight: '800' }}><BedDouble size={14} color="#94a3b8" /> {bedrooms}</div>}
            {bathrooms && <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', fontWeight: '800' }}><Droplets size={14} color="#94a3b8" /> {bathrooms}</div>}
            {lotSize && <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '10px', fontWeight: '800', marginLeft: 'auto', color: '#64748b' }}><Maximize2 size={14} color="#94a3b8" /> {lotSize} M²</div>}
          </div>
        )}

        {/* 💰 PRICING */}
        <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <p style={{ fontSize: '9px', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '2px' }}>
              {isAuction ? "Current Bid" : "Retail Price"}
            </p>
            <p style={{ fontSize: '26px', fontWeight: '900', color: '#014d4e', margin: 0, letterSpacing: '-1px' }}>
              ${Number(displayPrice || 0).toLocaleString()}
            </p>
          </div>
          {isAuction && (
            <div style={{ textAlign: 'right', background: '#fffbeb', padding: '4px 8px', borderRadius: '6px', border: '1px solid #fef3c7' }}>
              <div style={{ fontSize: '9px', fontWeight: '900', color: '#b45309', display: 'flex', alignItems: 'center', gap: '3px' }}>
                <Timer size={10} /> {timeLeft || "24H LEFT"}
              </div>
            </div>
          )}
        </div>

        {/* 🎯 ACTION BUTTON */}
        <button 
          onClick={() => onBid && onBid()}
          style={{ width: '100%', marginTop: '20px', background: '#014d4e', color: 'white', padding: '16px', borderRadius: '12px', border: 'none', fontWeight: '900', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', cursor: 'pointer' }}
        >
          View Asset
        </button>
      </div>
    </div>
  );
}
