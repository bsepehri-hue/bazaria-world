TypeScript
"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SupportBridgePage() {
  const router = useRouter();

  useEffect(() => {
    // 🤖 Tell the browser to wake up the Sidebar Chat
    if (typeof window !== "undefined") {
      // If your sidebar has a global toggle, we trigger it here
      if ((window as any).openSidebarChat) {
        (window as any).openSidebarChat();
      } else {
        // Fallback: Set a flag so the main layout knows to open it
        sessionStorage.setItem("force_open_chat", "true");
      }
    }
    
    // 🚀 Smoothly transition them to the Market Registry after 1 second
    const timer = setTimeout(() => {
      router.replace("/market");
    }, 1200);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div style={{ 
      minHeight: "100vh", 
      backgroundColor: "#05292e", 
      display: "flex", 
      flexDirection: "column",
      alignItems: "center", 
      justifyContent: "center", 
      fontFamily: "sans-serif" 
    }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ 
          width: "40px", 
          height: "40px", 
          border: "3px solid #FFBF00", 
          borderTopColor: "transparent", 
          borderRadius: "50%", 
          animation: "spin 1s linear infinite",
          margin: "0 auto 20px"
        }} />
        <p style={{ color: "#FFBF00", fontSize: "10px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "4px" }}>
          Initializing Concierge
        </p>
        <h2 style={{ color: "#ffffff", fontSize: "18px", fontWeight: 900, marginTop: "10px", textTransform: "uppercase" }}>
          Connecting to Bazaria Support
        </h2>
      </div>

      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
