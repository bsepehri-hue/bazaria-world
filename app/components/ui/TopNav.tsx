"use client";

import React, { useState } from "react";
import { FiMenu, FiMapPin, FiSearch, FiShoppingCart, FiPlus } from "react-icons/fi";
import { MdDarkMode } from "react-icons/md";
import { FaBell } from "react-icons/fa6";
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function TopNav() {
  const [locationOpen, setLocationOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (term) params.set('q', term);
    else params.delete('q');
    router.push(`/market?${params.toString()}`);
  };

return (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%', padding: '0 24px', width: '100%' }}>
    
    {/* LEFT: Toggle + Location */}
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
      <button className="bg-[#004d40] text-white p-2 rounded-md hover:bg-[#003d33]"><FiMenu size={20} /></button>
      <button 
        onClick={() => setLocationOpen(!locationOpen)}
        className="bg-[#004d40] text-white px-3 py-2 rounded-md text-sm whitespace-nowrap flex items-center gap-1.5"
      >
        <FiMapPin size={16} /> Los Angeles, CA <span style={{ fontSize: '10px' }}>▼</span>
      </button>
    </div>

    {/* CENTER: Searchbar (Locked Max Width) */}
    <div style={{ flex: 1, display: 'flex', justifyContent: 'center', padding: '0 40px' }}>
      <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#f3f4f6', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '8px 12px', width: '100%', maxWidth: '450px' }}>
        <FiSearch size={18} color="#9ca3af" />
        <input
          type="text"
          placeholder="Search Bazaria..."
          style={{ background: 'transparent', border: 'none', outline: 'none', width: '100%', marginLeft: '8px', color: 'black', fontSize: '14px' }}
          onChange={(e) => handleSearch(e.target.value)}
          defaultValue={searchParams.get('q') || ""}
        />
      </div>
    </div>

    {/* RIGHT: Actions (Forced Row) */}
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexShrink: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderRight: '1px solid #e5e7eb', paddingRight: '16px', color: '#6b7280' }}>
        <MdDarkMode size={22} style={{ cursor: 'pointer' }} />
        <FiShoppingCart size={22} style={{ cursor: 'pointer' }} />
        <FaBell size={20} style={{ cursor: 'pointer' }} />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Link 
          href="/market/create"
          style={{ backgroundColor: '#FFBF00', color: '#004d40', padding: '8px 16px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}
        >
          <FiPlus size={16} strokeWidth={4} /> LIST TO BID
        </Link>
        <button className="bg-[#004d40] text-white px-4 py-2 rounded-md text-sm font-semibold whitespace-nowrap">
          Connect Wallet
        </button>
      </div>
    </div>

  </div>
);
    </div>

  </div>
);
}
