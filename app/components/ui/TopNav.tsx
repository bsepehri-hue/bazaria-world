"use client";

import React, { useState, Suspense, useEffect, useRef } from "react";
import { FiMapPin, FiSearch, FiShoppingCart, FiPlus, FiMessageSquare, FiUser, FiSettings, FiBriefcase, FiLogOut, FiLogIn, FiChevronDown, FiRadio } from "react-icons/fi";
import { FaBell } from "react-icons/fa6";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

// Firebase & Auth Imports
import { auth, db } from "@/lib/firebase/client"; 
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { useAuth } from "@/app/providers/AuthProvider";
import { signOut } from "firebase/auth";

// 📡 Radar Stream Hook Integration
import { useUserBids } from "@/hooks/useUserBids";

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
  const router = useRouter();
  const searchParams = useSearchParams();
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Live-syncing state variables
  const [unreadMessages, setUnreadMessages] = useState(0); 
  const [notificationCount, setNotificationCount] = useState(0);

  // 📡 Real-time Radar Multi-Item Loss Counter Hook
  const { activeBids } = useUserBids(user?.uid);
  const lostRoomsCount = activeBids.filter(bid => !bid.isCurrentHighestBidder).length;

  // 🛰️ 1. Real-time Inquiry Portal (Conversations/Chats) Listener
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

  // 🔔 2. Real-time System Notifications (The Bell) Listener
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

  // 🖱️ 3. Click-Outside Dropdown Controller Listener
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
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

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: "64px",
        padding: "0 24px 0 32px",
        width: "100%",
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #e5e7eb",
        position: "relative",
        boxSizing: "border-box"
      }}
    >
      {/* 🎯 RESPONSIVE TOPNAV UTILITY OVERRIDES & RADAR ANIMATIONS */}
      <style jsx global>{`
        @keyframes radar-pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.15); opacity: 0.8; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-radar-flash {
          animation: radar-pulse 1.5s infinite ease-in-out;
        }
        @media (max-w: 840px) {
          .topnav-location-wrapper {
            display: none !important;
          }
          .topnav-list-btn span, .topnav-connect-btn {
            display: none !important; 
          }
          .topnav-list-btn {
            padding: 10px !important;
            border-radius: 50% !important;
          }
        }
      `}</style>

      {/* LEFT: Location Selector */}
      <div className="topnav-location-wrapper" style={{ display: "flex", alignItems: "center", gap: "16px", flexShrink: 0 }}>
        <button
          onClick={() => setLocationOpen(!locationOpen)}
          style={{
            backgroundColor: "#004d40",
            color: "white",
            padding: "8px 12px",
            borderRadius: "6px",
            fontSize: "14px",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            whiteSpace: "nowrap",
          }}
          onMouseOver={(e) => { e.currentTarget.style.backgroundColor = "#003d33"; }}
          onMouseOut={(e) => { e.currentTarget.style.backgroundColor = "#004d40"; }}
        >
          <FiMapPin size={16} />
          <span>Costa Mesa, CA</span>
          <span style={{ fontSize: "10px", opacity: 0.7 }}>▼</span>
        </button>
      </div>

      {/* CENTER / RIGHT ACTION CHANNEL LINK WRAPPER */}
      <div style={{ display: "flex", alignItems: "center", gap: "20px", marginLeft: "auto", paddingRight: "16px", color: "#64748b" }} ref={dropdownRef}>
        
        {/* 🔍 OPTIMIZED GLOBAL MAGNIFIER LINK */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <FiSearch
            size={22}
            style={{ cursor: "pointer", color: "#64748b" }}
            onClick={() => router.push("/market")}
            title="Search Marketplace"
          />
        </div>

        {/* 📡 LIVE BID RADAR PORTAL ICON */}
        <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
          <FiRadio
            size={22}
            className={lostRoomsCount > 0 ? "animate-radar-flash" : ""}
            style={{ 
              cursor: "pointer",
              color: lostRoomsCount > 0 ? "#ef4444" : "#64748b",
              filter: lostRoomsCount > 0 ? "drop-shadow(0 0 6px rgba(239, 68, 68, 0.6))" : "none",
              transition: "all 0.3s ease"
            }}
            onClick={() => router.push("/radar-test")}
            title="Live Bid Radar Arena"
          />
          {lostRoomsCount > 0 && (
            <span style={{ position: "absolute", top: "-6px", right: "-6px", backgroundColor: "#ef4444", color: "#fff", borderRadius: "50%", fontSize: "9px", width: "14px", height: "14px", display: "flex", alignItems: "center", justifyItems: "center", justifyContent: "center", fontWeight: "bold", border: "1.5px solid #fff" }}>
              {lostRoomsCount}
            </span>
          )}
        </div>

        {/* 💬 INQUIRY PORTAL */}
        <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
          <FiMessageSquare
            size={22}
            style={{ 
              cursor: "pointer",
              color: unreadMessages > 0 ? "#ff4d4d" : "#64748b",
              filter: unreadMessages > 0 ? "drop-shadow(0 0 4px rgba(255, 77, 77, 0.4))" : "none",
              transition: "all 0.3s ease"
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
              filter: notificationCount > 0 ? "drop-shadow(0 0 4px rgba(255, 77, 77, 0.4))" : "none",
              transition: "all 0.3s ease"
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

      {/* FIXED ACTION CONTROL BLOCK (Always anchored cleanly on right hand side) */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
        <Link
          href="/market/create"
          className="topnav-list-btn"
          style={{
            backgroundColor: "#FFBF00",
            color: "#004d40",
            padding: "8px 16px",
            borderRadius: "6px",
            fontSize: "12px",
            fontWeight: "bold",
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            whiteSpace: "nowrap",
          }}
        >
          <FiPlus size={16} strokeWidth={4} style={{ flexShrink: 0 }} />
          <span>LIST TO BID</span>
        </Link>

        <button
          onClick={async () => {
            if (typeof window.ethereum !== "undefined") {
              try {
                const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
                console.log("Wallet connected:", accounts[0]);
              } catch (error) {
                console.error("Failed to connect wallet:", error);
              }
            } else {
              alert("Please install MetaMask or another Web3 wallet provider.");
            }
          }}
          className="topnav-connect-btn"
          style={{
            backgroundColor: "#004d40",
            color: "white",
            padding: "8px 16px",
            borderRadius: "6px",
            fontSize: "13px",
            fontWeight: "600",
            border: "none",
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}
        >
          Connect
        </button>

        {/* 🎯 UNIFIED ACCOUNT DROP CONTROLLER */}
        <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
          <div 
            onClick={() => setDropdownOpen(!dropdownOpen)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              cursor: "pointer",
              padding: "6px 8px",
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
              zIndex: 2000,
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
                  <Link href="/login" onClick={() => setDropdownOpen(false)} style={dropdownStyles.item}>
                    <FiLogIn size={14} color="#FFBF00" />
                    <span>Log In to Portal</span>
                  </Link>
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
