"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DedicatedSupportBridge() {
  const router = useRouter();

  useEffect(() => {
    // 🤖 1. Try to open the master chat sidebar if it's attached globally
    if (typeof window !== "undefined") {
      if ((window as any).openSidebarChat) {
        (window as any).openSidebarChat();
      } else {
        // Fallback: If layout hasn't mounted it, flag session storage to wake it up
        sessionStorage.setItem("open_ai_chat_on_load", "true");
      }
    }
    
    // 🔄 2. Gently bounce them back to the market view so they have a beautiful backdrop for their chat
    router.replace("/market");
  }, [router]);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#022122", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif" }}>
      <div style={{ textAlign: "center" }}>
        <p style={{ color: "#FFBF00", fontSize: "11px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "3px" }}>
          Initializing Secure Subsystem...
        </p>
        <h2 style={{ color: "#ffffff", fontSize: "20px", fontWeight: 900, marginTop: "8px" }}>
          CONNECTING TO AI SUPPORT CONCIERGE
        </h2>
      </div>
    </div>
  );
}
