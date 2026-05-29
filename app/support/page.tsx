"use client";

import React, { useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      console.log("📡 Flagging cross-route support activation keys...");
      
      // 1️⃣ Plant the persistent session flag that the drawer checks on path load
      sessionStorage.setItem("force_open_support_triage", "true");

      // 2️⃣ Dispatch the global event signal instantly 
      const event = new CustomEvent("open-ai-concierge", { 
        detail: { mode: "support" } 
      });
      window.dispatchEvent(event);
    }
    
    // 3️⃣ Immediately route the customer onto the marketplace frame where the drawer is hosted
    // This removes the "stuck on message" issue and restores your homepage button behavior!
    router.replace("/market");
  }, [router]);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#05292e" }} />
  );
}
