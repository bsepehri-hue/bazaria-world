"use client";

import { useState } from "react";
import { FiMenu, FiMapPin, FiSearch, FiShoppingCart } from "react-icons/fi";
import { MdDarkMode } from "react-icons/md";
import { FaBell } from "react-icons/fa6";

export default function TopNav() {
  const [locationOpen, setLocationOpen] = useState(false);

  return (
    // 1. Flex container guarantees a single row. 
    // I added your teal brand color here (bg-[#0a4d44] as an example, adjust hex as needed)
    <div className="flex justify-between items-center w-full h-16 px-4 gap-4 bg-[#0a4d44] text-white">

      {/* LEFT CLUSTER: shrink-0 keeps it from getting crushed by the search bar */}
      <div className="flex items-center gap-3 shrink-0">
        <button className="p-2 rounded-md hover:bg-black/20 transition">
          <FiMenu size={20} />
        </button>

        <button
          onClick={() => setLocationOpen(!locationOpen)}
          className="flex items-center gap-1 px-3 py-2 rounded-md hover:bg-black/20 transition text-sm"
        >
          <FiMapPin size={16} />
          <span>Los Angeles, CA</span>
          <span className="opacity-70">▾</span>
        </button>
      </div>

      {/* CENTER — SEARCHBAR: flex-1 takes remaining space, max-w-md keeps it short */}
      <div className="flex-1 flex justify-center w-full">
        <div className="w-full max-w-md">
          {/* Changed to a white background with dark text to match your screenshot */}
          <div className="flex items-center bg-white border border-gray-300 rounded-md px-3 py-2">
            <FiSearch size={18} className="text-gray-500" />
            <input
              type="text"
              placeholder="Search Bazaria..."
              className="bg-transparent w-full ml-2 outline-none text-sm text-gray-900 placeholder-gray-500"
            />
          </div>
        </div>
      </div>

      {/* RIGHT CLUSTER: shrink-0 keeps icons and buttons aligned on the far right */}
      <div className="flex items-center gap-3 shrink-0">
        <button className="p-2 rounded-md hover:bg-black/20 transition">
          <MdDarkMode size={20} />
        </button>

        <button className="p-2 rounded-md hover:bg-black/20 transition relative">
          <FiShoppingCart size={20} />
        </button>

        <button className="p-2 rounded-md hover:bg-black/20 transition relative">
          <FaBell size={18} />
        </button>

        <button className="px-4 py-2 rounded-md bg-emerald-600 hover:bg-emerald-500 transition text-sm font-medium">
          Connect Wallet
        </button>

        <button className="px-4 py-2 rounded-md border border-white/30 hover:bg-white/10 transition text-sm font-medium">
          Login
        </button>
      </div>

    </div>
  );
}
