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

           {/* Sub-menu: Upgraded to 2-Column Mega Menu */}
            {openCategory === cat.id && cat.subcategories && (
              <div 
                style={{ 
                  position: 'fixed', 
                  marginTop: '8px', 
                  background: 'white', 
                  borderRadius: '12px', 
                  padding: '16px', 
                  zIndex: 99999, 
                  display: 'grid', 
                  /* Creates the 2-column layout */
                  gridTemplateColumns: 'repeat(2, 1fr)', 
                  gap: '4px 12px', 
                  minWidth: '380px', 
                  boxShadow: '0 15px 35px rgba(0,0,0,0.2)',
                  border: '1px solid #e5e7eb'
                }}
              >
                {cat.subcategories.map((sub) => (
                  <button
                    key={sub.id}
                    onClick={() => {
                      onSelect(sub.id);
                      setOpenCategory(null);
                    }}
                    style={{ 
                      textAlign: 'left', 
                      padding: '10px 12px', 
                      borderRadius: '6px', 
                      width: '100%', 
                      cursor: 'pointer', 
                      color: '#374151', /* Professional Dark Gray */
                      background: 'transparent', 
                      border: 'none',
                      fontSize: '14px',
                      fontWeight: '500',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#f3f4f6';
                      e.currentTarget.style.color = tealNormal;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = '#374151';
                    }}
                  >
                    <span style={{ color: tealNormal }}>•</span>
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
