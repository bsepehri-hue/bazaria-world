
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

// Theme
import { useThemeToggle } from "../../../hooks/useThemeToggle";

// System hooks
import { useOnlineStatus } from "../../../hooks/useOnlineStatus";
import { usePageScroll } from "../../../hooks/usePageScroll";
import { useTabVisibility } from "../../../hooks/useTabVisibility";

// Auth + Wallet
import { useFirebaseAuth } from "../../../hooks/useFirebaseAuth";
import { useMobileWallet } from "../../../hooks/useMobileWallet";

// Notifications


// Wagmi
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { injected } from "@wagmi/connectors";

// Icons
import { Sun, Moon } from "lucide-react";

export default function TopNav() {
  // Auth
  const { user, handleLogout } = useFirebaseAuth();

  // Theme
  const { isDark, toggleTheme } = useThemeToggle();

  // Wallet
  const { address, isConnected } = useAccount();
  const { connect } = useConnect({ connector: injected() });
  const { disconnect } = useDisconnect();

  // UI state
  const [mobileOpen, setMobileOpen] = useState(false);
  const [walletOpen, setWalletOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  // Hooks: online, scroll, tab
  const { isOnline, lastSeen } = useOnlineStatus();
  const { isScrollingDown, isAtTop } = usePageScroll();
  const { isVisible } = useTabVisibility();

  // Notifications
  
    
  // Active link helper
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

  // Close dropdowns on outside click
  useEffect(() => {
  function close() {
    setWalletOpen(false);
    setUserMenuOpen(false);
    // closeNotifications removed
  }
  window.addEventListener("click", close);
  return () => window.removeEventListener("click", close);
}, []);

  // Search handler
  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const q = (e.currentTarget.elements.namedItem("search") as HTMLInputElement)
      .value;
    if (q.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(q)}`;
    }
  }

  return (
    <nav
      className={`
        l2b-nav
        l2b-flex-between
        l2b-items-center
        l2b-sticky
        l2b-top-0
        ${isScrollingDown ? "l2b-h-12" : "l2b-h-16"}
        l2b-z-50
        l2b-backdrop-blur
        l2b-transition-all
        l2b-duration-300
        ${!isAtTop ? "l2b-bg-surface l2b-shadow l2b-py-2" : "l2b-bg-transparent l2b-py-4"}
        l2b-px-6
      `}
    >
      {/* LEFT SIDE */}
      <div className="l2b-flex l2b-items-center l2b-gap-6 l2b-hidden md:l2b-flex">
        <Link
          href="/marketplace"
          className={isActive("/marketplace") ? "l2b-nav-link-active" : "l2b-nav-link"}
        >
          Marketplace
        </Link>

        <Link
          href="/auctions"
          className={isActive("/auctions") ? "l2b-nav-link-active" : "l2b-nav-link"}
        >
          Auctions
        </Link>

        {user && (
          <Link
            href="/portal/dashboard"
            className={isActive("/portal/dashboard") ? "l2b-nav-link-active" : "l2b-nav-link"}
          >
            Dashboard
          </Link>
        )}
      </div>

      {/* CENTER: SEARCH */}
      <form
        onSubmit={handleSearch}
        className={`
          l2b-relative
          l2b-transition-all
          l2b-duration-300
          l2b-rounded-full
          l2b-bg-surface
          l2b-border
          l2b-border-transparent
          ${searchFocused
            ? "l2b-flex-[2] l2b-scale-105 l2b-shadow-lg l2b-border-primary"
            : "l2b-flex-1 l2b-scale-100"
          }
          l2b-mx-6
        `}
      >
        <input
          type="text"
          name="search"
          placeholder="Search storefronts, auctions, categories..."
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          className="
            l2b-input
            w-full
            l2b-pl-10
            l2b-rounded-full
            l2b-transition-all
            l2b-duration-300
            focus:l2b-ring-2
            focus:l2b-ring-primary
          "
        />
      </form>

      {/* RIGHT SIDE */}
      <div className="l2b-flex l2b-items-center l2b-gap-4 relative">
        {/* Sell Button */}
<Link
  href="/auctions/new"
  className="l2b-btn l2b-btn-amber l2b-hidden md:l2b-inline-flex"
>
  Sell
</Link>

{/* Wallet */}
        {!isConnected ? (
          <button onClick={() => connect()} className="l2b-btn l2b-btn-primary">
            Connect Wallet
          </button>
        ) : (
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setWalletOpen(!walletOpen)}
              className="l2b-btn l2b-btn-muted"
            >
              {address?.slice(0, 6)}...{address?.slice(-4)}
            </button>

{walletOpen && (
  <div className="l2b-absolute l2b-right-0 l2b-mt-2 l2b-bg-surface l2b-shadow l2b-rounded l2b-p-4 l2b-flex l2b-flex-col l2b-gap-3 l2b-z-50">
    <div className="l2b-text-sm l2b-text-muted">{address}</div>

    <button
      onClick={() => navigator.clipboard.writeText(address || "")}
      className="l2b-btn l2b-btn-muted"
    >
      Copy Address
    </button>

    <button
      onClick={() => disconnect()}
      className="l2b-btn l2b-btn-critical"
    >
      Disconnect
    </button>
  </div>
)}
</div>
)}

{/* Theme Toggle */}
<button onClick={toggleTheme} className="l2b-btn-icon">
  {isDark ? (
    <Sun className="l2b-text-warning" />
  ) : (
    <Moon className="l2b-text-primary" />
  )}
</button>

{/* Mobile Menu */}
<button
  onClick={() => setMobileOpen(true)}
  className="l2b-btn-icon l2b-md-hidden"
  title="Open menu"
>
  ☰
</button>
</div>

{/* MOBILE DRAWER */}
{mobileOpen && (
  <div
    className="l2b-fixed l2b-inset-0 l2b-bg-black/40 l2b-z-50"
    onClick={() => setMobileOpen(false)}
  >
    <div
      className="l2b-absolute l2b-top-0 l2b-right-0 l2b-w-64 l2b-h-full l2b-bg-surface l2b-shadow l2b-p-6 l2b-flex l2b-flex-col l2b-gap-6"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        onClick={() => setMobileOpen(false)}
        className="l2b-btn-icon l2b-self-end"
        title="Close menu"
      >
        ✕
      </button>

      <Link
        href="/marketplace"
        className={isActive("/marketplace") ? "l2b-nav-link-active" : "l2b-nav-link"}
      >
        Marketplace
      </Link>

      <Link
        href="/auctions"
        className={isActive("/auctions") ? "l2b-nav-link-active" : "l2b-nav-link"}
      >
        Auctions
      </Link>

      {user && (
        <Link
          href="/portal/dashboard"
          className={isActive("/portal/dashboard") ? "l2b-nav-link-active" : "l2b-nav-link"}
        >
          Dashboard
        </Link>
      )}

      <Link
        href="/auctions/new"
        className="l2b-btn l2b-btn-amber"
      >
        Sell
      </Link>

      {!user ? (
        <Link href="/portal/login" className="l2b-btn l2b-btn-primary">
          Login
        </Link>
      ) : (
        <div className="relative" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="l2b-btn l2b-btn-muted"
          >
            Account
          </button>

          {userMenuOpen && (
            <div className="l2b-absolute l2b-right-0 l2b-mt-2 l2b-bg-surface l2b-shadow l2b-rounded l2b-p-4 l2b-flex l2b-flex-col l2b-gap-3 l2b-z-50">
              <Link href="/portal/dashboard" className="l2b-nav-link">
                Dashboard
              </Link>

              <Link href="/portal/settings" className="l2b-nav-link">
                Settings
              </Link>

              <button
                onClick={handleLogout}
                className="l2b-btn l2b-btn-critical"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  </div>
)}
</nav>
);
}
