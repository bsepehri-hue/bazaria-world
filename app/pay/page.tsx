"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import TopNav from "@/app/components/ui/TopNav";
import { ShieldCheck, Printer, ArrowRight, CheckCircle2, Car, Home, Layers } from "lucide-react";

const TARIFF_REGISTRY: Record<string, { name: string; price: number; icon: any }> = {
  car: { name: "Automotive Verification & Listing", price: 10, icon: Car },
  home: { name: "Real Estate Structural Auction Slot", price: 29, icon: Home },
  heavy: { name: "Industrial Heavy Machinery Slot", price: 49, icon: Layers },
};

function PortableQuoteCheckout() {
  const searchParams = useSearchParams();

  // URL Parameter Extraction
  const agentId = searchParams.get("agent") || "SYSTEM_DIRECT";
  const itemType = searchParams.get("item") || "car";
  const assetTitle = searchParams.get("title") || "Standard Asset Clearance";
  
  const activeTariff = TARIFF_REGISTRY[itemType] || TARIFF_REGISTRY.car;
  const platformFee = 2.00;
  const finalTotal = activeTariff.price + platformFee;

  const initiateSecureStripeRoute = () => {
    alert(`Redirecting to Secure Stripe Server...\nProcessing: $${finalTotal.toFixed(2)}\nAgent Credit: ${agentId}`);
  };

  return (
    <div style={styles.masterWrapper}>
      
      {/* BRAND HEADER BAR */}
      <div style={styles.headerBar}>
        <div>
          <span style={styles.headerSub}>Official Broker Solution Estimate</span>
          <h1 style={styles.headerTitle}>Order Quote / Statement</h1>
        </div>
        <div style={styles.agentTag}>
          <span style={{ color: "#94a3b8", fontWeight: "bold" }}>BROKER ID:</span>
          <span style={{ color: "#C5A059", fontFamily: "monospace", fontWeight: 900 }}>{agentId.toUpperCase()}</span>
        </div>
      </div>

      {/* CORE CONTENT GRID SPLIT */}
      <div style={styles.contentGrid}>
        
        {/* LEFT PANEL: ITEMIZED STATEMENT LIST */}
        <div style={styles.leftColumn}>
          
          {/* Asset Context Box */}
          <div style={styles.sectionBlock}>
            <span style={styles.sectionLabel}>Target Asset Context</span>
            <div style={styles.contextBox}>
              <span style={styles.contextSub}>Vetting Description</span>
              <div style={styles.contextTitle}>{assetTitle.replace(/-/g, " ")}</div>
            </div>
          </div>

          {/* Line Items Container */}
          <div style={styles.sectionBlock}>
            <span style={styles.sectionLabel}>Itemized Billing Allocations</span>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              
              {/* Line Item 1 */}
              <div style={styles.ledgerLine}>
                <span style={{ color: "#cbd5e1", fontSize: "13px" }}>{activeTariff.name}</span>
                <span style={styles.ledgerLinePrice}>${activeTariff.price.toFixed(2)}</span>
              </div>

              {/* Line Item 2 */}
              <div style={styles.ledgerLine}>
                <span style={{ color: "#94a3b8", fontSize: "13px" }}>Compliance & Verification Stamp Fee</span>
                <span style={styles.ledgerLinePrice}>${platformFee.toFixed(2)}</span>
              </div>

            </div>
          </div>

          {/* Print Trigger Button */}
          <button type="button" onClick={() => window.print()} style={styles.printBtn}>
            <Printer size={14} /> Print/Save Portable Copy
          </button>
        </div>

        {/* RIGHT PANEL: PAYMENT INTERCEPT CONTROLS */}
        <div style={styles.rightColumn}>
          <div>
            <div style={styles.securityHeader}>
              <CheckCircle2 size={13} /> SECURE ORDER LINK
            </div>
            <span style={{ ...styles.sectionLabel, marginBottom: "4px" }}>Total Amount Due</span>
            <div style={styles.totalDisplay}>${finalTotal.toFixed(2)}</div>
            <p style={styles.lockBoxWarning}>
              Funds are held securely under our corporate clearing layer. Listing activation occurs instantly post-authorization.
            </p>
          </div>

          <button onClick={initiateSecureStripeRoute} style={styles.masterPayBtn}>
            Proceed to Stripe Pay <ArrowRight size={14} />
          </button>
        </div>

      </div>

      {/* FOOTER BAR */}
      <div style={styles.footerBar}>
        <ShieldCheck size={14} color="#C5A059" />
        <span>**Security Isolation Guard:** Agents do not have visibility into credit profiles or clearing parameters.</span>
      </div>

    </div>
  );
}

