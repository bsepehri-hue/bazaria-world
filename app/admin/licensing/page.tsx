"use client";

import React, { useState, useEffect } from "react";
import { db } from "@/lib/firebase/client";
import { collection, query, orderBy, getDocs, doc, updateDoc } from "firebase/firestore";
import { Globe, Mail, Phone, Clock, CheckCircle, XCircle, Shield, ExternalLink } from "lucide-react";

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

  useEffect(() => {
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
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: "approved" | "rejected") => {
    try {
      const docRef = doc(db, "license_inquiries", id);
      await updateDoc(docRef, {
        status: newStatus,
        reviewedAt: new Date().toISOString()
      });
      
      // Update local state smoothly
      setInquiries(prev => prev.map(item => item.id === id ? { ...item, status: newStatus } : item));
      alert(`Node inquiry status successfully modified to: ${newStatus.toUpperCase()}`);
    } catch (err) {
      console.error("Failed to process status override:", err);
    }
  };

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
          <div style={{ backgroundColor: "#ffffff", borderRadius: "24px", padding: "60px", textCenter: "center", border: "1px solid #e2e8f0", color: "#64748b", fontWeight: 600, display: "flex", justifyContent: "center" }}>
            No incoming license parameters found matching this classification filter tier.
          </div>
        )}

        {/* Grid Loop Display Matrix */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "24px" }}>
          {filteredData.map((brief) => (
            <div key={brief.id} style={{ backgroundColor: "#ffffff", border: "1px solid #cbd5e1", borderRadius: "24px", padding: "32px", display: "grid", gridTemplateColumns: "1fr", lgGridTemplateColumns: "3fr 1fr", gap: "24px" }} className="lg:grid lg:grid-cols-4">
              
              {/* Primary Profile Parameters Block */}
              <div className="lg:col-span-3 text-left">
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "10px", fontWeight: 900, backgroundColor: "#05292e", color: "#FFBF00", padding: "4px 10px", borderRadius: "6px", textTransform: "uppercase" }}>
                    <Globe size={10} /> {brief.targetCountry}
                  </span>
                  <span style={{ fontSize: "11px", color: "#94a3b8", fontWeight: 600, display: "flex", alignItems: "center", gap: "4px" }}>
                    <Clock size={12} /> Received: {brief.createdAt?.seconds ? new Date(brief.createdAt.seconds * 1000).toLocaleDateString() : "Pending"}
                  </span>
                </div>

                <h2 style={{ margin: "0 0 14px 0", fontSize: "22px", fontWeight: 900, color: "#05292e", textTransform: "uppercase" }}>{brief.name}</h2>
                
                <div style={{ display: "flex", gap: "24px", marginBottom: "20px", fontSize: "13px", fontWeight: 600, color: "#475569" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "6px" }}><Mail size={14} /> {brief.email}</span>
                  <span style={{ display: "flex", alignItems: "center", gap: "6px" }}><Phone size={14} /> {brief.phone}</span>
                </div>

                <div style={{ backgroundColor: "#f8fafc", padding: "20px", borderRadius: "16px", border: "1px solid #e2e8f0", marginBottom: "14px" }}>
                  <p style={{ margin: "0 0 6px 0", fontSize: "9px", fontWeight: 900, color: "#014d4e", textTransform: "uppercase" }}>Linguistic Fluency Validation</p>
                  <p style={{ margin: "0 0 16px 0", fontSize: "13px", color: "#0f172a", fontWeight: 600 }}>{brief.linguisticFluency}</p>
                  
                  <p style={{ margin: "0 0 6px 0", fontSize: "9px", fontWeight: 900, color: "#014d4e", textTransform: "uppercase" }}>Physical Street Address Node</p>
                  <p style={{ margin: 0, fontSize: "13px", color: "#0f172a", fontWeight: 600 }}>{brief.localPhysicalAddress}</p>
                </div>

                <div>
                  <p style={{ margin: "0 0 6px 0", fontSize: "9px", fontWeight: 900, color: "#64748b", textTransform: "uppercase" }}>Operational Strategy Brief</p>
                  <p style={{ margin: 0, fontSize: "13px", color: "#334155", lineHeight: "1.6", fontWeight: 500 }}>{brief.operationalIntent}</p>
                </div>
              </div>

              {/* Action Overrides Operations Terminal Drawer */}
              <div className="lg:col-span-1 flex flex-col justify-center gap-3" style={{ borderLeft: "1px solid #f1f5f9", paddingLeft: "16px" }}>
                {brief.status === "under_review" ? (
                  <>
                    <button
                      onClick={() => handleUpdateStatus(brief.id, "approved")}
                      style={{ width: "100%", padding: "14px", backgroundColor: "#14b8a6", color: "#ffffff", border: "none", borderRadius: "12px", fontSize: "11px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "1px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}
                    >
                      <CheckCircle size={14} /> Approve Node
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(brief.id, "rejected")}
                      style={{ width: "100%", padding: "14px", backgroundColor: "#ef4444", color: "#ffffff", border: "none", borderRadius: "12px", fontSize: "11px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "1px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}
                    >
                      <XCircle size={14} /> Deny Exclusivity
                    </button>
                  </>
                ) : (
                  <div style={{ textAlign: "center", padding: "20px" }}>
                    <p style={{ fontSize: "10px", fontWeight: 900, color: "#94a3b8", textTransform: "uppercase", margin: "0 0 4px 0" }}>Current Protocol State</p>
                    <span style={{ fontSize: "14px", fontWeight: 900, color: brief.status === "approved" ? "#14b8a6" : "#ef4444", textTransform: "uppercase" }}>
                      {brief.status === "approved" ? "Active Ambassador" : "Rejected Brief"}
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
