"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Icons (your validated icon set)
import { 
  FaBell, 
  FaShoppingCart, 
  FaLocationArrow, 
  FaSun, 
  FaMoon 
} from "react-icons/fa";

// Wallet + Auth hooks
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { injected } from "@wagmi/connectors";
import { useFirebaseAuth } from "../../../hooks/useFirebaseAuth";

// Theme
import { useThemeToggle } from "../../../hooks/useThemeToggle";

export default function TopNav() {
  const pathname = usePathname();

  // Theme
  const { isDark, toggleTheme } = useThemeToggle();

  // Wallet
  const { address, isConnected } = useAccount();
  const { connect } = useConnect({ connector: injected() });
  const { disconnect } = useDisconnect();

  // Auth
  const { user } = useFirebaseAuth();

  // UI state
  const [locationOpen, setLocationOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
  <nav className="w-full h-16 px-6 grid grid-cols-[240px_1fr_240px] items-center bg-white dark:bg-neutral-900 shadow-sm z-50">

  {/* LEFT — SEARCH (fixed width, no more stretching) */}
  <div className="flex-none w-[380px]">
    <input
      type="text"
      placeholder="Search Bazaria…"
      className="
        w-full h-10 px-4 rounded-full
        bg-neutral-100 dark:bg-neutral-800
        text-sm outline-none
        focus:ring-2 focus:ring-emerald-500
        transition
      "
    />
  </div>

  {/* CENTER — LOCATION + PROFILE + WALLET + THEME + MOBILE */}
  <div className="flex items-center gap-6">

    {/* LOCATION */}
    <div className="relative">
      <button
        onClick={() => setLocationOpen(!locationOpen)}
        className="flex items-center gap-2 text-sm"
      >
        <FaLocationArrow className="text-emerald-600" />
        Los Angeles, CA
      </button>

      {locationOpen && (
        <div className="
          absolute right-0 mt-2 w-48
          bg-white dark:bg-neutral-800
          shadow-lg rounded-md p-3 text-sm
        ">
          <button className="w-full text-left py-1">Use my location</button>
          <button className="w-full text-left py-1">Enter ZIP code</button>
          <button className="w-full text-left py-1">Change city</button>
        </div>
      )}
    </div>

    {/* PROFILE */}
    {user ? (
      <div className="relative">
        <button
          onClick={() => setProfileOpen(!profileOpen)}
          className="w-8 h-8 rounded-full bg-neutral-300 dark:bg-neutral-700"
        />
        {profileOpen && (
          <div className="
            absolute right-0 mt-2 w-40
            bg-white dark:bg-neutral-800
            shadow-lg rounded-md p-3 text-sm
          ">
            <Link href="/portal/dashboard" className="block py-1">Dashboard</Link>
            <Link href="/portal/settings" className="block py-1">Settings</Link>
            <button className="block py-1 text-red-500">Logout</button>
          </div>
        )}
      </div>
    ) : (
      <Link href="/portal/login" className="text-sm">Login</Link>
    )}

    {/* WALLET */}
    {!isConnected ? (
      <button
        onClick={() => connect()}
        className="text-sm px-3 py-1 rounded-md bg-emerald-600 text-white"
      >
        Connect Wallet
      </button>
    ) : (
      <button
        onClick={() => disconnect()}
        className="text-sm px-3 py-1 rounded-md bg-neutral-200 dark:bg-neutral-700"
      >
        {address?.slice(0, 6)}...{address?.slice(-4)}
      </button>
    )}

    {/* THEME */}
    <button onClick={toggleTheme} className="text-xl">
      {isDark ? <FaSun className="text-yellow-400" /> : <FaMoon />}
    </button>

    {/* MOBILE MENU */}
    <button
      onClick={() => setMobileOpen(true)}
      className="text-2xl md:hidden"
    >
      ☰
    </button>
  </div>

  {/* RIGHT — BELL + CART */}
  <div className="flex items-center gap-6">
    <FaBell className="text-xl cursor-pointer" />
    <FaShoppingCart className="text-xl cursor-pointer" />
  </div>

</nav>
  );
}
