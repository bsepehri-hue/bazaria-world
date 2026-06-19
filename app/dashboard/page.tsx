"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/app/providers/AuthProvider";
import TopNav from "@/app/components/ui/TopNav";
import { db } from "@/lib/firebase/client";
import { collection, query, where, onSnapshot, doc, getDoc, setDoc } from "firebase/firestore";
import Link from "next/link";
import { 
  BarChart3, 
  Package, 
  Truck, 
  MessageSquare, 
  DollarSign, 
  Clock,
  Layers,
  Loader2,
  Search,
  ShieldAlert,
  ArrowRight,
  IdCard,
  Save,
  CheckCircle,
  AlertCircle
} from "lucide-react";

// 🎯 Added REGISTRY to core state dictionary layout
type ConsoleTab = "OVERVIEW" | "INVENTORY" | "ORDERS" | "INBOX" | "REGISTRY";

export default function MerchantConsolePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // --- 1. CORE LIVING STATES ---
  const [activeTab, setActiveTab] = useState<ConsoleTab>("OVERVIEW");
  const [pageLoading, setPageLoading] = useState(true);
  
  // Real-Time Analytics Matrix Aggregations
  const [metrics, setMetrics] = useState({
    grossVolume: 0,
    activeInventoryCount: 0,
    pendingDispatchCount: 0
  });

  // Dynamic Data Stream Pools
  const [orders, setOrders] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [orderTab, setOrderTab] = useState("all"); // all, standard, high-ticket

  // 📝 REGISTRY SUBMISSION FORM PROFILE STATES
  const [storeName, setStoreName] = useState("");
  const [categoryFocus, setCategoryFocus] = useState("");
  const [kioskDescription, setKioskDescription] = useState("");
  const [registrySaving, setRegistrySaving] = useState(false);
  const [registrySuccess, setRegistrySuccess] = useState(false);
  const [registryError, setRegistryError] = useState<string | null>(null);

  // 🎯 URL Parameter Watcher Map
  useEffect(() => {
    const tabParam = searchParams.get('tab')?.toUpperCase();
    if (tabParam === "BIDS" || tabParam === "OVERVIEW") {
      setActiveTab("OVERVIEW");
    } else if (tabParam === "LISTINGS" || tabParam === "INVENTORY") {
      setActiveTab("INVENTORY");
    } else if (tabParam === "ORDERS" || tabParam === "FULFILLMENT") {
      setActiveTab("ORDERS");
    } else if (tabParam === "REGISTRY") {
      setActiveTab("REGISTRY");
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

  // ─────────────────────────────────────────────────────────────────────────────
  // 🛰️ REAL-TIME FIRESTORE DATA STREAM BINDINGS
  // ─────────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!user?.uid) return;

    // A. Track & Enumerate Live Storefront Listing Inventories
    const listingsRef = collection(db, "listings");
    const qListings = query(listingsRef, where("userId", "==", user.uid));
    
    const unsubscribeListings = onSnapshot(qListings, (snapshot) => {
      setMetrics(prev => ({
        ...prev,
        activeInventoryCount: snapshot.size
      }));
    }, (err) => console.error("Inventory pipeline error:", err));

    // B. Track Orders Pipeline to Compute Macro Balances & Pending Dispatches
    const ordersRef = collection(db, "orders");
    const qOrders = query(ordersRef, where("sellerId", "==", user.uid));

    const unsubscribeOrders = onSnapshot(qOrders, (snapshot) => {
      let volumeAccumulator = 0;
      let pendingDispatchAccumulator = 0;
      const orderDataList: any[] = [];

      snapshot.docs.forEach((docSnap) => {
        const order = docSnap.data();
        const fullOrderObj = { id: docSnap.id, ...order };
        orderDataList.push(fullOrderObj);

        const priceUSD = order.totalPriceUSD || 0;

        // Calculate settled revenue volume matching your accounting rules
        if (order.status === "completed") {
          volumeAccumulator += priceUSD;
        }
        
        // Track outstanding fulfillment loops
        if (order.status === "pending" || order.status === "shipped") {
          pendingDispatchAccumulator++;
        }
      });

      setMetrics(prev => ({
        ...prev,
        grossVolume: volumeAccumulator,
        pendingDispatchCount: pendingDispatchAccumulator
      }));
      setOrders(orderDataList);
    }, (err) => console.error("Orders channel pipeline error:", err));

    // 📥 C. One-time Fetch of Existing Registry Node State Data
    const fetchRegistryData = async () => {
      try {
        const docRef = doc(db, "storefronts", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setStoreName(data.storeName || "");
          setCategoryFocus(data.categoryFocus || "");
          setKioskDescription(data.kioskDescription || "");
        }
      } catch (err) {
        console.error("Failed to sync profile context states:", err);
      }
    };
    fetchRegistryData();

    return () => {
      unsubscribeListings();
      unsubscribeOrders();
    };
  }, [user]);

  // --- Secure Profile Registry Form Submissions ---
  const handleSaveRegistry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.uid) return;

    setRegistrySaving(true);
    setRegistrySuccess(false);
    setRegistryError(null);

    try {
      const docRef = doc(db, "storefronts", user.uid);
      await setDoc(docRef, {
        storeName: storeName.trim(),
        categoryFocus: categoryFocus.trim(),
        kioskDescription: kioskDescription.trim(),
        updatedAt: new Date().toISOString(),
      }, { merge: true });

      setRegistrySuccess(true);
      setTimeout(() => setRegistrySuccess(false), 4000);
    } catch (err) {
      console.error("Firestore submission failure:", err);
      setRegistryError("Failed to update database profile ledger mutations.");
    } finally {
      setRegistrySaving(false);
    }
  };

  // --- Search and Tab filtering for Freight Fulfillment Row Entries ---
  const filteredOrders = orders.filter((order) => {
    const s = searchTerm.toLowerCase().trim();
    const matchesSearch = s === "" || 
      order.id.toLowerCase().includes(s) || 
      (order.shippingAddress?.name || "").toLowerCase().includes(s);

    if (!matchesSearch) return false;

    const priceUSD = order.totalPriceUSD || 0;
    if (orderTab === "standard") return priceUSD < 5000;
    if (orderTab === "high-ticket") return priceUSD >= 5000;

    return true;
  });

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

        <div className="flex flex-col md:grid md:grid-cols-[280px_1fr] gap-8 items-start">
          
          {/* 🕹️ NAVIGATION TERMINAL ROW/STACK (Matches image_2b1c0b.png) */}
          <div className="w-full flex flex-row md:flex-col gap-2 bg-[#05292e] p-4 rounded-2xl border border-white/5 overflow-x-auto whitespace-nowrap md:whitespace-normal box-border">
            <button onClick={() => setActiveTab("OVERVIEW")} className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black cursor-pointer border-none transition-all flex-shrink-0 w-full text-left" style={{ backgroundColor: activeTab === "OVERVIEW" ? "rgba(255,191,0,0.08)" : "transparent", color: activeTab === "OVERVIEW" ? "#C5A059" : "#94a3b8" }}>
              <BarChart3 size={15} /> Terminal Overview
            </button>
            <button onClick={() => setActiveTab("INVENTORY")} className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black cursor-pointer border-none transition-all flex-shrink-0 w-full text-left" style={{ backgroundColor: activeTab === "INVENTORY" ? "rgba(255,191,0,0.08)" : "transparent", color: activeTab === "INVENTORY" ? "#C5A059" : "#94a3b8" }}>
              <Package size={15} /> Assets & Inventory
            </button>
            <button onClick={() => setActiveTab("ORDERS")} className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black cursor-pointer border-none transition-all flex-shrink-0 w-full text-left" style={{ backgroundColor: activeTab === "ORDERS" ? "rgba(255,191,0,0.08)" : "transparent", color: activeTab === "ORDERS" ? "#C5A059" : "#94a3b8" }}>
              <Truck size={15} /> Freight Fulfillment
            </button>
            <button onClick={() => setActiveTab("INBOX")} className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black cursor-pointer border-none transition-all flex-shrink-0 w-full text-left" style={{ backgroundColor: activeTab === "INBOX" ? "rgba(255,191,0,0.08)" : "transparent", color: activeTab === "INBOX" ? "#C5A059" : "#94a3b8" }}>
              <MessageSquare size={15} /> B2B Inquiry Desk
            </button>
            
            {/* 📍 NEW TARGET TAB TRIGGER: REGISTRY PROFILE NODE */}
            <button onClick={() => setActiveTab("REGISTRY")} className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black cursor-pointer border-none transition-all flex-shrink-0 w-full text-left" style={{ backgroundColor: activeTab === "REGISTRY" ? "rgba(255,191,0,0.08)" : "transparent", color: activeTab === "REGISTRY" ? "#C5A059" : "#94a3b8" }}>
              <IdCard size={15} /> Registry Node Profile
            </button>
          </div>

          {/* 🖥 nudge DISPLAY RENDER PORT */}
          <div style={{ width: "100%", boxSizing: "border-box" }}>
            
            {/* 📈 TAB 1: TERMINAL OVERVIEW CONTROL PANEL */}
            {activeTab === "OVERVIEW" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  
                  <div style={styles.kpiCard}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                      <span style={styles.kpiLabel}>GROSS ECONOMIC VOLUME</span>
                      <DollarSign size={16} color="#C5A059" />
                    </div>
                    <div style={{ display: "flex", alignItems: "baseline", gap: "10px", marginTop: "12px" }}>
                      <span style={styles.kpiValue}>
                        ${metrics.grossVolume.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </span>
                      <span style={{ color: "#64748b", fontSize: "11px", fontWeight: 700 }}>USD</span>
                    </div>
                    <div style={styles.kpiFooter}>
                      {metrics.grossVolume > 0 ? "Vault clearance systems reconciled" : "Stripe Connect Ledger tracking inactive"}
                    </div>
                  </div>

                  <div style={styles.kpiCard}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                      <span style={styles.kpiLabel}>ACTIVE POOL INVENTORY</span>
                      <Layers size={16} color="#C5A059" />
                    </div>
                    <div style={{ display: "flex", alignItems: "baseline", gap: "10px", marginTop: "12px" }}>
                      <span style={styles.kpiValue}>{metrics.activeInventoryCount}</span>
                      <span style={{ color: "#64748b", fontSize: "11px", fontWeight: 700 }}>ASSETS LISTED</span>
                    </div>
                    <div style={styles.kpiFooter}>Live collection entries running</div>
                  </div>

                  <div style={styles.kpiCard}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                      <span style={styles.kpiLabel}>PENDING DISPATCH TARGETS</span>
                      <Clock size={16} color="#C5A059" />
                    </div>
                    <div style={{ display: "flex", alignItems: "baseline", gap: "10px", marginTop: "12px" }}>
                      <span style={styles.kpiValue}>{metrics.pendingDispatchCount}</span>
                      <span style={{ color: "#64748b", fontSize: "11px", fontWeight: 700 }}>ORDERS</span>
                    </div>
                    <div style={styles.kpiFooter}>
                      {metrics.pendingDispatchCount > 0 ? "Fulfillment streams require attention" : "Fulfillment streams perfectly cleared"}
                    </div>
                  </div>

                </div>

                <div style={{ backgroundColor: "#05292e", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "20px", padding: "40px", display: "flex", flexDirection: "column", gap: "16px" }}>
                  <h3 style={{ color: "#ffffff", fontSize: "16px", fontWeight: 900, margin: 0, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    🚀 Initialize Marketplace Node
                  </h3>
                  <p style={{ color: "#cbd5e1", fontSize: "13px", lineHeight: "1.6", margin: 0, maxWidth: "680px" }}>
                    Welcome to your custom workspace cockpit. Manage active auction bids, coordinate logistics, generate tracking data updates, and audit your deep Vault settlement ledgers.
                  </p>
                  <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
                    <button onClick={() => setActiveTab("REGISTRY")} style={{ backgroundColor: "#FFBF00", color: "#021a1d", border: "none", padding: "10px 18px", borderRadius: "8px", fontSize: "12px", fontWeight: 900, cursor: "pointer" }}>
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
                <h4 style={styles.panelTitle}>Active Pool Inventory ({metrics.activeInventoryCount})</h4>
                <p style={styles.panelDesc}>Manage items currently distributed to the public marketplace pipelines.</p>
                <button onClick={() => router.push("/market/create")} style={styles.actionBtn}>
                  + Create New List-To-Bid Asset
                </button>
              </div>
            )}

            {/* 🚚 TAB 3: FREIGHT FULFILLMENT TRUCKING TERMINAL */}
            {activeTab === "ORDERS" && (
              <div className="space-y-6">
                <div className="bg-[#05292e] p-4 rounded-xl border border-white/5 flex flex-col sm:flex-row gap-4 items-center justify-between">
                  <div className="relative w-full sm:w-80">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search Order Number, Customer..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9 w-full rounded-lg bg-[#021a1d] border-white/10 text-white placeholder-gray-400 text-sm focus:border-amber-500 outline-none h-9 border"
                    />
                  </div>
                  <div className="flex gap-1 bg-[#021a1d] p-1 rounded-lg text-[10px] font-black uppercase tracking-wide">
                    {[
                      { id: "all", label: "All Traces" },
                      { id: "standard", label: "Standard (<$5k)" },
                      { id: "high-ticket", label: "Escrow Locked (≥$5k)" }
                    ].map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setOrderTab(tab.id)}
                        className={`px-3 py-1.5 rounded-md transition-all ${
                          orderTab === tab.id ? "bg-[#FFBF00] text-[#021a1d]" : "text-gray-400 hover:text-white"
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-[#05292e] rounded-xl border border-white/5 overflow-hidden shadow-2xl">
                  {filteredOrders.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-[#021a1d] text-gray-400 font-bold uppercase tracking-wider text-[10px] border-b border-white/5">
                            <th className="py-3.5 px-5">Order Reference</th>
                            <th className="py-3.5 px-5">Acquisition Classification</th>
                            <th className="py-3.5 px-5">Customer Record</th>
                            <th className="py-3.5 px-5 text-right">Value (USD)</th>
                            <th className="py-3.5 px-5 text-center">Fulfillment Status</th>
                            <th className="py-3.5 px-5"></th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-xs text-gray-200">
                          {filteredOrders.map((order) => {
                            const isHighEscrow = (order.totalPriceUSD || 0) >= 5000;
                            return (
                              <tr key={order.id} className="hover:bg-white/[0.02] transition">
                                <td className="py-4 px-5 font-mono font-bold text-amber-500">#{order.id.slice(0, 8)}...</td>
                                <td className="py-4 px-5">
                                  {isHighEscrow ? (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold">
                                      <ShieldAlert className="w-3 h-3 mr-1" /> High Escrow
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded bg-teal-500/10 text-teal-400 border border-teal-500/20 font-bold">
                                      Standard Retail
                                    </span>
                                  )}
                                </td>
                                <td className="py-4 px-5 font-medium">{order.shippingAddress?.name || "Verified Client"}</td>
                                <td className="py-4 px-5 text-right font-black text-white">${(order.totalPriceUSD || 0).toLocaleString()}</td>
                                <td className="py-4 px-5 text-center">
                                  <span className={`inline-block font-black tracking-wide text-[10px] uppercase px-2.5 py-0.5 rounded-full border ${
                                    order.status === "completed" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                                  }`}>
                                    {order.status || "Pending"}
                                  </span>
                                </td>
                                <td className="py-4 px-5 text-right">
                                  <Link
                                    href={`/orders/${order.id}`}
                                    className="inline-flex items-center text-amber-400 font-bold hover:text-amber-300 transition group"
                                  >
                                    Ledger <ArrowRight className="w-3 h-3 ml-1 transform group-hover:translate-x-0.5 transition" />
                                  </Link>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="py-16 text-center text-gray-400 space-y-3">
                      <Truck size={36} className="mx-auto opacity-30 text-[#C5A059]" />
                      <h4 className="font-bold text-white uppercase tracking-wider text-sm">No Matching Logs Found</h4>
                      <p className="text-xs text-gray-400 max-w-xs mx-auto">No client invoices correlate to those search bounds inside the ledger streams.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

           {/* 💬  TAB 4: CLIENT INTERACTION INBOX */}
            {activeTab === "INBOX" && (
              <div style={styles.emptyPanelCard}>
                <MessageSquare size={36} color="#C5A059" style={{ marginBottom: "16px" }} />
                {/* 🎯 FIXED: Removed the extra .styles */}
                <h4 style={styles.panelTitle}>B2B Inquiry Desk Stream Silent</h4>
                <p style={styles.panelDesc}>Incoming client request channels are clear. Customer price offers or bulk cargo quotes will stream here instantly.</p>
              </div>
            )}

            {/* 🛠️ TAB 5: NEW REGISTRY PROFILE CONFIGURATION PANEL */}
            {activeTab === "REGISTRY" && (
              <div style={{ backgroundColor: "#05292e", border: "1px solid rgba(255, 255, 255, 0.05)", borderRadius: "20px", padding: "40px" }}>
                <div style={{ marginBottom: "28px" }}>
                  <h3 style={{ color: "#C5A059", fontSize: "16px", fontWeight: 900, margin: "0 0 6px 0", textTransform: "uppercase", letterSpacing: "0.05em", fontFamily: "monospace" }}>
                    // Directory Kiosk Node Profile
                  </h3>
                  <p style={{ color: "#cbd5e1", fontSize: "13px", lineHeight: "1.5", margin: 0 }}>
                    Configure the presentation profiles that feed into the Marketplace Directory board index and map live parameters straight to the AI Concierge routing models.
                  </p>
                </div>

                <form onSubmit={handleSaveRegistry} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                  
                  {/* Field 1: Store Name */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label style={{ fontSize: "10px", fontWeight: 900, textTransform: "uppercase", color: "#C5A059", letterSpacing: "0.05em", fontFamily: "monospace" }}>
                      Public Brand Name Identifier
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., White Pearl Fine Jewelry"
                      value={storeName}
                      onChange={(e) => setStoreName(e.target.value)}
                      style={styles.terminalInput}
                    />
                  </div>

                  {/* Field 2: Categories */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label style={{ fontSize: "10px", fontWeight: 900, textTransform: "uppercase", color: "#C5A059", letterSpacing: "0.05em", fontFamily: "monospace" }}>
                      Inventory Classification Tags (Comma Separated)
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., Fine Jewelry, Pearls, Luxury Watches"
                      value={categoryFocus}
                      onChange={(e) => setCategoryFocus(e.target.value)}
                      style={styles.terminalInput}
                    />
                  </div>

                  {/* Field 3: Kiosk Description Pitch */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label style={{ fontSize: "10px", fontWeight: 900, textTransform: "uppercase", color: "#C5A059", letterSpacing: "0.05em", fontFamily: "monospace" }}>
                      Boutique Presentation elevator pitch (Max 300 characters)
                    </label>
                    <textarea
                      required
                      rows={4}
                      maxLength={300}
                      placeholder="Give your absolute best old-school presentation paragraph to describe your products and bring hope to the directory map..."
                      value={kioskDescription}
                      onChange={(e) => setKioskDescription(e.target.value)}
                      style={{ ...styles.terminalInput, resize: "none", lineHeight: "1.6" }}
                    />
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#94a3b8", marginTop: "4px", fontFamily: "monospace" }}>
                      <span>Inputs map directly to active search index arrays.</span>
                      <span>{kioskDescription.length}/300</span>
                    </div>
                  </div>

                  {/* Error Prompt Guard */}
                  {registryError && (
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "12px 16px", backgroundColor: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.2)", borderRadius: "8px", color: "#f87171", fontSize: "13px" }}>
                      <AlertCircle size={16} />
                      <span>{registryError}</span>
                    </div>
                  )}

                  {/* Form Submission Footer Actions */}
                  <div style={{ display: "flex", alignItems: "center", gap: "16px", marginTop: "8px", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "20px" }}>
                    <button
                      type="submit"
                      disabled={registrySaving}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "8px",
                        backgroundColor: registrySaving ? "#475569" : "#FFBF00",
                        color: "#021a1d",
                        border: "none",
                        padding: "12px 24px",
                        borderRadius: "8px",
                        fontSize: "12px",
                        fontWeight: 900,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        cursor: registrySaving ? "not-allowed" : "pointer",
                        transition: "background-color 0.2s"
                      }}
                    >
                      {registrySaving ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} />}
                      <span>{registrySaving ? "Syncing ledger..." : "Commit Profile Changes"}</span>
                    </button>

                    {/* Live Broadcast Success Toast */}
                    {registrySuccess && (
                      <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "#4ade80", fontSize: "12px", fontWeight: "bold", fontFamily: "monospace" }}>
                        <CheckCircle size={14} />
                        <span>REGISTRY UPDATE BROADCAST SUCCESSFUL</span>
                      </div>
                    )}
                  </div>

                </form>
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
  
  emptyPanelCard: { backgroundColor: "#05292e", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "20px", padding: "60px 40px", display: "flex", flexDirection: "column" as const, alignItems: "center", justifyBox: "center", justifyContent: "center", textAlign: "center" as const, boxSizing: "border-box" as const },
  panelTitle: { color: "#ffffff", fontSize: "16px", fontWeight: 800, margin: "0 0 8px 0", textTransform: "uppercase" as const, letterSpacing: "0.03em" },
  panelDesc: { color: "#94a3b8", fontSize: "13px", lineHeight: "1.6", margin: "0 0 24px 0", maxWidth: "440px" },
  actionBtn: { backgroundColor: "#FFBF00", color: "#021a1d", border: "none", padding: "12px 20px", borderRadius: "8px", fontSize: "12px", fontWeight: 900, cursor: "pointer" },
  
  // Terminal Forms Input Shared Object Style
  terminalInput: {
    width: "100%",
    padding: "12px 16px",
    fontSize: "14px",
    backgroundColor: "rgba(2, 26, 29, 0.6)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "10px",
    color: "#ffffff",
    outline: "none",
    boxSizing: "border-box" as const,
    focusBorderColor: "#FFBF00"
  }
};
