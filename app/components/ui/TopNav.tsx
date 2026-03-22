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

      {/* 3. RIGHT CLUSTER: Keep it all on ONE line */}
      <div className="flex items-center gap-4 shrink-0 h-full">
        {/* Icons Group */}
        <div className="flex items-center gap-3 text-neutral-600 mr-2">
          <button className="p-1.5 hover:text-[#004d40] transition"><MdDarkMode size={20} /></button>
          <button className="p-1.5 hover:text-[#004d40] transition"><FiShoppingCart size={20} /></button>
          <button className="p-1.5 hover:text-[#004d40] transition relative">
            <FaBell size={18} />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
          </button>
        </div>
        
        {/* Main Actions Group */}
        <div className="flex items-center gap-2 border-l pl-4 border-gray-200">
          <Link 
            href="/market/create"
            className="flex items-center gap-1.5 text-white transition-all active:scale-95 whitespace-nowrap"
            style={{
              backgroundColor: '#004d40',
              padding: '6px 12px',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: '600',
              textDecoration: 'none',
              display: 'flex'
            }}
          >
            <FiPlus size={16} />
            <span>List to Bid</span>
          </Link>

          <button className="bg-white text-[#004d40] border border-[#004d40] px-3 py-1.5 rounded-md text-sm font-semibold hover:bg-neutral-50 transition whitespace-nowrap">
            Connect Wallet
          </button>
        </div>
      </div>
    </nav>
  );
}
