"use client";
import React, { Suspense } from "react";
import { useRouter } from "next/navigation";
import { Radio, ArrowRight, Globe, Coins, Truck } from "lucide-react";
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
      background: "radial-gradient(circle at 50% 40%, #022c22 0%, #011714 65%, #010f0d 100%)",
      color: "#ffffff",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      padding: "clamp(20px, 5vw, 40px)", 
      fontFamily: "sans-serif",
      position: "relative",
      overflow: "hidden",
      boxSizing: "border-box"
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
          pointer-events: none;
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
          pointer-events: none;
        }
        .text-pulse { animation: pulse 2.5s ease-in-out infinite; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
      `}} />
      <div className="cyber-grid" />
      <div className="ambient-glow" />

      {/* ─── TOP STATUS HEADER ─── */}
      <header style={{ width: "100%", maxWidth: "1200px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 10, position: "relative", paddingBottom: "32px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ display: "inline-block", width: "6px", height: "6px", backgroundColor: "#2dd4bf", borderRadius: "50%", animation: "pulse 1.5s infinite" }} />
          <span style={{ fontSize: "10px", fontWeight: "900", letterSpacing: "0.2em", color: "#2dd4bf", fontFamily: "monospace" }}>
            BAZARIA WORLD // A LIVING ECONOMY
          </span>
        </div>
        <span style={{ fontSize: "9px", fontWeight: "900", color: "#2dd4bf", letterSpacing: "0.1em", backgroundColor: "rgba(45, 212, 191, 0.05)", padding: "6px 12px", borderRadius: "6px", border: "1px solid rgba(45, 212, 191, 0.25)", textTransform: "uppercase" }}>
          GLOBAL CRYPTO NETWORK ACTIVE
        </span>
      </header>

      {/* ─── MAIN HERO ZONE ─── */}
      <main style={{ width: "100%", maxWidth: "1000px", margin: "0 auto", padding: "20px 0 80px 0", display: "flex", flexDirection: "column", alignItems: "center", gap: "32px", position: "relative", zIndex: 10 }}>
        
        {/* 1. PROTOCOL LINK */}
        <a 
          href="https://app.bazaria.world/market/create"
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "10px 24px", backgroundColor: "rgba(255,191,0,0.1)", color: "#FFBF00", borderRadius: "9999px", fontSize: "11px", fontWeight: "900", letterSpacing: "0.15em", border: "1px solid rgba(255,191,0,0.3)", textDecoration: "none", transition: "all 0.2s" }}
          className="hover:bg-[#FFBF00]/20 hover:scale-105"
        >
          <Radio size={14} className="text-pulse" /> FREE LISTING MARKETPLACE PROTOCOL
        </a>

        {/* 2. GRAND TITLE */}
        <h1 style={{ textAlign: "center", fontSize: "clamp(2.5rem, 6vw, 5rem)", fontWeight: "900", letterSpacing: "-1.5px", lineHeight: "1.05", textTransform: "uppercase", margin: "0", color: "#ffffff" }}>
          HAVE YOUR<br />
          OWN STOREFRONT<br />
          IN THE <span style={{ color: "#FFBF00", textShadow: "0 0 40px rgba(255,191,0,0.35)" }}>GRAND BAZAR.</span>
        </h1>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px", width: "100%" }}>
          
          {/* 3. PREMIUM PORTRAIT IMAGE CARD FRAME */}
          <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
            <div style={{ 
              backgroundColor: "#011c18", border: "2px solid #115e59", padding: "12px", borderRadius: "28px", width: "100%", maxWidth: "650px", boxShadow: "0 30px 60px -15px rgba(0,0,0,0.8)", backdropFilter: "blur(10px)", position: "relative", boxSizing: "border-box"
            }}>
              <div style={{
                width: "100%", height: "500px", backgroundColor: "#011210", borderRadius: "20px", position: "relative", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center"
              }}>
                <div style={{ position: "absolute", inset: 0, opacity: 0.12, backgroundImage: "radial-gradient(#2dd4bf 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
                <img 
                  src="/assets/marketplace-hero.jpg" 
                  alt="Bazaria Global Decentralized Business Hub"
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", borderRadius: "20px", opacity: "0.9", zIndex: 2, transition: "opacity 0.3s" }}
                  onError={(e) => { e.currentTarget.style.opacity = "0"; }}
                />
                <div style={{ zIndex: 1, textAlign: "center", padding: "24px" }}>
                  <div className="text-pulse" style={{ fontSize: "11px", fontWeight: "900", color: "#115e59", letterSpacing: "0.3em", textTransform: "uppercase" }}>[ STANDBY FOR PORTRAIT_HERO_ASSET ]</div>
                  <div style={{ fontSize: "9px", color: "#0f766e", fontFamily: "monospace", marginTop: "8px", lineHeight: "1.4" }}>DROP A PORTRAIT IMAGE INTO<br />public/assets/marketplace-hero.jpg</div>
                </div>

                {/* OVERLAY TAG */}
                <div style={{
                  position: "absolute", bottom: "16px", left: "16px", right: "16px", backgroundColor: "rgba(1, 28, 24, 0.9)", border: "1px solid rgba(45, 212, 191, 0.3)", padding: "14px 18px", borderRadius: "14px", display: "flex", justifyContent: "space-between", alignItems: "center", backdropFilter: "blur(6px)", zIndex: 10
                }}>
                  <div style={{ textAlign: "left" }}>
                    <p style={{ margin: 0, fontSize: "12px", fontWeight: "900", textTransform: "uppercase", color: "#ffffff" }}>Bazar Economy Node</p>
                    <p style={{ margin: 0, fontSize: "10px", color: "#94a3b8", fontFamily: "monospace", marginTop: "2px" }}>NETWORK DISTRIBUTOR ACTIVE</p>
                  </div>
                  <span className="text-pulse" style={{ fontSize: "11px", fontWeight: "900", color: "#2dd4bf", fontFamily: "monospace" }}>● LIVE</span>
                </div>
              </div>
            </div>
          </div>

          {/* 4. DECENTRALIZED AUCTION PROTOCOLS SECTION */}
          <div style={{ 
            backgroundColor: "rgba(2, 44, 34, 0.4)", border: "1px solid rgba(45, 212, 191, 0.15)", padding: "32px", borderRadius: "20px", textAlign: "center", backdropFilter: "blur(4px)", boxShadow: "0 10px 30px rgba(0,0,0,0.3)", width: "100%", maxWidth: "750px", boxSizing: "border-box"
          }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "#FFBF00", fontSize: "12px", fontWeight: "900", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "16px" }}>
              <span>⚡ DECENTRALIZED AUCTION PROTOCOLS</span>
            </div>
            <h3 style={{ margin: "0 0 16px 0", fontSize: "20px", fontWeight: "900", color: "#ffffff", textTransform: "uppercase", letterSpacing: "-0.5px" }}>
              Bid in our Auction or Run Your Own House
            </h3>
            <p style={{ margin: 0, fontSize: "14px", color: "#94a3b8", lineHeight: "1.7" }}>
              Take control of asset valuation. Place live bids in our primary global marketplace auctions, or spawn your own independent, smart-contract-backed auction house to command high-velocity competition for your products.
            </p>
          </div>

        </div>

        {/* 5. ENTER THE GRAND BAZAR BUTTON */}
        <button
          onClick={() => router.push("/market")}
          style={{
            padding: "22px 54px", backgroundColor: "#FFBF00", color: "#020617", fontWeight: "900", fontSize: "14px", textTransform: "uppercase", letterSpacing: "0.2em", borderRadius: "16px", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "12px", boxShadow: "0 12px 35px rgba(255,191,0,0.4)", transition: "transform 0.2s", marginTop: "16px"
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.04)"}
          onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
        >
          Enter The Grand Bazar ⚡
          <ArrowRight size={18} />
        </button>

        {/* 6. NARRATIVE TEXT PARAGRAPHS */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px", color: "#cbd5e1", fontWeight: "500", fontSize: "16px", lineHeight: "1.8", width: "100%", maxWidth: "850px", textAlign: "left", marginTop: "24px", padding: "0 16px", boxSizing: "border-box" }}>
          <p>
            Our competitors set you up with an isolated shopping cart in the middle of nowhere, then line up 1,000 vendors to sell you SaaS add-ons you don&apos;t even need. 
          </p>
          <p style={{ borderLeft: "3px solid #FFBF00", paddingLeft: "24px", color: "#ffffff", backgroundColor: "rgba(255,191,0,0.03)", padding: "20px 24px", borderRadius: "0 12px 12px 0" }}>
            With us, we establish your storefront directly in the heart of our high-traffic **Grand Bazar** where active customers come to discover you. Run your independent operation and securely accept any payment medium—including standard currencies and **ERC20 stablecoins**.
          </p>
          
          <div style={{ margin: "12px 0" }}>
            <a 
              href="https://app.bazaria.world/storefront/whitepearl" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ 
                display: "inline-flex", alignItems: "center", gap: "8px", color: "#2dd4bf", fontSize: "16px", fontWeight: "700", textDecoration: "none", borderBottom: "1px dashed rgba(45, 212, 191, 0.4)", paddingBottom: "4px", transition: "color 0.2s"
              }}
              onMouseOver={(e) => e.currentTarget.style.color = "#FFBF00"}
              onMouseOut={(e) => e.currentTarget.style.color = "#2dd4bf"}
            >
              <span>📦 Explore a Live Demo Storefront (WhitePearl)</span>
              <ArrowRight size={14} />
            </a>
          </div>

          <p>
            You get complete access to our custom-trained **AI Concierge** to handle live triage, item discoveries, and client requests—taking the customer service overhead entirely off your shoulders. This is not your ordinary, rigid chatbot.
          </p>
          <p style={{ color: "#2dd4bf", fontWeight: "700", backgroundColor: "rgba(45, 212, 191, 0.05)", padding: "20px", borderRadius: "12px", border: "1px solid rgba(45, 212, 191, 0.15)" }}>
            We do not charge a single penny if you don&apos;t make a sale. That means absolute $0 overhead while your storefront sits idle. We only win when you win.
          </p>
        </div>

      </main>
   
      {/* ─── BOTTOM ZONE (DISPATCH ALERT & FOOTER) ─── */}
      <div style={{ width: "100%", maxWidth: "1200px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "48px", position: "relative", zIndex: 50 }}>
        
        {/* TYPOGRAPHY ANCHOR */}
        <div style={{ width: "100%", display: "flex", alignItems: "flex-end", justifyContent: "center", gap: "16px", opacity: 0.75, flexWrap: "wrap", borderBottom: "1px solid rgba(45, 212, 191, 0.1)", paddingBottom: "40px" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: "12px" }}>
            <span style={{ fontSize: "28px", fontWeight: "900", letterSpacing: "0.12em", color: "#ffffff", textTransform: "uppercase", lineHeight: "1" }}>
              BAZARIA
            </span>
            <span style={{ fontSize: "10px", fontWeight: "800", letterSpacing: "0.33em", color: "#2dd4bf", textTransform: "uppercase", lineHeight: "1.1", whiteSpace: "nowrap" }}>
              A Living Economy
            </span>
          </div>
          <div style={{ fontSize: "10px", fontFamily: "monospace", color: "#475569", letterSpacing: "0.1em", whiteSpace: "nowrap", paddingBottom: "2px" }}>
            V1.0.0 // LIVE
          </div>
        </div>

        {/* 7. DISPATCH ALERT */}
        {/* 🛠️ FIX: Enforced extreme z-index and explicit pointer-events right on the wrapper so nothing can block the clicks */}
        <div style={{ width: "100%", display: "flex", justifyContent: "center", position: "relative", zIndex: 9999, pointerEvents: "auto" }}>
          <AgentNotificationRegister />
        </div>

        {/* ─── FOOTER VALUE PILLS ─── */}
        <footer style={{ width: "100%", borderTop: "1px solid rgba(45, 212, 191, 0.1)", paddingTop: "40px", pointerEvents: "auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "40px", textAlign: "left" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#2dd4bf", marginBottom: "8px" }}>
                <Globe size={18} />
                <h4 style={{ margin: 0, fontSize: "14px", fontWeight: "900", textTransform: "uppercase" }}>Maximum Flexibility</h4>
              </div>
              <p style={{ margin: 0, fontSize: "13px", color: "#94a3b8", lineHeight: "1.6" }}>No tracking bosses, no set shift hours, and zero inventory pressure. Open your digital doors when it fits your day, and run everything from a smartphone window.</p>
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#FFBF00", marginBottom: "8px" }}>
                <Coins size={18} />
                <h4 style={{ margin: 0, fontSize: "14px", fontWeight: "900", textTransform: "uppercase" }}>The Listing Agent Program</h4>
              </div>
              <p style={{ margin: 0, fontSize: "13px", color: "#94a3b8", lineHeight: "1.6" }}>We built an economy where effort is rewarded. Build consistent supplementary income by connecting shoppers and supporting verified merchants in your community.</p>
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#2dd4bf", marginBottom: "8px" }}>
                <Truck size={18} />
                <h4 style={{ margin: 0, fontSize: "14px", fontWeight: "900", textTransform: "uppercase" }}>Fair, Shared Value</h4>
              </div>
              <p style={{ margin: 0, fontSize: "13px", color: "#94a3b8", lineHeight: "1.6" }}>We reject predatory models where the giants take the credit. Every listing, referral, and secure trade transaction keeps value distributed right where it belongs.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
