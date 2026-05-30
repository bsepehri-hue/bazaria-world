"use client";

import React, { useState, useEffect } from "react";
import { db, auth } from "@/lib/firebase/client";
import { onAuthStateChanged } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { FaBell, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";

export default function AgentNotificationRegister() {
  const [user, setUser] = useState<any>(null);
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>("default");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    // 1️⃣ Keep track of who the logged-in agent is
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    // 2️⃣ Check if the browser already has notification permissions set
    if (typeof window !== "undefined" && "Notification" in window) {
      setPermissionStatus(Notification.permission);
    }

    return () => unsubscribe();
  }, []);

  const requestNotificationAccess = async () => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      alert("This device browser does not support push notifications.");
      return;
    }

    if (!user) {
      alert("Please log in to your agent account before registering this device.");
      return;
    }

    setLoading(true);

    try {
      // Ask the phone browser for lock screen push permissions
      const permission = await Notification.requestPermission();
      setPermissionStatus(permission);

      if (permission === "granted") {
        // Dynamic lazy import ensures Firebase messaging configurations don't crash standard server builds
        const { getMessaging, getToken } = await import("firebase/messaging");
        
        /* 🚨 IMPORTANT NOTE FOR LATER: You will grab your actual Firebase messaging token configuration sender key 
           from your Firebase console settings layout. For now, we call the standard default environment configuration hook */
        const messaging = getMessaging();
        
        // Request the phone's unique cryptographic address token
        const deviceToken = await getToken(messaging, {
          vapidKey: "xZXG8du9m2pziwWO-rcpZD8dCGtqO10gURYKKKjxZvQ" 
        });

        if (deviceToken) {
          console.log("📡 Phone Device Token Captured Securely:", deviceToken);

          // 💾 Save this phone address straight into your Firestore database
          const tokenDocRef = doc(db, "agent_tokens", user.uid);
          await setDoc(tokenDocRef, {
            agentId: user.uid,
            agentName: user.displayName || "Active Agent",
            agentEmail: user.email || "",
            deviceToken: deviceToken,
            platform: window.navigator.userAgent.toLowerCase().includes("iphone") ? "ios" : "android",
            lastUpdated: serverTimestamp()
          }, { merge: true });

          console.log("💾 Device address mapped into agent_tokens collection safely.");
        } else {
          console.warn("⚠️ No address token retrieved. Check background configurations.");
        }
      } else if (permission === "denied") {
        alert("Notification permissions blocked. Please reset your site browser settings to unlock lock screen alerts.");
      }
    } catch (err) {
      console.error("❌ Failed to secure device address code registry maps:", err);
    } finally {
      setLoading(false);
    }
  };

  // If the device has already successfully granted permission and is linked, show a clean indicator card
  if (permissionStatus === "granted") {
    return (
      <div style={{ backgroundColor: "#022329", border: "1px solid #2dd4bf", borderRadius: "12px", padding: "16px", display: "flex", alignItems: "center", gap: "12px", maxWidth: "360px" }}>
        <FaCheckCircle size={20} style={{ color: "#2dd4bf", flexShrink: 0 }} />
        <div>
          <h4 style={{ margin: 0, fontSize: "12px", color: "#ffffff", fontWeight: "bold", letterSpacing: "0.5px" }}>DISPATCH ALERT PATH ACTIVE</h4>
          <p style={{ margin: 0, fontSize: "10px", color: "#94a3b8", marginTop: "2px" }}>This phone is registered to receive high-priority "Uber-style" incoming client alerts.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "#022329", border: "2px solid #FFBF00", borderRadius: "16px", padding: "20px", color: "#ffffff", maxWidth: "360px", display: "flex", flexDirection: "column", gap: "12px", boxShadow: "0 10px 25px rgba(0,0,0,0.2)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <FaBell size={18} style={{ color: "#FFBF00" }} />
        <h4 style={{ margin: 0, fontSize: "13px", fontWeight: 900, letterSpacing: "0.5px" }}>LOCK SCREEN DISPATCHES</h4>
      </div>
      
      <p style={{ margin: 0, fontSize: "11px", color: "#94a3b8", lineHeight: "1.4" }}>
        To turn on immediate lock screen vibration and popup text banners when a client broadcasts a lead, register this cell phone device.
      </p>

      <button
        type="button"
        onClick={requestNotificationAccess}
        disabled={loading}
        style={{
          width: "100%", padding: "10px 14px", borderRadius: "8px", fontSize: "11px", fontWeight: "bold",
          backgroundColor: "#FFBF00", color: "#020617", border: "none", cursor: loading ? "not-allowed" : "pointer",
          display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", transition: "transform 0.1s"
        }}
        onMouseOver={(e) => !loading && (e.currentTarget.style.transform = "scale(1.02)")}
        onMouseOut={(e) => !loading && (e.currentTarget.style.transform = "scale(1)")}
      >
        {loading ? "Registering Device Address..." : "Enable Mobile Live Dispatches 📡"}
      </button>
    </div>
  );
}
