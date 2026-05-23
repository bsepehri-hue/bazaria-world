"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/providers/AuthProvider";
import TopNav from "@/app/components/ui/TopNav";
import { 
  BarChart3, 
  Package, 
  Truck, 
  MessageSquare, 
  TrendingUp, 
  Layers, 
  ArrowUpRight, 
  DollarSign, 
  Clock,
  Loader2
} from "lucide-react";
import { useSearchParams } from 'next/navigation';

type ConsoleTab = "OVERVIEW" | "INVENTORY" | "ORDERS" | "INBOX";

export default function MerchantConsolePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<ConsoleTab>("OVERVIEW");
  const [pageLoading, setPageLoading] = useState(true);
  const searchParams = useSearchParams(); // 🛰️ Keep this one!

  // 🎯 READ THE URL TAB PARAMETER AND UPDATE THE STATE AUTOMATICALLY
  useEffect(() => {
    const tabParam = searchParams.get('tab')?.toUpperCase();
    
    // Safety check: Make sure the URL param matches one of your valid ConsoleTabs
    if (tabParam === "BIDS" || tabParam === "OVERVIEW") {
      setActiveTab("OVERVIEW"); // Maps bids tracking to your main overview module
    } else if (tabParam === "LISTINGS" || tabParam === "INVENTORY") {
      setActiveTab("INVENTORY"); // Maps listings straight to your inventory view
    }
  }, [searchParams]);

  // --- Auth Route Protection Gate ---
  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push("/login");
      return;
    }
    setPageLoading(false);
  }, [user, authLoading, router]);

  if (authLoading || pageLoading) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#021a1d", display: "flex", alignItems: "center", justifyBox: "center", justifyContent: "center", color: "#C5A059" }}>
        <Loader2 className="animate-spin" size={32} />
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#021a1d", color: "#ffffff", position: "relative", overflowX: "hidden" }}>
      <TopNav />

      <div className="max-w-[1400px] mx-auto px-6 md:px-10 my-10 pb-20">
        
        {/* 🏢 MAIN HEADER HUD BLOCK */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 border-b border-white/5 pb-6">
          <div>
            <h1 style={{ color: "#ffffff", fontSize: "28px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "1px", margin: 0 }}>
              Merchant Console
            </h1>
            <p style={{ color: "#94a3b8", fontSize: "13px", marginTop: "6px", margin: "6px 0 0 0" }}>
              Operational control station for asset lifecycles, clearing balances, and freight dispatch.
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "11px", fontWeight: 900, color: "#C5A059", backgroundColor: "rgba(197, 160, 89, 0.08)", padding: "6px 14px", borderRadius: "50px", border: "1px solid rgba(197, 160, 89, 0.2)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              📍 System Online
            </span>
          </div>
        </div>

        {/* RESPONSIVE LAYOUT ENGINE: Vertical Stack on Mobile, Grid on Monitors */}
        <div className="flex flex-col md:grid md:grid-cols-[280px_1fr] gap-8 items-start">
          
          {/* 🕹️ NAVIGATION TERMINAL ROW/STACK */}
          <div className="w-full flex flex-row md:flex-col gap-2 bg-[#05292e] p-4 rounded-2xl border border-white/5 overflow-x-auto whitespace-nowrap md:whitespace-normal box-border">
            <button onClick={() => setActiveTab("OVERVIEW")} className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black cursor-pointer border-none transition-all flex-shrink-0" style={{ backgroundColor: activeTab === "OVERVIEW" ? "rgba(255,191,0,0.08)" : "transparent", color: activeTab === "OVERVIEW" ? "#C5A059" : "#94a3b8" }}>
              <BarChart3 size={15} /> Terminal Overview
            </button>
            <button onClick={() => setActiveTab("INVENTORY")} className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black cursor-pointer border-none transition-all flex-shrink-0" style={{ backgroundColor: activeTab === "INVENTORY" ? "rgba(255,191,0,0.08)" : "transparent", color: activeTab === "INVENTORY" ? "#C5A059" : "#94a3b8" }}>
              <Package size={15} /> Assets & Inventory
            </button>
            <button onClick={() => setActiveTab("ORDERS")} className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black cursor-pointer border-none transition-all flex-shrink-0" style={{ backgroundColor: activeTab === "ORDERS" ? "rgba(255,191,0,0.08)" : "transparent", color: activeTab === "ORDERS" ? "#C5A059" : "#94a3b8" }}>
              <Truck size={15} /> Freight Fulfillment
            </button>
            <button onClick={() => setActiveTab("INBOX")} className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black cursor-pointer border-none transition-all flex-shrink-0" style={{ backgroundColor: activeTab === "INBOX" ? "rgba(255,191,0,0.08)" : "transparent", color: activeTab === "INBOX" ? "#C5A059" : "#94a3b8" }}>
              <MessageSquare size={15} /> B2B Inquiry Desk
            </button>
          </div>

          {/* 🖥️ PRIVATE ACTIVE DISPLAY PANEL */}
          <div style={{ width: "100%", boxSizing: "border-box" }}>
            
            {/* 📈 TAB 1: TERMINAL OVERVIEW CONTROL PANEL */}
            {activeTab === "OVERVIEW" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
                
                {/* Real-time KPI Card Metrics Cluster */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  
                  <div style={styles.kpiCard}>
                    <div style={{ display: "flex", justifyContent: "between", alignItems: "center", width: "100%" }}>
                      <span style={styles.kpiLabel}>GROSS ECONOMIC VOLUME</span>
                      <DollarSign size={16} color="#C5A059" />
                    </div>
                    <div style={{ display: "flex", alignItems: "baseline", gap: "10px", marginTop: "12px" }}>
                      <span style={styles.kpiValue}>$0.00</span>
                      <span style={{ color: "#64748b", fontSize: "11px", fontWeight: 700 }}>USD</span>
                    </div>
                    <div style={styles.kpiFooter}>Stripe Connect Ledger tracking inactive</div>
                  </div>

                  <div style={styles.kpiCard}>
                    <div style={{ display: "flex", justifyContent: "between", alignItems: "center", width: "100%" }}>
                      <span style={styles.kpiLabel}>ACTIVE POOL INVENTORY</span>
                      <Layers size={16} color="#C5A059" />
                    </div>
                    <div style={{ display: "flex", alignItems: "baseline", gap: "10px", marginTop: "12px" }}>
                      <span style={styles.kpiValue}>0</span>
                      <span style={{ color: "#64748b", fontSize: "11px", fontWeight: 700 }}>ASSETS LISTED</span>
                    </div>
                    <div style={styles.kpiFooter}>0 live auction tracks running</div>
                  </div>

                  <div style={styles.kpiCard}>
                    <div style={{ display: "flex", justifyContent: "between", alignItems: "center", width: "100%" }}>
                      <span style={styles.kpiLabel}>PENDING DISPATCH TARGETS</span>
                      <Clock size={16} color="#C5A059" />
                    </div>
                    <div style={{ display: "flex", alignItems: "baseline", gap: "10px", marginTop: "12px" }}>
                      <span style={styles.kpiValue}>0</span>
                      <span style={{ color: "#64748b", fontSize: "11px", fontWeight: 700 }}>ORDERS</span>
                    </div>
                    <div style={styles.kpiFooter}>Fulfillment streams perfectly cleared</div>
                  </div>

                </div>

                {/* Main Dashboard Interactive Onboarding Card */}
                <div style={{ backgroundColor: "#05292e", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "20px", padding: "40px", display: "flex", flexDirection: "column", gap: "16px" }}>
                  <h3 style={{ color: "#ffffff", fontSize: "16px", fontWeight: 900, margin: 0, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    🚀 Initialize Marketplace Node
                  </h3>
                  <p style={{ color: "#cbd5e1", fontSize: "13px", lineHeight: "1.6", margin: 0, maxWidth: "680px" }}>
                    Welcome to your custom workspace cockpit. Starting Monday, once your corporate verification gates clear, this private terminal will live-stream active auction bids, generate carrier shipping labels, and display pending Stripe balance payments.
                  </p>
                  <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
                    <button onClick={() => router.push("/dashboard/settings?tab=branding")} style={{ backgroundColor: "#FFBF00", color: "#021a1d", border: "none", padding: "10px 18px", borderRadius: "8px", fontSize: "12px", fontWeight: 900, cursor: "pointer" }}>
                      Configure Storefront Identity
                    </button>
                  </div>
                </div>

              </div>
            )}

            {/* 📦 TAB 2: PRODUCT MANAGEMENT CATALOG LAYOUT */}
            {activeTab === "INVENTORY" && (
              <div style={styles.emptyPanelCard}>
                <Package size={36} color="#C5A059" style={{ marginBottom: "16px" }} />
                <h4 style={styles.panelTitle}>No Active Pool Inventory</h4>
                <p style={styles.panelDesc}>Your public boutique catalog database is empty. Ready your item parameters and launch them directly to the marketplace.</p>
                <button onClick={() => router.push("/market/create")} style={styles.actionBtn}>
                  + Create First List-To-Bid Asset
                </button>
              </div>
            )}

            {/* 🚚 TAB 3: FREIGHT fulfillment TRUCKING TERMINAL */}
            {activeTab === "ORDERS" && (
              <div style={styles.emptyPanelCard}>
                <Truck size={36} color="#C5A059" style={{ marginBottom: "16px" }} />
                <h4 style={styles.panelTitle}>Logistics Manifest Cleared</h4>
                <p style={styles.panelDesc}>No pending customer purchase invoices require dispatch verification or freight sorting flags.</p>
              </div>
            )}

            {/* 💬 TAB 4: CLIENT INTERACTION INBOX */}
            {activeTab === "INBOX" && (
              <div style={styles.emptyPanelCard}>
                <MessageSquare size={36} color="#C5A059" style={{ marginBottom: "16px" }} />
                <h4 style={styles.panelTitle}>B2B Inquiry Desk Stream Silent</h4>
                <p style={styles.panelDesc}>Incoming client request channels are clear. Customer price offers or bulk cargo quotes will stream here instantly.</p>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

// --- High-End Luxury Style Dictionary ---
const styles = {
  kpiCard: { backgroundColor: "#05292e", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "16px", padding: "24px", display: "flex", flexDirection: "column" as const, boxSizing: "border-box" as const },
  kpiLabel: { color: "#C5A059", fontSize: "10px", fontWeight: 900, letterSpacing: "0.05em" },
  kpiValue: { color: "#ffffff", fontSize: "28px", fontWeight: 900, fontFamily: "sans-serif" },
  kpiFooter: { color: "#94a3b8", fontSize: "11px", marginTop: "12px", borderTop: "1px solid rgba(255,255,255,0.04)", paddingTop: "10px" },
  
  emptyPanelCard: { backgroundColor: "#05292e", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "20px", padding: "60px 40px", display: "flex", flexDirection: "column" as const, alignItems: "center", justifyContent: "center", textAlign: "center" as const, boxSizing: "border-box" as const },
  panelTitle: { color: "#ffffff", fontSize: "16px", fontWeight: 800, margin: "0 0 8px 0", textTransform: "uppercase" as const, letterSpacing: "0.03em" },
  panelDesc: { color: "#94a3b8", fontSize: "13px", lineHeight: "1.6", margin: "0 0 24px 0", maxWidth: "440px" },
  actionBtn: { backgroundColor: "#FFBF00", color: "#021a1d", border: "none", padding: "12px 20px", borderRadius: "8px", fontSize: "12px", fontWeight: 900, cursor: "pointer" }
};
