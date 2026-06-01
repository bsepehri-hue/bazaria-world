"use client";

import React, { Suspense } from "react";
import { useRouter } from "next/navigation";
import { Radio, ArrowRight, Globe, Coins, Truck } from "lucide-react";

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div style={{ backgroundColor: "#01161a", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ fontSize: "10px", fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.5em", color: "#2dd4bf", animation: "pulse 2s infinite" }}>
          INITIALIZING SECURE TERMINAL...
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
      background: "radial-gradient(circle at 50% 40%, #043836 0%, #01191c 65%, #011114 100%)",
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
      
      {/* 🔮 CINEMATIC LIVE MATRIX BACKGROUND EFFECT */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes gridMove {
          0% { background-position: 0 0; }
          100% { background-position: 0 40px; }
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.08); }
        }
        .cyber-grid {
          position: absolute;
          inset: 0;
          background-image: 
            linear-gradient(to right, rgba(45, 212, 191, 0.02) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(45, 212, 191, 0.02) 1px, transparent 1px);
          background-size: 40px 40px;
          mask-image: radial-gradient(circle at 50% 40%, #000 30%, transparent 80%);
          animation: gridMove 12s linear infinite;
          z-index: 1;
        }
        .ambient-glow {
          position: absolute;
          top: -10%;
          left: 15%;
          width: 70vw;
          height: 70vw;
          background: radial-gradient(circle, rgba(255,191,0,0.05) 0%, transparent 70%);
          border-radius: 50%;
          animation: pulseGlow 9s ease-in-out infinite;
          z-index: 1;
        }
        .text-pulse { animation: pulse 2.5s ease-in-out infinite; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
      `}} />

      <div className="cyber-grid" />
      <div className="ambient-glow" />

      {/* ─── TOP STATUS HEADER ─── */}
      <header style={{ width: "100%", maxWidth: "1200px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 10, position: "relative" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ display: "inline-block", width: "6px", height: "6px", backgroundColor: "#2dd4bf", borderRadius: "50%", animation: "pulse 1.5s infinite" }} />
          <span style={{ fontSize: "10px", fontWeight: "900", letterSpacing: "0.2em", color: "#2dd4bf", fontFamily: "monospace" }}>
            THE UNDERDOG ECONOMY // INITIALIZED
          </span>
        </div>
        <span style={{ fontSize: "10px", fontWeight: "700", color: "#475569", letterSpacing: "0.1em", backgroundColor: "rgba(255,255,255,0.02)", padding: "4px 10px", borderRadius: "4px", border: "1px solid rgba(255,255,255,0.05)" }}>
          GLOBAL NETWORK ACTIVE
        </span>
      </header>

      {/* ─── MAIN HERO ZONE ─── */}
      <main className="flex flex-col lg:flex-row" style={{ width: "100%", maxWidth: "1200px", margin: "auto", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "64px", zIndex: 10, padding: "40px 0", position: "relative" }}>
        
        {/* LEFT CONTAINER: Manifesto & Value Proposition */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", textAlign: "left", maxWidth: "620px" }}>
          
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "6px 14px", backgroundColor: "rgba(255,191,0,0.1)", color: "#FFBF00", borderRadius: "9999px", fontSize: "10px", fontWeight: "900", letterSpacing: "0.15em", marginBottom: "28px", border: "1px solid rgba(255,191,0,0.2)" }}>
            <Radio size={12} className="text-pulse" /> WE BUILD FOR THE UNDERDOG
          </div>
          
          <h1 style={{ fontSize: "clamp(2.3rem, 5vw, 4.2rem)", fontWeight: "900", letterSpacing: "-1.5px", lineHeight: "1.0", textTransform: "uppercase", margin: "0", color: "#ffffff" }}>
            RUN YOUR BUSINESS.<br />
            SHIP WORLDWIDE.<br />
            <span style={{ color: "#FFBF00", textShadow: "0 0 40px rgba(255,191,0,0.35)" }}>
              EARN ON YOUR TERMS.
            </span>
          </h1>

          <div style={{ width: "80px", height: "4px", backgroundColor: "#2dd4bf", margin: "24px 0", borderRadius: "2px", boxShadow: "0 0 15px rgba(45,212,191,0.5)" }} />

          <p style={{ color: "#cbd5e1", fontWeight: "500", fontSize: "16px", lineHeight: "1.6", margin: "0", maxWidth: "540px" }}>
            The world doesn’t need another predatory marketplace. It needs one built on fairness. Bazaria exists for the people who do the real work—the stay-at-home moms, the students, the creators, and the stewards. We built a system where you keep more of what you earn, handle everything directly from your phone, and build real income helping others succeed.
          </p>

          <button
            onClick={() => router.push("/market")}
            style={{
              marginTop: "36px", padding: "20px 42px", backgroundColor: "#FFBF00", color: "#020617", fontWeight: "900", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.2em", borderRadius: "16px", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "12px", boxShadow: "0 12px 35px rgba(255,191,0,0.4)", transition: "transform 0.2s"
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.04)"}
            onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
          >
            Launch Your Storefront ⚡
            <ArrowRight size={14} />
          </button>
        </div>

        {/* RIGHT CONTAINER: Adjusted for Maximum Vertical Real Estate */}
        <div style={{ position: "relative", display: "flex", justifyContent: "center", alignItems: "center", width: "100%", maxWidth: "520px", flexGrow: 1 }}>
          
          {/* Cyan backing glow */}
          <div style={{ position: "absolute", inset: "-15px", background: "radial-gradient(circle, rgba(45,212,191,0.22) 0%, transparent 75%)", borderRadius: "32px", pointerEvents: "none" }} />

          <div style={{ 
            backgroundColor: "#01161a", 
            border: "2px solid #1e293b", 
            padding: "12px", 
            borderRadius: "28px", 
            width: "100%", 
            boxShadow: "0 30px 60px -15px rgba(0,0,0,0.9)", 
            backdropFilter: "blur(10px)",
            position: "relative",
            overflow: "hidden"
          }}>
            {/* 📸 EXPANDED HEIGHT FRAME: Changed from 320px to 540px to balance the large text layout */}
            <img 
              public="/assets/side-hustle.png" 
              alt="Bazaria Independent Business Dashboard Setup"
              style={{
                width: "100%",
                height: "540px",
                objectFit: "cover",
                borderRadius: "20px",
                opacity: "0.85",
                display: "block"
              }}
            />
            
            {/* Overlay Protocol Info Tag */}
            <div style={{
              position: "absolute",
              bottom: "24px",
              left: "24px",
              right: "24px",
              backgroundColor: "rgba(1, 22, 26, 0.85)",
              border: "1px solid rgba(45, 212, 191, 0.3)",
              padding: "12px 16px",
              borderRadius: "14px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              backdropFilter: "blur(6px)"
            }}>
              <div style={{ textAlign: "left" }}>
                <p style={{ margin: 0, fontSize: "11px", fontWeight: "900", textTransform: "uppercase", tracking: "0.05em", color: "#ffffff" }}>Steward Node Active</p>
                <p style={{ margin: 0, fontSize: "9px", color: "#64748b", fontFamily: "monospace", marginTop: "1px" }}>GLOBAL DISPATCH ID: #0412</p>
              </div>
              <span className="text-pulse" style={{ fontSize: "10px", fontWeight: "900", color: "#2dd4bf", fontFamily: "monospace" }}>● PROCESSING</span>
            </div>

          </div>
        </div>
      </main>

      {/* ─── FOOTER VALUE PILLS ─── */}
      <footer style={{ width: "100%", maxWidth: "1200px", margin: "0 auto", borderTop: "1px solid #1e293b", zIndex: 10, position: "relative" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "32px", textAlign: "left", paddingTop: "24px" }}>
          
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#2dd4bf", marginBottom: "6px" }}>
              <Globe size={16} />
              <h4 style={{ margin: 0, fontSize: "13px", fontWeight: "900", textTransform: "uppercase" }}>Maximum Flexibility</h4>
            </div>
            <p style={{ margin: 0, fontSize: "12px", color: "#94a3b8", lineHeight: "1.5" }}>No tracking bosses, no set shift hours, and zero inventory pressure. Open your digital doors when it fits your day, and run everything from a smartphone window.</p>
          </div>

          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#FFBF00", marginBottom: "6px" }}>
              <Coins size={16} />
              <h4 style={{ margin: 0, fontSize: "13px", fontWeight: "900", textTransform: "uppercase" }}>The Steward Agent Program</h4>
            </div>
            <p style={{ margin: 0, fontSize: "12px", color: "#94a3b8", lineHeight: "1.5" }}>We built an economy where effort is rewarded. Build consistent supplementary income by connecting shoppers and supporting verified merchants in your community.</p>
          </div>

          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#2dd4bf", marginBottom: "6px" }}>
              <Truck size={16} />
              <h4 style={{ margin: 0, fontSize: "13px", fontWeight: "900", textTransform: "uppercase" }}>Fair, Shared Value</h4>
            </div>
            <p style={{ margin: 0, fontSize: "12px", color: "#94a3b8", lineHeight: "1.5" }}>We reject predatory models where the giants take the credit. Every listing, referral, and secure trade transaction keeps value distributed right where it belongs.</p>
          </div>

        </div>
      </footer>

    </div>
  );
}
