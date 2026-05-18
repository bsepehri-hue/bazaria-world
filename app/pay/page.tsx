"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import TopNav from "@/app/components/ui/TopNav";
import { ShieldCheck, Printer, ArrowRight, CheckCircle2, Link2, Copy, FilePlus } from "lucide-react";

const TARIFF_REGISTRY: Record<string, { name: string; price: number }> = {
  car: { name: "Automotive Verification & Listing", price: 10 },
  home: { name: "Real Estate Structural Auction Slot", price: 29 },
  heavy: { name: "Industrial Heavy Machinery Slot", price: 49 },
};

function PortableQuoteCheckout() {
  const searchParams = useSearchParams();

  // --- 1. READ URL METRICS FROM THE PORTABLE LINK ---
  const agentId = searchParams.get("agent") || "SYSTEM_DIRECT";
  const itemType = searchParams.get("item") || "car";
  const assetTitle = searchParams.get("title") || "Standard Asset Clearance";
  
  const activeTariff = TARIFF_REGISTRY[itemType] || TARIFF_REGISTRY.car;
  const platformFee = 2.00;
  const finalTotal = activeTariff.price + platformFee;

  // --- 2. STATE ENGINE FOR THE AGENT LINK BUILDER (AT BOTTOM) ---
  const [inputAgent, setInputAgent] = useState("");
  const [inputItem, setInputItem] = useState("car");
  const [inputTitle, setInputTitle] = useState("");
  const [generatedLink, setGeneratedLink] = useState("");
  const [copied, setCopied] = useState(false);

  const initiateSecureStripeRoute = () => {
    alert(`Redirecting to Secure Stripe Server...\nProcessing: $${finalTotal.toFixed(2)}\nAgent Credit: ${agentId}`);
  };

  const handleBuildQuoteLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputAgent || !inputTitle) return;

    // Formats the text title so it is web-safe (e.g., "2023 BMW M4")
    const formattedTitle = inputTitle.trim().replace(/\s+/g, "-");
    
    // Builds the portable quote link relative to your current domain
    const origin = typeof window !== "undefined" ? window.location.origin : "https://bazaria.world";
    const newLink = `${origin}/pay?agent=${inputAgent.toUpperCase()}&item=${inputItem}&title=${formattedTitle}`;
    
    setGeneratedLink(newLink);
    setCopied(false);
  };

  const handleCopyLink = () => {
    if (!generatedLink) return;
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "48px" }}>
      
      {/* 👑 CORE MODULE: THE CLIENT INVOICE SLATE */}
      <div style={styles.masterWrapper}>
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

        <div style={styles.contentGrid}>
          {/* LEFT COLUMN */}
          <div style={styles.leftColumn}>
            <div style={styles.sectionBlock}>
              <span style={styles.sectionLabel}>Target Asset Context</span>
              <div style={styles.contextBox}>
                <span style={styles.contextSub}>Vetting Description</span>
                <div style={styles.contextTitle}>{assetTitle.replace(/-/g, " ")}</div>
              </div>
            </div>

            <div style={styles.sectionBlock}>
              <span style={styles.sectionLabel}>Itemized Billing Allocations</span>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={styles.ledgerLine}>
                  <span style={{ color: "#cbd5e1", fontSize: "13px" }}>{activeTariff.name}</span>
                  <span style={styles.ledgerLinePrice}>${activeTariff.price.toFixed(2)}</span>
                </div>
                <div style={styles.ledgerLine}>
                  <span style={{ color: "#94a3b8", fontSize: "13px" }}>Compliance & Verification Stamp Fee</span>
                  <span style={styles.ledgerLinePrice}>${platformFee.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <button type="button" onClick={() => window.print()} style={styles.printBtn}>
              <Printer size={14} /> Print/Save Portable Copy
            </button>
          </div>

          {/* RIGHT COLUMN */}
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

        <div style={styles.footerBar}>
          <ShieldCheck size={14} color="#C5A059" />
          <span>**Security Isolation Guard:** Agents do not have visibility into credit profiles or clearing parameters.</span>
        </div>
      </div>

      {/* 🛠️ INTERNAL AGENT TOOL: THE LINK GENERATOR CONSOLE */}
      <div style={styles.agentGeneratorCard}>
        <div style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "16px", marginBottom: "24px" }}>
          <h2 style={{ fontSize: "15px", fontWeight: 900, color: "#C5A059", textTransform: "uppercase", letterSpacing: "0.05em", margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
            <FilePlus size={16} /> Internal Broker Workspace: Quote Link Builder
          </h2>
          <p style={{ margin: "6px 0 0 0", color: "#94a3b8", fontSize: "12px" }}>
            Input onboarding data to generate an itemized transaction link for the client.
          </p>
        </div>

        <form onSubmit={handleBuildQuoteLink} style={styles.generatorFormGrid}>
          <div style={styles.inputStack}>
            <label style={styles.fieldLabel}>Your Agent ID</label>
            <input type="text" required placeholder="e.g., AGNT-777" value={inputAgent} onChange={(e) => setInputAgent(e.target.value)} style={styles.inputElement} />
          </div>

          <div style={styles.inputStack}>
            <label style={styles.fieldLabel}>Asset Category</label>
            <select value={inputItem} onChange={(e) => setInputItem(e.target.value)} style={styles.inputElement}>
              <option value="car">Automotive Listing ($10)</option>
              <option value="home">Real Estate Listing ($29)</option>
              <option value="heavy">Heavy Machinery ($49)</option>
            </select>
          </div>

          <div style={{ ...styles.inputStack, gridColumn: "span 2" }}>
            <label style={styles.fieldLabel}>Detailed Asset Title (What the order is about)</label>
            <input type="text" required placeholder="e.g., 2022 Volkswagen ID.4 Pro Large Hub" value={inputTitle} onChange={(e) => setInputTitle(e.target.value)} style={styles.inputElement} />
          </div>

          <button type="submit" style={styles.genBtn}>Generate Quote Link</button>
        </form>

        {/* OUTPUT INTERCEPT HUB */}
        {generatedLink && (
          <div style={styles.outputBox}>
            <span style={{ color: "#10b981", fontSize: "11px", fontWeight: 900, display: "block", marginBottom: "8px", textTransform: "uppercase" }}>
              <Link2 size={12} style={{ display: "inline", marginRight: "4px" }} /> Client Link Ready to Transmit
            </span>
            <div style={styles.linkRow}>
              <div style={styles.linkTextContainer}>{generatedLink}</div>
              <button onClick={handleCopyLink} style={{ ...styles.copyBtn, backgroundColor: copied ? "#10b981" : "#C5A059", color: copied ? "#ffffff" : "#021a1d" }}>
                <Copy size={13} /> {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <p style={{ color: "#94a3b8", fontSize: "11px", margin: "8px 0 0 0" }}>
              Copy this link and send it directly to the customer over WhatsApp or email. When they tap it, their invoice will pre-fill automatically.
            </p>
          </div>
        )}
      </div>

    </div>
  );
}

export default function PortablePayConsole() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#021a1d", color: "#ffffff", padding: "40px 20px" }}>
      <TopNav />
      <div style={{ maxWidth: "1200px", margin: "40px auto 0 auto" }}>
        <Suspense fallback={<div style={{ color: "#C5A059", textAlign: "center", fontSize: "12px", letterSpacing: "2px" }}>PARSING SECURE LINE...</div>}>
          <PortableQuoteCheckout />
        </Suspense>
      </div>
    </div>
  );
}

