"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import TopNav from "@/app/components/ui/TopNav";
import { ShieldCheck, Printer, ArrowRight, CheckCircle2, Link2, Copy, FilePlus, Hash } from "lucide-react";

const TARIFF_REGISTRY: Record<string, { name: string; price: number }> = {
  "real-estate": { name: "Real Estate Listing", price: 29 },
  "auto": { name: "Auto Industry Listing", price: 10 },
  "trucks-rvs": { name: "Trucks/RVs Listing", price: 29 },
  "heavy-equipment": { name: "Heavy Equipment and Machinery", price: 49 },
  "professional": { name: "Professional Services", price: 25 }, // <-- Update this placeholder price!
  "business": { name: "Business Activities", price: 35 },
  "misc": { name: "Misc Products and Services", price: 10 },
};

function PortableQuoteCheckout() {
  const searchParams = useSearchParams();

  // --- 1. READ URL METRICS (INCLUDING QUANTITY) ---
  const agentId = searchParams.get("agent") || "SYSTEM_DIRECT";
  const itemType = searchParams.get("item") || "car";
  const assetTitle = searchParams.get("title") || "Standard Asset Clearance";
  const quantity = Math.max(1, parseInt(searchParams.get("qty") || "1", 10)); // Defends against 0 or negative inputs
  
 // 🛡️ Safe Lookup: If the URL has an old/invalid item, default to "auto" to prevent crashes
  const activeTariff = TARIFF_REGISTRY[inputItem] || TARIFF_REGISTRY["auto"];
  
  // Dynamic Multi-Unit Math Calculations
  const subtotal = activeTariff.price * quantity;
  const platformFee = 2.00 * quantity; // Scale processing stamp fee per listing slot
  const finalTotal = subtotal + platformFee;

  // --- 2. STATE ENGINE FOR THE AGENT LINK BUILDER ---
  const [inputAgent, setInputAgent] = useState("");
 const [inputItem, setInputItem] = useState("auto"); // Changed from "car" to "auto"
  const [inputTitle, setInputTitle] = useState("");
  const [inputQty, setInputQty] = useState("1");
  const [generatedLink, setGeneratedLink] = useState("");
  const [copied, setCopied] = useState(false);

  const initiateSecureStripeRoute = () => {
    alert(`Redirecting to Secure Stripe Server...\nProcessing Bulk Order: $${finalTotal.toFixed(2)}\nUnits: ${quantity} x ${activeTariff.name}\nAgent Credit: ${agentId}`);
  };

  const handleBuildQuoteLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputAgent || !inputTitle) return;

    const formattedTitle = inputTitle.trim().replace(/\s+/g, "-");
    const cleanQty = Math.max(1, parseInt(inputQty || "1", 10));
    
    const origin = typeof window !== "undefined" ? window.location.origin : "https://bazaria.world";
    const newLink = `${origin}/pay?agent=${inputAgent.toUpperCase()}&item=${inputItem}&title=${formattedTitle}&qty=${cleanQty}`;
    
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
      
      {/* 👑 CLIENT INVOICE SLATE */}
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
          {/* LEFT COLUMN: ITEMIZED SLATE */}
          <div style={styles.leftColumn}>
            <div style={styles.sectionBlock}>
              <span style={styles.sectionLabel}>Target Asset Context</span>
              <div style={styles.contextBox}>
                <span style={styles.contextSub}>Vetting Description (Package Context)</span>
                <div style={styles.contextTitle}>{assetTitle.replace(/-/g, " ")}</div>
              </div>
            </div>

            <div style={styles.sectionBlock}>
              <span style={styles.sectionLabel}>Itemized Billing Allocations</span>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                
                {/* Base Tier Price Line Item */}
                <div style={styles.ledgerLine}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                    <span style={{ color: "#cbd5e1", fontSize: "13px", fontWeight: "bold" }}>{activeTariff.name}</span>
                    <span style={{ color: "#64748b", fontSize: "11px" }}>${activeTariff.price.toFixed(2)} per slot × {quantity} units</span>
                  </div>
                  <span style={styles.ledgerLinePrice}>${subtotal.toFixed(2)}</span>
                </div>

                {/* Stamp Fee Line Item */}
                <div style={styles.ledgerLine}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                    <span style={{ color: "#94a3b8", fontSize: "13px" }}>Compliance & Verification Stamp Fee</span>
                    <span style={{ color: "#64748b", fontSize: "11px" }}>$2.00 per slot × {quantity} units</span>
                  </div>
                  <span style={styles.ledgerLinePrice}>${platformFee.toFixed(2)}</span>
                </div>

              </div>
            </div>

            <button type="button" onClick={() => window.print()} style={styles.printBtn}>
              <Printer size={14} /> Print/Save Portable Copy
            </button>
          </div>

          {/* RIGHT COLUMN: ACTION BLOCK */}
          <div style={styles.rightColumn}>
            <div>
              <div style={styles.securityHeader}>
                <CheckCircle2 size={13} /> SECURE QUANTITY LOCK
              </div>
              
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", backgroundColor: "#05292e", padding: "12px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.03)" }}>
                <span style={{ fontSize: "11px", fontWeight: "bold", color: "#94a3b8" }}>TOTAL UNIT SLOTS:</span>
                <span style={{ fontSize: "14px", fontWeight: 900, color: "#C5A059", display: "flex", alignItems: "center", gap: "4px" }}><Hash size={14}/> {quantity}</span>
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

      {/* 🛠️ AGENT WORKSPACE: QUANTITY MANAGER ADDED */}
      <div style={styles.agentGeneratorCard}>
        <div style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "16px", marginBottom: "24px" }}>
          <h2 style={{ fontSize: "15px", fontWeight: 900, color: "#C5A059", textTransform: "uppercase", letterSpacing: "0.05em", margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
            <FilePlus size={16} /> Internal Broker Workspace: Bulk Quote Link Builder
          </h2>
          <p style={{ margin: "6px 0 0 0", color: "#94a3b8", fontSize: "12px" }}>
            Configure client needs, define multi-unit quantities, and extract a portable transaction URL.
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
              <option value="real-estate">Real Estate ($29/ea)</option>
              <option value="auto">Auto Industry ($10/ea)</option>
              <option value="trucks-rvs">Trucks/RVs ($29/ea)</option>
              <option value="heavy-equipment">Heavy equipment and Machinery ($49/ea)</option>
              <option value="professional">Professional services ($25/ea)</option>
              <option value="business">Business Activities ($35/ea)</option>
              <option value="misc">Misc Products and Services ($10/ea)</option>
            </select>
          </div>

          <div style={{ ...styles.inputStack, gridColumn: "span 2" }}>
            <label style={styles.fieldLabel}>Quantity (How many listing slots do they need?)</label>
            <input type="number" min="1" required placeholder="e.g., 20" value={inputQty} onChange={(e) => setInputQty(e.target.value)} style={styles.inputElement} />
          </div>

          <div style={{ ...styles.inputStack, gridColumn: "span 2" }}>
            <label style={styles.fieldLabel}>Detailed Asset Title / Dealer Name</label>
            <input type="text" required placeholder="e.g., Miami Auto Group 20 Car Allocation Package" value={inputTitle} onChange={(e) => setInputTitle(e.target.value)} style={styles.inputElement} />
          </div>

          <button type="submit" style={styles.genBtn}>Generate Bulk Quote Link</button>
        </form>

        {/* OUTPUT INTERCEPT HUB */}
        {generatedLink && (
          <div style={styles.outputBox}>
            <span style={{ color: "#10b981", fontSize: "11px", fontWeight: 900, display: "block", marginBottom: "8px", textTransform: "uppercase" }}>
              <Link2 size={12} style={{ display: "inline", marginRight: "4px" }} /> Portable Client URL Ready
            </span>
            <div style={styles.linkRow}>
              <div style={styles.linkTextContainer}>{generatedLink}</div>
              <button onClick={handleCopyLink} style={{ ...styles.copyBtn, backgroundColor: copied ? "#10b981" : "#C5A059", color: copied ? "#ffffff" : "#021a1d" }}>
                <Copy size={13} /> {copied ? "Copied!" : "Copy"}
              </button>
            </div>
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
        <Suspense fallback={<div>SYNCHRONIZING PORTABLE LEDGER...</div>}>
          <PortableQuoteCheckout />
        </Suspense>
      </div>
    </div>
  );
}

// --- Layout Object Core Constants ---
const styles = {
  masterWrapper: { backgroundColor: "#05292e", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "24px", overflow: "hidden", display: "flex", flexDirection: "column" as const, boxSizing: "border-box" as const },
  headerBar: { padding: "32px", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", flexWrap: "wrap" as const, justifyContent: "space-between", alignItems: "center", gap: "16px", background: "linear-gradient(to right, #05292e, #021a1d)" },
  headerSub: { color: "#C5A059", fontSize: "10px", fontWeight: 900, textTransform: "uppercase" as const, display: "block", marginBottom: "4px" },
  headerTitle: { color: "#ffffff", fontSize: "24px", fontWeight: 900, textTransform: "uppercase" as const, margin: 0 },
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
  masterPayBtn: { width: "100%", backgroundColor: "#C5A059", color: "#021a1d", border: "none", borderRadius: "12px", padding: "14px 20px", fontSize: "12px", fontWeight: 900, textTransform: "uppercase" as const, cursor: "pointer", marginTop: "24px" },
  footerBar: { padding: "16px 32px", backgroundColor: "#021a1d", borderTop: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", gap: "10px", color: "#94a3b8", fontSize: "11px" },

  agentGeneratorCard: { backgroundColor: "#05292e", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "24px", padding: "32px", boxSizing: "border-box" as const },
  generatorFormGrid: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "20px" },
  inputStack: { display: "flex", flexDirection: "column" as const, gap: "8px" },
  fieldLabel: { color: "#cbd5e1", fontSize: "11px", fontWeight: 700, textTransform: "uppercase" as const },
  inputElement: { backgroundColor: "#021a1d", border: "1px solid rgba(255,255,255,0.08)", padding: "12px 14px", borderRadius: "10px", color: "#ffffff", fontSize: "13px", outline: "none", width: "100%", boxSizing: "border-box" as const },
  genBtn: { gridColumn: "span 2", backgroundColor: "#C5A059", border: "none", padding: "14px", borderRadius: "10px", color: "#021a1d", fontWeight: 900, fontSize: "12px", textTransform: "uppercase" as const, cursor: "pointer", marginTop: "8px" },
  outputBox: { marginTop: "24px", backgroundColor: "#021a1d", padding: "20px", borderRadius: "14px", border: "1px solid rgba(16,185,129,0.15)" },
  linkRow: { display: "flex", gap: "10px", marginTop: "8px" },
  linkTextContainer: { backgroundColor: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)", padding: "12px", borderRadius: "8px", fontFamily: "monospace", fontSize: "12px", color: "#cbd5e1", flex: 1, whiteSpace: "nowrap" as const, overflowX: "hidden" as const, textOverflow: "ellipsis" as const },
  copyBtn: { border: "none", display: "flex", alignItems: "center", gap: "6px", padding: "0 18px", borderRadius: "8px", fontSize: "12px", fontWeight: 900, cursor: "pointer" }
};
