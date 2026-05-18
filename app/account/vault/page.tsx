"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import TopNav from "@/app/components/ui/TopNav";
import { 
  ShieldAlert, 
  TrendingUp, 
  Coins, 
  FileText, 
  Download, 
  RefreshCcw,
  CheckCircle2,
  AlertTriangle,
  Layers,
  PieChart
} from "lucide-react";

type VaultTab = "OVERVIEW" | "INVENTORY" | "FINANCIALS";

export default function SecureVaultPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<VaultTab>("FINANCIALS");

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#021a1d", color: "#ffffff", position: "relative", overflowX: "hidden", fontFamily: "sans-serif" }}>
      <TopNav />

      <div className="max-w-[1400px] mx-auto px-6 md:px-10 my-10 pb-20">
        
        {/* 🔐 VAULT HEADER HUD */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 border-b border-white/5 pb-6">
          <div>
            <span style={{ color: "#C5A059", fontSize: "10px", fontWeight: 900, letterSpacing: "3px", display: "block", marginBottom: "4px", textTransform: "uppercase" }}>
              Sovereign Asset Secure Escrow
            </span>
            <h1 style={{ color: "#ffffff", fontSize: "28px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "1px", margin: 0 }}>
              Financial Vault
            </h1>
          </div>

          {/* Dynamic Tab Navigation Engine */}
          <div className="flex items-center gap-2 bg-[#05292e] p-1.5 rounded-xl border border-white/5 overflow-x-auto">
            <button onClick={() => setActiveTab("OVERVIEW")} style={{ ...styles.tabBtn, backgroundColor: activeTab === "OVERVIEW" ? "rgba(197, 160, 89, 0.1)" : "transparent", color: activeTab === "OVERVIEW" ? "#C5A059" : "#94a3b8" }}>
              <PieChart size={14} /> Overview
            </button>
            <button onClick={() => setActiveTab("INVENTORY")} style={{ ...styles.tabBtn, backgroundColor: activeTab === "INVENTORY" ? "rgba(197, 160, 89, 0.1)" : "transparent", color: activeTab === "INVENTORY" ? "#C5A059" : "#94a3b8" }}>
              <Layers size={14} /> Inventory
            </button>
            <button onClick={() => setActiveTab("FINANCIALS")} style={{ ...styles.tabBtn, backgroundColor: activeTab === "FINANCIALS" ? "rgba(197, 160, 89, 0.1)" : "transparent", color: activeTab === "FINANCIALS" ? "#C5A059" : "#94a3b8" }}>
              <Coins size={14} /> Financials
            </button>
          </div>
        </div>

        {/* 📊 ACTIVE WORKSPACE DISPLAY */}
        {activeTab === "FINANCIALS" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
            
            {/* GRID 1: MASTER METRIC CARD CLUSTER */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Total Revenue Card */}
              <div style={styles.vaultMetricCard}>
                <span style={styles.metricLabel}>TOTAL LIQUID REVENUE</span>
                <h2 style={styles.metricValue}>$1,134,350</h2>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "12px", color: "#10b981", fontSize: "12px", fontWeight: 700 }}>
                  <TrendingUp size={14} /> +12.4% PERFORMANCE INDICATOR
                </div>
              </div>

              {/* Active Bidding Escrow Card */}
              <div style={styles.vaultMetricCard}>
                <span style={styles.metricLabel}>ACTIVE BIDDING POOL</span>
                <h2 style={styles.metricValue}>$420,000</h2>
                <div style={{ marginTop: "12px", color: "#94a3b8", fontSize: "11px", fontWeight: 700, letterSpacing: "0.05em" }}>
                  CURRENT SILENT EVENTS RUNNING
                </div>
              </div>

              {/* CRITICAL WARNING CARD */}
              <div style={{ ...styles.vaultMetricCard, border: "1px solid rgba(239, 68, 68, 0.25)", backgroundColor: "rgba(239, 68, 68, 0.02)" }}>
                <span style={{ ...styles.metricLabel, color: "#ef4444" }}>ACTION REQUIRED</span>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "12px" }}>
                  <ShieldAlert size={24} color="#ef4444" />
                  <span style={{ fontSize: "20px", fontWeight: 900, color: "#ffffff" }}>1 Failed Settlement</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "10px" }}>
                  <span style={{ color: "#94a3b8", fontSize: "12px", fontWeight: 700 }}>RESOLVE IDENTITY MISMATCH</span>
                  <button style={styles.miniFixBtn}>Fix Now</button>
                </div>
              </div>

            </div>

            {/* BLOCK 2: SECURED FINANCIAL LEDGER */}
            <div style={{ backgroundColor: "#05292e", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "24px", padding: "32px", boxSizing: "border-border" }}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                  <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.05em", color: "#ffffff" }}>
                    Financial Ledger Manifest
                  </h3>
                  <p style={{ margin: "4px 0 0 0", color: "#94a3b8", fontSize: "12px" }}>
                    Cryptographically stamped clearing logs tracking platform payouts and reserve settlements.
                  </p>
                </div>
                <button style={styles.exportBtn}>
                  <Download size={14} /> Export QuickBooks
                </button>
              </div>

              {/* LEDGER LINES TRAIN */}
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                
                {/* Row 1: Studio 64 */}
                <div style={styles.ledgerRow}>
                  <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    <div style={{ ...styles.statusIndicatorCircle, backgroundColor: "rgba(16, 185, 129, 0.08)", color: "#10b981" }}>
                      <TrendingUp size={16} />
                    </div>
                    <div>
                      <h4 style={styles.ledgerRowTitle}>Studio 64 Settlement</h4>
                      <span style={styles.ledgerRowMeta}>APR 22 • BAZ-TX-9901</span>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={styles.ledgerRowAmountPositive}>+$1,078,000</div>
                    <span style={styles.ledgerRowBadgeSuccess}>Settled</span>
                  </div>
                </div>

                {/* Row 2: Sovereign Mobility */}
                <div style={{ ...styles.ledgerRow, border: "1px solid rgba(239,68,68,0.15)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    <div style={{ ...styles.statusIndicatorCircle, backgroundColor: "rgba(239, 68, 68, 0.08)", color: "#ef4444" }}>
                      <AlertTriangle size={16} />
                    </div>
                    <div>
                      <h4 style={styles.ledgerRowTitle}>Sovereign Mobility #04</h4>
                      <span style={styles.ledgerRowMeta}>APR 24 • BAZ-TX-9905</span>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={styles.ledgerRowAmountNegative}>Retry</div>
                    <span style={styles.ledgerRowBadgeDanger}>Urgent</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        )}

        {/* PLACEHOLDER SLOTS FOR ALTERNATIVE TAB VIEWS */}
        {activeTab === "OVERVIEW" && (
          <div style={styles.emptyVaultCard}>
            <PieChart size={36} color="#C5A059" style={{ marginBottom: "12px" }} />
            <h4 style={{ margin: 0, textTransform: "uppercase" }}>Vault Asset Distribution</h4>
            <p style={{ color: "#94a3b8", fontSize: "13px", maxWidth: "400px" }}>Graphical macro metrics of capital spreads across global free-trade coordinates will stream here.</p>
          </div>
        )}

        {activeTab === "INVENTORY" && (
          <div style={styles.emptyVaultCard}>
            <Layers size={36} color="#C5A059" style={{ marginBottom: "12px" }} />
            <h4 style={{ margin: 0, textTransform: "uppercase" }}>Escrowed Inventory Blocks</h4>
            <p style={{ color: "#94a3b8", fontSize: "13px", maxWidth: "400px" }}>Real-time titles, physical bills of lading, and verified asset deeds held in system clearing contracts.</p>
          </div>
        )}

      </div>
    </div>
  );
}

