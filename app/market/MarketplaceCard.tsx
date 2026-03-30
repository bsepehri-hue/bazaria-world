// app/market/MarketplaceCard.tsx

"use client";

import React from "react";
import { CategoryIcons } from "@/lib/categories";

// 1. Updated Props to include our new Firestore Auction fields
type MarketplaceCardProps = {
  id?: string;
  title: string;
  make?: string;
  model?: string;
  price: number | string;
  currentBid?: number;
  bidCount?: number;
  timeLeft?: string; // Calculated in the parent (page.tsx)
  location: string;
  category: string;
  emoji: string;
  imageType?: string;
  featured?: boolean;
};

export default function MarketplaceCard({
  title,
  make,
  model,
  price,
  currentBid,
  bidCount,
  timeLeft,
  location,
  category,
  emoji,
  imageType,
  featured,
}: MarketplaceCardProps) {
  
  const Icon = CategoryIcons[category.toLowerCase()]?.default;
  const displayTitle = make && model ? `${make} ${model}` : title;
  const displayPrice = currentBid || price;

  return (
    <div className={`marketplace-card ${featured ? 'featured' : ''}`} style={{ 
      background: 'white', 
      borderRadius: '12px', 
      overflow: 'hidden', 
      border: '1px solid #e5e7eb', 
      display: 'flex', 
      flexDirection: 'column',
      position: 'relative'
    }}>
      
      {/* 2. THE AMBER LIVE BADGE (Over the emoji/image area) */}
      <div className={`card-image ${imageType || 'default'}`} style={{ position: 'relative', height: '160px', backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px' }}>
        <div className="card-image-gradient" />
        <span className="card-emoji">{emoji}</span>

        {/* MIAMI AMBER LIVE PULSE */}
        <div style={{
          position: 'absolute', top: '10px', left: '10px', backgroundColor: '#FFBF00', color: '#004d40',
          padding: '4px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '6px',
          boxShadow: '0 4px 10px rgba(0,0,0,0.15)', zIndex: 10
        }}>
          <span className="pulse-dot"></span>
          LIVE AUCTION
        </div>
      </div>

      <div className="card-content" style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        
        {/* Category Icon */}
        {Icon && (
          <div className="card-category-icon" style={{ marginBottom: '8px' }}>
            <Icon className="w-4 h-4 text-gray-400" />
          </div>
        )}

        <div className="card-title" style={{ fontWeight: 'bold', fontSize: '16px', color: '#1f2937' }}>{displayTitle}</div>
        <div className="card-location" style={{ fontSize: '12px', color: '#6b7280', marginBottom: '12px' }}>{location}</div>

        {/* 3. THE MONEY SECTION (Auction Style) */}
        <div style={{ marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <p style={{ fontSize: '9px', color: '#9ca3af', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Current Bid</p>
            <p style={{ color: '#004d40', fontSize: '22px', fontWeight: '900', lineHeight: '1' }}>
              ${Number(displayPrice).toLocaleString()}
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '11px', fontWeight: 'bold', color: '#004d40', backgroundColor: '#f0fdf4', padding: '2px 6px', borderRadius: '4px' }}>
              {timeLeft || "3d 12h left"}
            </p>
            <p style={{ fontSize: '10px', color: '#9ca3af', marginTop: '4px' }}>{bidCount || 0} Bids</p>
          </div>
        </div>

        {/* 4. THE ACTION BUTTON */}
<button 
  onClick={() => {
    console.log("🚀 Penthouse Bid Initiated!"); 
    if (onBid) onBid(); 
  }}
  style={{
    width: '100%', 
    marginTop: '16px', 
    backgroundColor: '#004d40', 
    color: 'white', 
    padding: '12px', 
    borderRadius: '8px', 
    fontWeight: 'bold', 
    border: 'none', 
    cursor: 'pointer',
    transition: 'transform 0.1s active:scale-95'
  }}
>
  Place Quick Bid
</button>
      </div>

      <style jsx>{`
        .pulse-dot {
          width: 6px;
          height: 6px;
          background-color: #004d40;
          border-radius: 50%;
          animation: pulse-animation 1.5s infinite;
        }
        @keyframes pulse-animation {
          0% { transform: scale(0.95); opacity: 1; }
          50% { transform: scale(1.3); opacity: 0.5; }
          100% { transform: scale(0.95); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