// --- Style Settings Canvas Objects ---
const styles = {
  masterWrapper: { backgroundColor: "#05292e", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "24px", overflow: "hidden", display: "flex", flexDirection: "column" as const, boxSizing: "border-box" as const },
  headerBar: { padding: "32px", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", flexWrap: "wrap" as const, justifyContent: "space-between", alignItems: "center", gap: "16px", background: "linear-gradient(to right, #05292e, #021a1d)" },
  headerSub: { color: "#C5A059", fontSize: "10px", fontWeight: 900, textTransform: "uppercase" as const, display: "block", marginBottom: "4px" },
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
  footerBar: { padding: "16px 32px", backgroundColor: "#021a1d", borderTop: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", gap: "10px", color: "#94a3b8", fontSize: "11px" },

  // --- BUILDER STYLES PACK ---
  agentGeneratorCard: { backgroundColor: "#05292e", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "24px", padding: "32px", boxSizing: "border-box" as const },
  generatorFormGrid: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "20px" },
  inputStack: { display: "flex", flexDirection: "column" as const, gap: "8px" },
  fieldLabel: { color: "#cbd5e1", fontSize: "11px", fontWeight: 700, textTransform: "uppercase" as const },
  inputElement: { backgroundColor: "#021a1d", border: "1px solid rgba(255,255,255,0.08)", padding: "12px 14px", borderRadius: "10px", color: "#ffffff", fontSize: "13px", outline: "none", width: "100%", boxSizing: "border-box" as const },
  genBtn: { gridColumn: "span 2", backgroundColor: "#C5A059", border: "none", padding: "14px", borderRadius: "10px", color: "#021a1d", fontWeight: 900, fontSize: "12px", textTransform: "uppercase" as const, cursor: "pointer", tracking: "0.05em", marginTop: "8px" },
  
  outputBox: { marginTop: "24px", backgroundColor: "#021a1d", padding: "20px", borderRadius: "14px", border: "1px solid rgba(16,185,129,0.15)" },
  linkRow: { display: "flex", gap: "10px", marginTop: "8px" },
  linkTextContainer: { backgroundColor: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)", padding: "12px", borderRadius: "8px", fontFamily: "monospace", fontSize: "12px", color: "#cbd5e1", flex: 1, whiteSpace: "nowrap" as const, overflowX: "hidden" as const, textOverflow: "ellipsis" as const },
  copyBtn: { border: "none", display: "flex", alignItems: "center", gap: "6px", padding: "0 18px", borderRadius: "8px", fontSize: "12px", fontWeight: 900, cursor: "pointer", transition: "all 0.2s" }
};
