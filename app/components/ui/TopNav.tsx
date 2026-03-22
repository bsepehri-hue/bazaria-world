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
    <nav style={{ 
      display: 'grid', 
      gridTemplateColumns: '250px 1fr auto', // Keeps Left, Center, and Right separate
      alignItems: 'center', 
      width: '100%', 
      height: '70px', // STRICT height to prevent 3-row expansion
      padding: '0 24px',
      boxSizing: 'border-box',
      background: 'white', 
      borderBottom: '1px solid #e5e7eb',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      
      {/* 1. LEFT: Fixed Width Cluster */}
      <div className="flex items-center gap-3 shrink-0">
        <button className="p-2 rounded-md bg-[#004d40] text-white hover:bg-[#003d33] transition">
          <FiMenu size={20} />
        </button>

        <button
          onClick={() => setLocationOpen(!locationOpen)}
          className="flex items-center gap-1 px-3 py-2 rounded-md bg-[#004d40] text-white text-sm whitespace-nowrap"
        >
          <FiMapPin size={16} />
          <span>Los Angeles, CA</span>
          <span className="opacity-70">▾</span>
        </button>
      </div>

      {/* 2. CENTER: Flexible Searchbar */}
      <div className="flex justify-center px-6" style={{ minWidth: '200px' }}>
        <div className="flex items-center bg-gray-100 border border-gray-300 rounded-md px-3 py-2 w-full max-w-md">
          <FiSearch size={18} className="text-gray-500 shrink-0" />
          <input
            type="text"
            placeholder="Search Bazaria..."
            className="bg-transparent w-full ml-2 outline-none text-black"
            onChange={(e) => handleSearch(e.target.value)}
            defaultValue={searchParams.get('q') || ""}
          />
        </div>
      </div>

      {/* 3. RIGHT: The Amber "List to Bid" Action Group */}
      <div className="flex items-center gap-4 shrink-0">
        {/* Compact Icons */}
        <div className="flex items-center gap-3 text-neutral-600 border-r pr-4 border-gray-200">
          <button className="p-1 hover:text-[#004d40] transition"><MdDarkMode size={20} /></button>
          <button className="p-1 hover:text-[#004d40] transition"><FiShoppingCart size={20} /></button>
          <button className="p-1 hover:text-[#004d40] transition"><FaBell size={18} /></button>
        </div>
        
        {/* Buttons: All on one line */}
        <div className="flex items-center gap-2">
          <Link 
            href="/market/create"
            className="transition-all active:scale-95 shadow-sm"
            style={{
              backgroundColor: '#FFBF00', // Amber
              color: '#004d40', // Contrast dark green text
              padding: '8px 14px',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: '700', // Bolder for the "List to Bid" legacy
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              whiteSpace: 'nowrap', // Prevents text from jumping to row 3
              border: '1px solid #E5A100' // Subtle border for depth
            }}
          >
            <FiPlus size={18} style={{ strokeWidth: 4 }} />
            <span>LIST TO BID</span>
          </Link>

          <button className="bg-white text-[#004d40] border border-[#004d40] px-3 py-2 rounded-md text-sm font-semibold hover:bg-neutral-50 transition whitespace-nowrap">
            Connect Wallet
          </button>
        </div>
      </div>
    </nav>
  );
}
