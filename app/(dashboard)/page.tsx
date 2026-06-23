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
      // 🛠️ FIX 1: Responsive clamp padding ensures perfect centering on mobile without heavy margins
      padding: "clamp(16px, 4vw, 32px)", 
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
      <header style={{ width: "100%", maxWidth: "1200px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 10, position: "relative", paddingBottom: "24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ display: "inline-block", width: "6px", height: "6px", backgroundColor: "#2dd4bf", borderRadius: "50%", animation: "pulse 1.5s infinite" }} />
          <span className="hidden sm:inline" style={{ fontSize: "10px", fontWeight: "900", letterSpacing: "0.2em", color: "#2dd4bf", fontFamily: "monospace" }}>
            BAZARIA WORLD // A LIVING ECONOMY
          </span>
          <span className="inline sm:hidden" style={{ fontSize: "10px", fontWeight: "900", letterSpacing: "0.2em", color: "#2dd4bf", fontFamily: "monospace" }}>
            BAZARIA WORLD
          </span>
        </div>
        {/* 🛠️ FIX 2: Upgraded the Crypto Network badge visibility */}
        <span style={{ fontSize: "9px", fontWeight: "900", color: "#2dd4bf", letterSpacing: "0.1em", backgroundColor: "rgba(45, 212, 191, 0.05)", padding: "6px 12px", borderRadius: "6px", border: "1px solid rgba(45, 212, 191, 0.25)", textTransform: "uppercase" }}>
          GLOBAL CRYPTO NETWORK ACTIVE
        </span>
      </header>

      {/* ─── MAIN HERO ZONE (REARRANGED VERTICAL FLOW) ─── */}
      <main className="flex flex-col items-center text-center gap-10 w-full relative mx-auto z-10" style={{ maxWidth: "700px", padding: "20px 0 60px 0" }}>
        
        {/* 1. PROTOCOL LINK (🛠️ FIX 3) */}
        <a 
          href="https://app.bazaria.world/market/create"
          style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "8px 18px", backgroundColor: "rgba(255,191,0,0.1)", color: "#FFBF00", borderRadius: "9999px", fontSize: "10px", fontWeight: "900", letterSpacing: "0.15em", border: "1px solid rgba(255,191,0,0.3)", textDecoration: "none", transition: "all 0.2s", cursor: "pointer" }}
          className="hover:bg-[#FFBF00]/20 hover:scale-105"
        >
          <Radio size={14} className="text-pulse" /> FREE LISTING MARKETPLACE PROTOCOL
        </a>

        {/* 2. GRAND TITLE */}
        <h1 style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)", fontWeight: "900", letterSpacing: "-1.5px", lineHeight: "1.05", textTransform: "uppercase", margin: "0", color: "#ffffff" }}>
          HAVE YOUR<br />
          OWN STOREFRONT<br />
          IN THE <span style={{ color: "#FFBF00", textShadow: "0 0 40px rgba(255,191,0,0.35)" }}>GRAND BAZAR.</span>
        </h1>

        {/* 3. PREMIUM PORTRAIT IMAGE CARD FRAME */}
        <div style={{ 
          backgroundColor: "#011c18", border: "2px solid #115e59", padding: "12px", borderRadius: "28px", width: "100%", maxWidth: "520px", boxShadow: "0 30px 60px -15px rgba(0,0,0,0.8)", backdropFilter: "blur(10px)", position: "relative", overflow: "hidden"
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
          </div>
          
          <div style={{
            position: "absolute", bottom: "24px", left: "24px", right: "24px", backgroundColor: "rgba(1, 28, 24, 0.9)", border: "1px solid rgba(45, 212, 191, 0.3)", padding: "12px 16px", borderRadius: "14px", display: "flex", justifyContent: "space-between", alignItems: "center", backdropFilter: "blur(6px)", zIndex: 10
          }}>
            <div style={{ textAlign: "left" }}>
              <p style={{ margin: 0, fontSize: "11px", fontWeight: "900", textTransform: "uppercase", color: "#ffffff" }}>Bazar Economy Node</p>
              <p style={{ margin: 0, fontSize: "9px", color: "#94a3b8", fontFamily: "monospace", marginTop: "1px" }}>NETWORK DISTRIBUTOR ACTIVE</p>
            </div>
            <span className="text-pulse" style={{ fontSize: "10px", fontWeight: "900", color: "#2dd4bf", fontFamily: "monospace" }}>● LIVE</span>
          </div>
        </div>

        {/* 4. DECENTRALIZED AUCTION PROTOCOLS SECTION */}
        <div style={{ 
          backgroundColor: "rgba(2, 44, 34, 0.4)", border: "1px solid rgba(45, 212, 191, 0.15)", padding: "24px", borderRadius: "20px", textAlign: "center", backdropFilter: "blur(4px)", boxShadow: "0 10px 30px rgba(0,0,0,0.3)", width: "100%", maxWidth: "520px"
        }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "#FFBF00", fontSize: "11px", fontWeight: "900", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "12px" }}>
            <span>⚡ DECENTRALIZED AUCTION PROTOCOLS</span>
          </div>
          <h3 style={{ margin: "0 0 12px 0", fontSize: "18px", fontWeight: "900", color: "#ffffff", textTransform: "uppercase", letterSpacing: "-0.5px" }}>
            Bid in our Auction or Run Your Own House
          </h3>
          <p style={{ margin: 0, fontSize: "13px", color: "#94a3b8", lineHeight: "1.6" }}>
            Take control of asset valuation. Place live bids in our primary global marketplace auctions, or spawn your own independent, smart-contract-backed auction house to command high-velocity competition for your products.
          </p>
        </div>

        {/* 5. ENTER THE GRAND BAZAR BUTTON */}
        <button
          onClick={() => router.push("/market")}
          style={{
            padding: "20px 48px", backgroundColor: "#FFBF00", color: "#020617", fontWeight: "900", fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.2em", borderRadius: "16px", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "12px", boxShadow: "0 12px 35px rgba(255,191,0,0.4)", transition: "transform 0.2s"
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.04)"}
          onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
        >
          Enter The Grand Bazar ⚡
          <ArrowRight size={16} />
        </button>

        {/* 6. NARRATIVE TEXT PARAGRAPHS */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px", color: "#cbd5e1", fontWeight: "500", fontSize: "15px", lineHeight: "1.7", width: "100%", textAlign: "left", marginTop: "16px", padding: "0 16px" }}>
          <p>
            Our competitors set you up with an isolated shopping cart in the middle of nowhere, then line up 1,000 vendors to sell you SaaS add-ons you don&apos;t even need. 
          </p>
          <p style={{ borderLeft: "3px solid #FFBF00", paddingLeft: "20px", color: "#ffffff", backgroundColor: "rgba(255,191,0,0.03)", padding: "16px 20px", borderRadius: "0 12px 12px 0" }}>
            With us, we establish your storefront directly in the heart of our high-traffic **Grand Bazar** where active customers come to discover you. Run your independent operation and securely accept any payment medium—including standard currencies and **ERC20 stablecoins**.
          </p>
          
          <div style={{ margin: "8px 0" }}>
            <a 
              href="https://app.bazaria.world/storefront/whitepearl" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ 
                display: "inline-flex", alignItems: "center", gap: "8px", color: "#2dd4bf", fontSize: "15px", fontWeight: "700", textDecoration: "none", borderBottom: "1px dashed rgba(45, 212, 191, 0.4)", paddingBottom: "4px", transition: "color 0.2s"
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
          <p style={{ color: "#2dd4bf", fontWeight: "700", backgroundColor: "rgba(45, 212, 191, 0.05)", padding: "16px", borderRadius: "12px", border: "1px solid rgba(45, 212, 191, 0.15)" }}>
            We do not charge a single penny if you don&apos;t make a sale. That means absolute $0 overhead while your storefront sits idle. We only win when you win.
          </p>
        </div>

      </main>
   
      {/* ─── BOTTOM ZONE (DISPATCH ALERT & FOOTER) ─── */}
      <div style={{ width: "100%", maxWidth: "1200px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "40px", zIndex: 10, position: "relative" }}>
        
        {/* TYPOGRAPHY ANCHOR */}
        <div style={{ width: "100%", display: "flex", alignItems: "flex-end", justifyContent: "center", gap: "16px", opacity: 0.75, flexWrap: "wrap", borderBottom: "1px solid rgba(45, 212, 191, 0.1)", paddingBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: "12px" }}>
            <span style={{ fontSize: "24px", fontWeight: "900", letterSpacing: "0.12em", color: "#ffffff", textTransform: "uppercase", lineHeight: "1" }}>
              BAZARIA
            </span>
            <span style={{ fontSize: "9px", fontWeight: "800", letterSpacing: "0.33em", color: "#2dd4bf", textTransform: "uppercase", lineHeight: "1.1", whiteSpace: "nowrap" }}>
              A Living Economy
            </span>
          </div>
          <div style={{ fontSize: "9px", fontFamily: "monospace", color: "#475569", letterSpacing: "0.1em", whiteSpace: "nowrap", paddingBottom: "2px" }}>
            V1.0.0 // LIVE
          </div>
        </div>

        {/* 7. DISPATCH ALERT (MOVED TO BOTTOM) */}
        <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
          <AgentNotificationRegister />
        </div>

        {/* ─── FOOTER VALUE PILLS ─── */}
        <footer style={{ width: "100%", borderTop: "1px solid rgba(45, 212, 191, 0.1)", paddingTop: "32px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "32px", textAlign: "left" }}>
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
                <h4 style={{ margin: 0, fontSize: "13px", fontWeight: "900", textTransform: "uppercase" }}>The Listing Agent Program</h4>
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
    </div>
  );
}
