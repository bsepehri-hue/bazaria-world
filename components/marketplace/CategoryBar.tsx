"use client";

import { useState, useRef } from "react";
import { MARKET_CATEGORIES } from "@/lib/categories";

export default function CategoryBar({ active, onSelect }) {
  const [openCategory, setOpenCategory] = useState(null);
  const hoverTimeout = useRef(null);

  // FIX 2: Faster hover response
  const handleEnter = (id) => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    setOpenCategory(id);
  };

  const handleLeave = () => {
    hoverTimeout.current = setTimeout(() => setOpenCategory(null), 150);
  };

  const tealNormal = "#004d40"; 
  const tealHover = "#00695c";  


return (
    <div className="category-bar-wrapper" style={{ 
      position: 'relative', 
      zIndex: 50, 
      width: '100%', 
      background: 'white',
      borderBottom: '1px solid #e5e7eb',
      padding: '12px 24px',
      boxSizing: 'border-box'
    }}>
      <div 
        style={{ 
          display: 'flex', 
          flexWrap: 'wrap',    /* THE FIX: Moves categories to a new line when they hit the edge */
          gap: '10px',         /* Spacing between buttons */
          width: '100%',
          alignItems: 'center'
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
                background: active === cat.id ? "#00251a" : tealNormal, color: 'white', cursor: 'pointer',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap'
              }}
              onMouseEnter={(e) => {
                if (active !== cat.id) e.currentTarget.style.background = tealHover;
              }}
              onMouseLeave={(e) => {
                if (active !== cat.id) e.currentTarget.style.background = tealNormal;
              }}
            >
              {cat.icon && <cat.icon size={18} />}
              <span style={{ fontWeight: '600', fontSize: '14px' }}>{cat.label}</span>
            </button>

            {/* Sub-menu (stays fixed so it sits on top of everything) */}
            {openCategory === cat.id && cat.subcategories && (
              <div 
                style={{ 
                  position: 'fixed', 
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
