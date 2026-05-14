"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase/client";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ShieldCheck, User, Mail, Phone, MapPin, ArrowRight, Globe, Landmark, FileText } from "lucide-react";

export default function CorporateLicensingInquiryPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  // 📋 Sovereign License Inquiry Payload State Matrix
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    targetCountry: "",
    localPhysicalAddress: "",
    linguisticFluency: "",
    operationalIntent: "",
  });

  // 🛡️ Mandatory Corporate Responsibility Overrides
  const [isFinanciallyResponsible, setIsFinanciallyResponsible] = useState(false);
  const [isBankingCompliant, setIsBankingCompliant] = useState(false);
  const [isTrialCovenantAcknowledged, setIsTrialCovenantAcknowledged] = useState(false);

  const handleSubmitInquiry = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFinanciallyResponsible || !isBankingCompliant || !isTrialCovenantAcknowledged) {
      alert("Verification Error: You must acknowledge all regulatory and banking compliance check conditions.");
      return;
    }

    if (formData.operationalIntent.trim().length < 50) {
      alert("Please provide a more extensive summary regarding your local operational intent and market access paths.");
      return;
    }

    setLoading(true);

    try {
      // 🚀 Deploy Inquiry Payload straight into centralized corporate vault collection
      await addDoc(collection(db, "license_inquiries"), {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        targetCountry: formData.targetCountry.trim(),
        localPhysicalAddress: formData.localPhysicalAddress.trim(),
        linguisticFluency: formData.linguisticFluency.trim(),
        operationalIntent: formData.operationalIntent.trim(),
        status: "under_review",
        createdAt: serverTimestamp(),
      });

      alert("Sovereign Node Application Transmitted. Your regional brief is officially under security review.");
      router.push("/market"); // Gracefully loops them back onto the main portal landing matrix

    } catch (err) {
      console.error("Failed to submit licensing brief:", err);
      alert("Ecosystem Link Interrupted: Unable to log your tracking parameters down to Firestore.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f1f5f9", fontFamily: "sans-serif", padding: "60px 20px", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <div style={{ width: "100%", maxWidth: "850px", backgroundColor: "#ffffff", borderRadius: "32px", border: "1px solid #e2e8f0", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.05)", overflow: "hidden" }}>
        
        {/* Banner Title Frame (Repurposed Layout Card Aesthetic) */}
        <div style={{ backgroundColor: "#05292e", padding: "40px", color: "#ffffff", borderBottom: "2px solid #FFBF00" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#FFBF00", marginBottom: "12px" }}>
            <Globe size={18} />
            <span style={{ fontSize: "9px", fontWeight: 1000, textTransform: "uppercase", letterSpacing: "3px" }}>Global Network Extension Gateway</span>
          </div>
          <h1 style={{ margin: 0, fontSize: "28px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "-0.5px" }}>Territorial License Application</h1>
          <p style={{ margin: "8px 0 0 0", color: "#94a3b8", fontSize: "13px", lineHeight: "1.5" }}>
            Submit your localized ambassador credentials, geographic routing targets, and banking capability footprints to initialize a Bazaria Country Node lease.
          </p>
        </div>

        <form onSubmit={handleSubmitInquiry} style={{ padding: "40px", display: "flex", flexDirection: "column", gap: "28px" }}>
          
          {/* SECTION 1: CORE AMBASSADOR IDENTITY */}
          <div>
            <h3 style={{ margin: "0 0 16px 0", fontSize: "13px", fontWeight: 900, color: "#05292e", textTransform: "uppercase", letterSpacing: "0.5px", borderBottom: "1px solid #f1f5f9", paddingBottom: "6px" }}>
              1. Principal Ambassador Profile
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px" }}>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "6px", textAlign: "left" }}>
                <label style={{ fontSize: "9px", color: "#64748b", fontWeight: 900, textTransform: "uppercase" }}>Full Legal Name / Entity</label>
                <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                  <User size={14} style={{ position: "absolute", left: "12px", color: "#94a3b8" }} />
                  <input 
                    type="text" required placeholder="e.g. Alon Diaz"
                    value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={{ width: "100%", padding: "12px 12px 12px 36px", backgroundColor: "#f8fafc", border: "1px solid #cbd5e1", borderRadius: "12px", fontSize: "13px", color: "#0f172a", outline: "none", fontWeight: 600 }}
                  />
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "6px", textAlign: "left" }}>
                <label style={{ fontSize: "9px", color: "#64748b", fontWeight: 900, textTransform: "uppercase" }}>Secure Correspondence Email</label>
                <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                  <Mail size={14} style={{ position: "absolute", left: "12px", color: "#94a3b8" }} />
                  <input 
                    type="email" required placeholder="e.g. diaz@ambassador.world"
                    value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    style={{ width: "100%", padding: "12px 12px 12px 36px", backgroundColor: "#f8fafc", border: "1px solid #cbd5e1", borderRadius: "12px", fontSize: "13px", color: "#0f172a", outline: "none", fontWeight: 600 }}
                  />
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "6px", textAlign: "left" }}>
                <label style={{ fontSize: "9px", color: "#64748b", fontWeight: 900, textTransform: "uppercase" }}>Direct Communication Line</label>
                <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                  <Phone size={14} style={{ position: "absolute", left: "12px", color: "#94a3b8" }} />
                  <input 
                    type="text" required placeholder="e.g. +1 (809) 555-0144"
                    value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    style={{ width: "100%", padding: "12px 12px 12px 36px", backgroundColor: "#f8fafc", border: "1px solid #cbd5e1", borderRadius: "12px", fontSize: "13px", color: "#0f172a", outline: "none", fontWeight: 600 }}
                  />
                </div>
              </div>

            </div>
          </div>

          {/* SECTION 2: GEOGRAPHIC & SOVEREIGN EXCLUSIVITY VARIABLES */}
          <div>
            <h3 style={{ margin: "0 0 16px 0", fontSize: "13px", fontWeight: 900, color: "#05292e", textTransform: "uppercase", letterSpacing: "0.5px", borderBottom: "1px solid #f1f5f9", paddingBottom: "6px" }}>
              2. Target Territorial Sovereignty
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px" }}>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "6px", textAlign: "left" }}>
                <label style={{ fontSize: "9px", color: "#64748b", fontWeight: 900, textTransform: "uppercase" }}>Target Country / Region Location</label>
                <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                  <Globe size={14} style={{ position: "absolute", left: "12px", color: "#94a3b8" }} />
                  <input 
                    type="text" required placeholder="e.g. Philippines (PHL) or Colombia"
                    value={formData.targetCountry} onChange={(e) => setFormData({ ...formData, targetCountry: e.target.value })}
                    style={{ width: "100%", padding: "12px 12px 12px 36px", backgroundColor: "#f8fafc", border: "1px solid #cbd5e1", borderRadius: "12px", fontSize: "13px", color: "#0f172a", outline: "none", fontWeight: 600 }}
                  />
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "6px", textAlign: "left" }}>
                <label style={{ fontSize: "9px", color: "#64748b", fontWeight: 900, textTransform: "uppercase" }}>Local Linguistic Fluency Status</label>
                <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                  <User size={14} style={{ position: "absolute", left: "12px", color: "#94a3b8" }} />
                  <input 
                    type="text" required placeholder="e.g. Fluent Spanish & English Mastery"
                    value={formData.linguisticFluency} onChange={(e) => setFormData({ ...formData, linguisticFluency: e.target.value })}
                    style={{ width: "100%", padding: "12px 12px 12px 36px", backgroundColor: "#f8fafc", border: "1px solid #cbd5e1", borderRadius: "12px", fontSize: "13px", color: "#0f172a", outline: "none", fontWeight: 600 }}
                  />
                </div>
              </div>

            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px", textAlign: "left", marginTop: "20px" }}>
              <label style={{ fontSize: "9px", color: "#64748b", fontWeight: 900, textTransform: "uppercase" }}>Physical Local Street Address within Territory</label>
              <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                <MapPin size={14} style={{ position: "absolute", left: "12px", color: "#94a3b8" }} />
                <input 
                  type="text" required placeholder="e.g. Av. Winston Churchill, Blue Mall Tower, Floor 11, Santo Domingo"
                  value={formData.localPhysicalAddress} onChange={(e) => setFormData({ ...formData, localPhysicalAddress: e.target.value })}
                  style={{ width: "100%", padding: "12px 12px 12px 36px", backgroundColor: "#f8fafc", border: "1px solid #cbd5e1", borderRadius: "12px", fontSize: "13px", color: "#0f172a", outline: "none", fontWeight: 600 }}
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: OPERATIONAL INTENT NARRATIVE BRIEF */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px", textAlign: "left" }}>
            <label style={{ fontSize: "9px", color: "#05292e", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.5px" }}>
              3. Operational Strategy & Merchant Network Mapping Brief
            </label>
            <span style={{ fontSize: "11px", color: "#64748b", fontWeight: 600, marginBottom: "4px" }}>
              Please provide an analysis outlining your local corporate background, strategic target banking partnerships, and initial paths to integrate frontline luxury merchants onto your region's node.
            </span>
            <div style={{ position: "relative", display: "flex" }}>
              <FileText size={14} style={{ position: "absolute", left: "12px", top: "14px", color: "#94a3b8" }} />
              <textarea 
                required rows={5}
                placeholder="Detail your local commercial footprint, current regional asset brokerage familiarity, and baseline capacity to meet network rollout timelines..."
                value={formData.operationalIntent} onChange={(e) => setFormData({ ...formData, operationalIntent: e.target.value })}
                style={{ width: "100%", padding: "12px 14px 12px 38px", backgroundColor: "#f8fafc", border: "1px solid #cbd5e1", borderRadius: "16px", fontSize: "13px", color: "#0f172a", outline: "none", fontWeight: 600, resize: "none", lineHeight: "1.5" }}
              />
            </div>
          </div>

          {/* SECTION 4: INSTITUTIONAL RESPONSIBILITY COMPLIANCE CHECKS */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", backgroundColor: "#f8fafc", padding: "20px", borderRadius: "20px", border: "1px solid #e2e8f0" }}>
            
            <label style={{ display: "flex", alignItems: "flex-start", gap: "12px", cursor: "pointer", selectNone: "none", textAlign: "left" } as any}>
              <input 
                type="checkbox" checked={isFinanciallyResponsible} onChange={(e) => setIsFinanciallyResponsible(e.target.checked)}
                style={{ marginTop: "2px", width: "16px", height: "16px", accentColor: "#05292e" }} 
              />
              <span style={{ fontSize: "12px", color: "#334155", fontWeight: 700 }}>
                I certify that I am financially independent, completely self-funded, and assume all localized overhead liability for regional operations.
              </span>
            </label>

            <label style={{ display: "flex", alignItems: "flex-start", gap: "12px", cursor: "pointer", selectNone: "none", textAlign: "left" } as any}>
              <input 
                type="checkbox" checked={isBankingCompliant} onChange={(e) => setIsBankingCompliant(e.target.checked)}
                style={{ marginTop: "2px", width: "16px", height: "16px", accentColor: "#05292e" }} 
              />
              <span style={{ fontSize: "12px", color: "#334155", fontWeight: 700 }}>
                I confirm absolute capacity to independently manage local banking channels, commercial clearing structures, and fulfill all corporate jurisdictional and AML laws.
              </span>
            </label>

            <label style={{ display: "flex", alignItems: "flex-start", gap: "12px", cursor: "pointer", selectNone: "none", textAlign: "left" } as any}>
              <input 
                type="checkbox" checked={isTrialCovenantAcknowledged} onChange={(e) => setIsTrialCovenantAcknowledged(e.target.checked)}
                style={{ marginTop: "2px", width: "16px", height: "16px", accentColor: "#05292e" }} 
              />
              <span style={{ fontSize: "12px", color: "#334155", fontWeight: 700 }}>
                I acknowledge that the first 6 months operate as a strict performance probationary period requiring a minimum benchmark delivery of $10,000 USD on the books to retain territorial node exclusivity.
              </span>
            </label>

          </div>

          {/* ACTION SUBMISSION TRIGGER */}
          <button
            type="submit"
            disabled={loading || !isFinanciallyResponsible || !isBankingCompliant || !isTrialCovenantAcknowledged}
            style={{
              width: "100%", padding: "18px",
              backgroundColor: (!isFinanciallyResponsible || !isBankingCompliant || !isTrialCovenantAcknowledged) ? "#cbd5e1" : "#05292e",
              color: (!isFinanciallyResponsible || !isBankingCompliant || !isTrialCovenantAcknowledged) ? "#94a3b8" : "#FFBF00",
              border: "1px solid " + ((!isFinanciallyResponsible || !isBankingCompliant || !isTrialCovenantAcknowledged) ? "#e2e8f0" : "#FFBF00"),
              borderRadius: "14px", fontSize: "13px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "1.5px",
              cursor: (!isFinanciallyResponsible || !isBankingCompliant || !isTrialCovenantAcknowledged || loading) ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", transition: "all 0.2s ease"
            }}
          >
            {loading ? "TRANSMITTING SOVEREIGN BRIEF..." : "🔒 Transmit Territorial License Brief"}
            <ArrowRight size={16} />
          </button>

        </form>

      </div>
    </div>
  );
}
