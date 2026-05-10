"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase/client"; 
import { onAuthStateChanged, User } from "firebase/auth";

// 🎯 Add these specific functions here:
import { collection, query, where, onSnapshot } from "firebase/firestore"; 

import { 
  FaStore, FaGift, FaWallet, FaPlusCircle, 
  FaUserShield, FaCog, FaEnvelope, FaBell, FaLifeRing 
} from "react-icons/fa";

// Replaced "Auctions" with a "Create Storefront" menu item
const menuData = [
  { name: "Marketplace", href: "/market", icon: FaStore },
  { name: "Rewards", href: "/rewards", icon: FaGift },
  { name: "Vault", href: "/account/vault", icon: FaWallet },
  { name: "Storefront", href: "/storefront/test-store", icon: FaStore },
  { name: "Create Storefront", href: "/market/create/onboarding", icon: FaPlusCircle },
  { name: "Admin", href: "/admin", icon: FaUserShield },
  { name: "Settings", href: "/settings", icon: FaCog },
  { name: "Messages", href: "/market/inbox", icon: FaEnvelope },
  { name: "Notifications", href: "/notifications", icon: FaBell },
  { name: "Support", href: "#", icon: FaLifeRing }, // 🔄 Pointed to "#" since we intercept this click
];

export default function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [user, setUser] = useState<User | null>(null);
  
  // 🎯 1. STATE FOR MESSAGES (Inquiry Portal)
  const [unreadCount, setUnreadCount] = useState(0);

  // 🔔 2. STATE FOR SYSTEM NOTIFICATIONS (The Bell)
  const [notificationCount, setNotificationCount] = useState(0);

  // 🛡️ AUTH LISTENER (Only need this once!)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      setUser(authUser);
    });
    return () => unsubscribe();
  }, []);

  // 🛰️ LISTENER 1: Upgraded Inquiry Portal (Chats)
  useEffect(() => {
    if (!user?.uid) {
      setUnreadCount(0);
      return;
    }

    // 🔒 Listen to our new "chats" collection matching TopNav
    const q = query(
      collection(db, "chats"),
      where("unreadBy", "array-contains", user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      // The total unread threads is simply the snapshot size
      setUnreadCount(snapshot.size);
    }, (error) => {
      console.error("Sidebar: Error streaming chats:", error);
    });

    return () => unsubscribe();
  }, [user?.uid]);

  // 🔔 LISTENER 2: System Notifications (Bell)
  useEffect(() => {
    if (!user?.uid) {
      setNotificationCount(0);
      return;
    }

    // We keep this active query listening to unread user-level notifications
    const q = query(
      collection(db, "notifications"),
      where("userId", "==", user.uid),
      where("read", "==", false)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setNotificationCount(snapshot.size);
    }, (error) => {
      console.error("Sidebar: Error streaming notifications:", error);
    });

    return () => unsubscribe();
  }, [user?.uid]);

  const dynamicItems = menuData.map(item => {
    if (item.name === "Storefront") {
      return { 
        ...item, 
        href: user ? `/storefront/${user.uid}` : "/market" 
      };
    }
    return item;
  });

  // 🛎️ Intercept Click Handler
  const handleItemClick = (e: React.MouseEvent, itemName: string) => {
    if (itemName === "Support") {
      e.preventDefault(); // Stop page routing / 404
      
      // Dispatch a global custom event that the AI Concierge Drawer is listening for!
      const event = new CustomEvent("open-ai-concierge", { 
        detail: { mode: "support" } // Pass "support" mode context so it can adapt!
      });
      window.dispatchEvent(event);
      
      if (onClose) onClose(); // Close mobile sidebar overlay if open
    }
  };

  return (
    <aside 
      style={{ 
        height: '100vh', 
        display: 'flex', 
        flexDirection: 'column',
        width: '280px',
        backgroundColor: '#05292e',
        overflowY: 'auto'
      }}
    >
      {/* Primary Logo Only */}
      <div style={{ padding: '44px 28px 24px 28px' }}>
        <span style={{ color: 'white', fontSize: '32px', fontWeight: '900', letterSpacing: '-1.5px' }}>
          BAZARIA
        </span>
        <div style={{ width: '140px', height: '4px', background: 'linear-gradient(90deg, #FFBF00 0%, #E5A100 100%)', marginTop: '12px' }}></div>
        <span style={{ color: '#FFBF00', fontSize: '10px', letterSpacing: '3.5px', marginTop: '14px', display: 'block' }}>
          A LIVING ECONOMY
        </span>
      </div>

      {/* Menu Area */}
      <nav style={{ flex: 1, paddingBottom: '24px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {dynamicItems.map((item) => {
          const Icon = item.icon;
          
          // 🎯 1. Define alerts for both types
          const isMessages = item.name === "Messages" || item.name === "Inquiry Portal";
          const isNotifications = item.name === "Notifications";

          // 🚨 2. The Logic Switch
          const hasUnread = (isMessages && unreadCount > 0) || (isNotifications && notificationCount > 0);
          
          // Determine which number to show
          const displayCount = isMessages ? unreadCount : notificationCount;

          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={(e) => handleItemClick(e, item.name)}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                padding: '12px 28px', 
                color: hasUnread ? '#ffffff' : 'rgba(255, 255, 255, 0.7)', 
                textDecoration: 'none',
                transition: 'all 0.2s ease-in-out'
              }}
              onMouseOver={(e) => { e.currentTarget.style.color = '#ffffff'; }}
              onMouseOut={(e) => { 
                if (!hasUnread) e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)'; 
              }}
            >
              <Icon style={{ 
                marginRight: '16px', 
                fontSize: '18px',
                color: hasUnread ? '#ff4d4d' : 'inherit', // 🔴 UNIVERSAL RED
                filter: hasUnread ? 'drop-shadow(0 0 4px rgba(255, 77, 77, 0.5))' : 'none',
                transition: 'all 0.3s ease'
              }} />
              
              <span style={{ 
                fontWeight: hasUnread ? '900' : 'normal',
                letterSpacing: hasUnread ? '0.2px' : 'normal'
              }}>
                {item.name}
                
                {/* 🔢 Dynamic Number Badge */}
                {hasUnread && (
                  <span style={{ 
                    marginLeft: '10px', 
                    fontSize: '11px', 
                    color: '#ff4d4d', 
                    fontWeight: '900'
                  }}>
                    ({displayCount})
                  </span>
                )}
              </span>
            </Link>
          );
        })}
      </nav>
      {/* Footer */}
      <div style={{ padding: '16px', borderTop: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
        <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>Protocol v1.0.0</p>
      </div>
    </aside>
  );
}
