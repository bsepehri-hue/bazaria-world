"use client";

import { useState, useRef } from "react";
import { MARKET_CATEGORIES } from "@/lib/categories";

export default function CategoryBar({ active, onSelect }) {
  const [openCategory, setOpenCategory] = useState(null);
  const hoverTimeout = useRef(null);

  const handleEnter = (id) => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    setOpenCategory(id);
  };

  const handleLeave = () => {
    hoverTimeout.current = setTimeout(() => setOpenCategory(null), 150);
  };

  const tealNormal = "#004d40"; 

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
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', width: '100%', alignItems: 'center' }}>
        {MARKET_CATEGORIES.map((cat, index) => {
          
          // 🎯 PURE MECHANICAL ROUTING: Map labels directly and explicitly to corporate database tokens
          const label = String(cat.label || "").toLowerCase().trim();
          let trueTargetId = String(cat.id || "").toLowerCase().trim();

          if (label === "art") trueTargetId = "art";
          else if (label === "cars" || label === "car") trueTargetId = "cars";
          else if (label === "trucks" || label === "truck") trueTargetId = "trucks";
          else if (label === "rvs" || label === "rv") trueTargetId = "rvs";
          else if (label === "motorcycles" || label === "motorcycle") trueTargetId = "motorcycles";
          else if (label === "marine" || label === "watercraft") trueTargetId = "marine";
          else if (label === "land") trueTargetId = "land";
          else if (label === "homes" || label === "home" || label === "property") trueTargetId = "homes";
          else if (label === "pets" || label === "pet") trueTargetId = "pets";
          else if (label === "rentals" || label === "rental") trueTargetId = "rentals";
          else if (label === "rooms" || label === "room") trueTargetId = "rooms";
          else if (label === "services" || label === "service") trueTargetId = "services";
          else if (label === "timeshare") trueTargetId = "timeshare";
          else if (label === "general") trueTargetId = "general";

          return (
            <div 
              key={cat.id || trueTargetId || index} 
              onMouseEnter={() => handleEnter(trueTargetId)}
              onMouseLeave={handleLeave}
              style={{ position: 'relative', flexShrink: 0 }}
            >
              <button
                onClick={() => onSelect(trueTargetId)}
                style={{ 
                  display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '6px', border: 'none', 
                  background: active === trueTargetId ? "#00251a" : tealNormal, color: 'white', cursor: 'pointer',
                  transition: 'all 0.2s ease', whiteSpace: 'nowrap'
                }}
              >
                {cat.icon && <cat.icon size={18} />}
                <span style={{ fontWeight: '600', fontSize: '14px' }}>{cat.label}</span>
              </button>

              {/* 🛸 SUB-MENU */}
              {openCategory === trueTargetId && cat.subcategories && (
                <div 
                  style={{ 
                    position: 'absolute', 
                    top: '100%', 
                    marginTop: '10px', 
                    background: 'white', 
                    borderRadius: '16px', 
                    padding: '16px', 
                    zIndex: 100000, 
                    display: 'grid', 
                    gridTemplateColumns: '1fr', 
                    gap: '4px', 
                    width: 'max-content',
                    minWidth: '220px', 
                    maxWidth: 'calc(100vw - 40px)', 
                    boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                    border: '1px solid #e5e7eb',
                    left: index < 2 ? '0' : (index > MARKET_CATEGORIES.length - 3 ? 'auto' : '50%'),
                    right: index > MARKET_CATEGORIES.length - 3 ? '0' : 'auto',
                    transform: (index >= 2 && index <= MARKET_CATEGORIES.length - 3) ? 'translateX(-50%)' : 'none',
                  }}
                >
                  {cat.subcategories.map((sub, subIdx) => {
                    const subLabel = String(sub.label || "").toLowerCase().trim();
                    let trueSubId = String(sub.id || "").toLowerCase().trim();

                    if (subLabel === "art") trueSubId = "art";
                    else if (subLabel === "cars" || subLabel === "car") trueSubId = "cars";
                    else if (subLabel === "trucks" || subLabel === "truck") trueSubId = "trucks";
                    else if (subLabel === "rvs" || subLabel === "rv") trueSubId = "rvs";
                    else if (subLabel === "motorcycles" || subLabel === "motorcycle") trueSubId = "motorcycles";
                    else if (subLabel === "suv" || subLabel === "suvs") trueSubId = "suv";

                    return (
                      <button
                        key={sub.id || trueSubId || subIdx}
                        onClick={() => {
                          onSelect(trueSubId); 
                          setOpenCategory(null);
                        }}
                        style={{ 
                          textAlign: 'left', padding: '10px 14px', borderRadius: '8px',
                          width: '100%', cursor: 'pointer', color: '#4b5563',
                          background: 'transparent', border: 'none', fontSize: '13px',
                          fontWeight: '600', display: 'flex', alignItems: 'center', gap: '10px',
                          transition: 'background 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#f9fafb';
                          e.currentTarget.style.color = '#000';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = '#4b5563';
                        }}
                      >
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: tealNormal }} />
                        {sub.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
