"use client";

import { useState } from "react";
import { MARKET_CATEGORIES } from "@/lib/categories";

export default function CategoryBar({ active, onSelect }) {
  const [openCategory, setOpenCategory] = useState(null);
  const [activeSub, setActiveSub] = useState(null);

  // Colors for the theme
  const tealNormal = "#004d40"; // Dark Teal
  const tealActive = "#00251a"; // Even darker for clicked state
  const tealHover = "#00695c";  // Lighter for hovering sub-menus

  return (
    <div className="category-bar" style={{ display: 'flex', gap: '12px', padding: '16px 24px', width: '100%', overflowX: 'auto', minHeight: '60px', alignItems: 'center' }}>
      
      {/* ALL BUTTON */}
      <button
        className={`category-item ${active === null ? "active" : ""}`}
        onClick={() => onSelect(null)}
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px', 
          padding: '8px 16px', 
          borderRadius: '6px', 
          border: 'none', 
          background: active === null ? tealActive : tealNormal, 
          color: 'white', 
          cursor: 'pointer', 
          flexShrink: 0,
          transition: 'background 0.2s'
        }}
      >
        <span className="category-icon">🌐</span>
        <span className="category-label font-semibold">All</span>
      </button>

      {/* DYNAMIC CATEGORIES */}
      {MARKET_CATEGORIES.map((cat) => (
        <div key={cat.id} className="category-item-wrapper" style={{ position: 'relative', flexShrink: 0 }}>
          <button
            className={`category-item ${active === cat.id ? "active" : ""}`}
            onClick={() => setOpenCategory(openCategory === cat.id ? null : cat.id)}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              padding: '8px 16px', 
              borderRadius: '6px', 
              border: 'none', 
              background: active === cat.id ? tealActive : tealNormal, 
              color: 'white', 
              cursor: 'pointer',
              transition: 'background 0.2s'
            }}
          >
            {/* Render the icon component safely */}
            {cat.icon && <cat.icon className="w-5 h-5" />}
            <span className="category-label font-semibold">{cat.label}</span>
          </button>

          {/* Subcategories Dropdown (Now matching the teal theme) */}
          {openCategory === cat.id && cat.subcategories && (
            <div className="subcategory-panel" style={{ position: 'absolute', top: '100%', left: 0, marginTop: '8px', background: tealNormal, border: '1px solid #00251a', borderRadius: '6px', padding: '8px', zIndex: 50, display: 'flex', flexDirection: 'column', gap: '4px', minWidth: '150px', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
              {cat.subcategories.map((sub) => (
                <button
                  key={sub.id}
                  className="subcategory-item"
                  onClick={() => setActiveSub(sub.id)}
                  style={{ textAlign: 'left', padding: '6px 12px', borderRadius: '4px', width: '100%', cursor: 'pointer', color: 'white', background: 'transparent', border: 'none' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = tealHover}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  {sub.label}
                </button>
              ))}
            </div>
          )}
        </div>
      ))}

    </div>
  );
}
