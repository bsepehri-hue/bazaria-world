"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase/client"; 
import { onAuthStateChanged, User } from "firebase/auth";
import { useRouter } from "next/navigation"; 

import { collection, query, where, doc, getDoc, onSnapshot } from "firebase/firestore"; 

import { 
  FaStore, 
  FaPlusCircle, 
  FaMapSigns, 
  FaSlidersH, 
  FaUserTie,  
  FaWallet, 
  FaUserShield, 
  FaEnvelope, 
  FaBell, 
  FaLifeRing,
  FaUserCircle // 👤 Added for the human head icon
} from "react-icons/fa";

// 🌐 THE RECONFIGURED BAZARIA CORE SIDEBAR NAVIGATION
const menuData = [
  { name: "Marketplace", href: "/market", icon: FaStore },
  { name: "Storefront", href: "/storefront/test-store", icon: FaStore }, 
  { name: "Create Storefront", href: "/market/create/onboarding", icon: FaPlusCircle },
  { name: "Storefront Directory", href: "/market/directory", icon: FaMapSigns }, 
  
  // 📅 THE AGENT DOUBLE-BARREL GATEWAY
  { name: "Agent Portal", href: "/rewards", icon: FaSlidersH }, 
  { name: "Agents Registry", href: "https://app.bazaria.world/register/agent", icon: FaUserTie }, 
  
  { name: "Vault", href: "/account/vault", icon: FaWallet },
  { name: "Admin", href: "/admin", icon: FaUserShield },
  { name: "Messages", href: "/market/inbox", icon: FaEnvelope },
  { name: "Notifications", href: "/notifications", icon: FaBell },
  { name: "Support", href: "#", icon: FaLifeRing }, 
];

export default function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [user, setUser] = useState<User | null>(null);
  const [merchantHandle, setMerchantHandle] = useState<string | null>(null); 
  const router = useRouter(); 
  
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationCount, setNotificationCount] = useState(0);

  // 🛡️ AUTH & IDENTITY REGISTRY PROFILE LISTENER
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      setUser(authUser);
      
      if (authUser) {
        try {
          const storeRef = doc(db, "storefronts", authUser.uid);
          const storeSnap = await getDoc(storeRef);
          
          if (storeSnap.exists() && storeSnap.data().handle) {
            setMerchantHandle(storeSnap.data().handle);
          } else {
            setMerchantHandle(authUser.uid);
          }
        } catch (err) {
          console.error("Sidebar identity resolver caught exception:", err);
          setMerchantHandle(authUser.uid);
        }
      } else {
        setMerchantHandle(null);
      }
    });
    return () => unsubscribe();
  }, []);

  // 🛰️ LISTENER 1: Upgraded Inquiry Portal (Chats)
  useEffect(() => {
    if (!user?.uid) {
      setUnreadCount(0);
      return;
    }

    const q = query(
      collection(db, "chats"),
      where("unreadBy", "array-contains", user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
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
        href: user ? `/storefront/${merchantHandle || user.uid}` : "/market" 
      };
    }
    return item;
  });

  const handleItemClick = (e: React.MouseEvent, itemName: string, itemHref: string) => {
    if (itemName === "Support") {
      e.preventDefault(); 
      const event = new CustomEvent("open-ai-concierge", { 
        detail: { mode: "support" } 
      });
      window.dispatchEvent(event);
    }

    const isProtectedPath = ["Storefront", "Rewards", "Vault", "Create Storefront", "Admin"].includes(itemName);
    
    if (isProtectedPath && !user) {
      e.preventDefault(); 
      let loginRedirectTarget = itemHref;
      if (itemName === "Storefront") {
        loginRedirectTarget = "/storefront";
      }
      router.push(`/login?redirect=${encodeURIComponent(loginRedirectTarget)}`);
    }

    if (onClose) {
      onClose();
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
      <Link 
        href="https://bazaria.world" 
        style={{ textDecoration: 'none', display: 'block' }}
      >
        <div style={{ padding: '44px 28px 24px 28px', cursor: 'pointer' }}>
          <span style={{ color: 'white', fontSize: '32px', fontWeight: '900', letterSpacing: '-1.5px' }}>
            BAZARIA
          </span>
          <div style={{ width: '140px', height: '4px', background: 'linear-gradient(90deg, #FFBF00 0%, #E5A100 100%)', marginTop: '12px' }}></div>
          <span style={{ color: '#FFBF00', fontSize: '10px', letterSpacing: '3.5px', marginTop: '14px', display: 'block' }}>
            A LIVING ECONOMY
          </span>
        </div>
      </Link>

      {/* 👤 SECONDARY LOGIN/PROFILE BLOCK */}
      <div 
        onClick={() => {
          if (onClose) onClose();
          router.push(user ? '/admin' : '/login');
        }}
        style={{
          margin: '0 24px 16px 24px',
          padding: '12px 16px',
          backgroundColor: 'rgba(255, 255, 255, 0.08)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          cursor: 'pointer',
          transition: 'background-color 0.2s ease',
        }}
        onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)'}
        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)'}
      >
        {user?.photoURL ? (
          <img 
            src={user.photoURL} 
            alt="Profile" 
            style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} 
          />
        ) : (
          <FaUserCircle style={{ fontSize: '36px', color: '#FFBF00' }} />
        )}
        
        <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {user ? (
            <>
              <span style={{ color: 'white', fontSize: '14px', fontWeight: 'bold', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                {user.displayName || 'My Profile'}
              </span>
              <span style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '11px' }}>
                Go to Dashboard
              </span>
            </>
          ) : (
            <>
              <span style={{ color: 'white', fontSize: '14px', fontWeight: 'bold' }}>
                Sign In
              </span>
              <span style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '11px' }}>
                Access your store
              </span>
            </>
          )}
        </div>
      </div>

      {/* Menu Area */}
      <nav style={{ flex: 1, paddingBottom: '24px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {dynamicItems.map((item) => {
          const Icon = item.icon;
          
          const isMessages = item.name === "Messages" || item.name === "Inquiry Portal";
          const isNotifications = item.name === "Notifications";

          const hasUnread = (isMessages && unreadCount > 0) || (isNotifications && notificationCount > 0);
          
          const displayCount = isMessages ? unreadCount : notificationCount;

          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={(e) => handleItemClick(e, item.name, item.href)}
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
                color: hasUnread ? '#ff4d4d' : 'inherit', 
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
