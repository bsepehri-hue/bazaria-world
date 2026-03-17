Ah, that is entirely my fault! I left a comment ({/* FIX 4... */}) floating at the very top of the return statement, outside of the main <div>.

In React, the return () block must have exactly one main HTML element at the very top, and it doesn't know how to read a comment before that element starts.

Here is the cleaned-up, syntax-error-free version. I simply moved that comment inside the <div> where it belongs.

Copy and paste this exact block into your CategoryBar.tsx file:

TypeScript
"use client";

import { useState, useRef } from "react";
import { MARKET_CATEGORIES } from "@/lib/categories";

export default function CategoryBar({ active, onSelect }) {
  const [openCategory, setOpenCategory] = useState(null);
  const [activeSub, setActiveSub] = useState(null);
  const hoverTimeout = useRef(null);

  // Hover Handlers
  const handleEnter = (id) => {
    clearTimeout(hoverTimeout.current);
    hoverTimeout.current = setTimeout(() => setOpenCategory(id), 80);
  };

  const handleLeave = () => {
    clearTimeout(hoverTimeout.current);
    hoverTimeout.current = setTimeout(() => setOpenCategory(null), 80);
  };

  // Theme Colors
  const tealNormal = "#004d40"; 
  const tealActive = "#00251a"; 
  const tealHover = "#00695c";  

  return (
    <div className="category-bar" style={{ display: 'flex', gap: '12px', padding: '16px 24px', width: '100%', maxWidth: '100%', boxSizing: 'border-box', overflowX: 'auto', minHeight: '60px', alignItems: 'center' }}>
      
      {/* ALL BUTTON */}
      <button
        className={`category-item ${active === null ? "active" : ""}`}
        onClick={() => onSelect(null)}
        style={{ 
          display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '6px', border: 'none', 
          background: active === null ? tealActive : tealNormal, color: 'white', cursor: 'pointer', flexShrink: 0, transition: 'background 0.2s'
        }}
      >
        <span className="category-icon">🌐</span>
        <span className="category-label font-semibold">All</span>
      </button>

      {/* DYNAMIC CATEGORIES */}
      {MARKET_CATEGORIES.map((cat) => (
        <div 
          key={cat.id} 
          className="category-item-wrapper" 
          style={{ position: 'relative', flexShrink: 0 }}
          onMouseEnter={() => handleEnter(cat.id)}
          onMouseLeave={handleLeave}
        >
          <button
            className={`category-item ${active === cat.id ? "active" : ""}`}
            onClick={() => onSelect(cat.id)}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '6px', border: 'none', 
              background: active === cat.id ? tealActive : tealNormal, color: 'white', cursor: 'pointer', transition: 'background 0.2s'
            }}
          >
            {cat.icon && <cat.icon className="w-5 h-5" />}
            <span className="category-label font-semibold">{cat.label}</span>
          </button>

          {/* Subcategories Dropdown */}
          {openCategory === cat.id && cat.subcategories && (
            <div 
              className="subcategory-panel" 
              style={{ position: 'absolute', top: '100%', left: 0, marginTop: '8px', background: tealNormal, border: '1px solid #00251a', borderRadius: '6px', padding: '8px', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '4px', minWidth: '150px', boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }}
            >
              {cat.subcategories.map((sub) => (
                <button
                  key={sub.id}
                  className="subcategory-item"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveSub(sub.id);
                  }}
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
