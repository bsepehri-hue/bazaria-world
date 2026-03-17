"use client";

import { useState, useRef } from "react";
import { MARKET_CATEGORIES } from "@/lib/categories";

export default function CategoryBar({ active, onSelect }) {
  const [openCategory, setOpenCategory] = useState(null);
  const hoverTimeout = useRef(null);

  const handleEnter = (id) => {
    clearTimeout(hoverTimeout.current);
    hoverTimeout.current = setTimeout(() => setOpenCategory(id), 100);
  };

  const handleLeave = () => {
    clearTimeout(hoverTimeout.current);
    hoverTimeout.current = setTimeout(() => setOpenCategory(null), 100);
  };

  const tealNormal = "#004d40"; 
  const tealActive = "#00251a"; 
  const tealHover = "#00695c";  

 return (
    <div className="category-bar-container" style={{ 
      position: 'relative', 
      zIndex: 1000,           /* High z-index to stay above cards */
      width: '100%', 
      maxWidth: '100vw', 
      overflow: 'visible',    /* CHANGED: This allows sub-menus to actually show up! */
      background: 'white',
      borderBottom: '1px solid #e5e7eb'
    }}>
      <div style={{ 
        display: 'flex', 
        gap: '12px', 
        padding: '12px 24px', 
        overflowX: 'auto',    /* Keep horizontal scrolling for zoom support */
        overflowY: 'visible', /* Allow vertical dropdowns to leak out */
        alignItems: 'center'
      }}>
        
        {/* ALL BUTTON */}
        <button
          onClick={() => onSelect(null)}
          style={{ 
            display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '6px', border: 'none', 
            background: active === null ? tealActive : tealNormal, color: 'white', cursor: 'pointer', flexShrink: 0 
          }}
        >
          <span>🌐</span>
          <span style={{ fontWeight: '600', fontSize: '14px' }}>All</span>
        </button>

        {/* DYNAMIC CATEGORIES */}
        {MARKET_CATEGORIES.map((cat) => (
          <div 
            key={cat.id} 
            onMouseEnter={() => handleEnter(cat.id)}
            onMouseLeave={handleLeave}
            style={{ position: 'relative', flexShrink: 0 }}
          >
            <button
              onClick={() => onSelect(cat.id)}
              style={{ 
                display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '6px', border: 'none', 
                background: active === cat.id ? tealActive : tealNormal, color: 'white', cursor: 'pointer'
              }}
            >
              {cat.icon && <cat.icon size={18} />}
              <span style={{ fontWeight: '600', fontSize: '14px' }}>{cat.label}</span>
            </button>

            {/* Subcategories Dropdown - FORCED TO TOP */}
            {openCategory === cat.id && cat.subcategories && (
              <div 
                style={{ 
                  position: 'absolute', 
                  top: '100%', 
                  left: 0, 
                  marginTop: '4px', 
                  background: tealNormal, 
                  borderRadius: '8px', 
                  padding: '8px', 
                  zIndex: 9999, // Absolute highest priority
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '2px', 
                  minWidth: '180px', 
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
                  pointerEvents: 'auto'
                }}
              >
                {cat.subcategories.map((sub) => (
                  <button
                    key={sub.id}
                    style={{ 
                      textAlign: 'left', padding: '8px 12px', borderRadius: '4px', width: '100%', 
                      cursor: 'pointer', color: 'white', background: 'transparent', border: 'none',
                      fontSize: '13px'
                    }}
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
    </div>
  );
}
