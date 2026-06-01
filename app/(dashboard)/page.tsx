"use client";

import React, { Suspense } from "react";
import { useRouter } from "next/navigation";
import { Zap, Store, Gavel, Radio, ArrowRight } from "lucide-react";

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div style={{ backgroundColor: "#022329", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ fontSize: "10px", fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.5em", color: "#2dd4bf", animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite" }}>
          TUNING BAZARIA FREQUENCY...
        </p>
      </div>
    }>
      <BazariaHighEnergySplash />
    </Suspense>
  );
}

function BazariaHighEnergySplash() {
  const router = useRouter();

  return (
    <div style={{
      backgroundColor: "#022329",
      color: "#ffffff",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      padding: "32px",
      fontFamily: "sans-serif",
      position: "relative",
      overflow: "hidden"
    }}>
      
      {/* 🔮 INLINE CINEMATIC ANIMATION STYLES (Creates the digital video movement effect) */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes gridMove {
          0% { background-position: 0 0; }
          100% { background-position: 0 64px; }
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.15; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(1.1); }
        }
        .cyber-grid {
          position: absolute;
          inset: 0;
          background-image: 
            linear-gradient(to right, rgba(45, 212, 191, 0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(45, 212, 191, 0.03) 1px, transparent 1px);
          background-size: 64px 64px;
          mask-image: radial-gradient(circle at 50% 30%, #000 30%, transparent 70%);
          animation: gridMove 8s linear infinite;
          z-index: 0;
        }
        .ambient-glow {
          position: absolute;
          top: -20%;
          right: -10%;
          width: 60vw;
          height: 60vw;
          background: radial-gradient(circle, rgba(255,191,0,0.08) 0%, transparent 70%);
          border-radius: 50%;
          animation: pulseGlow 6s ease-in-out infinite;
          z-index: 0;
        }
        .badge-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: .5; } }
      `}} />

      {/* Dynamic Looping Cyber Grid Background */}
      <div className="cyber-grid" />
      <div className="ambient-glow" />

      {/* ─── TOP HEADER LAYER ─── */}
      <header style={{ width: "100%", maxWidth: "1200px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 10, position: "relative" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ display: "inline-block", width: "8px", height: "8px", backgroundColor: "#ef4444", borderRadius: "50%", animation: "pulse 1s infinite" }} />
          <span style={{ fontSize: "10px", fontWeight: "900", letterSpacing: "0.2em", color: "#2dd4bf", backgroundColor: "#031a1e", padding: "6px 12px", rounded: "6px", borderRadius: "6px", border: "1px solid #1e293b" }}>
            LIVE AUCTION GRIDS ACTIVE
          </span>
        </div>
        <span style={{ fontSize: "11px", fontWeight: "700", color: "#64748b", letterSpacing: "0.1em", fontFamily: "monospace" }}>POLYGON L2 ⚡</span>
      </header>

      {/* ─── MAIN HERO AREA ─── */}
      <main className="flex flex-col lg:flex-row" style={{ width: "100%", maxWidth: "1200px", margin: "auto", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "48px", zIndex: 10, padding: "40px 0", position: "relative" }}>
        
        {/* LEFT TEXT CONTAINER */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", textAlign: "left", maxWidth: "580px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "6px 14px", backgroundColor: "rgba(255,191,0,0.1)", color: "#FFBF00", borderRadius: "9999px", fontSize: "10px", fontWeight: "900", letterSpacing: "0.1em", marginBottom: "24px", border: "1px solid rgba(255,191,0,0.2)" }}>
            <Radio size={12} className="badge-pulse" /> THE LIVING ECONOMY HAS ARRIVED
          </div>
          
          {/* 🔥 STRIKING INSTANT HIT HEADLINE */}
          <h1 style={{ fontSize: "clamp(2.5rem, 5.5vw, 4.8rem)", fontWeight: "900", tracking: "-0.05em", letterSpacing: "-1px", lineHeight: "0.95", textTransform: "uppercase", margin: "0", color: "#ffffff" }}>
            BID FAST.<br />
            DROP FIRST.<br />
            <span style={{ color: "#FFBF00", textShadow: "0 0 30px rgba(255,191,0,0.3)" }}>
              THE LIVE BAZAR.
            </span>
          </h1>

          <div style={{ width: "120px", height: "4px", backgroundColor: "#2dd4bf", margin: "24px 0", borderRadius: "2px", boxShadow: "0 0 10px rgba(45,212,191,0.5)" }} />

          <p style={{ color: "#94a3b8", fontWeight: "500", fontSize: "16px", lineHeight: "1.6", margin: "0" }}>
            The raw alternative to corporate marketplaces. Launch instant digital storefronts, run interactive hammer actions, and stack native yield rewards instantly across the network loop.
          </p>

          {/* 🔥 MASTER CALL-TO-ACTION */}
          <button
            onClick={() => router.push("/market")}
            style={{
              marginTop: "32px", padding: "18px 38px", backgroundColor: "#FFBF00", color: "#020617", fontWeight: "900", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.15em", borderRadius: "14px", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "12px", boxShadow: "0 10px 30px rgba(255,191,0,0.35)", transition: "all 0.2s"
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.03)"}
            onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
          >
            Launch Marketplace ⚡
            <ArrowRight size={14} />
          </button>
        </div>

        {/* RIGHT VISUAL INTERACTIVE ENGINE */}
        <div style={{ position: "relative", display: "flex", justifyContent: "center", alignItems: "center", width: "100%", maxWidth: "440px" }}>
          
          {/* Ambient Outer Glow Behind Component Container */}
          <div style={{ position: "absolute", inset: "-20px", background: "radial-gradient(circle, rgba(45,212,191,0.15) 0%, transparent 70%)", borderRadius: "40px", pointerEvents: "none" }} />

          <div style={{ backgroundColor: "#031a1e", border: "2px solid #1e293b", padding: "32px", borderRadius: "28px", width: "100%", display: "flex", flexDirection: "column", gap: "24px", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.7)" }}>
            
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "9px", color: "#2dd4bf", fontFamily: "monospace", tracking: "0.1em" }}>SYS_PRTCL_ON //</span>
              <span className="badge-pulse" style={{ fontSize: "9px", color: "#ef4444", fontWeight: "900", fontFamily: "monospace" }}>● LIVE TRACK</span>
            </div>

            {/* THE AUCTION GAVEL CONTAINER */}
            <div style={{ height: "180px", backgroundColor: "#022329", border: "1px solid #1e293b", borderRadius: "20px", display: "flex", flexDirection: "column", alignItems: "center", justifyInbound: "center", justifyContent: "center", position: "relative" }}>
              <div style={{ width: "72px", height: "72px", backgroundColor: "rgba(255,191,0,0.08)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#FFBF00", border: "1px solid rgba(255,191,0,0.2)", boxShadow: "0 0 20px rgba(255,191,0,0.1)" }}>
                <Gavel size={28} style={{ transform: "rotate(-45deg)" }} />
              </div>
              <span style={{ fontSize: "10px", fontWeight: "900", color: "#FFBF00", letterSpacing: "0.2em", marginTop: "16px", fontFamily: "monospace" }}>
                REALTIME AUCTION HOOK
              </span>
            </div>

            {/* LIVE MARKETPLACE ROW PREVIEW */}
            <div style={{ backgroundColor: "#022329", border: "1px solid #1e293b", padding: "16px", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ padding: "10px", backgroundColor: "rgba(45,212,191,0.08)", color: "#2dd4bf", borderRadius: "10px", border: "1px solid rgba(45,212,191,0.15)" }}>
                  <Store size={18} />
                </div>
                <div style={{ textAlign: "left" }}>
                  <h4 style={{ margin: 0, fontSize: "13px", fontWeight: "900", textTransform: "uppercase", tracking: "0.05em" }}>Alpha Storefront</h4>
                  <p style={{ margin: 0, fontSize: "11px", color: "#64748b" }}>Room #0921 Connected</p>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <span style={{ fontSize: "11px", fontWeight: "900", backgroundColor: "rgba(45,212,191,0.1)", color: "#2dd4bf", padding: "4px 8px", borderRadius: "6px", fontFamily: "monospace", border: "1px solid rgba(45,212,191,0.2)" }}>
                  12.5 MATIC
                </span>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* ─── FOOTER HIGHLIGHTS GRID ─── */}
      <footer style={{ width: "100%", maxWidth: "1200px", margin: "0 auto", paddingTo: "24px", borderTop: "1px solid #1e293b", zIndex: 10, position: "relative" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "32px", textAlign: "left", paddingTop: "24px" }}>
          
          <div>
            <h4 style={{ margin: "0 0 6px 0", fontSize: "13px", fontWeight: "900", textTransform: "uppercase", color: "#2dd4bf", tracking: "0.05em" }}>⚡ Live Hammer Bids</h4>
            <p style={{ margin: 0, fontSize: "12px", color: "#94a3b8", lineHeight: "1.5" }}>Real-time web socket loops stream high-speed bidding metrics directly to your terminal window layout.</p>
          </div>

          <div>
            <h4 style={{ margin: "0 0 6px 0", fontSize: "13px", fontWeight: "900", textTransform: "uppercase", color: "#FFBF00", tracking: "0.05em" }}>🏬 Curated Storefronts</h4>
            <p style={{ margin: 0, fontSize: "12px", color: "#94a3b8", lineHeight: "1.5" }}>Launch custom decentralized spaces, configure custom permissions, and control asset drop streams natively.</p>
          </div>

          <div>
            <h4 style={{ margin: "0 0 6px 0", fontSize: "13px", fontWeight: "900", textTransform: "uppercase", color: "#2dd4bf", tracking: "0.05em" }}>💰 Node Yield Ecosystem</h4>
            <p style={{ margin: 0, fontSize: "12px", color: "#94a3b8", lineHeight: "1.5" }}>Sync device notifications silently in the background to access direct node validation reward allocations.</p>
          </div>

        </div>
      </footer>

    </div>
  );
}
