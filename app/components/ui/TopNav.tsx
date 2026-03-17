"use client";

import { useState } from "react";
import { FiMenu, FiMapPin, FiSearch, FiShoppingCart } from "react-icons/fi";
import { MdDarkMode } from "react-icons/md";
import { FaBell } from "react-icons/fa6";

export default function TopNav() {
  const [locationOpen, setLocationOpen] = useState(false);

  console.log("TOPNAV FROM app/components/ui/TopNav.tsx");

 export default function TopNav() {
  return (
    // 'h-full' ensures it fills the 64px header, 'px-6' gives it breathing room
    <div className="grid grid-cols-[200px_1fr_auto] w-full h-full items-center px-6">
      
      {/* LEFT: Menu & Location */}
      <div className="flex items-center gap-3">
        {/* ... your menu button and location code ... */}
      </div>

      {/* CENTER: Search Bar */}
      <div className="flex justify-center px-4">
        <div className="relative w-full max-w-lg">
           {/* ... your search input code ... */}
        </div>
      </div>

      {/* RIGHT: Actions & Login */}
      <div className="flex items-center gap-4">
        {/* Icons (Dark mode, cart, bell) */}
        <div className="flex items-center gap-2">
           {/* ... icons ... */}
        </div>
        {/* Buttons */}
        <button className="bg-[#004d40] text-white px-4 py-1.5 rounded-md text-sm font-medium">
          Connect Wallet
        </button>
        <button className="text-sm font-medium">Login</button>
      </div>
    </div>
  );
}
