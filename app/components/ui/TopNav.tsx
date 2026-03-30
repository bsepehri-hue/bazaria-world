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
  <nav 
    className="fixed top-0 right-0 z-[1000] bg-white border-b border-gray-200" 
    style={{ 
      height: '70px', 
      left: '0', // Full width to cover top
      paddingLeft: '250px' // THIS ANCHORS IT: Matches your Sidebar width
    }}
  >
    <div className="flex items-center justify-between h-full w-full px-6 gap-4">
      
      {/* 1. LEFT CLUSTER: Now sits safely after the 250px sidebar gap */}
      <div className="flex items-center gap-3 shrink-0">
        <button className="p-2 rounded-md bg-[#004d40] text-white hover:bg-[#003d33] transition-all active:scale-95">
          <FiMenu size={20} />
        </button>

        <button
          onClick={() => setLocationOpen(!locationOpen)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-md bg-[#004d40] text-white text-sm font-medium whitespace-nowrap"
        >
          <FiMapPin size={16} />
          <span>Los Angeles, CA</span>
          <span className="opacity-70 text-[10px]">▼</span>
        </button>
      </div>

      {/* 2. CENTER: Searchbar */}
      <div className="flex-1 max-w-2xl">
        <div className="flex items-center bg-gray-100 border border-gray-200 rounded-lg px-3 py-2 w-full shadow-sm">
          <FiSearch size={18} className="text-gray-400 shrink-0" />
          <input
            type="text"
            placeholder="Search Bazaria..."
            className="bg-transparent w-full ml-2 outline-none text-black text-sm"
            onChange={(e) => handleSearch(e.target.value)}
            defaultValue={searchParams.get('q') || ""}
          />
        </div>
      </div>

      {/* 3. RIGHT CLUSTER: Forced to stay on the far right of the content area */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="flex items-center gap-3 text-neutral-500 mr-2 border-r pr-4 border-gray-200">
          <button className="p-1 hover:text-[#004d40] transition"><MdDarkMode size={22} /></button>
          <button className="p-1 hover:text-[#004d40] transition"><FiShoppingCart size={22} /></button>
          <button className="p-1 hover:text-[#004d40] transition"><FaBell size={20} /></button>
        </div>

        <div className="flex items-center gap-2">
          <Link 
            href="/market/create"
            className="flex items-center gap-1.5 bg-[#FFBF00] text-[#004d40] px-4 py-2 rounded-md text-[12px] font-bold shadow-sm hover:brightness-95 transition-all active:scale-95 whitespace-nowrap uppercase tracking-tight"
          >
            <FiPlus size={16} strokeWidth={4} />
            <span>List to Bid</span>
          </Link>

          <button className="bg-[#004d40] text-white px-4 py-2 rounded-md text-[12px] font-semibold hover:bg-[#003d33] transition-all whitespace-nowrap">
            Connect Wallet
          </button>
        </div>
      </div>

    </div>
  </nav>
);
}
