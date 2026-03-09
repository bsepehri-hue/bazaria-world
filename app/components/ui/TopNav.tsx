"use client";

import { useState } from "react";
import { FiMenu, FiMapPin, FiSearch, FiShoppingCart } from "react-icons/fi";
import { MdDarkMode } from "react-icons/md";
import { FaBell } from "react-icons/fa6";

export default function TopNav() {
  const [locationOpen, setLocationOpen] = useState(false);
 

 return (
  <div className="contents">

    {/* LEFT CLUSTER */}
    <div className="flex items-center gap-3">
      <button className="p-2 rounded-md hover:bg-neutral-800/60 transition">
        <FiMenu size={20} />
      </button>

      <button
        onClick={() => setLocationOpen(!locationOpen)}
        className="flex items-center gap-1 px-3 py-2 rounded-md hover:bg-neutral-800/60 transition text-sm"
      >
        <FiMapPin size={16} />
        <span>Los Angeles, CA</span>
        <span className="opacity-70">▾</span>
      </button>
    </div>

    {/* CENTER — SEARCHBAR */}
    <div className="flex justify-center w-full">
      <div className="w-full max-w-xl mx-auto">
        <div className="flex items-center bg-neutral-900/80 border border-neutral-700 rounded-md px-3 py-2">
          <FiSearch size={18} className="opacity-70" />
          <input
            type="text"
            placeholder="Search Bazaria..."
            className="bg-transparent flex-1 ml-2 outline-none text-sm"
          />
        </div>
      </div>
    </div>

    {/* RIGHT CLUSTER */}
    <div className="flex items-center gap-4 justify-end">
      <button className="p-2 rounded-md hover:bg-neutral-800/60 transition">
        <MdDarkMode size={20} />
      </button>

      <button className="p-2 rounded-md hover:bg-neutral-800/60 transition relative">
        <FiShoppingCart size={20} />
      </button>

      <button className="p-2 rounded-md hover:bg-neutral-800/60 transition relative">
        <FaBell size={18} />
      </button>

      <button className="px-3 py-2 rounded-md bg-emerald-600 hover:bg-emerald-500 transition text-sm font-medium">
        Connect Wallet
      </button>

      <button className="px-3 py-2 rounded-md bg-neutral-800 hover:bg-neutral-700 transition text-sm font-medium">
        Login
      </button>
    </div>

  </div>
);
}
