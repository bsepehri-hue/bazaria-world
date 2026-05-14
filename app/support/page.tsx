"use client";

import React, { useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";

// 🛡️ 1. MASTER GATEWAY: Wraps the logic in a Suspense Shield to completely satisfy Webpack server pre-rendering
export default function SupportBridgePage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: "100vh", backgroundColor: "#05292e", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif" }}>
        <p style={{ color: "#FFBF00", fontSize: "10px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "4px" }}>
          Synchronizing Security Matrix...
        </p>
      </div>
    }>
      <SupportBridgeCore />
    </Suspense>
  );
}

// ⚙️ 2. ACTIVE ROUTER ROUTINE
function SupportBridgeCore() {
  const router = useRouter();

  useEffect(() => {
    // 🤖 Instruct the client machine to flag and wake up the floating AI Sidebar Chat
    if (typeof window !== "undefined") {
      // 1. Dispatch your Sidebar's native event straight into the DOM window on load
      const event = new CustomEvent("open-ai-concierge", { 
        detail: { mode: "support" } 
      });
      window.dispatchEvent(event);

      // 2. Secondary fallback flag just in case the sidebar component mounts slightly later than the page load
      sessionStorage.setItem("force_open_chat", "true");
    }
    
    // 🚀 Gracefully bounce the user onto the main live Market Registry layout frame after a brief initialization window
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
          animation: "bazaria-spin 1s linear infinite",
          margin: "0 auto 20px"
        }} />
        <p style={{ color: "#FFBF00", fontSize: "10px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "4px", margin: 0 }}>
          Initializing Concierge
        </p>
        <h2 style={{ color: "#ffffff", fontSize: "18px", fontWeight: 900, marginTop: "10px", textTransform: "uppercase", letterSpacing: "-0.5px" }}>
          Connecting to Bazaria Support
        </h2>
      </div>

      {/* Inline Keyframe Injector to prevent build system CSS compiling dependencies */}
      <style>{`
        @keyframes bazaria-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