// --- Luxury Cryptographic Theme Styling ---
const styles = {
  tabBtn: { border: "none", display: "flex", alignItems: "center", gap: "8px", padding: "8px 16px", borderRadius: "8px", fontSize: "12px", fontWeight: 900, cursor: "pointer", transition: "all 0.2s" },
  vaultMetricCard: { backgroundColor: "#05292e", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "20px", padding: "24px", display: "flex", flexDirection: "column" as const, boxSizing: "border-box" as const },
  metricLabel: { color: "#C5A059", fontSize: "10px", fontWeight: 900, letterSpacing: "0.08em", textTransform: "uppercase" as const },
  metricValue: { color: "#ffffff", fontSize: "36px", fontWeight: 900, fontFamily: "sans-serif", margin: "8px 0 0 0", letterSpacing: "-0.5px" },
  miniFixBtn: { backgroundColor: "#ef4444", color: "#ffffff", border: "none", fontSize: "10px", fontWeight: 900, padding: "4px 8px", borderRadius: "4px", cursor: "pointer", marginLeft: "auto" },
  
  exportBtn: { backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#ffffff", display: "flex", alignItems: "center", gap: "8px", padding: "10px 18px", borderRadius: "10px", fontSize: "11px", fontWeight: 900, cursor: "pointer", textTransform: "uppercase" as const },
  ledgerRow: { backgroundColor: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.03)", borderRadius: "16px", padding: "20px", display: "flex", alignItems: "center", justifyContent: "space-between", boxSizing: "border-box" as const },
  statusIndicatorCircle: { width: "40px", height: "40px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" },
  ledgerRowTitle: { color: "#ffffff", margin: 0, fontSize: "14px", fontWeight: 800 },
  ledgerRowMeta: { color: "#64748b", fontSize: "11px", fontWeight: 700, display: "block", marginTop: "4px" },
  ledgerRowAmountPositive: { color: "#10b981", fontSize: "16px", fontWeight: 900, fontFamily: "monospace" },
  ledgerRowAmountNegative: { color: "#ef4444", fontSize: "16px", fontWeight: 900, textTransform: "uppercase" as const },
  ledgerRowBadgeSuccess: { color: "#10b981", backgroundColor: "rgba(16,185,129,0.08)", padding: "2px 8px", borderRadius: "4px", fontSize: "10px", fontWeight: 900, textTransform: "uppercase" as const, display: "inline-block", marginTop: "4px" },
  ledgerRowBadgeDanger: { color: "#ef4444", backgroundColor: "rgba(239,68,68,0.08)", padding: "2px 8px", borderRadius: "4px", fontSize: "10px", fontWeight: 900, textTransform: "uppercase" as const, display: "inline-block", marginTop: "4px" },

  emptyVaultCard: { backgroundColor: "#05292e", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "20px", padding: "8px 0", display: "flex", flexDirection: "column" as const, alignItems: "center", justifyContent: "center", textAlign: "center" as const, minHeight: "300px" }
};
