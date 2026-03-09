"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import { FiMenu, FiMapPin, FiSearch, FiShoppingCart } from "react-icons/fi";
import { MdDarkMode } from "react-icons/md";

export default function TopNav() {
  const path = usePathname();

  const [locationOpen, setLocationOpen] = useState(false);

  return (
    <header className="w-full h-16 border-b border-slate-800 bg-slate-900/80 backdrop-blur flex items-center px-4 gap-4 fixed top-0 left-0 z-50">

      {/* LEFT CLUSTER */}
      <div className="flex items-center gap-3 flex-none">

        {/* Mobile Toggle */}
        <button className="p-2 rounded-md hover:bg-slate-800 transition">
          <FiMenu size={20} />
        </button>

        {/* Location Selector (Amazon-style) */}
        <button
          onClick={() => setLocationOpen(!locationOpen)}
          className="flex items-center gap-1 px-3 py-2 rounded-md hover:bg-slate-800 transition text-sm"
        >
          <FiMapPin size={16} />
          <span>Los Angeles, CA</span>
          <span className="opacity-70">▾</span>
        </button>

      </div>

      {/* CENTER — SEARCHBAR */}
      <div className="flex-1 flex justify-center">
        <div className="w-full max-w-xl">
          <div className="flex items-center bg-slate-800 border border-slate-700 rounded-md px-3 py-2">
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
      <div className="flex items-center gap-4 flex-none">

        {/* Dark Mode */}
        <button className="p-2 rounded-md hover:bg-slate-800 transition">
          <MdDarkMode size={20} />
        </button>

        {/* Cart */}
        <button className="p-2 rounded-md hover:bg-slate-800 transition relative">
          <FiShoppingCart size={20} />
        </button>

        {/* Connect Wallet */}
        <button className="px-3 py-2 rounded-md bg-emerald-600 hover:bg-emerald-500 transition text-sm font-medium">
          Connect Wallet
        </button>

        {/* Login / Profile */}
        <button className="px-3 py-2 rounded-md bg-slate-800 hover:bg-slate-700 transition text-sm font-medium">
          Login
        </button>

      </div>
    </header>
  );
}
