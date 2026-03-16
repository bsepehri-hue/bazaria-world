"use client";

import { useState } from "react";
import { FiMenu, FiMapPin, FiSearch, FiShoppingCart } from "react-icons/fi";
import { MdDarkMode } from "react-icons/md";
import { FaBell } from "react-icons/fa6";

export default function TopNav() {
  const [locationOpen, setLocationOpen] = useState(false);

  return (
    <div className="flex items-center w-full gap-4 px-4">


      className="
        grid 
        grid-cols-[auto,1fr,auto] 
        items-center 
        w-full 
        gap-4 
        px-4 
        overflow-x-auto 
        whitespace-nowrap
      "
    >

      {/* LEFT CLUSTER */}
      <div className="flex items-center gap-3">
        <button className="p-2 rounded-md bg-[#0a4d44] text-white hover:bg-teal-800 transition">
          <FiMenu size={20} />
        </button>

        <button
          onClick={() => setLocationOpen(!locationOpen)}
          className="flex items-center gap-1 px-3 py-2 rounded-md bg-[#0a4d44] text-white transition text-sm"
        >
          <FiMapPin size={16} />
          <span>Los Angeles, CA</span>
          <span className="opacity-70">▾</span>
        </button>
      </div>

      {/* CENTER — SEARCHBAR */}
      <div className="flex justify-center min-w-0">
        <div className="topnav-search flex items-center bg-gray-100 border border-gray-300 rounded-md px-3 py-2 w-full max-w-xl">
          <FiSearch size={18} className="text-gray-500" />
          <input
            type="text"
            placeholder="Search Bazaria..."
            className="bg-transparent w-full ml-2 outline-none text-sm text-gray-900"
          />
        </div>
      </div>

      {/* RIGHT CLUSTER */}
      <div className="flex items-center gap-3">
        <button className="p-2 rounded-md bg-[#0a4d44] text-white transition">
          <MdDarkMode size={20} />
        </button>
        <button className="p-2 rounded-md bg-[#0a4d44] text-white transition">
          <FiShoppingCart size={20} />
        </button>
        <button className="p-2 rounded-md bg-[#0a4d44] text-white transition">
          <FaBell size={18} />
        </button>
        <button className="px-4 py-2 rounded-md bg-[#0a4d44] text-white transition text-sm font-medium">
          Connect Wallet
        </button>
        <button className="px-4 py-2 rounded-md bg-[#0a4d44] text-white transition text-sm font-medium">
          Login
        </button>
      </div>

    </div>
  );
}
