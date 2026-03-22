"use client";

import React, { useState } from "react";
import { FiMenu, FiMapPin, FiSearch, FiShoppingCart, FiPlus } from "react-icons/fi"; // Added FiPlus
import { MdDarkMode } from "react-icons/md";
import { FaBell } from "react-icons/fa6";
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link'; // Added Link for navigation

export default function TopNav() {
  const [locationOpen, setLocationOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (term) {
      params.set('q', term);
    } else {
      params.delete('q');
    }
    router.push(`/market?${params.toString()}`);
  };

  return (
    <nav style={{ 
      display: 'grid', 
      gridTemplateColumns: '250px 1fr auto', 
      alignItems: 'center', 
      width: '100%', 
      height: '70px', 
      padding: '0 24px',
      boxSizing: 'border-box',
      background: 'white', 
      borderBottom: '1px solid #e5e7eb',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      
      {/* 1. LEFT CLUSTER */}
      <div className="flex flex-row items-center gap-3 shrink-0">
        <button className="p-2 rounded-md bg-[#004d40] text-white hover:bg-[#003d33] transition">
          <FiMenu size={20} />
        </button>

        <button
          onClick={() => setLocationOpen(!locationOpen)}
          className="flex flex-row items-center gap-1 px-3 py-2 rounded-md bg-[#004d40] text-white transition text-sm whitespace-nowrap"
        >
          <FiMapPin size={16} />
          <span>Los Angeles, CA</span>
          <span className="opacity-70">▾</span>
        </button>
      </div>

      {/* 2. CENTER: SEARCHBAR */}
      <div className="flex justify-center px-8" style={{ minWidth: 0 }}>
        <div className="flex items-center bg-gray-100 border border-gray-300 rounded-md px-3 py-2 w-full max-w-lg shadow-sm">
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

      {/* 3. RIGHT CLUSTER */}
      <div className="flex items-center gap-6 shrink-0">
        <div className="flex items-center gap-4 text-neutral-600">
          <button className="p-1 hover:text-[#004d40] transition"><MdDarkMode size={22} /></button>
          <button className="p-1 hover:text-[#004d40] transition"><FiShoppingCart size={22} /></button>
          <button className="p-1 hover:text-[#004d40] transition"><FaBell size={20} /></button>
        </div>
        
      <div className="flex items-center gap-3 border-l pl-6 border-gray-200">
  {/* NEW: LIST TO BID BUTTON - No database import needed here! */}
  <Link 
    href="/market/create"
    className="flex items-center gap-1.5 bg-[#004d40] text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-[#003d33] transition shadow-md active:scale-95"
  >
    <FiPlus size={18} strokeWidth={3} />
    <span>List to Bid</span>
  </Link>

  <button className="bg-white text-[#004d40] border border-[#004d40] px-4 py-2 rounded-md text-sm font-semibold hover:bg-neutral-50 transition">
    Connect Wallet
  </button>
</div>
      </div>
    </nav>
  );
}
