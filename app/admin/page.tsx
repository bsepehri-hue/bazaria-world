"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/providers/AuthProvider";
import { db } from "@/lib/firebase/client"; 
import { collection, getDocs, doc, updateDoc, query, where } from "firebase/firestore";
import TopNav from "@/app/components/ui/TopNav";
import { 
  Globe, 
  ShieldCheck, 
  Building2, 
  Container, 
  LineChart, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Users,
  Package,
  MessageSquare,
  Loader2,
  UserCheck, // 💼 Added for Agent Attestation icon
  Briefcase,
  FileText
} from "lucide-react";

// ✨ Updated to include AGENTS state rule
type AdminTab = "OVERVIEW" | "AUDITING" | "COMPLIANCE" | "LOGISTICS" | "ANALYTICS" | "SECURITY" | "AGENTS";

interface DashboardStats {
  totalUsers: number;
  totalListings: number;
  totalChats: number;
}

interface ListingItem {
  id: string;
  title: string;
  price: number;
  userId: string;
  status?: string;
}

// 📋 Strong typing for incoming Agent applications
interface AgentApplication {
  id: string;
  name: string;
  email: string;
  sector: string;
  bio: string;
  status: "PENDING_REVIEW" | "APPROVED" | "DECLINED";
  region: string;
  timestamp: string;
}

