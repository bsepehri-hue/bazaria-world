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
  const tealHover = "#00695c";  

  return (
    <div className="category-bar-wrapper" style={{ 
      position: 'sticky', 
      top: 0, 
      zIndex: 100, // Stays below TopNav but above Grid
      width: '100%', 
      background: 'white',
      borderBottom: '1px solid #e5e7eb'
    }}>
      <div 
        className="no-scrollbar"
        style={{ 
          display: 'flex', 
          gap: '12px', 
          padding: '12px 24px', 
          overflowX: 'auto', 
          width: '100%',
          boxSizing: 'border-box'
        }}
      >
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
                background: active === cat.id ? "#00251a" : tealNormal, color: 'white', cursor: 'pointer'
              }}
            >
              {cat.icon && <cat.icon size={18} />}
              <span style={{ fontWeight: '600', fontSize: '14px' }}>{cat.label}</span>
            </button>

            {/* THE FIX: Fixed positioning ignores parent overflow constraints */}
            {openCategory === cat.id && cat.subcategories && (
              <div 
                style={{ 
                  position: 'fixed', // Teleports out of the container
                  marginTop: '4px', 
                  background: tealNormal, 
                  borderRadius: '8px', 
                  padding: '8px', 
                  zIndex: 99999, 
                  display: 'flex', 
                  flexDirection: 'column', 
                  minWidth: '180px', 
                  boxShadow: '0 10px 25px rgba(0,0,0,0.4)',
                }}
              >
                {cat.subcategories.map((sub) => (
                  <button
                    key={sub.id}
                    style={{ 
                      textAlign: 'left', padding: '8px 12px', borderRadius: '4px', width: '100%', 
                      cursor: 'pointer', color: 'white', background: 'transparent', border: 'none',
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
