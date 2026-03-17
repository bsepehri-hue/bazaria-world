"use client";

import React, { useState } from "react";
import { FiMenu, FiMapPin, FiSearch, FiShoppingCart } from "react-icons/fi";
import { MdDarkMode } from "react-icons/md";
import { FaBell } from "react-icons/fa6";

export default function TopNav() {
  const [locationOpen, setLocationOpen] = useState(false);

  console.log("TOPNAV FROM app/components/ui/TopNav.tsx");

 return (
  /* Replaced grid with a standard flex layout */
  <div className="flex items-center justify-between w-full h-full px-4 md:px-6">
    
    {/* LEFT: Menu & Location (Added shrink-0 so it doesn't crush) */}
    <div className="flex items-center gap-3 shrink-0">
      <button className="p-2 rounded-md hover:bg-neutral-100 transition">
        <FiMenu size={20} />
      </button>
      <button
        onClick={() => setLocationOpen(!locationOpen)}
        className="flex items-center gap-1 px-3 py-2 rounded-md hover:bg-neutral-100 transition text-sm"
      >
        <FiMapPin size={16} />
        <span className="font-medium whitespace-nowrap">Los Angeles, CA</span>
        <span className="opacity-70">▾</span>
      </button>
    </div>

    {/* CENTER: Search Bar (Flex-1 tells it to fill all empty space) */}
    <div className="flex-1 flex justify-center px-4">
      <div className="w-full max-w-xl">
        <div className="flex items-center bg-white border border-neutral-300 rounded-md px-3 py-1.5 shadow-sm">
          <FiSearch size={18} className="text-neutral-400" />
          <input
            type="text"
            placeholder="Search Bazaria..."
            className="bg-transparent flex-1 ml-2 outline-none text-sm text-neutral-800"
          />
        </div>
      </div>
    </div>

    {/* RIGHT: Actions & Login (Added shrink-0) */}
    <div className="flex items-center gap-4 shrink-0">
      <div className="flex items-center gap-1 sm:gap-3 text-neutral-600">
        <button className="p-2 hover:bg-neutral-100 rounded-full"><MdDarkMode size={20} /></button>
        <button className="p-2 hover:bg-neutral-100 rounded-full"><FiShoppingCart size={20} /></button>
        <button className="p-2 hover:bg-neutral-100 rounded-full"><FaBell size={18} /></button>
      </div>
      
      <div className="flex items-center gap-2">
        <button className="bg-[#004d40] text-white px-3 sm:px-4 py-2 rounded-md text-sm font-semibold whitespace-nowrap">
          Connect Wallet
        </button>
        <button className="px-3 sm:px-4 py-2 text-sm font-semibold hover:bg-neutral-100 rounded-md">
          Login
        </button>
      </div>
    </div>
  </div>
);
}
