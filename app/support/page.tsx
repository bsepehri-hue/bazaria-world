"use client";

import React, { useEffect, Suspense } from "react";
import { FaMagic } from "react-icons/fa";

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

function SupportBridgeCore() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      console.log("📡 Initializing dedicated support link portal...");
      
      // 🎯 THE FORCE LOCK: Set the storage token so the drawer forces its layout rules open
      sessionStorage.setItem("force_open_support_triage", "true");

      // Dispatch the event trigger to wake up the panel layout frame instantly
      const event = new CustomEvent("open-ai-concierge", { 
        detail: { mode: "support" } 
      });
      window.dispatchEvent(event);
    }
  }, []);

  return (
    <div style={{ 
      minHeight: "85vh", 
      backgroundColor: "#f8fafc", 
      display: "flex", 
      flexDirection: "column",
      alignItems: "center", 
      justifyContent: "center", 
      fontFamily: "sans-serif",
      padding: "20px"
    }}>
      <div style={{ 
        textAlign: "center", 
        backgroundColor: "#ffffff", 
        padding: "40px 32px", 
        borderRadius: "24px",
        boxShadow: "0 10px 30px rgba(5, 41, 46, 0.04)",
        border: "1px solid #e2e8f0",
        maxWidth: "420px"
      }}>
        <div style={{ 
          backgroundColor: "#05292e",
          width: "56px",
          height: "56px",
          borderRadius: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 24px auto",
          boxShadow: "0 8px 20px rgba(5, 41, 46, 0.15)"
        }}>
          <FaMagic size={22} style={{ color: "#FFBF00" }} />
        </div>
        
        <p style={{ color: "#0d9488", fontSize: "10px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "3px", margin: "0 0 8px 0" }}>
          Secure Portal Active
        </p>
        
        <h2 style={{ color: "#05292e", fontSize: "22px", fontWeight: 900, margin: "0 0 12px 0", letterSpacing: "-0.5px" }}>
          Bazaria Support Desk
        </h2>
        
        <p style={{ color: "#64748b", fontSize: "13px", lineHeight: "1.6", margin: 0 }}>
          Your live agent communications channel has initialized. Please use the floating concierge panel on the right side of your viewport to route your inquiry.
        </p>
      </div>
    </div>
  );
}
