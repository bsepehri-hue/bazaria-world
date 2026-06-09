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
          
          // 🎯 ABSOLUTE POSITION CORRECTION INDEX ROUTER
          // Overrides array indexing gaps by mapping sequential positions directly to correct tokens
          let trueTargetId = "";
          
          switch(index) {
            case 0:  trueTargetId = "art";         break; // 🎨 Art (First Button)
            case 1:  trueTargetId = "cars";        break; // 🚗 Cars
            case 2:  trueTargetId = "trucks";      break; // 🛻 Trucks
            case 3:  trueTargetId = "rvs";         break; // 🚐 RVs
            case 4:  trueTargetId = "motorcycles"; break; // 🏍️ Motorcycles
            case 5:  trueTargetId = "marine";      break; // ⚓ Watercraft / Marine
            case 6:  trueTargetId = "land";        break; // ⛰️ Land
            case 7:  trueTargetId = "homes";       break; // 🏠 Homes
            case 8:  trueTargetId = "pets";        break; // 🐾 Pets
            case 9:  trueTargetId = "rentals";     break; // 🏢 Rentals
            case 10: trueTargetId = "rooms";       break; // 🛌 Rooms
            case 11: trueTargetId = "services";    break; // 🛠️ Services
            default: trueTargetId = String(cat.id || "").toLowerCase().trim();
          }

          return (
            <div 
              key={cat.id || trueTargetId} 
              onMouseEnter={() => handleEnter(trueTargetId)}
              onMouseLeave={handleLeave}
              style={{ position: 'relative', flexShrink: 0 }}
            >
              <button
                // 🚀 FIXED TERMINAL DIRECTION: Fires the exact realigned database vertical token key string
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
                    let trueSubId = String(sub.id || "").toLowerCase().trim();
                    const subLabelLower = String(sub.label || "").toLowerCase().trim();

                    // Lock dropdown items to match their precise database subCategory tokens
                    if (subLabelLower.includes("art")) trueSubId = "art";
                    if (subLabelLower.includes("car")) trueSubId = "cars";
                    if (subLabelLower.includes("truck")) trueSubId = "trucks";
                    if (subLabelLower.includes("rv")) trueSubId = "rvs";
                    if (subLabelLower.includes("moto")) trueSubId = "motorcycles";
                    if (subLabelLower.includes("suv")) trueSubId = "suv";

                    return (
                      <button
                        key={sub.id || trueSubId}
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
