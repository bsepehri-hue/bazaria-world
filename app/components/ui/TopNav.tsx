"use client";

import React, { useState } from "react";
import { FiMenu, FiMapPin, FiSearch, FiShoppingCart } from "react-icons/fi";
import { MdDarkMode } from "react-icons/md";
import { FaBell } from "react-icons/fa6";

export default function TopNav() {
  const [locationOpen, setLocationOpen] = useState(false);

  console.log("TOPNAV FROM app/components/ui/TopNav.tsx");

return (
    /* This <nav> acts as the frame that holds the whole top bar together */
    <nav style={{ 
      display: 'grid', 
      gridTemplateColumns: 'auto 1fr auto', 
      alignItems: 'center', 
      width: '100%', 
      maxWidth: '100vw', 
      height: '70px', 
      padding: '0 24px',
      boxSizing: 'border-box',
      overflow: 'hidden', /* THE LOCK: Prevents ghost width from pushing icons away */
      background: 'white', 
      borderBottom: '1px solid #e5e7eb',
      position: 'sticky',
      top: 0,
      zIndex: 1000 /* Stay on top of the categories */
    }}>
      
      {/* 1. LEFT CLUSTER */}
      <div className="flex flex-row flex-nowrap items-center gap-3 shrink-0 whitespace-nowrap">
        <button className="p-2 rounded-md bg-[#0a4d44] text-white hover:bg-teal-800 transition">
          <FiMenu size={20} />
        </button>

        <button
          onClick={() => setLocationOpen(!locationOpen)}
          className="flex flex-row flex-nowrap items-center gap-1 px-3 py-2 rounded-md bg-[#0a4d44] text-white transition text-sm"
        >
          <FiMapPin size={16} className="shrink-0" />
          <span>Los Angeles, CA</span>
          <span className="opacity-70 shrink-0">▾</span>
        </button>
      </div>

      {/* 2. CENTER: SEARCHBAR (Added minWidth: 0 to force it to respect the grid) */}
      <div className="w-full flex justify-center px-4" style={{ minWidth: 0 }}>
        <div className="topnav-search flex items-center bg-gray-100 border border-gray-300 rounded-md px-3 py-2 w-full max-w-md">
          <FiSearch size={18} className="text-gray-500 shrink-0" />
          <input
            type="text"
            placeholder="Search Bazaria..."
            className="bg-transparent w-full ml-2 outline-none text-black"
          />
        </div>
      </div>

      {/* 3. RIGHT CLUSTER (The missing icons!) */}
      <div className="flex items-center gap-4 shrink-0">
        <div className="flex items-center gap-3 text-neutral-600">
          <button className="p-2 hover:bg-neutral-100 rounded-full"><MdDarkMode size={20} /></button>
          <button className="p-2 hover:bg-neutral-100 rounded-full"><FiShoppingCart size={20} /></button>
          <button className="p-2 hover:bg-neutral-100 rounded-full"><FaBell size={18} /></button>
        </div>
        <div className="flex items-center gap-2">
          <button className="bg-[#004d40] text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-[#003d33] transition whitespace-nowrap">
            Connect Wallet
          </button>
          <button className="px-4 py-2 text-sm font-semibold hover:bg-neutral-100 rounded-md transition">
            Login
          </button>
        </div>
      </div>
    </nav>
  );
}
