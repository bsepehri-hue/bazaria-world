"use client";

import React, { Suspense } from "react";
import { useRouter } from "next/navigation";
import { Radio, ArrowRight, Globe, Coins, Truck, ShoppingBag, Bot, ShieldAlert } from "lucide-react";
import AgentNotificationRegister from "@/components/ui/AgentNotificationRegister";

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div style={{ backgroundColor: "#011714", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
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
      // 🎯 THEMATIC EMERALD GREEN RADIAL GRADIENT OVERHAUL
      background: "radial-gradient(circle at 50% 40%, #022c22 0%, #011714 65%, #010f0d 100%)",
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
          background: radial-gradient(circle, rgba(255,191,0,0.04) 0%, transparent 70%);
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
            BAZARIA WORLD // A LIVING ECONOMY
          </span>
        </div>
        <span style={{ fontSize: "10px", fontWeight: "700", color: "#475569", letterSpacing: "0.1em", backgroundColor: "rgba(255,255,255,0.02)", padding: "4px 10px", borderRadius: "4px", border: "1px solid rgba(255,255,255,0.05)" }}>
          GLOBAL CRYPTO NETWORK ACTIVE
        </span>
      </header>

      {/* ─── MAIN HERO ZONE ─── */}
      <main className="flex flex-col lg:flex-row" style={{ width: "100%", maxWidth: "1200px", margin: "auto", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "48px", zIndex: 10, padding: "60px 0", position: "relative" }}>
        
        {/* LEFT CONTAINER: Manifesto & Value Proposition */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", textAlign: "left", flex: "1", maxWidth: "680px" }}>
          
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "6px 14px", backgroundColor: "rgba(255,191,0,0.1)", color: "#FFBF00", borderRadius: "9999px", fontSize: "10px", fontWeight: "900", letterSpacing: "0.15em", marginBottom: "24px", border: "1px solid rgba(255,191,0,0.2)" }}>
            <Radio size={12} className="text-pulse" /> FREE LISTING MARKETPLACE PROTOCOL
          </div>
          
          <h1 style={{ fontSize: "clamp(2rem, 4.5vw, 3.8rem)", fontWeight: "900", letterSpacing: "-1.5px", lineHeight: "1.05", textTransform: "uppercase", margin: "0", color: "#ffffff" }}>
            HAVE YOUR OWN STOREFRONT<br />
            IN THE <span style={{ color: "#FFBF00", textShadow: "0 0 40px rgba(255,191,0,0.35)" }}>GRAND BAZAR.</span>
          </h1>

          <div style={{ width: "80px", height: "4px", backgroundColor: "#2dd4bf", margin: "24px 0", borderRadius: "2px", boxShadow: "0 0 15px rgba(45,212,191,0.5)" }} />

          {/* ⚡ THE MIDNIGHT MANIFESTO TEXT INJECTED NATIVELY */}
          <div style={{ display: "flex", flexDirection: "column", gap: "18px", color: "#cbd5e1", fontWeight: "500", fontSize: "15px", lineHeight: "1.6", maxWidth: "640px" }}>
            <p>
              Our competitors set you up with an isolated shopping cart in the middle of nowhere, then line up 1,000 vendors to sell you SaaS add-ons you don&apos;t even need. 
            </p>
            <p style={{ borderLeft: "3px solid #FFBF00", paddingLeft: "16px", color: "#ffffff", backgroundColor: "rgba(255,191,0,0.02)" }}>
              With us, we establish your storefront directly in the heart of our high-traffic **Grand Bazar** where active customers come to discover you. Run your independent operation and securely accept any payment medium—including standard currencies and **ERC20 stablecoins**.
            </p>
            <p>
              You get complete access to our custom-trained **AI Concierge** to handle live triage, item discoveries, and client requests—taking the customer service overhead entirely off your shoulders. This is not your ordinary, rigid chatbot.
            </p>
            <p style={{ color: "#2dd4bf", fontWeight: "700" }}>
              We do not charge a single penny if you don&apos;t make a sale. That means absolute $0 overhead while your storefront sits idle. We only win when you win.
            </p>
          </div>

          <button
            onClick={() => router.push("/market")}
            style={{
              marginTop: "32px", padding: "18px 36px", backgroundColor: "#FFBF00", color: "#020617", fontWeight: "900", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.2em", borderRadius: "14px", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "12px", boxShadow: "0 12px 35px rgba(255,191,0,0.3)", transition: "transform 0.2s"
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.03)"}
            onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
          >
            Enter The Grand Bazar ⚡
            <ArrowRight size={14} />
          </button>
        </div>

        {/* RIGHT CONTAINER: Cleaned up and stripped of the image frame card box */}
        <div style={{ 
          position: "relative", 
          display: "flex", 
          flexDirection: "column", 
          alignItems: "stretch", 
          justifyContent: "flex-start", 
          gap: "24px", 
          width: "100%", 
          maxWidth: "460px",
          backgroundColor: "rgba(2, 44, 34, 0.3)",
          border: "1px solid rgba(45, 212, 191, 0.1)",
          padding: "24px",
          borderRadius: "24px",
          backdropFilter: "blur(8px)",
          marginTop: "20px"
        }}>
          
          {/* Subtle green backing glow overlay */}
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle, rgba(45,212,191,0.08) 0%, transparent 80%)", borderRadius: "24px", pointerEvents: "none" }} />

          <div style={{ position: "relative", zIndex: 2 }}>
            <h3 style={{ margin: "0 0 8px 0", fontSize: "14px", fontWeight: "900", textTransform: "uppercase", color: "#FFBF00", letterSpacing: "0.05em" }}>
              THE 50/50 AGENT ALLIANCE
            </h3>
            <p style={{ margin: 0, fontSize: "13px", color: "#94a3b8", lineHeight: "1.5" }}>
              Join our network as a listing agent and retain **50% of our platform revenue**. Because we don&apos;t run a centralized direct retail desk, we route closed transactions and localized merchant leads back to our fast-finger agent grid.
            </p>
            <div style={{ margin: "16px 0", padding: "12px", backgroundColor: "rgba(45, 212, 191, 0.05)", borderLeft: "2px solid #2dd4bf", borderRadius: "4px" }}>
              <p style={{ margin: 0, fontSize: "12px", color: "#2dd4bf", lineHeight: "1.4", fontWeight: "600" }}>
                💡 Secure storefronts for local merchants, and secure half of our platform fees from that customer for life.
              </p>
            </div>
          </div>

          {/* 📡 THE DISPATCH REGISTER REGISTER BAR */}
          <div style={{ width: "100%", display: "flex", justifyContent: "center", position: "relative", zIndex: 2 }}>
            <AgentNotificationRegister />
          </div>

        </div>
      </main>

      {/* ─── FOOTER VALUE PILLS ─── */}
      <footer style={{ width: "100%", maxWidth: "1200px", margin: "0 auto", borderTop: "1px solid rgba(45, 212, 191, 0.1)", zIndex: 10, position: "relative" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "32px", textAlign: "left", paddingTop: "24px" }}>
          
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#2dd4bf", marginBottom: "6px" }}>
              <ShoppingBag size={16} />
              <h4 style={{ margin: 0, fontSize: "13px", fontWeight: "900", textTransform: "uppercase" }}>Multi-Token Checkout</h4>
            </div>
            <p style={{ margin: 0, fontSize: "12px", color: "#94a3b8", lineHeight: "1.5" }}>Bypass rigid processing restrictions. Settle marketplace transactions securely via decentralized Web3 crypto tokens or standard options directly on your phone.</p>
          </div>

          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#FFBF00", marginBottom: "6px" }}>
              <Bot size={16} />
              <h4 style={{ margin: 0, fontSize: "13px", fontWeight: "900", textTransform: "uppercase" }}>Trained AI Assistance</h4>
            </div>
            <p style={{ margin: 0, fontSize: "12px", color: "#94a3b8", lineHeight: "1.5" }}>Delegate complex service logistics. Our digital concierge engine handles buyer walkthroughs, item inquiries, and triage loops natively around the clock.</p>
          </div>

          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#2dd4bf", marginBottom: "6px" }}>
              <ShieldAlert size={16} />
              <h4 style={{ margin: 0, fontSize: "13px", fontWeight: "900", textTransform: "uppercase" }}>True Zero Overhead</h4>
            </div>
            <p style={{ margin: 0, fontSize: "12px", color: "#94a3b8", lineHeight: "1.5" }}>No tracking fees, no surprise infrastructure tiers, and zero ongoing monthly subscription traps. If your storefront is completely idle, you owe us nothing.</p>
          </div>

        </div>
      </footer>

    </div>
  );
}
