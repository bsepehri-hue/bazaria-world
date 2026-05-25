"use client";

import React, { useState, Suspense, useEffect, useRef } from "react";
import { FiMapPin, FiSearch, FiShoppingCart, FiPlus, FiMessageSquare, FiUser, FiSettings, FiBriefcase, FiLogOut, FiLogIn, FiChevronDown, FiTarget } from "react-icons/fi";
import { FaBell } from "react-icons/fa6";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Link from "next/link";

// Firebase & Auth Imports
import { auth, db } from "@/lib/firebase/client"; 
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { useAuth } from "@/app/providers/AuthProvider";
import { signOut } from "firebase/auth";

export default function TopNav() {
  return (
    <Suspense fallback={<div style={{ height: "64px", width: "100%" }} />}>
      <TopNavContent />
    </Suspense>
  );
}

function TopNavContent() {
  const { user } = useAuth(); // Connect to your Bazaria Auth
  const [locationOpen, setLocationOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchExpanded, setSearchExpanded] = useState(false); // Tracks magnifier click expansion state
  const [radarMenuOpen, setRadarMenuOpen] = useState(false); 
  
  // 📏 Track screen width in native JS state to handle split-screen responsiveness flawlessly
  const [windowWidth, setWindowWidth] = useState(1200);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null); // Tracks closing search on outside click
  const pathname = usePathname();
  const isMerchantView = pathname.startsWith("/dashboard");
  
  // 🎯 Live-syncing state variables
  const [unreadMessages, setUnreadMessages] = useState(0); 
  const [notificationCount, setNotificationCount] = useState(0);

  // 📐 Track browser window adjustments dynamically on glass
  useEffect(() => {
    if (typeof window !== "undefined") {
      setWindowWidth(window.innerWidth);
      const handleResize = () => setWindowWidth(window.innerWidth);
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  // 🛰️ Real-time Inquiry Portal (Conversations/Chats) Listener
  useEffect(() => {
    if (!user?.uid) {
      setUnreadMessages(0);
      return;
    }

    const q = query(
      collection(db, "chats"),
      where("unreadBy", "array-contains", user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setUnreadMessages(snapshot.size);
    }, (error) => {
      console.error("TopNav: Error streaming unread chats:", error);
    });

    return () => unsubscribe();
  }, [user?.uid]);

  // 🔔 Real-time System Notifications (The Bell & Radar Link Engine)
  useEffect(() => {
    if (!user?.uid) {
      setNotificationCount(0);
      return;
    }

    const q = query(
      collection(db, "notifications"),
      where("userId", "==", user.uid),
      where("read", "==", false) 
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setNotificationCount(snapshot.size);
    });

    return () => unsubscribe();
  }, [user?.uid]);

  // 鼠标 Click-Outside Context Menu Controller
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      
      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        setDropdownOpen(false);
      }
      
      if (searchRef.current && !searchRef.current.contains(target)) {
        setSearchExpanded(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogoutAction = async () => {
    try {
      await signOut(auth);
      setDropdownOpen(false);
      router.push("/login");
    } catch (err) {
      console.error("TopNav: Failed to sign out:", err);
    }
  };

  // 🎯 Reusable Context-Aware Login Redirect Router
  const triggerSecureLoginRedirect = () => {
    setRadarMenuOpen(false);
    setDropdownOpen(false);
    // Explicitly fallback to /market if the current path is bare or configuration bound
    const runtimeRedirectBase = pathname && pathname !== "/" ? pathname : "/market";
    router.push(`/login?redirect=${encodeURIComponent(runtimeRedirectBase)}`);
  };

  // 📊 Compute responsive thresholds programmatically
  const isCompact = windowWidth < 980;
  const hideLocation = windowWidth < 1140;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: "64px",
        padding: "0 12px", 
        width: "100%",
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #e5e7eb",
        position: "relative",
        boxSizing: "border-box",
        zIndex: 9999
      }}
    >
      {/* LEFT: Adaptive Location Pin & Fixed Radar Button */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", position: "relative", flexShrink: 0 }}>
        <button
          onClick={() => setLocationOpen(!locationOpen)}
          title="Costa Mesa, CA"
          style={{
            backgroundColor: "#004d40",
            color: "white",
            padding: windowWidth < 1140 ? "10px" : "8px 12px",
            borderRadius: windowWidth < 1140 ? "50%" : "6px",
            minWidth: windowWidth < 1140 ? "40px" : "auto",
            height: windowWidth < 1140 ? "40px" : "auto",
            fontSize: "14px",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
            whiteSpace: "nowrap",
          }}
        >
          <FiMapPin size={16} style={{ flexShrink: 0 }} />
          {windowWidth >= 1140 && (
            <>
              <span>Costa Mesa, CA</span>
              <span style={{ fontSize: "10px", opacity: 0.7 }}>▼</span>
            </>
          )}
        </button>

        {/* 📱 MOBILE TAP OVERLAY */}
        {locationOpen && windowWidth < 1140 && (
          <div
            style={{
              position: "absolute",
              top: "50px",
              left: "0",
              backgroundColor: "#004d40",
              color: "white",
              padding: "6px 12px",
              borderRadius: "6px",
              fontSize: "12px",
              fontWeight: "bold",
              whiteSpace: "nowrap",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              zIndex: 100000,
              display: "flex",
              alignItems: "center",
              gap: "4px"
            }}
          >
            <span>Costa Mesa, CA</span>
          </div>
        )}

        {/* 🚨 RADAR CONNECTOR MODULE */}
        <div style={{ position: "relative", display: "flex", alignItems: "center", width: "max-content" }}>
          <Link 
            href="/radar-test" 
            onClick={(e) => {
              e.preventDefault(); 
              setRadarMenuOpen(!radarMenuOpen); 
            }}
            style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: "6px", 
              color: notificationCount > 0 ? "#ffffff" : "#ff4d4d", 
              backgroundColor: notificationCount > 0 ? "#ff4d4d" : "#fff5f5",
              border: notificationCount > 0 ? "1px solid #ff4d4d" : "1px solid rgba(255, 77, 77, 0.3)",
              textDecoration: "none", 
              fontSize: "12px", 
              fontWeight: 800,
              padding: "8px 12px",
              borderRadius: "6px",
              whiteSpace: "nowrap",
              transition: "all 0.2s ease",
              cursor: "pointer"
            }}
            title="Track your live listings and active bids"
          >
            <FiTarget size={15} strokeWidth={3} />
            <span>RADAR</span>
          </Link>

          {/* Crimson Alert Floating Numerical Pill Badge */}
          {notificationCount > 0 && (
            <span style={{ 
              position: "absolute", 
              top: "-6px", 
              right: "-6px", 
              backgroundColor: "#ff1a1a", 
              color: "#fff", 
              borderRadius: "50%", 
              fontSize: "9px", 
              width: "15px", 
              height: "15px", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center", 
              fontWeight: "900", 
              border: "1.5px solid #fff",
              boxShadow: "0 0 6px rgba(255, 26, 26, 0.4)",
              zIndex: 10
            }}>
              {notificationCount}
            </span>
          )}

          {/* 🛰️ RADAR DROPDOWN OVERLAY CONTAINER */}
          {radarMenuOpen && (
            <div style={{
              position: "absolute",
              top: "45px",
              left: "0",           
              backgroundColor: "white",
              border: "1px solid #e0e0e0",
              borderRadius: "8px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
              width: "290px",
              zIndex: 100005,      
              padding: "16px",
              display: "flex",
              flexDirection: "column",
              gap: "12px"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", borderBottom: "1px solid #f0f0f0", paddingBottom: "8px" }}>
                <FiTarget size={16} color="#004d40" />
                <h4 style={{ margin: 0, color: "#004d40", fontSize: "13px", fontWeight: "bold" }}>Live Bid & Item Tracker</h4>
              </div>

              {!user?.uid ? (
                // 🔐 Friendly Guest Call-To-Action Mode (FIXED VIA CONTEXT-AWARE HOOKS)
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <p style={{ margin: 0, fontSize: "12px", color: "#666", lineHeight: "1.5", whiteSpace: "normal" }}>
                    You are browsing as a guest. Sign in or connect a wallet to track your active listings, bids, and offers in real time.
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <button
                      onClick={triggerSecureLoginRedirect}
                      style={{
                        backgroundColor: "#004d40", color: "white", border: "none",
                        padding: "8px", borderRadius: "4px", fontSize: "12px", fontWeight: "bold", cursor: "pointer"
                      }}
                    >
                      Connect Web3 Wallet
                    </button>
                    <button
                      onClick={triggerSecureLoginRedirect}
                      style={{
                        backgroundColor: "transparent", color: "#004d40", border: "1px solid #004d40",
                        padding: "7px", borderRadius: "4px", fontSize: "12px", fontWeight: "bold", cursor: "pointer"
                      }}
                    >
                      Sign In with Email / Fiat
                    </button>
                  </div>
                </div>
              ) : (
                // 📊 REAL-TIME LOGGED IN ACTIVE USER VIEW
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <div style={{ backgroundColor: "#f9f9f9", padding: "8px", borderRadius: "4px" }}>
                    <p style={{ margin: 0, fontSize: "12px", color: "#222", fontWeight: "600" }}>
                      Status: Connected
                    </p>
                    <p style={{ margin: "4px 0 0 0", fontSize: "11px", color: "#666" }}>
                      {notificationCount > 0 ? `You have ${notificationCount} active updates.` : "No active bids or listings tracked yet."}
                    </p>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "4px", marginTop: "4px" }}>
                    {/* LINK 1: BIDS TRACKING */}
                    <a 
                      href={isMerchantView ? "/dashboard" : "/profile?tab=bids"} 
                      onClick={() => setRadarMenuOpen(false)}
                      style={{
                        display: "flex", alignItems: "center",
                        padding: "8px", borderRadius: "4px", textDecoration: "none",
                        fontSize: "12px", color: "#333", backgroundColor: "#f0fdf4",
                        transition: "background 0.2s"
                      }}
                    >
                      <span style={{ fontWeight: "600" }}>
                        {isMerchantView ? "📈 View Store Incoming Bids" : "📈 View My Marketplace Bids"}
                      </span>
                    </a>
                    
                    {/* LINK 2: LISTINGS TRACKING */}
                    <a 
                      href={isMerchantView ? "/dashboard?tab=inventory" : "/profile?tab=listings"} 
                      onClick={() => setRadarMenuOpen(false)}
                      style={{
                        display: "flex", alignItems: "center",
                        padding: "8px", borderRadius: "4px", textDecoration: "none",
                        fontSize: "12px", color: "#333", backgroundColor: "#f0fdf4",
                        transition: "background 0.2s"
                      }}
                    >
                      <span style={{ fontWeight: "600" }}>
                        {isMerchantView ? "📦 View Store Live Inventory" : "📦 View My Live Watchlist"}
                      </span>
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* CENTER: Expandable Search Layout */}
      <div style={{ flex: 1, display: "flex", justifyContent: "center", padding: "0 8px" }} ref={searchRef}>
        {!searchExpanded ? (
          <button
            type="button"
            onClick={() => setSearchExpanded(true)}
            style={{ background: "none", border: "none", padding: "10px", cursor: "pointer", color: "#64748b", display: "flex", alignItems: "center", justifyContent: "center" }}
            title="Expand Search Fields"
          >
            <FiSearch size={22} />
          </button>
        ) : (
          <div
            className="topnav-search-container"
            style={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "#f3f4f6",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              padding: "8px 12px",
              width: "100%",
              maxWidth: windowWidth < 1050 ? "150px" : "280px",
              animation: "fadeIn 0.15s ease-out"
            }}
          >
            <FiSearch size={18} color="#9ca3af" style={{ flexShrink: 0 }} />
            <input
              type="text"
              autoFocus
              placeholder="Search Bazaria..."
              value={searchParams.get("q") || ""}
              onChange={(e) => {
                const term = e.target.value;
                const params = new URLSearchParams(searchParams.toString());
                if (term) params.set("q", term);
                else params.delete("q");
                router.push(`/market?${params.toString()}`, { scroll: false });
              }}
              style={{
                border: "none",
                backgroundColor: "transparent",
                outline: "none",
                width: "100%",
                marginLeft: "8px",
                fontSize: "14px",
              }}
            />
          </div>
        )}
      </div>

      {/* RIGHT: Actions & Unified Account Profile Matrix Wrapper */}
      <div className="topnav-actions-group" style={{ display: "flex", alignItems: "center", gap: isCompact ? "6px" : "12px", flexShrink: 0 }} ref={dropdownRef}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            borderRight: "1px solid #e5e7eb",
            paddingRight: "12px",
            color: "#6b7280",
          }}
        >
          {/* 💬 INQUIRY PORTAL */}
          <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
            <FiMessageSquare
              size={22}
              style={{ 
                cursor: "pointer",
                color: unreadMessages > 0 ? "#ff4d4d" : "#64748b",
              }}
              onClick={() => router.push("/market/inbox")}
              title="Inquiry Portal"
            />
            {unreadMessages > 0 && (
              <span style={{ position: "absolute", top: "-6px", right: "-6px", backgroundColor: "#ff4d4d", color: "#fff", borderRadius: "50%", fontSize: "9px", width: "14px", height: "14px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", border: "1.5px solid #fff" }}>
                {unreadMessages}
              </span>
            )}
          </div>

          {/* 🛒 SHOPPING CART */}
          <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
            <FiShoppingCart
              size={22}
              style={{ cursor: "pointer", color: "#64748b" }}
              onClick={() => router.push("/market/checkout")}
              title="Shopping Cart"
            />
            {typeof window !== "undefined" && (() => {
              const stored = localStorage.getItem("bazaria_cart");
              if (stored) {
                try {
                  const parsed = JSON.parse(stored);
                  const count = parsed.totalItems || (Array.isArray(parsed) ? parsed.length : 0);
                  if (count > 0) {
                    return (
                      <span style={{ position: "absolute", top: "-6px", right: "-6px", backgroundColor: "#004d40", color: "#fff", borderRadius: "50%", fontSize: "9px", width: "14px", height: "14px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", border: "1.5px solid #fff" }}>
                        {count}
                      </span>
                    );
                  }
                } catch (e) {
                  console.error(e);
                }
              }
              return null;
            })()}
          </div>
          
          {/* 🔔 SYSTEM NOTIFICATIONS */}
          <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
            <FaBell
              size={20}
              style={{ 
                cursor: "pointer",
                color: notificationCount > 0 ? "#ff4d4d" : "#64748b",
              }}
              onClick={() => router.push("/notifications")}
              title="Notifications"
            />
            {notificationCount > 0 && (
              <span style={{ position: "absolute", top: "-4px", right: "-6px", backgroundColor: "#ff4d4d", color: "#fff", borderRadius: "50%", fontSize: "10px", width: "14px", height: "14px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", border: "1.5px solid #fff" }}>
                {notificationCount}
              </span>
            )}
          </div>
        </div>

        {/* --- BUTTONS SYSTEM --- */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          
          {/* 1. LIST TO BID BUTTON */}
          <Link
            href="/market/create"
            title="Create a new listing to receive bids"
            style={{
              backgroundColor: "#FFBF00",
              color: "#004d40",
              padding: "8px 12px",
              borderRadius: "6px",
              fontSize: "12px",
              fontWeight: "bold",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              whiteSpace: "nowrap",
            }}
          >
            <FiPlus size={16} strokeWidth={4} style={{ flexShrink: 0 }} />
            <span>{windowWidth < 1050 ? "List" : "LIST TO BID"}</span>
          </Link>

{/* 🔌 2. CONNECT WALLET (DEBUG EDITION) */}
          <button
            onClick={async (e) => {
              // 🛑 Stop click events from bubbling up and triggering parent element hijacks
              e.preventDefault();
              e.stopPropagation();

              if (user) {
                console.log("Web3 Debug: Session context already active via Firebase user context.");
                return;
              }

              // 🕵️ Inspect exactly what the window context is rendering on click
              const walletDetected = typeof window !== "undefined" && !!(window as any).ethereum;
              console.log("Web3 Debug: Button clicked. Injected wallet status (window.ethereum):", walletDetected);

              if (walletDetected) {
                try {
                  console.log("Web3 Debug: Wallet detected! Triggering eth_requestAccounts handshake...");
                  const accounts = await (window as any).ethereum.request({ method: "eth_requestAccounts" });
                  console.log("Web3 Debug: Handshake success! Connected account address:", accounts[0]);
                } catch (error) {
                  console.error("Web3 Debug: Handshake rejected or failed:", error);
                }
              } else {
                console.log("Web3 Debug: No wallet detected in this browser session context. Routing fallback redirect execution.");
                triggerSecureLoginRedirect();
              }
            }}
            title="Connect your Web3 crypto wallet"
            style={{
              backgroundColor: "#004d40",
              color: "white",
              padding: "8px 12px",
              borderRadius: "6px",
              fontSize: "13px",
              fontWeight: "600",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              whiteSpace: "nowrap",
            }}
          >
            <FiUser size={14} style={{ marginRight: "4px", flexShrink: 0 }} />
            <span>Connect</span>
          </button>

          {/* 🎯 UNIFIED ACCOUNT DROP CONTROLLER */}
          <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
            <div 
              onClick={() => setDropdownOpen(!dropdownOpen)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "2px",
                cursor: "pointer",
                padding: "6px 2px",
                borderRadius: "50px",
                backgroundColor: dropdownOpen ? "rgba(0, 0, 0, 0.05)" : "transparent",
                transition: "background-color 0.15s ease",
                userSelect: "none"
              }}
            >
              <div style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                border: "2px solid #004d40",
                backgroundColor: "#f3f4f6",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                flexShrink: 0
              }}>
                {user?.photoURL ? (
                  <img src={user.photoURL} alt="Avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <FiUser size={16} color="#004d40" />
                )}
              </div>
              <FiChevronDown size={14} color={dropdownOpen ? "#004d40" : "#6b7280"} style={{ transition: "transform 0.2s", transform: dropdownOpen ? "rotate(180deg)" : "none" }} />
            </div>

            {/* OVERLAY PANEL DROPDOWN MENU */}
            {dropdownOpen && (
              <div style={{
                position: "absolute",
                top: "44px",
                right: "0",
                backgroundColor: "#05292e",
                border: "1px solid rgba(255, 191, 0, 0.2)",
                borderRadius: "12px",
                width: "210px",
                padding: "6px",
                boxShadow: "0 10px 25px -5px rgba(0,0,0,0.3)",
                zIndex: 100000,
                display: "flex",
                flexDirection: "column",
                gap: "2px"
              }}>
                {user ? (
                  <>
                    <div style={{ padding: "8px 12px", borderBottom: "1px solid rgba(255,255,255,0.05)", marginBottom: "4px" }}>
                      <span style={{ display: "block", fontSize: "9px", fontWeight: 900, color: "#FFBF00", letterSpacing: "0.05em" }}>ACCOUNT INSTANCE</span>
                      <span style={{ display: "block", fontSize: "11px", color: "#ffffff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginTop: "2px", fontWeight: 500 }}>
                        {user.displayName || user.email}
                      </span>
                    </div>

                    <Link href="/dashboard/settings" onClick={() => setDropdownOpen(false)} style={dropdownStyles.item}>
                      <FiSettings size={14} color="#FFBF00" />
                      <span>Account Settings</span>
                    </Link>

                    <Link href="/dashboard" onClick={() => setDropdownOpen(false)} style={dropdownStyles.item}>
                      <FiBriefcase size={14} color="#FFBF00" />
                      <span>Merchant Console</span>
                    </Link>

                    <hr style={{ border: "none", borderTop: "1px solid rgba(255,255,255,0.05)", margin: "4px 0" }} />

                    <button onClick={handleLogoutAction} style={{ ...dropdownStyles.item, ...dropdownStyles.logoutBtn }}>
                      <FiLogOut size={14} />
                      <span>Sign Out</span>
                    </button>
                  </>
                ) : (
                  <>
                    {/* FIXED VIA CONTEXT-AWARE REDIRECT FUNCTION */}
                    <button onClick={triggerSecureLoginRedirect} style={dropdownStyles.item}>
                      <FiLogIn size={14} color="#FFBF00" />
                      <span>Log In to Portal</span>
                    </button>
                    <Link 
                      href="/join" 
                      onClick={() => setDropdownOpen(false)} 
                      style={{ ...dropdownStyles.item, color: "#021a1d", backgroundColor: "#FFBF00", fontWeight: 900, justifyContent: "center" }}
                    >
                      <span>Create Storefront</span>
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

const dropdownStyles = {
  item: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "10px 12px",
    borderRadius: "8px",
    color: "#cbd5e1",
    fontSize: "12px",
    fontWeight: 700,
    textDecoration: "none",
    backgroundColor: "transparent",
    border: "none",
    textAlign: "left" as const,
    cursor: "pointer",
    transition: "all 0.1s ease",
  },
  logoutBtn: {
    color: "#fb7185",
  }
};
