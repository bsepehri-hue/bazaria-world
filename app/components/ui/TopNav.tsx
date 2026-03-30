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
  <nav className="w-full bg-white border-b sticky top-0 z-[1000] px-6" style={{ height: '70px' }}>
    <div className="flex items-center justify-between h-full w-full gap-4">
      
      {/* 1. LEFT CLUSTER: Toggle + Location (Now aligned!) */}
      <div className="flex items-center gap-3 shrink-0">
        <button className="p-2 rounded-md bg-[#004d40] text-white hover:bg-[#003d33] transition-all active:scale-95">
          <FiMenu size={20} />
        </button>

        <button
          onClick={() => setLocationOpen(!locationOpen)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-md bg-[#004d40] text-white text-sm font-medium whitespace-nowrap transition-all hover:bg-[#003d33]"
        >
          <FiMapPin size={16} />
          <span>Los Angeles, CA</span>
          <span className="opacity-70 text-[10px]">▼</span>
        </button>
      </div>

      {/* 2. CENTER: Searchbar (Automatically fills remaining space) */}
      <div className="flex-1 max-w-xl mx-2">
        <div className="flex items-center bg-gray-100 border border-gray-200 rounded-lg px-3 py-2 w-full">
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

      {/* 3. RIGHT CLUSTER: Actions (Forced horizontal) */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Icons */}
        <div className="flex items-center gap-3 text-neutral-500 mr-2">
          <button className="p-1 hover:text-[#004d40] transition"><MdDarkMode size={22} /></button>
          <button className="p-1 hover:text-[#004d40] transition"><FiShoppingCart size={22} /></button>
          <button className="p-1 hover:text-[#004d40] transition"><FaBell size={20} /></button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 border-l pl-4 border-gray-200">
          <Link 
            href="/market/create"
            className="flex items-center gap-1.5 bg-[#FFBF00] text-[#004d40] px-4 py-2 rounded-md text-[13px] font-bold shadow-sm hover:brightness-95 transition-all active:scale-95 whitespace-nowrap uppercase tracking-tight"
          >
            <FiPlus size={18} strokeWidth={4} />
            <span>List to Bid</span>
          </Link>

          <button className="bg-[#004d40] text-white px-4 py-2 rounded-md text-[13px] font-semibold hover:bg-[#003d33] transition-all whitespace-nowrap">
            Connect Wallet
          </button>
        </div>
      </div>

    </div>
  </nav>
);
}