export default function RegionalAdminPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  
  // --- State Machines ---
  const [activeTab, setActiveTab] = useState<AdminTab>("OVERVIEW");
  const [pageLoading, setPageLoading] = useState(true);
  const [managerRegion, setManagerRegion] = useState<string>("GLOBAL"); // 🗺️ Holds manager's dynamic jurisdiction bound
  const [stats, setStats] = useState<DashboardStats>({ totalUsers: 0, totalListings: 0, totalChats: 0 });
  const [listings, setListings] = useState<ListingItem[]>([]);
  const [agentApps, setAgentApps] = useState<AgentApplication[]>([]);
  const [processingAgentId, setProcessingAgentId] = useState<string | null>(null);
  const [activeAgents, setActiveAgents] = useState<any[]>([]);

  // --- Strict Session Guard Rail ---
  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push("/login");
      return;
    }
    setPageLoading(false);
  }, [user, authLoading, router]);

 //  🛰️  Live Database Fetching Pipeline (Strictly Localized)
  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        // 1. Fetch ONLY the current manager's profile to resolve their jurisdiction
        // We import getDoc for this, not getDocs!
        const { getDoc } = await import("firebase/firestore"); 
        const adminDocRef = doc(db, "users", user?.uid as string);
        const adminSnap = await getDoc(adminDocRef);
        
        const resolvedRegion = adminSnap.exists() ? adminSnap.data().assignedRegion || "US-WEST-CA" : "US-WEST-CA";
        setManagerRegion(resolvedRegion);

        // 2. Execute strictly localized queries for this specific region
        const regionalUsersQuery = query(collection(db, "users"), where("region", "==", resolvedRegion));
        // Note: Ensure your listings and chats in Firebase actually have a "region" or "location" field saved to them!
        const regionalListingsQuery = query(collection(db, "listings"), where("region", "==", resolvedRegion)); 
        const regionalChatsQuery = query(collection(db, "chats"), where("region", "==", resolvedRegion));
        
        // Execute queries concurrently for speed
        const [usersSnap, listingsSnap, chatsSnap] = await Promise.all([
          getDocs(regionalUsersQuery),
          getDocs(regionalListingsQuery),
          getDocs(regionalChatsQuery)
        ]);

        // 3. Set strictly localized stats
        setStats({
          totalUsers: usersSnap.size,
          totalListings: listingsSnap.size,
          totalChats: chatsSnap.size
        });

       // 3.5 Extract Active Agents from the local users snapshot
        const loadedActiveAgents = usersSnap.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter((u: any) => u.role === "LISTING_AGENT" || u.agentStatus === "ACTIVE" || u.agentStatus === "SUSPENDED");
        setActiveAgents(loadedActiveAgents);
        
        // 4. Load strictly localized listings into the Audit Queue
        const loadedListings = listingsSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as ListingItem[];
        setListings(loadedListings);

        // 5. Localized Routing Query: Agent Applications
        const agentsQuery = query(
          collection(db, "agent_applications"),
          where("region", "==", resolvedRegion),
          where("status", "==", "PENDING_REVIEW")
        );
        const agentsSnap = await getDocs(agentsQuery);

        const loadedAgents = agentsSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as AgentApplication[];
        setAgentApps(loadedAgents);

      } catch (err) {
        console.error("Territory Data Sync Fault:", err);
      }
    };

    if (!authLoading && user) {
      fetchAdminData();
    }
  }, [user, authLoading]);

  // 🛠️ Asset Auditing Action Logic
  const handleUpdateStatus = async (listingId: string, newStatus: string) => {
    try {
      const docRef = doc(db, "listings", listingId);
      await updateDoc(docRef, { status: newStatus });
      
      setListings(prev => 
        prev.map(item => item.id === listingId ? { ...item, status: newStatus } : item)
      );
    } catch (err) {
      console.error("Failed to commit moderation action:", err);
    }
  };

  // 🔒 Agent Decision Engine
  const handleAgentDecision = async (applicationId: string, decision: "APPROVED" | "DECLINED") => {
    setProcessingAgentId(applicationId);
    try {
      // 1. Update status tracking in agent_applications ledger
      const appRef = doc(db, "agent_applications", applicationId);
      await updateDoc(appRef, { status: decision });

//  🛑  Agent Soft-Delete & Suspension Engine
  const handleToggleAgentStatus = async (agentId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === "SUSPENDED" ? "ACTIVE" : "SUSPENDED";
      const agentRef = doc(db, "users", agentId);
      
      // Update the database guardrail
      await updateDoc(agentRef, { agentStatus: newStatus });
      
      // Instantly update the local UI without reloading
      setActiveAgents(prev => 
        prev.map(agent => agent.id === agentId ? { ...agent, agentStatus: newStatus } : agent)
      );
    } catch (err) {
      console.error("Failed to toggle agent access vector:", err);
    }
  };
      
      // 2. If approved, elevate their underlying credentials role parameters
      if (decision === "APPROVED") {
        const targetApp = agentApps.find(app => app.id === applicationId);
        if (targetApp) {
          // Find matching user document tracking entry and switch profile flag configuration
          const userQuery = query(collection(db, "users"), where("email", "==", targetApp.email));
          const userSnap = await getDocs(userQuery);
          if (!userSnap.empty) {
            const userDocRef = doc(db, "users", userSnap.docs[0].id);
            await updateDoc(userDocRef, { role: "LISTING_AGENT", agentStatus: "ACTIVE" });
          }
        }
      }

      // Evict item cleanly from local UI queue array state cache
      setAgentApps(prev => prev.filter(app => app.id !== applicationId));
    } catch (err) {
      console.error("Failed to commit agent attestation change:", err);
    } finally {
      setProcessingAgentId(null);
    }
  };

  if (authLoading || pageLoading) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#021a1d", display: "flex", alignItems: "center", justifyContent: "center", color: "#C5A059" }}>
        <Loader2 className="animate-spin" size={32} />
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#021a1d", color: "#ffffff", position: "relative", overflowX: "hidden" }}>
      <TopNav />

      <div className="max-w-[1440px] mx-auto px-6 md:px-10 my-10 pb-20">
        
        {/* 🏁 TERRITORY MASTER HUD HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 border-b border-white/5 pb-6">
          <div>
            <span style={{ color: "#C5A059", fontSize: "10px", fontWeight: 900, letterSpacing: "3px", display: "block", marginBottom: "4px" }}>
              INTERNAL JURISDICTION PROTOCOL
            </span>
            <h1 style={{ color: "#ffffff", fontSize: "28px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "1px", margin: 0 }}>
              Territory Command Center
            </h1>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "11px", fontWeight: 900, color: "#C5A059", backgroundColor: "rgba(197, 160, 89, 0.08)", padding: "6px 14px", borderRadius: "50px", border: "1px solid rgba(197, 160, 89, 0.2)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              🌐 Region Admin: {managerRegion}
            </span>
          </div>
        </div>

        {/* RESPONSIVE MATRIX CONTAINER */}
        <div className="flex flex-col md:grid md:grid-cols-[290px_1fr] gap-8 items-start">
          
          {/* 🧭 SYSTEM NAVIGATION LINK TRAIN */}
          <div className="w-full flex flex-row md:flex-col gap-2 bg-[#05292e] p-4 rounded-2xl border border-white/5 overflow-x-auto whitespace-nowrap md:whitespace-normal box-border">
            <button onClick={() => setActiveTab("OVERVIEW")} className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black cursor-pointer border-none transition-all flex-shrink-0" style={{ backgroundColor: activeTab === "OVERVIEW" ? "rgba(255,191,0,0.08)" : "transparent", color: activeTab === "OVERVIEW" ? "#C5A059" : "#94a3b8" }}>
              <Globe size={15} /> Territory Overview
            </button>
            <button onClick={() => setActiveTab("AUDITING")} className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black cursor-pointer border-none transition-all flex-shrink-0" style={{ backgroundColor: activeTab === "AUDITING" ? "rgba(255,191,0,0.08)" : "transparent", color: activeTab === "AUDITING" ? "#C5A059" : "#94a3b8" }}>
              <ShieldCheck size={15} /> Asset Auditing Queue ({listings.length})
            </button>
            <button onClick={() => setActiveTab("COMPLIANCE")} className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black cursor-pointer border-none transition-all flex-shrink-0" style={{ backgroundColor: activeTab === "COMPLIANCE" ? "rgba(255,191,0,0.08)" : "transparent", color: activeTab === "COMPLIANCE" ? "#C5A059" : "#94a3b8" }}>
              <Building2 size={15} /> Merchant Verification
            </button>
            {/* ✨ INTEGRATED LINK ROW SLOT FOR AGENT REVIEW */}
            <button onClick={() => setActiveTab("AGENTS")} className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black cursor-pointer border-none transition-all flex-shrink-0" style={{ backgroundColor: activeTab === "AGENTS" ? "rgba(197,160,89,0.08)" : "transparent", color: activeTab === "AGENTS" ? "#C5A059" : "#94a3b8" }}>
              <UserCheck size={15} /> Agent Attestation Log ({agentApps.length})
            </button>
            <button onClick={() => setActiveTab("LOGISTICS")} className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black cursor-pointer border-none transition-all flex-shrink-0" style={{ backgroundColor: activeTab === "LOGISTICS" ? "rgba(255,191,0,0.08)" : "transparent", color: activeTab === "LOGISTICS" ? "#C5A059" : "#94a3b8" }}>
              <Container size={15} /> Regional Freight Hub
            </button>
            <button onClick={() => setActiveTab("ANALYTICS")} className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black cursor-pointer border-none transition-all flex-shrink-0" style={{ backgroundColor: activeTab === "ANALYTICS" ? "rgba(255,191,0,0.08)" : "transparent", color: activeTab === "ANALYTICS" ? "#C5A059" : "#94a3b8" }}>
              <LineChart size={15} /> Macro Analytics
            </button>
            <button onClick={() => setActiveTab("SECURITY")} className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black cursor-pointer border-none transition-all flex-shrink-0" style={{ backgroundColor: activeTab === "SECURITY" ? "rgba(255,191,0,0.08)" : "transparent", color: activeTab === "SECURITY" ? "#C5A059" : "#94a3b8" }}>
              <AlertTriangle size={15} /> Security & Disputes
            </button>
          </div>

          {/* 📊 ACTIVE WORKSPACE SLOTS */}
          <div style={{ width: "100%", boxSizing: "border-box" }}>
            
            {/* TAB 1: LIVE JURISDICTION OVERVIEW */}
            {activeTab === "OVERVIEW" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div style={styles.kpiCard}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={styles.kpiLabel}>TOTAL CITIZENS</span>
                      <Users size={16} color="#C5A059" />
                    </div>
                    <span style={styles.kpiValue}>{stats.totalUsers}</span>
                    <div style={styles.kpiFooter}>Registered regional accounts</div>
                  </div>

                  <div style={styles.kpiCard}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={styles.kpiLabel}>ACTIVE POOL ASSETS</span>
                      <Package size={16} color="#C5A059" />
                    </div>
                    <span style={styles.kpiValue}>{stats.totalListings}</span>
                    <div style={styles.kpiFooter}>Items live across system nodes</div>
                  </div>

                  <div style={styles.kpiCard}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={styles.kpiLabel}>SECURED INQUIRIES</span>
                      <MessageSquare size={16} color="#C5A059" />
                    </div>
                    <span style={styles.kpiValue}>{stats.totalChats}</span>
                    <div style={styles.kpiFooter}>Active client transaction loops</div>
                  </div>
                </div>

                <div style={{ backgroundColor: "#05292e", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "20px", padding: "32px" }}>
                  <h3 style={{ color: "#ffffff", fontSize: "15px", fontWeight: 900, margin: "0 0 10px 0", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    🌍 Territory Dashboard Online
                  </h3>
                  <p style={{ color: "#cbd5e1", fontSize: "13px", lineHeight: "1.7", margin: 0 }}>
                    Welcome to your central management workspace. Your live database links are fully connected to the framework. Use the sidebar selectors to audit inbound marketplace auctions, inspect corporate merchant credentials, manage local trade zone logistics, and handle peer-to-peer escrow disputes.
                  </p>
                </div>
              </div>
            )}

            {/* TAB 2: LIVE ASSET AUDITING QUEUE DATA GRID */}
            {activeTab === "AUDITING" && (
              <div style={{ backgroundColor: "#05292e", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "20px", padding: "24px", boxSizing: "border-box" }}>
                <h3 style={styles.panelTitle}>Asset Auditing Ledger</h3>
                {listings.length === 0 ? (
                  <p style={{ color: "#cbd5e1", fontSize: "13px" }}>No inventory listings available to audit inside this jurisdiction.</p>
                ) : (
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                      <thead>
                        <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", fontSize: "11px", fontWeight: 900, color: "#C5A059", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                          <th style={{ padding: "12px 16px" }}>Asset Title</th>
                          <th style={{ padding: "12px 16px" }}>Target Value</th>
                          <th style={{ padding: "12px 16px" }}>Vetting Status</th>
                          <th style={{ padding: "12px 16px", textAlign: "right" }}>Moderation Controls</th>
                        </tr>
                      </thead>
                      <tbody style={{ fontSize: "13px", color: "#cbd5e1" }}>
                        {listings.map((item) => (
                          <tr key={item.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }} className="hover:bg-white/5 transition-colors">
                            <td style={{ padding: "14px 16px", fontWeight: 700, color: "#ffffff" }}>{item.title}</td>
                            <td style={{ padding: "14px 16px", color: "#FFBF00", fontWeight: 800, fontFamily: "monospace" }}>${item.price}</td>
                            <td style={{ padding: "14px 16px" }}>
                              <span style={{
                                padding: "4px 10px",
                                borderRadius: "6px",
                                fontSize: "10px",
                                fontWeight: 900,
                                textTransform: "uppercase",
                                backgroundColor: item.status === "approved" ? "rgba(16,185,129,0.1)" : item.status === "under-review" ? "rgba(245,158,11,0.1)" : "rgba(255,255,255,0.05)",
                                color: item.status === "approved" ? "#10b981" : item.status === "under-review" ? "#f59e0b" : "#94a3b8"
                              }}>
                                {item.status || "Active"}
                              </span>
                            </td>
                            <td style={{ padding: "14px 16px", textAlign: "right" }}>
                              <div style={{ display: "inline-flex", gap: "6px" }}>
                                {item.status !== "approved" && (
                                  <button onClick={() => handleUpdateStatus(item.id, "approved")} style={{ ...styles.actionBtn, backgroundColor: "rgba(16,185,129,0.1)", color: "#10b981" }} title="Approve Asset">
                                    <CheckCircle size={14} />
                                  </button>
                                )}
                                {item.status !== "under-review" && (
                                  <button onClick={() => handleUpdateStatus(item.id, "under-review")} style={{ ...styles.actionBtn, backgroundColor: "rgba(239,68,68,0.1)", color: "#ef4444" }} title="Flag Asset">
                                    <XCircle size={14} />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* ✨ TAB 2.5: AGENT REGISTRY PROTOCOL WORKSPACE ATTESTATION LOG */}
            {activeTab === "AGENTS" && (
              <div style={{ backgroundColor: "#05292e", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "20px", padding: "24px", boxSizing: "border-box" }}>
                <div style={{ marginBottom: "16px" }}>
                  <h3 style={styles.panelTitle}>Agent Attestation Log</h3>
                  <p style={{ fontSize: "12px", color: "#94a3b8", margin: "4px 0 0 0", fontWeight: 500 }}>
                    Applications restricted to incoming profile vectors from jurisdiction segment: <strong style={{ color: "#C5A059" }}>{managerRegion}</strong>.
                  </p>
                </div>

                {agentApps.length === 0 ? (
                  <p style={{ color: "#cbd5e1", fontSize: "13px", padding: "16px 0" }}>No pending onboarding applications currently registered to this territorial node framework.</p>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    {agentApps.map((app) => (
                      <div key={app.id} style={{ border: "1px solid rgba(255,255,255,0.06)", backgroundColor: "rgba(2,26,29,0.4)", borderRadius: "16px", padding: "20px" }}>
                        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-start", gap: "12px", marginBottom: "14px" }}>
                          <div>
                            <h4 style={{ color: "#ffffff", fontSize: "15px", fontWeight: 800, margin: 0 }}>{app.name}</h4>
                            <span style={{ fontSize: "12px", color: "#94a3b8", fontWeight: 600 }}>{app.email}</span>
                          </div>
                          <span style={{ fontSize: "10px", fontWeight: 900, color: "#C5A059", backgroundColor: "rgba(197, 160, 89, 0.08)", padding: "4px 10px", borderRadius: "8px", border: "1px solid rgba(197, 160, 89, 0.15)", textTransform: "uppercase" }}>
                            {app.sector}
                          </span>
                        </div>

                        <div style={{ backgroundColor: "rgba(5,41,46,0.8)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: "12px", padding: "14px", marginBottom: "16px" }}>
                          <span style={{ fontSize: "9px", fontWeight: 900, color: "#C5A059", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "4px", marginBottom: "6px" }}>
                            <FileText size={11} /> Professional Narrative Track
                          </span>
                          <p style={{ color: "#cbd5e1", fontSize: "12px", lineHeight: "1.5", margin: 0, fontWeight: 500 }}>
                            "{app.bio}"
                          </p>
                        </div>

                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
                          <span style={{ fontSize: "10px", color: "#64748b", fontWeight: 700 }}>Logged: {app.timestamp}</span>
                          <div style={{ display: "flex", gap: "8px" }}>
                            <button
                              disabled={processingAgentId !== null}
                              onClick={() => handleAgentDecision(app.id, "DECLINED")}
                              style={{ border: "none", padding: "8px 16px", borderRadius: "30px", fontSize: "10px", fontWeight: 900, textTransform: "uppercase", cursor: "pointer", backgroundColor: "rgba(239,68,68,0.1)", color: "#ef4444" }}
                            >
                              Deny Node
                            </button>
                            <button
                              disabled={processingAgentId !== null}
                              onClick={() => handleAgentDecision(app.id, "APPROVED")}
                              style={{ border: "none", padding: "8px 18px", borderRadius: "30px", fontSize: "10px", fontWeight: 1000, textTransform: "uppercase", cursor: "pointer", backgroundColor: "#C5A059", color: "#021a1d" }}
                            >
                              {processingAgentId === app.id ? "Authorizing..." : "⚡ Activate Agent"}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: MERCHANT REGISTRY VETTING GATE */}
            {activeTab === "COMPLIANCE" && (
              <div style={styles.emptyPanelCard}>
                <Building2 size={36} color="#C5A059" style={{ marginBottom: "16px" }} />
                <h4 style={styles.panelTitle}>Merchant Registry Secure</h4>
                <p style={styles.panelDesc}>No business corporate certificates or tax files are currently waiting for regional compliance review signatures.</p>
              </div>
            )}

            {/* TAB 4: CARRIER SHIPPING FREIGHT TERMINAL */}
            {activeTab === "LOGISTICS" && (
              <div style={styles.emptyPanelCard}>
                <Container size={36} color="#C5A059" style={{ marginBottom: "16px" }} />
                <h4 style={styles.panelTitle}>Freight Tracks Balanced</h4>
                <p style={styles.panelDesc}>Localized warehouse clearances, package dispatch manifests, and physical check channels are fully synchronized.</p>
              </div>
            )}

            {/* TAB 5: STRIPE ECONOMIC VOLUME ANALYTICS */}
            {activeTab === "ANALYTICS" && (
              <div style={styles.emptyPanelCard}>
                <LineChart size={36} color="#C5A059" style={{ marginBottom: "16px" }} />
                <h4 style={styles.panelTitle}>Macro Demand Signals Offline</h4>
                <p style={styles.panelDesc}>Territory traffic indices, local auction liquidity charts, and region-bound transaction logs will activate once nodes go live.</p>
              </div>
            )}

            {/* TAB 6: SECURITY / DISPUTE INTERCEPT DESK */}
            {activeTab === "SECURITY" && (
              <div style={styles.emptyPanelCard}>
                <AlertTriangle size={36} color="#C5A059" style={{ marginBottom: "16px" }} />
                <h4 style={styles.panelTitle}>Sovereign System Shield Clear</h4>
                <p style={styles.panelDesc}>Zero malicious script signals or open buyer-merchant transaction disputes require administrative arbitration.</p>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

// --- Luxury Theme Style Matrix ---
const styles = {
  kpiCard: { backgroundColor: "#05292e", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "16px", padding: "24px", display: "flex", flexDirection: "column" as const, boxSizing: "border-box" as const },
  kpiLabel: { color: "#C5A059", fontSize: "10px", fontWeight: 900, letterSpacing: "0.05em" },
  kpiValue: { color: "#ffffff", fontSize: "28px", fontWeight: 900, fontFamily: "sans-serif", marginTop: "8px" },
  kpiFooter: { color: "#94a3b8", fontSize: "11px", marginTop: "12px", borderTop: "1px solid rgba(255,255,255,0.04)", paddingTop: "10px" },
  
  emptyPanelCard: { backgroundColor: "#05292e", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "20px", padding: "60px 40px", display: "flex", flexDirection: "column" as const, alignItems: "center", justifyContent: "center", textAlign: "center" as const, boxSizing: "border-box" as const },
  panelTitle: { color: "#ffffff", fontSize: "15px", fontWeight: 900, margin: "0 0 8px 0", textTransform: "uppercase" as const, letterSpacing: "0.03em" },
  panelDesc: { color: "#94a3b8", fontSize: "13px", lineHeight: "1.6", margin: 0, maxWidth: "460px" },
  
  actionBtn: { border: "none", padding: "6px", borderRadius: "6px", cursor: "pointer", display: "flex", alignItems: "center", justifyBox: "center" }
};
