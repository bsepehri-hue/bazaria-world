"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase/client";
import { useAuth } from "@/app/providers/AuthProvider";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { ShieldCheck, User, Mail, Phone, MapPin, ArrowRight, FileText } from "lucide-react";

export default function AgentOnboardingPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  
  // 📋 Form Data Matrix
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    location: "Miami, FL",
  });

  // 🛡️ Terms Agreement Checkboxes
  const [isAgeVerified, setIsAgeVerified] = useState(false);
  const [isProtocolAgreed, setIsProtocolAgreed] = useState(false);

  const handleSubmitCovenant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("Authentication timeout. Please log in before activating agent credentials.");
      router.push("/login");
      return;
    }

    if (!isAgeVerified || !isProtocolAgreed) {
      alert("You must verify your age requirement and acknowledge the Sovereign Protocol.");
      return;
    }

    setLoading(true);

    try {
      // Node A: Initialize Core User document operational parameters
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: formData.name,
        email: user.email || "",
        phone: formData.phone,
        location: formData.location,
        role: "agent",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }, { merge: true });

      // Node B: Initialize Partner Revenue Tier Tracking parameters
      await setDoc(doc(db, "partners", user.uid), {
        uid: user.uid,
        name: formData.name,
        paid: 0.00,
        available: 0.00,
        credits: 0,
        listings: 0,
        tier: "Standard Steward (M1)",
        academyLevel: 1,
        volumeCapacity: 250000,
        pulsePositive: 0,
        pulseNeutral: 0,
        pulseNegative: 0,
        updatedAt: serverTimestamp(),
      }, { merge: true });

      alert("Covenant Signed. Agent Node Online!");
      router.push("/rewards"); // Releases them straight into their active live dashboard

    } catch (err) {
      console.error("Failed to initialize agent nodes:", err);
      alert("Database link failed. Please check your secure connection parameters.");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div style={{ height: "100vh", backgroundColor: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", color: "#014d4e", fontWeight: 900 }}>
        SYNCHRONIZING ACCESS CLEARENCE...
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f1f5f9", fontFamily: "sans-serif", padding: "60px 20px", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <div style={{ width: "100%", maxWidth: "800px", backgroundColor: "#ffffff", borderRadius: "32px", border: "1px solid #e2e8f0", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.05)", overflow: "hidden" }}>
        
        {/* Banner Title Frame */}
        <div style={{ backgroundColor: "#05292e", padding: "40px", color: "#ffffff", borderBottom: "1px solid #FFBF00" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#FFBF00", marginBottom: "12px" }}>
            <ShieldCheck size={16} />
            <span style={{ fontSize: "9px", fontWeight: 1000, textTransform: "uppercase", letterSpacing: "3px" }}>Ecosystem Activation Port</span>
          </div>
          <h1 style={{ margin: 0, fontSize: "28px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "-0.5px" }}>Steward Credentials Intake</h1>
          <p style={{ margin: "8px 0 0 0", color: "#94a3b8", fontSize: "13px", lineHeight: "1.5" }}>
            Register your local operational hub identity metrics and contractually align your workspace with the Bazaria platform protocols.
          </p>
        </div>

        <form onSubmit={handleSubmitCovenant} style={{ padding: "40px", display: "flex", flexDirection: "column", gap: "32px" }}>
          
          {/* SECTION 1: IDENTITY HANDLES */}
          <div>
            <h3 style={{ margin: "0 0 20px 0", fontSize: "14px", fontWeight: 900, color: "#05292e", textTransform: "uppercase", letterSpacing: "0.5px", borderBottom: "1px solid #f1f5f9", paddingBottom: "8px" }}>
              1. Operational Identity Metrics
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px" }}>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "9px", color: "#64748b", fontWeight: 900, textTransform: "uppercase" }}>Full Professional Name</label>
                <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                  <User size={14} style={{ position: "absolute", left: "12px", color: "#94a3b8" }} />
                  <input 
                    type="text" 
                    required 
                    placeholder="e.g. Xavier Dan"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={{ width: "100%", padding: "12px 12px 12px 36px", backgroundColor: "#f8fafc", border: "1px solid #cbd5e1", borderRadius: "12px", fontSize: "13px", color: "#0f172a", outline: "none", fontWeight: 600 }}
                  />
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "9px", color: "#64748b", fontWeight: 900, textTransform: "uppercase" }}>Secure Mobile Line</label>
                <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                  <Phone size={14} style={{ position: "absolute", left: "12px", color: "#94a3b8" }} />
                  <input 
                    type="text" 
                    required 
                    placeholder="e.g. +1 (305) 555-7742"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    style={{ width: "100%", padding: "12px 12px 12px 36px", backgroundColor: "#f8fafc", border: "1px solid #cbd5e1", borderRadius: "12px", fontSize: "13px", color: "#0f172a", outline: "none", fontWeight: 600 }}
                  />
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "9px", color: "#64748b", fontWeight: 900, textTransform: "uppercase" }}>Operational Hub Location</label>
                <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                  <MapPin size={14} style={{ position: "absolute", left: "12px", color: "#94a3b8" }} />
                  <input 
                    type="text" 
                    required 
                    placeholder="e.g. Santo Domingo, DR"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    style={{ width: "100%", padding: "12px 12px 12px 36px", backgroundColor: "#f8fafc", border: "1px solid #cbd5e1", borderRadius: "12px", fontSize: "13px", color: "#0f172a", outline: "none", fontWeight: 600 }}
                  />
                </div>
              </div>

            </div>
          </div>

          {/* SECTION 2: THE LEGAL DISPLAY COVERANCE */}
          <div>
            <h3 style={{ margin: "0 0 12px 0", fontSize: "14px", fontWeight: 900, color: "#05292e", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              2. Review Platform Governance Covenants
            </h3>
            
            {/* Scrollable Document Container */}
            <div style={{ 
              width: "100%", 
              height: "200px", 
              backgroundColor: "#030712", 
              color: "#94a3b8", 
              border: "1px solid #cbd5e1", 
              borderRadius: "16px", 
              padding: "20px", 
              boxSizing: "border-box", 
              overflowY: "auto", 
              fontFamily: "monospace", 
              fontSize: "11px", 
              lineHeight: "1.6",
              textAlign: "left"
            }}>
              <p style={{ color: "#FFBF00", fontWeight: "bold", margin: "0 0 12px 0" }}>BAZARIA GLOBAL SUCCESS NETWORK — LISTING AGENT COVENANT v1.02</p>
              <p>SECTION 1: INDEPENDENT COMMISSION STATUS & AT-WILL TERMINATION</p>
              <p>1.1 Absolute Non-Employment Declaration: This Agreement establishes a purely contract-based, non-exclusive commission relationship. There is absolutely zero employment agreement, joint venture, agency, or employer-employee relationship created between you and Bazaria. You are entirely responsible for managing your own schedule, workspace, local tools, and all individual self-employment income tax liabilities.</p>
              <p>1.2 Voluntary At-Will Dissolution: This relationship is built entirely on mutual alignment. Either party (the Listing Agent or Bazaria) can break this agreement and close the associated network workspace node at any time, for any reason, effective instantly.</p>
              <p>SECTION 2: AGE REQUISITE & METRIC-DRIVEN ACTIVITY LIFESPANS</p>
              <p>2.1 Minimum Age Constraint: To access corporate data loops and operate merchant intake modules, all Listing Agents must be at least eighteen (18) years of age at the time of account creation.</p>
              <p>2.2 The 2-Month Inactivity Auto-Purge: An Agent workspace remains active solely as long as the Steward is actively engaged and producing marketplace volume. If an account node records two (2) consecutive months of absolute transaction or listing inactivity, the protocol will automatically terminate the workspace.</p>
              <p>SECTION 3: THE PULSE RATING INTEGRITY & COMMISSION FORFEITURE RULES</p>
              <p>3.1 Authorized Payout Ratings: Bazaria distributes commission overrides and referral residuals only for completed transactions scoring POSITIVE or NEUTRAL customer pulse ratings.</p>
              <p>3.2 Negative Rating Penalty: Any transaction resulting in a verified NEGATIVE customer pulse rating constitutes a performance failure. The Agent automatically forfeits any and all commission slices associated with that transaction.</p>
              <p>3.3 The 3-Strike Quality Auto-Termination: If an Agent accumulates three (3) consecutive negative ratings, the system will automatically trigger a terminal override, terminate the account, and revoke all platform access clearances immediately.</p>
              <p>SECTION 4: VAULT CAPITAL DISBURSEMENT & DEBIT CARD THRESHOLDS</p>
              <p>4.1 The $500 Debit Card Milestone Gate: A Listing Agent must clear an initial pipeline threshold of Five Hundred Dollars ($500.00 USD) in verified, accumulated earnings before the protocol will authorize and issue a physical corporate debit card.</p>
              <p>4.2 Separation Fund Exhaustion Rules: In the event that either party terminates this relationship, the Agent retains the absolute right to continue using their issued physical debit card to clear purchases until all existing, cleared vault funds are entirely exhausted.</p>
              <p>4.3 Retained Micro-Balance Forfeiture: If an Agent chooses to separate or falls into permanent inactivity before reaching the baseline $500.00 system threshold, no debit card will be issued, and remaining micro-balances under the threshold upon account termination are permanently forfeit to absorb setup overhead.</p>
            </div>
          </div>

          {/* SECTION 3: CONTRACT INTERLOCK INTERACTION */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", backgroundColor: "#f8fafc", padding: "20px", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
            
            <label style={{ display: "flex", alignItems: "flex-start", gap: "12px", cursor: "pointer", selectNone: "none", textAlign: "left" } as any}>
              <input 
                type="checkbox" 
                checked={isAgeVerified}
                onChange={(e) => setIsAgeVerified(e.target.checked)}
                style={{ marginTop: "2px", width: "16px", height: "16px", accentColor: "#05292e" }} 
              />
              <span style={{ fontSize: "12px", color: "#334155", fontWeight: 700 }}>
                I formally certify that I am at least eighteen (18) years of age or older and am legally cleared to conduct high-end marketplace operations.
              </span>
            </label>

            <label style={{ display: "flex", alignItems: "flex-start", gap: "12px", cursor: "pointer", selectNone: "none", textAlign: "left" } as any}>
              <input 
                type="checkbox" 
                checked={isProtocolAgreed}
                onChange={(e) => setIsProtocolAgreed(e.target.checked)}
                style={{ marginTop: "2px", width: "16px", height: "16px", accentColor: "#05292e" }} 
              />
              <span style={{ fontSize: "12px", color: "#334155", fontWeight: 700 }}>
                I have thoroughly reviewed, understood, and voluntarily accept all terms listed inside the Bazaria Success Network Steward Protocol.
              </span>
            </label>

          </div>

          {/* SUBMIT BUTTON TRIGGER */}
          <button
            type="submit"
            disabled={loading || !isAgeVerified || !isProtocolAgreed}
            style={{
              width: "100%",
              padding: "16px",
              backgroundColor: (!isAgeVerified || !isProtocolAgreed) ? "#cbd5e1" : "#05292e",
              color: (!isAgeVerified || !isProtocolAgreed) ? "#94a3b8" : "#FFBF00",
              border: "1px solid " + ((!isAgeVerified || !isProtocolAgreed) ? "#e2e8f0" : "#FFBF00"),
              borderRadius: "14px",
              fontSize: "13px",
              fontWeight: 900,
              textTransform: "uppercase",
              letterSpacing: "1.5px",
              cursor: (!isAgeVerified || !isProtocolAgreed || loading) ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              transition: "all 0.2s ease"
            }}
          >
            {loading ? "COMMITTING ENCRYPTED COVENANT..." : "🔒 Authorize and Activate Agent Node"}
            <ArrowRight size={16} />
          </button>

        </form>

      </div>
    </div>
  );
}
