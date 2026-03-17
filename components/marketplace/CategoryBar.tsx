"use client";

import { useState } from "react";
import { MARKET_CATEGORIES } from "@/lib/categories";

export default function CategoryBar({ active, onSelect }) {
  const [openCategory, setOpenCategory] = useState(null);
  const [activeSub, setActiveSub] = useState(null);

  return (
    <div className="category-bar" style={{ display: 'flex', gap: '12px', padding: '16px 24px', width: '100%', overflowX: 'auto', minHeight: '60px', alignItems: 'center' }}>
      
      {/* DEBUG BUTTON: So we know it's rendering */}
      <button style={{ padding: '8px 16px', backgroundColor: 'red', color: 'white', fontWeight: 'bold', borderRadius: '6px', flexShrink: 0 }}>
        I AM VISIBLE!
      </button>

      {/* ALL BUTTON */}
      <button
        className={`category-item ${active === null ? "active" : ""}`}
        onClick={() => onSelect(null)}
        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '6px', border: '1px solid #ddd', background: active === null ? '#eee' : 'white', cursor: 'pointer', flexShrink: 0 }}
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
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '6px', border: '1px solid #ddd', background: active === cat.id ? '#eee' : 'white', cursor: 'pointer' }}
          >
            {/* Render the icon component safely */}
            {cat.icon && <cat.icon className="w-5 h-5" />}
            <span className="category-label font-semibold">{cat.label}</span>
          </button>

          {/* Subcategories Dropdown */}
          {openCategory === cat.id && cat.subcategories && (
            <div className="subcategory-panel" style={{ position: 'absolute', top: '100%', left: 0, marginTop: '4px', background: 'white', border: '1px solid #ddd', borderRadius: '6px', padding: '8px', zIndex: 50, display: 'flex', flexDirection: 'column', gap: '4px', minWidth: '150px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
              {cat.subcategories.map((sub) => (
                <button
                  key={sub.id}
                  className="subcategory-item"
                  onClick={() => setActiveSub(sub.id)}
                  style={{ textAlign: 'left', padding: '6px 12px', borderRadius: '4px', width: '100%', cursor: 'pointer' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
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
