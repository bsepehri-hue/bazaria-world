"use client";

import React, { useState, Suspense, useEffect } from "react";
import { FiMapPin, FiSearch, FiShoppingCart, FiPlus, FiMessageSquare } from "react-icons/fi";
import { FaBell } from "react-icons/fa6";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

// Firebase & Auth Imports
import { db } from "@/lib/firebase/client"; 
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { useAuth } from "@/app/providers/AuthProvider";

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
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // 🎯 Live-syncing state variables
  const [unreadMessages, setUnreadMessages] = useState(0); 
  const [notificationCount, setNotificationCount] = useState(0);

  // 🛰️ 1. Real-time Inquiry Portal (Conversations/Chats) Listener
  useEffect(() => {
    if (!user?.uid) {
      setUnreadMessages(0);
      return;
    }

    const q = query(
      collection(db, "chats"),
      // Find threads where the current user has NOT read the latest message
      where("unreadBy", "array-contains", user.uid)
    );

const unsubscribe = onSnapshot(q, (snapshot) => {
      // The total unread threads is simply the snapshot size!
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
      }}
    >
      {/* LEFT: Location Selector */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px", flexShrink: 0 }}>
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
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = "#003d33";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = "#004d40";
          }}
        >
          <FiMapPin size={16} />
          <span>Costa Mesa, CA</span>
          <span style={{ fontSize: "10px", opacity: 0.7 }}>▼</span>
        </button>
      </div>

      {/* CENTER: Searchbar */}
      <div style={{ flex: 1, display: "flex", justifyContent: "center", padding: "0 40px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "#f3f4f6",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            padding: "8px 12px",
            width: "100%",
            maxWidth: "450px",
          }}
        >
          <FiSearch size={18} color="#9ca3af" />
          <input
            type="text"
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
      </div>

      {/* RIGHT: Actions */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px", flexShrink: 0 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            borderRight: "1px solid #e5e7eb",
            paddingRight: "16px",
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
                filter: unreadMessages > 0 ? "drop-shadow(0 0 4px rgba(255, 77, 77, 0.4))" : "none",
                transition: "all 0.3s ease"
              }}
              onClick={() => router.push("/market/inbox")}
              title="Inquiry Portal"
            />
            {unreadMessages > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "-6px",
                  right: "-6px",
                  backgroundColor: "#ff4d4d",
                  color: "#fff",
                  borderRadius: "50%",
                  fontSize: "9px",
                  width: "14px",
                  height: "14px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "bold",
                  border: "1.5px solid #fff",
                }}
              >
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
                      <span
                        style={{
                          position: "absolute",
                          top: "-6px",
                          right: "-6px",
                          backgroundColor: "#004d40",
                          color: "#fff",
                          borderRadius: "50%",
                          fontSize: "9px",
                          width: "14px",
                          height: "14px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: "bold",
                          border: "1.5px solid #fff",
                        }}
                      >
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
          
          {/* 🔔 SYSTEM NOTIFICATIONS (The Bell) */}
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
              <span
                style={{
                  position: "absolute",
                  top: "-4px",
                  right: "-6px",
                  backgroundColor: "#ff4d4d", 
                  color: "#fff",
                  borderRadius: "50%",
                  fontSize: "10px",
                  width: "14px",
                  height: "14px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "bold",
                  border: "1.5px solid #fff",
                }}
              >
                {notificationCount}
              </span>
            )}
          </div>
        </div>

        {/* --- BUTTONS --- */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Link
            href="/market/create"
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
            <FiPlus size={16} strokeWidth={4} />
            <span>LIST TO BID</span>
          </Link>

          <button
            onClick={async () => {
              if (typeof window.ethereum !== "undefined") {
                try {
                  const accounts = await window.ethereum.request({
                    method: "eth_requestAccounts",
                  });
                  console.log("Wallet connected:", accounts[0]);
                } catch (error) {
                  console.error("Failed to connect wallet:", error);
                }
              } else {
                alert("Please install MetaMask or another Web3 wallet provider.");
              }
            }}
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
        </div>
      </div>
    </div>
  );
}
