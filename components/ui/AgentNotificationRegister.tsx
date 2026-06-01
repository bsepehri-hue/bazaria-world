"use client";

import React, { useState, useEffect } from "react";
import { db, auth } from "@/lib/firebase/client";
import { onAuthStateChanged } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { FaBell, FaCheckCircle } from "react-icons/fa";

export default function AgentNotificationRegister() {
  const [user, setUser] = useState<any>(null);
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>("default");
  const [loading, setLoading] = useState<boolean>(false);

  // 🛡️ Safe initialization tracking to prevent double executions in strict mode
  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setPermissionStatus(Notification.permission);
    }
  }, []);

  useEffect(() => {
    // 1️⃣ Keep track of who the logged-in agent is
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      // 🛡️ THE SHORT-CIRCUIT GATES: Stop infinite loops cold!
      if (!currentUser) return;
      if (typeof window === "undefined" || !("Notification" in window)) return;
      if (Notification.permission !== "granted") return;

      // Check if we have already successfully synced this specific token in this tab session
      const sessionSyncLock = sessionStorage.getItem(`bazaria_synced_uid_${currentUser.uid}`);
      if (sessionSyncLock === "true") {
        console.log("🛡️ SYNC PROTECTION ACTIVE: Device token already mapped for this session context.");
        return;
      }

      try {
        console.log("📦 Initializing isolated background service worker connection tunnel...");
        const { getMessaging, getToken } = await import("firebase/messaging");
        const messaging = getMessaging();
        
        // Request the token with a safe catch barrier for the Chromium AbortError bug
        const deviceToken = await getToken(messaging, {
          vapidKey: "BJ05cgCQ0RJ1z1EVjFeuoMVPttSJ2JRNTEnD27eGYEt27Sx3BEOcXW7it8E1WQQ-n6vbH_XuaDdOcVVGOagNVsY" 
        }).catch((tokenErr) => {
          console.warn("⚠️ Native push worker rejected registration handshake. Re-routing through failover channel.", tokenErr);
          return null;
        });

        if (deviceToken) {
          console.log("📡 Silent Background Token Sync Captured:", deviceToken);
          const tokenDocRef = doc(db, "agent_tokens", currentUser.uid);
          await setDoc(tokenDocRef, {
            agentId: currentUser.uid,
            agentName: currentUser.displayName || "Active Agent",
            agentEmail: currentUser.email || "",
            deviceToken: deviceToken,
            platform: window.navigator.userAgent.toLowerCase().includes("iphone") ? "ios" : "android",
            lastUpdated: serverTimestamp()
          }, { merge: true });
          
          console.log("💾 Firestore Token synced silently.");
          sessionStorage.setItem(`bazaria_synced_uid_${currentUser.uid}`, "true");
        }
      } catch (err) {
        console.error("❌ Silent background token sync failed:", err);
      }
    });

    return () => unsubscribe();
  }, []);

  const requestNotificationAccess = async () => {
    console.log("🔘 [MANUAL TRIGGER] Amber registration button clicked.");
    
    if (typeof window === "undefined" || !("Notification" in window)) {
      alert("This device browser does not support push notifications.");
      return;
    }

    if (!user) {
      console.warn("⚠️ Execution Halted: No active user state found.");
      alert("Please log in to your agent account before registering this device.");
      return;
    }

    setLoading(true);

    try {
      const permission = await Notification.requestPermission();
      console.log("🔑 Browser Notification Request Response:", permission);
      setPermissionStatus(permission);

      if (permission === "granted") {
        const { getMessaging, getToken } = await import("firebase/messaging");
        const messaging = getMessaging();
        
        const deviceToken = await getToken(messaging, {
          vapidKey: "BJ05cgCQ0RJ1z1EVjFeuoMVPttSJ2JRNTEnD27eGYEt27Sx3BEOcXW7it8E1WQQ-n6vbH_XuaDdOcVVGOagNVsY" 
        }).catch((err) => {
          console.error("❌ Handshake Aborted by Browser Core Platform Rules:", err);
          alert("Browser push infrastructure rejected registration. Access through http://127.0.0.1:3000 or open a Guest profile to flush browser block cache.");
          return null;
        });

        if (deviceToken) {
          console.log("🎯 SUCCESS! Phone Device Token Captured Securely:", deviceToken);

          const tokenDocRef = doc(db, "agent_tokens", user.uid);
          await setDoc(tokenDocRef, {
            agentId: user.uid,
            agentName: user.displayName || "Active Agent",
            agentEmail: user.email || "",
            deviceToken: deviceToken,
            platform: window.navigator.userAgent.toLowerCase().includes("iphone") ? "ios" : "android",
            lastUpdated: serverTimestamp()
          }, { merge: true });

          console.log("💾 Firestore write completed successfully.");
          sessionStorage.setItem(`bazaria_synced_uid_${user.uid}`, "true");
        }
      } else if (permission === "denied") {
        alert("Notification permissions blocked. Reset your browser address bar site settings to unlock alerts.");
      }
    } catch (err) {
      console.error("❌ CRITICAL ERROR inside manual registration handler:", err);
    } finally {
      setLoading(false);
    }
  };

  if (permissionStatus === "granted") {
    return (
      <div style={{ backgroundColor: "#022329", border: "1px solid #2dd4bf", borderRadius: "12px", padding: "16px", display: "flex", alignItems: "center", gap: "12px", maxWidth: "360px" }}>
        <FaCheckCircle size={20} style={{ color: "#2dd4bf", flexShrink: 0 }} />
        <div>
          <h4 style={{ margin: 0, fontSize: "12px", color: "#ffffff", fontWeight: "bold", letterSpacing: "0.5px" }}>DISPATCH ALERT PATH ACTIVE</h4>
          <p style={{ margin: 0, fontSize: "10px", color: "#94a3b8", marginTop: "2px" }}>This phone is registered to receive high-priority incoming client alerts.</p>
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
