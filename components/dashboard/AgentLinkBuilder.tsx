"use client";

import React, { useState } from "react";
import { FilePlus, Link2, Copy } from "lucide-react";

export default function AgentLinkBuilder({ currentAgentId }: { currentAgentId?: string }) {
  // --- 1. STATE MANAGEMENT ---
  const [inputAgent, setInputAgent] = useState(currentAgentId || "");
  const [inputItem, setInputItem] = useState("car");
  const [inputTitle, setInputTitle] = useState("");
  const [inputQty, setInputQty] = useState("1");
  const [generatedLink, setGeneratedLink] = useState("");
  const [copied, setCopied] = useState(false);

  const handleBuildQuoteLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputAgent || !inputTitle) return;

    const formattedTitle = inputTitle.trim().replace(/\s+/g, "-");
    const cleanQty = Math.max(1, parseInt(inputQty || "1", 10));
    
    const origin = typeof window !== "undefined" ? window.location.origin : "https://bazaria.world";
    
    // 🎯 ROUTES SECURELY BACK TO YOUR CENTRAL DISCOVERABLE ENTRYWAY
    const newLink = `${origin}/pay?agent=${inputAgent.toUpperCase().trim()}&item=${inputItem}&title=${formattedTitle}&qty=${cleanQty}`;
    
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
    <div style={styles.agentGeneratorCard}>
      <div style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "16px", marginBottom: "24px" }}>
        <h2 style={{ fontSize: "15px", fontWeight: 900, color: "#C5A059", textTransform: "uppercase", letterSpacing: "0.05em", margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
          <FilePlus size={16} /> Internal Broker Workspace: Bulk Quote Link Builder
        </h2>
        <p style={{ margin: "6px 0 0 0", color: "#94a3b8", fontSize: "12px" }}>
          Configure client needs, define multi-unit quantities, and extract a portable transaction URL instantly.
        </p>
      </div>

      <form onSubmit={handleBuildQuoteLink} style={styles.generatorFormGrid}>
        <div style={styles.inputStack}>
          <label style={styles.fieldLabel}>Your Agent ID</label>
          <input 
            type="text" 
            required 
            placeholder="e.g., AGNT-777" 
            value={inputAgent} 
            onChange={(e) => setInputAgent(e.target.value)} 
            style={styles.inputElement} 
            disabled={!!currentAgentId} // Auto-locks to active user context if provided
          />
        </div>

        <div style={styles.inputStack}>
          <label style={styles.fieldLabel}>Asset Category</label>
          <select value={inputItem} onChange={(e) => setInputItem(e.target.value)} style={styles.inputElement}>
            <option value="car">Automotive Listing ($10/ea)</option>
            <option value="home">Real Estate Listing ($29/ea)</option>
            <option value="heavy">Industrial Heavy Machinery Listing ($49/ea)</option>
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

      {/* OUTPUT HUB */}
      {generatedLink && (
        <div style={styles.outputBox}>
          <span style={{ color: "#10b981", fontSize: "11px", fontWeight: 900, display: "block", marginBottom: "8px", textTransform: "uppercase" }}>
            <Link2 size={12} style={{ display: "inline", marginRight: "4px" }} /> Portable Client URL Ready
          </span>
          <div style={styles.linkRow}>
            <div style={styles.linkTextContainer}>{generatedLink}</div>
            <button onClick={handleCopyLink} style={{ ...styles.copyBtn, backgroundColor: copied ? "#10b981" : "#C5A059", color: copied ? "#ffffff" : "#021a1d" }}>
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Sub-scaffolding styles matching your dark teal luxury theme
const styles = {
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
