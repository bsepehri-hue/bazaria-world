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
 return (
  <div className="category-bar-wrapper" style={{ 
    position: 'relative', 
    zIndex: 50, 
    width: '100%', 
    /* FIX: Force the bar to be ONLY as wide as the space next to the sidebar */
    maxWidth: 'calc(100vw - 260px)', 
    boxSizing: 'border-box',
    background: 'white',
    borderBottom: '1px solid #e5e7eb',
    overflow: 'hidden' /* This is the "Wall" that saves the TopNav */
  }}>
    <div 
      className="no-scrollbar"
      style={{ 
        display: 'flex', 
        gap: '12px', 
        padding: '12px 24px', 
        overflowX: 'auto',   /* This allows the menu to scroll left/right */
        width: '100%',
        boxSizing: 'border-box',
        alignItems: 'center',
        WebkitOverflowScrolling: 'touch'
      }}
    >
      {MARKET_CATEGORIES.map((cat) => (
        <div 
          key={cat.id} 
          style={{ flexShrink: 0, position: 'relative' }} /* flexShrink: 0 is vital! */
        >
          {/* ... your button and hover logic ... */}
          <button
              onClick={() => onSelect(cat.id)}
              style={{ 
                display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '6px', border: 'none', 
                background: active === cat.id ? "#00251a" : tealNormal, color: 'white', cursor: 'pointer',
                whiteSpace: 'nowrap' /* Keep text on one line */
              }}
            >
              {cat.icon && <cat.icon size={18} />}
              <span style={{ fontWeight: '600', fontSize: '14px' }}>{cat.label}</span>
          </button>
        </div>
      ))}
    </div>
  </div>
);
}
