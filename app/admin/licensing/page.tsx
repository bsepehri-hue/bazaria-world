"use client";


import React, { useState, useEffect } from "react";
import { db } from "@/lib/firebase/client";
import { collection, query, orderBy, getDocs, doc, updateDoc } from "firebase/firestore";
import { Globe, Mail, Phone, Clock, CheckCircle, XCircle, Shield, Key } from "lucide-react";

interface LicenseInquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  targetCountry: string;
  localPhysicalAddress: string;
  linguisticFluency: string;
  operationalIntent: string;
  status: string;
  createdAt: any;
}

export default function AdministrativeLicensingWorkspace() {
  const [inquiries, setInquiries] = useState<LicenseInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("under_review");

  // 🛡️ AUTHENTICATION LOCK STATES
  const [isAdminAuthorized, setIsAdminAuthorized] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [authError, setAuthError] = useState("");

  // Check if session clearance was already granted on this device
  useEffect(() => {
    const sessionClearance = sessionStorage.getItem("bazaria_admin_clearance");
    if (sessionClearance === "granted") {
      setIsAdminAuthorized(true);
    }
  }, []);

  // Fetch Firestore logs only if authorized keys match
  useEffect(() => {
    if (!isAdminAuthorized) return;

    async function fetchInquiries() {
      try {
        const q = query(collection(db, "license_inquiries"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as LicenseInquiry[];
        setInquiries(data);
      } catch (err) {
        console.error("Failed to load global license briefs:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchInquiries();
  }, [isAdminAuthorized]);

  const handleVerifyMasterKey = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");

    const keyPrimary = process.env.NEXT_PUBLIC_ADMIN_KEY_PRIMARY;
    const keySecondary = process.env.NEXT_PUBLIC_ADMIN_KEY_SECONDARY;

    // ✨ THE BYPASS IS ACTIVE HERE ✨
    if (passwordInput === "Miami2026" || passwordInput === keyPrimary || passwordInput === keySecondary) {
      sessionStorage.setItem("bazaria_admin_clearance", "granted");
      setIsAdminAuthorized(true);
    } else {
      setAuthError("CRITICAL EXCEPTION: ACCESS REJECTED. AUTHORIZATION NODE MISMATCH.");
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: "approved" | "rejected") => {
    try {
      const docRef = doc(db, "license_inquiries", id);
      await updateDoc(docRef, {
        status: newStatus,
        reviewedAt: new Date().toISOString()
      });
      
      setInquiries(prev => prev.map(item => item.id === id ? { ...item, status: newStatus } : item));
      alert(`Node inquiry status successfully modified to: ${newStatus.toUpperCase()}`);
    } catch (err) {
      console.error("Failed to process status override:", err);
    }
  };

  // 🔒 GATEKEEPER RENDER: If password matches fail, render the lock interface canvas
  if (!isAdminAuthorized) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#022122", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", boxSizing: "border-box", fontFamily: "sans-serif" }}>
        <div style={{ width: "100%", maxWidth: "420px", backgroundColor: "#05292e", borderRadius: "32px", padding: "40px", border: "1px solid #FFBF00", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)", textAlign: "center" }}>
          
          <div style={{ width: "56px", height: "56px", borderRadius: "16px", border: "2px solid #FFBF00", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: "20px", backgroundColor: "rgba(255,191,0,0.05)" }}>
            <Key color="#FFBF00" size={24} />
          </div>

          <h2 style={{ color: "#ffffff", fontSize: "20px", fontWeight: 900, textTransform: "uppercase", margin: "0 0 4px 0", letterSpacing: "0.5px" }}>Authority Interlock</h2>
          <p style={{ color: "#94a3b8", fontSize: "11px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 24px 0" }}>Master Clearances Threshold Required</p>

          <form onSubmit={handleVerifyMasterKey} style={{ display: "flex", flexDirection: "column", gap: "16px", textAlign: "left" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "8px", fontWeight: 900, color: "#FFBF00", textTransform: "uppercase", letterSpacing: "1px" }}>Secure Administrative Password</label>
              <input 
                type="password"
                required
                placeholder="••••••••"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                style={{ width: "100%", padding: "14px", backgroundColor: "#022122", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", fontSize: "14px", color: "#ffffff", outline: "none", fontWeight: "bold", boxSizing: "border-box" }}
              />
            </div>

            {authError && (
              <p style={{ color: "#f43f5e", fontSize: "9px", fontWeight: 900, margin: "4px 0 0 0", textAlign: "center", lineHeight: "1.4" }}>{authError}</p>
            )}

            <button 
              type="submit"
              style={{ width: "100%", padding: "14px", backgroundColor: "#FFBF00", color: "#022122", border: "none", borderRadius: "12px", fontSize: "11px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "1px", cursor: "pointer", marginTop: "8px" }}
            >
              Verify Administrative Clearance
            </button>
          </form>

        </div>
      </div>
    );
  }

  const filteredData = inquiries.filter(item => item.status === activeFilter);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#022122", display: "flex", alignItems: "center", justifyContent: "center", color: "#FFBF00", fontWeight: 900 }}>
        DECRYPTION LOGS IN TRANSIT...
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8f9fa", padding: "40px", boxSizing: "border-box", fontFamily: "sans-serif" }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        
        {/* Header Dashboard Node */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "2px solid #05292e", paddingBottom: "24px", marginBottom: "32px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#014d4e", marginBottom: "4px" }}>
              <Shield size={14} />
              <span style={{ fontSize: "9px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "2px" }}>Central Security Office</span>
            </div>
            <h1 style={{ margin: 0, fontSize: "32px", fontWeight: 900, color: "#05292e" }}>Global Node Clearance</h1>
          </div>
          
          {/* Tabs Filter Grid */}
          <div style={{ display: "flex", backgroundColor: "#e2e8f0", padding: "4px", borderRadius: "12px", gap: "4px" }}>
            {["under_review", "approved", "rejected"].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveFilter(tab)}
                style={{
                  padding: "8px 16px", borderRadius: "8px", border: "none", fontSize: "11px", fontWeight: 900, textTransform: "uppercase", cursor: "pointer",
                  backgroundColor: activeFilter === tab ? "#05292e" : "transparent",
                  color: activeFilter === tab ? "#FFBF00" : "#475569",
                  transition: "all 0.2s ease"
                }}
              >
                {tab.replace("_", " ")}
              </button>
            ))}
          </div>
        </div>

        {/* Empty State Card */}
        {filteredData.length === 0 && (
          <div style={{ backgroundColor: "#ffffff", borderRadius: "24px", padding: "60px", border: "1px solid #e2e8f0", color: "#64748b", fontWeight: 600, display: "flex", justifyContent: "center" }}>
            No incoming license parameters found matching this classification filter tier.
          </div>
        )}

     {/* Grid Loop Display Matrix */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {filteredData.map((brief) => (
            <div key={brief.id} style={{ backgroundColor: "#ffffff", border: "1px solid #cbd5e1", borderRadius: "24px", padding: "32px", display: "flex", flexWrap: "wrap", gap: "32px", alignItems: "center" }}>
              
              {/* Primary Profile Parameters Block */}
              <div style={{ flex: "1 1 60%", minWidth: "280px", textAlign: "left" }}>
                <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "10px", fontWeight: 900, backgroundColor: "#05292e", color: "#FFBF00", padding: "6px 12px", borderRadius: "8px", textTransform: "uppercase" }}>
                    <Globe size={12} /> {brief.targetCountry}
                  </span>
                  <span style={{ fontSize: "11px", color: "#94a3b8", fontWeight: 700, display: "flex", alignItems: "center", gap: "4px", backgroundColor: "#f1f5f9", padding: "6px 12px", borderRadius: "8px" }}>
                    <Clock size={12} /> Received: {brief.createdAt?.seconds ? new Date(brief.createdAt.seconds * 1000).toLocaleDateString() : "Pending"}
                  </span>
                </div>

                <h2 style={{ margin: "0 0 16px 0", fontSize: "24px", fontWeight: 900, color: "#05292e", textTransform: "uppercase", letterSpacing: "-0.5px" }}>{brief.name}</h2>
                
                <div style={{ display: "flex", flexWrap: "wrap", gap: "24px", marginBottom: "24px", fontSize: "13px", fontWeight: 600, color: "#475569" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "6px", backgroundColor: "#f8fafc", padding: "8px 16px", borderRadius: "12px", border: "1px solid #e2e8f0" }}><Mail size={16} color="#05292e" /> {brief.email}</span>
                  <span style={{ display: "flex", alignItems: "center", gap: "6px", backgroundColor: "#f8fafc", padding: "8px 16px", borderRadius: "12px", border: "1px solid #e2e8f0" }}><Phone size={16} color="#05292e" /> {brief.phone}</span>
                </div>

                <div style={{ backgroundColor: "#f8fafc", padding: "24px", borderRadius: "20px", border: "1px solid #e2e8f0", marginBottom: "20px" }}>
                  <p style={{ margin: "0 0 8px 0", fontSize: "10px", fontWeight: 900, color: "#014d4e", textTransform: "uppercase", letterSpacing: "1px" }}>Linguistic Fluency Validation</p>
                  <p style={{ margin: "0 0 20px 0", fontSize: "14px", color: "#0f172a", fontWeight: 600 }}>{brief.linguisticFluency}</p>
                  
                  <p style={{ margin: "0 0 8px 0", fontSize: "10px", fontWeight: 900, color: "#014d4e", textTransform: "uppercase", letterSpacing: "1px" }}>Physical Street Address Node</p>
                  <p style={{ margin: 0, fontSize: "14px", color: "#0f172a", fontWeight: 600 }}>{brief.localPhysicalAddress}</p>
                </div>

                <div>
                  <p style={{ margin: "0 0 8px 0", fontSize: "10px", fontWeight: 900, color: "#64748b", textTransform: "uppercase", letterSpacing: "1px" }}>Operational Strategy Brief</p>
                  <p style={{ margin: 0, fontSize: "14px", color: "#334155", lineHeight: "1.7", fontWeight: 500 }}>{brief.operationalIntent}</p>
                </div>
              </div>

              {/* Action Overrides Operations Terminal Drawer */}
              <div style={{ flex: "1 1 25%", minWidth: "220px", display: "flex", flexDirection: "column", justifyContent: "center", gap: "12px", borderLeft: "2px dashed #e2e8f0", paddingLeft: "32px", boxSizing: "border-box" }}>
                {brief.status === "under_review" ? (
                  <>
                    <button
                      onClick={() => handleUpdateStatus(brief.id, "approved")}
                      style={{ width: "100%", padding: "18px", backgroundColor: "#14b8a6", color: "#ffffff", border: "none", borderRadius: "16px", fontSize: "12px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "1px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", boxShadow: "0 10px 15px -3px rgba(20, 184, 166, 0.3)", transition: "transform 0.2s" }}
                    >
                      <CheckCircle size={16} /> Approve Node
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(brief.id, "rejected")}
                      style={{ width: "100%", padding: "18px", backgroundColor: "#ffffff", color: "#ef4444", border: "2px solid #ef4444", borderRadius: "16px", fontSize: "12px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "1px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", transition: "transform 0.2s" }}
                    >
                      <XCircle size={16} /> Deny Exclusivity
                    </button>
                  </>
                ) : (
                  <div style={{ textAlign: "center", padding: "24px", backgroundColor: brief.status === "approved" ? "rgba(20,184,166,0.05)" : "rgba(239,68,68,0.05)", borderRadius: "16px", border: `1px solid ${brief.status === "approved" ? "#ccfbf1" : "#fee2e2"}` }}>
                    <p style={{ fontSize: "10px", fontWeight: 900, color: "#64748b", textTransform: "uppercase", margin: "0 0 8px 0", letterSpacing: "1px" }}>Current Protocol State</p>
                    <span style={{ fontSize: "15px", fontWeight: 900, color: brief.status === "approved" ? "#0f766e" : "#b91c1c", textTransform: "uppercase", letterSpacing: "0.5px", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                      {brief.status === "approved" ? <><CheckCircle size={16} /> Active Ambassador</> : <><XCircle size={16} /> Rejected Brief</>}
                    </span>
                  </div>
                )}
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
