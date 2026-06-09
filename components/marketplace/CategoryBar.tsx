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
     <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', width: '100%', alignItems: 'center' }}>
        {MARKET_CATEGORIES.map((cat, index) => {
          
          // 🚀 DIRECT COMPRESSION ROUTER: Force-align labels straight to their exact database vertical IDs
          let trueTargetId = String(cat.id || "").toLowerCase().trim();
          const visualLabel = String(cat.label || "").toLowerCase().trim();

          if (visualLabel.includes("art")) trueTargetId = "art";
          if (visualLabel.includes("car")) trueTargetId = "cars";
          if (visualLabel.includes("truck")) trueTargetId = "trucks";
          if (visualLabel.includes("rv")) trueTargetId = "rvs";
          if (visualLabel.includes("moto")) trueTargetId = "motorcycles";
          if (visualLabel.includes("water") || visualLabel.includes("marine")) trueTargetId = "marine";
          if (visualLabel.includes("land")) trueTargetId = "land";
          if (visualLabel.includes("home") || visualLabel.includes("property")) trueTargetId = "homes";
          if (visualLabel.includes("pet")) trueTargetId = "pets";
          if (visualLabel.includes("rental")) trueTargetId = "rentals";
          if (visualLabel.includes("room")) trueTargetId = "rooms";
          if (visualLabel.includes("service")) trueTargetId = "services";
          if (visualLabel.includes("timeshare")) trueTargetId = "timeshare";
          if (visualLabel.includes("general")) trueTargetId = "general";

          return (
            <div 
              key={cat.id} 
              onMouseEnter={() => handleEnter(cat.id)}
              onMouseLeave={handleLeave}
              style={{ position: 'relative', flexShrink: 0 }}
            >
              <button
                // 🎯 FORCE TRUE SELECTION: Pass the absolute decoupled target ID string straight out!
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
              {openCategory === cat.id && cat.subcategories && (
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
                  {cat.subcategories.map((sub) => {
                    let trueSubId = String(sub.id || sub.label || "").toLowerCase().trim();
                    const subLabelLower = String(sub.label || "").toLowerCase().trim();

                    if (subLabelLower.includes("art")) trueSubId = "art";
                    if (subLabelLower.includes("car")) trueSubId = "cars";
                    if (subLabelLower.includes("truck")) trueSubId = "trucks";
                    if (subLabelLower.includes("rv")) trueSubId = "rvs";
                    if (subLabelLower.includes("moto")) trueSubId = "motorcycles";

                    return (
                      <button
                        key={sub.id}
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