export default function PortablePayConsole() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#021a1d", color: "#ffffff", padding: "40px 20px box-sizing: border-box" }}>
      <TopNav />
      <div style={{ maxWidth: "1200px", margin: "40px auto 0 auto" }}>
        <Suspense fallback={<div style={{ color: "#C5A059", textAlign: "center", fontSize: "12px", letterSpacing: "2px" }}>PARSING SECURE LINE...</div>}>
          <PortableQuoteCheckout />
        </Suspense>
      </div>
    </div>
  );
}

// --- Inline CSS Style Architecture Matrix ---
const styles = {
  masterWrapper: { backgroundColor: "#05292e", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "24px", overflow: "hidden", display: "flex", flexDirection: "column" as const, boxSizing: "border-box" as const },
  headerBar: { padding: "32px", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", flexWrap: "wrap" as const, justifyContent: "space-between", alignItems: "center", gap: "16px", background: "linear-gradient(to right, #05292e, #021a1d)" },
  headerSub: { color: "#C5A059", fontSize: "10px", fontWeight: 900, tracking: "3px", textTransform: "uppercase" as const, display: "block", marginBottom: "4px" },
  headerTitle: { color: "#ffffff", fontSize: "24px", fontWeight: 900, textTransform: "uppercase" as const, margin: 0, letterSpacing: "0.5px" },
  agentTag: { display: "flex", alignItems: "center", gap: "8px", backgroundColor: "#021a1d", border: "1px solid rgba(255,255,255,0.05)", padding: "10px 16px", borderRadius: "12px", fontSize: "12px" },
  
  contentGrid: { padding: "32px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "32px", boxSizing: "border-box" as const },
  leftColumn: { display: "flex", flexDirection: "column" as const, gap: "24px" },
  sectionBlock: { display: "flex", flexDirection: "column" as const },
  sectionLabel: { color: "#94a3b8", fontSize: "11px", fontWeight: 900, textTransform: "uppercase" as const, letterSpacing: "0.05em", marginBottom: "10px", display: "block" },
  contextBox: { backgroundColor: "#021a1d", padding: "16px", borderRadius: "14px", border: "1px solid rgba(255,255,255,0.04)" },
  contextSub: { color: "#C5A059", fontSize: "10px", fontWeight: 700, textTransform: "uppercase" as const, fontFamily: "monospace", display: "block", marginBottom: "4px" },
  contextTitle: { color: "#ffffff", fontSize: "15px", fontWeight: 800, textTransform: "uppercase" as const },
  
  ledgerLine: { display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#021a1d", padding: "14px 18px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.02)" },
  ledgerLinePrice: { color: "#ffffff", fontWeight: 900, fontSize: "14px", fontFamily: "monospace" },
  printBtn: { width: "fit-content", backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", color: "#C5A059", display: "flex", alignItems: "center", gap: "8px", padding: "10px 16px", borderRadius: "8px", fontSize: "11px", fontWeight: 900, cursor: "pointer", textTransform: "uppercase" as const },
  
  rightColumn: { backgroundColor: "#021a1d", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "18px", padding: "24px", display: "flex", flexDirection: "column" as const, justifyContent: "space-between", minHeight: "260px", boxSizing: "border-box" as const },
  securityHeader: { display: "flex", alignItems: "center", gap: "6px", color: "#10b981", fontSize: "10px", fontWeight: 900, letterSpacing: "0.05em", marginBottom: "20px" },
  totalDisplay: { color: "#ffffff", fontSize: "38px", fontWeight: 900, fontFamily: "monospace", marginTop: "2px" },
  lockBoxWarning: { color: "#94a3b8", fontSize: "11px", lineHeight: "1.6", margin: "14px 0 0 0" },
  masterPayBtn: { width: "100%", backgroundColor: "#C5A059", color: "#021a1d", border: "none", borderRadius: "12px", padding: "14px 20px", fontSize: "12px", fontWeight: 900, textTransform: "uppercase" as const, letterSpacing: "0.05em", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", cursor: "pointer", marginTop: "24px" },
  
  footerBar: { padding: "16px 32px", backgroundColor: "#021a1d", borderTop: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", gap: "10px", color: "#94a3b8", fontSize: "11px" }
};
