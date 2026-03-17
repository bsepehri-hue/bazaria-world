"use client";

import React, { useState } from "react";
import { FiMenu, FiMapPin, FiSearch, FiShoppingCart } from "react-icons/fi";
import { MdDarkMode } from "react-icons/md";
import { FaBell } from "react-icons/fa6";

export default function TopNav() {
  const [locationOpen, setLocationOpen] = useState(false);

  console.log("TOPNAV FROM app/components/ui/TopNav.tsx");

return (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', height: '100%', padding: '0 24px' }}>
    
    {/* LEFT CLUSTER */}
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
      <button style={{ padding: '8px', cursor: 'pointer' }}>
        <FiMenu size={20} />
      </button>
      <button
        onClick={() => setLocationOpen(!locationOpen)}
        style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '8px 12px', cursor: 'pointer', fontSize: '14px' }}
      >
        <FiMapPin size={16} />
        <span style={{ fontWeight: 500, whiteSpace: 'nowrap' }}>Los Angeles, CA</span>
        <span style={{ opacity: 0.7 }}>▾</span>
      </button>
    </div>

    {/* CENTER CLUSTER (Search) */}
    <div style={{ display: 'flex', flex: 1, justifyContent: 'center', padding: '0 16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', width: '100%', maxWidth: '600px', border: '1px solid #ccc', borderRadius: '6px', padding: '6px 12px', backgroundColor: 'white' }}>
        <FiSearch size={18} style={{ color: '#888' }} />
        <input
          type="text"
          placeholder="Search Bazaria..."
          style={{ flex: 1, marginLeft: '8px', outline: 'none', border: 'none', background: 'transparent', fontSize: '14px' }}
        />
      </div>
    </div>

    {/* RIGHT CLUSTER */}
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexShrink: 0 }}>
      
      {/* Icons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#555' }}>
        <button style={{ cursor: 'pointer', background: 'none', border: 'none' }}><MdDarkMode size={20} /></button>
        <button style={{ cursor: 'pointer', background: 'none', border: 'none' }}><FiShoppingCart size={20} /></button>
        <button style={{ cursor: 'pointer', background: 'none', border: 'none' }}><FaBell size={18} /></button>
      </div>
      
      {/* Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button style={{ backgroundColor: '#004d40', color: 'white', padding: '8px 16px', borderRadius: '6px', border: 'none', fontSize: '14px', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>
          Connect Wallet
        </button>
        <button style={{ backgroundColor: 'transparent', padding: '8px 16px', borderRadius: '6px', border: '1px solid transparent', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
          Login
        </button>
      </div>
      
    </div>
  </div>
);
}
