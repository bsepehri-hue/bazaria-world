"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc, collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { app } from "@/lib/firebase/client";
import { 
  ShieldCheck, ArrowRight, Gavel, Car, Home, 
  Mail, Phone, Lock, ChevronRight, CheckCircle2, Briefcase, FileText
} from "lucide-react";

export default function AgentSignupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 🎛️ STEP CONTROLLER: 1 = Credentials Intake, 2 = Experience & Covenants
  const [formStep, setFormStep] = useState(1);

  // Form States
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [referralCodeInput, setReferralCodeInput] = useState("");
  
  // 🧬 New Domain Fields State
  const [backgroundSector, setBackgroundSector] = useState("Sales, customer service experience.");
  const [experienceBio, setExperienceBio] = useState("");

  // 🛡️ Legal Protocols Sockets
  const [isAgeVerified, setIsAgeVerified] = useState(false);
  const [isProtocolAgreed, setIsProtocolAgreed] = useState(false);
  
  // Tier & Progress States
  const [selectedTier, setSelectedTier] = useState<"silver" | "gold" | "sovereign">("silver");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Automatically capture referral code from URL (?ref=...)
  useEffect(() => {
    const refParam = searchParams.get("ref");
    if (refParam) {
      setReferralCodeInput(refParam.toUpperCase());
    }
  }, [searchParams]);

  const generateAgentCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let randomSegment = "";
    for (let i = 0; i < 4; i++) {
      randomSegment += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `AGT-${randomSegment}`;
  };

  // Handles Step 1 Validation before transitioning card visuals
  const handleNextStepValidation = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !phone || !password) {
      setError("Please fill out all identity credentials fields.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setFormStep(2);
  };

  const handleAgentSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAgeVerified || !isProtocolAgreed) {
      setError("You must verify your age requirement and acknowledge the Sovereign Protocol.");
      return;
    }

    if (experienceBio.trim().length < 40) {
      setError("Please provide a more complete insight regarding your past experience.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const authInstance = getAuth(app);
      const db = getFirestore(app);

      let referrerId = "";
      let validReferralCode = "";

      if (referralCodeInput.trim() !== "") {
        const cleanCode = referralCodeInput.trim().toUpperCase();
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("myReferralCode", "==", cleanCode));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          setError("Invalid sponsor code. Please double-check the credentials.");
          setLoading(false);
          return;
        } else {
          referrerId = querySnapshot.docs[0].id;
          validReferralCode = cleanCode;
        }
      }

      const userCredential = await createUserWithEmailAndPassword(authInstance, email, password);
      const user = userCredential.user;
      const agentCode = generateAgentCode();

      // Node A: Master User Identity Table Node
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        phone: phone,
        role: "agent",
        status: "pending_verification",
        agentTier: selectedTier,
        backgroundSector: backgroundSector,
        experienceBio: experienceBio,
        createdAt: new Date().toISOString(),
        myReferralCode: agentCode,
        referredByCode: validReferralCode || null,
        referralCount: 0,
        accruedRewards: 0,
        totalSalesVolume: 0
      });

      // Node B: Initialize Partner Balance tracking node for Rewards Workspace Natively
      await setDoc(doc(db, "partners", user.uid), {
        uid: user.uid,
        name: email.split("@")[0].toUpperCase(), // Safe visual placeholder fallback name
        email: user.email,
        paid: 0.00,
        available: 0.00,
        credits: 0,
        listings: 0,
        tier: selectedTier === "sovereign" ? "Sovereign Executive" : selectedTier === "gold" ? "Gold Elite Steward" : "Standard Steward (M1)",
        academyLevel: selectedTier === "sovereign" ? 3 : selectedTier === "gold" ? 2 : 1,
        volumeCapacity: selectedTier === "sovereign" ? 1000000 : selectedTier === "gold" ? 500000 : 250000,
        pulsePositive: 0,
        pulseNeutral: 0,
        pulseNegative: 0,
        updatedAt: new Date().toISOString()
      });

      if (referrerId) {
        await addDoc(collection(db, "referrals"), {
          referrerUid: referrerId,
          refereeUid: user.uid,
          referralCode: validReferralCode,
          status: "pending",
          timestamp: new Date().toISOString()
        });
      }

      alert("Covenant Authorized. Welcome to the Bazaria Success Network!");
      router.push("/rewards"); // Routes agent straight to active console workspace
    } catch (err: any) {
      console.error("Agent signup error:", err);
      setError("Agent Enrollment Failed: " + (err.message || "Unknown error"));
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#05292E",
      color: "#ffffff",
      fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "40px 24px",
      boxSizing: "border-box"
    }}>
      
      {/* 🛡️ HEADER */}
      <div style={{ textAlign: "center", marginBottom: "48px", maxWidth: "500px" }}>
        <div style={{
          width: "64px",
          height: "64px",
          borderRadius: "20px",
          border: "2px solid #FFBF00",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "16px",
          boxShadow: "0 0 15px rgba(255, 191, 0, 0.15)"
        }}>
          <ShieldCheck color="#FFBF00" size={32} />
        </div>
        <h1 style={{ fontSize: "28px", fontWeight: 1000, textTransform: "uppercase", letterSpacing: "-0.5px", margin: "0 0 8px 0" }}>
          Agent Protocol Registry
        </h1>
        <span style={{ fontSize: "10px", fontWeight: 900, letterSpacing: "4px", color: "#64748b", textTransform: "uppercase" }}>
          Sovereign Sales & Listing Authority
        </span>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr",
        maxWidth: "1100px",
        width: "100%",
        gap: "40px",
        boxSizing: "border-box"
      }} className="lg-grid-cols-2-override">
        
        {/* 📋 LEFT SIDE: BENEFITS & TIER SELECTOR */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          
          {/* TIER SELECTION ROW */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "16px"
          }}>
            
            {/* SILVER CARD */}
            <div 
              onClick={() => setSelectedTier("silver")}
              style={{
                padding: "24px",
                borderRadius: "24px",
                border: selectedTier === "silver" ? "2px solid #FFBF00" : "1px solid rgba(255, 255, 255, 0.1)",
                backgroundColor: selectedTier === "silver" ? "#ffffff" : "rgba(255, 255, 255, 0.03)",
                color: selectedTier === "silver" ? "#05292E" : "#ffffff",
                cursor: "pointer",
                transition: "all 0.2s ease"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                <Gavel color={selectedTier === "silver" ? "#14b8a6" : "#64748b"} size={24} />
                <span style={{
                  fontSize: "8px", 
                  fontWeight: 900, 
                  padding: "4px 8px", 
                  borderRadius: "6px",
                  backgroundColor: selectedTier === "silver" ? "rgba(20, 184, 166, 0.1)" : "rgba(255,255,255,0.05)",
                  color: selectedTier === "silver" ? "#14b8a6" : "#ffffff"
                }}>UNDER $10K</span>
              </div>
              <h3 style={{ fontSize: "18px", fontWeight: 900, margin: "0 0 8px 0", textTransform: "uppercase" }}>Silver</h3>
              <p style={{ fontSize: "11px", opacity: 0.8, lineHeight: "1.5", margin: 0 }}>
                Perfect for general products, consumer assets, and local services.
              </p>
            </div>

            {/* GOLD CARD */}
            <div 
              onClick={() => setSelectedTier("gold")}
              style={{
                padding: "24px",
                borderRadius: "24px",
                border: selectedTier === "gold" ? "2px solid #FFBF00" : "1px solid rgba(255, 255, 255, 0.1)",
                backgroundColor: selectedTier === "gold" ? "#ffffff" : "rgba(255, 255, 255, 0.03)",
                color: selectedTier === "gold" ? "#05292E" : "#ffffff",
                cursor: "pointer",
                transition: "all 0.2s ease"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                <Car color={selectedTier === "gold" ? "#FFBF00" : "#64748b"} size={24} />
                <span style={{
                  fontSize: "8px", 
                  fontWeight: 900, 
                  padding: "4px 8px", 
                  borderRadius: "6px",
                  backgroundColor: selectedTier === "gold" ? "rgba(255, 191, 0, 0.1)" : "rgba(255,255,255,0.05)",
                  color: selectedTier === "gold" ? "#FFBF00" : "#ffffff"
                }}>OVER $10K</span>
              </div>
              <h3 style={{ fontSize: "18px", fontWeight: 900, margin: "0 0 8px 0", textTransform: "uppercase" }}>Gold Elite</h3>
              <p style={{ fontSize: "11px", opacity: 0.8, lineHeight: "1.5", margin: 0 }}>
                High-ticket mobility: automobiles, luxury yachts, and premium items.
              </p>
            </div>

            {/* SOVEREIGN CARD */}
            <div 
              onClick={() => setSelectedTier("sovereign")}
              style={{
                padding: "24px",
                borderRadius: "24px",
                border: selectedTier === "sovereign" ? "2px solid #FFBF00" : "1px solid rgba(255, 255, 255, 0.1)",
                backgroundColor: selectedTier === "sovereign" ? "#ffffff" : "rgba(255, 255, 255, 0.03)",
                color: selectedTier === "sovereign" ? "#05292E" : "#ffffff",
                cursor: "pointer",
                transition: "all 0.2s ease"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                <Home color={selectedTier === "sovereign" ? "#f43f5e" : "#64748b"} size={24} />
                <span style={{
                  fontSize: "8px", 
                  fontWeight: 900, 
                  padding: "4px 8px", 
                  borderRadius: "6px",
                  backgroundColor: selectedTier === "sovereign" ? "rgba(244, 63, 94, 0.1)" : "rgba(255,255,255,0.05)",
                  color: selectedTier === "sovereign" ? "#f43f5e" : "#ffffff"
                }}>OVER $100K</span>
              </div>
              <h3 style={{ fontSize: "18px", fontWeight: 900, margin: "0 0 8px 0", textTransform: "uppercase" }}>Sovereign</h3>
              <p style={{ fontSize: "11px", opacity: 0.8, lineHeight: "1.5", margin: 0 }}>
                Real estate listings, pristine land blocks, and custom white-glove concierge.
              </p>
            </div>

          </div>

          {/* DYNAMIC BENEFITS DESCRIPTION BOX */}
          <div style={{
            backgroundColor: "rgba(255, 255, 255, 0.03)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            padding: "32px",
            borderRadius: "32px",
            display: "flex",
            flexDirection: "column",
            gap: "24px"
          }}>
            <h2 style={{ fontSize: "18px", fontWeight: 900, textTransform: "uppercase", margin: 0, color: "#FFBF00" }}>
              Tier Compensation Protocol
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {selectedTier === "silver" && (
                <>
                  <BenefitRow text="Direct 50% commission splits on transactional storefront sales processed online." />
                  <BenefitRow text="Perfect for general retail products, consumer items, and local services." />
                  <BenefitRow text="Secure dashboard access to manage standard digital merchant referral codes." />
                </>
              )}
              {selectedTier === "gold" && (
                <>
                  <BenefitRow text="Earn a massive 50% split on all upfront dealer listing fees (e.g. 100 listings = $500 payout)." />
                  <BenefitRow text="Unlock high-ticket mobility portfolios: list cars, premium trucks, and watercraft." />
                  <BenefitRow text="Advanced specifications toolkit with integrated VIN-reading validation support." />
                </>
              )}
              {selectedTier === "sovereign" && (
                <>
                  <BenefitRow text="Premium listing overrides on high-value properties, villa developments, and raw land." />
                  <BenefitRow text="Access to the Sovereign Concierge network for managing high-spirit international tours." />
                  <BenefitRow text="Secured attorney contract templates to protect local property referral overrides." />
                </>
              )}
            </div>

            <div style={{
              borderTop: "1px solid rgba(255, 255, 255, 0.1)",
              paddingTop: "20px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <span style={{ fontSize: "10px", color: "#64748b", fontWeight: 900, textTransform: "uppercase" }}>Estimated Agent Revenue Potential</span>
              <span style={{ fontSize: "18px", fontWeight: 900, color: "#14b8a6" }}>
                {selectedTier === "silver" && "$2,500 - $6,000 / Mo"}
                {selectedTier === "gold" && "$8,000 - $18,000 / Mo"}
                {selectedTier === "sovereign" && "$20,000+ / Mo"}
              </span>
            </div>
          </div>

        </div>

        {/* 🔒 RIGHT SIDE: FORM CARD */}
        <div style={{
          backgroundColor: "#ffffff",
          color: "#0f172a",
          borderRadius: "40px",
          padding: "40px",
          boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)"
        }}>
          <div style={{ marginBottom: "32px" }}>
            <h3 style={{ fontSize: "20px", fontWeight: 1000, textTransform: "uppercase", color: "#05292E", margin: "0 0 4px 0" }}>
              Apply For {selectedTier === "silver" ? "Silver" : selectedTier === "gold" ? "Gold Elite" : "Sovereign"}
            </h3>
            <p style={{ fontSize: "11px", fontWeight: 800, color: "#64748b", textTransform: "uppercase", margin: 0 }}>
              {formStep === 1 ? "No upfront charges. Complete credential authorization below." : "Specify background track and endorse legal platform covenants."}
            </p>
          </div>

          {error && (
            <div style={{
              padding: "16px",
              marginBottom: "20px",
              backgroundColor: "#fee2e2",
              color: "#991b1b",
              borderRadius: "16px",
              fontSize: "11px",
              fontWeight: 900,
              textAlign: "center"
            }}>
              {error}
            </div>
          )}

          {/* 🎯 STEP 1: INITIAL ACCOUNT CREDENTIALS INTAKE */}
          {formStep === 1 && (
            <form onSubmit={handleNextStepValidation} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              
              {/* Email Field */}
              <div style={{ position: "relative" }}>
                <Mail style={{ position: "absolute", left: "20px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} size={18} />
                <input 
                  type="email" 
                  placeholder="AGENCY EMAIL" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{
                    width: "100%",
                    padding: "16px 20px 16px 56px",
                    border: "1px solid #e2e8f0",
                    borderRadius: "32px",
                    fontSize: "11px",
                    fontWeight: 900,
                    textTransform: "uppercase",
                    color: "#05292E",
                    outline: "none",
                    boxSizing: "border-box"
                  }} 
                />
              </div>

              {/* Phone Field */}
              <div style={{ position: "relative" }}>
                <Phone style={{ position: "absolute", left: "20px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} size={18} />
                <input 
                  type="tel" 
                  placeholder="MOBILE PROTOCOL (e.g. +1...)" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  style={{
                    width: "100%",
                    padding: "16px 20px 16px 56px",
                    border: "1px solid #e2e8f0",
                    borderRadius: "32px",
                    fontSize: "11px",
                    fontWeight: 900,
                    textTransform: "uppercase",
                    color: "#05292E",
                    outline: "none",
                    boxSizing: "border-box"
                  }} 
                />
              </div>

              {/* Password */}
              <div style={{ position: "relative" }}>
                <Lock style={{ position: "absolute", left: "20px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} size={18} />
                <input 
                  type="password" 
                  placeholder="SECURE PASSWORD" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{
                    width: "100%",
                    padding: "16px 20px 16px 56px",
                    border: "1px solid #e2e8f0",
                    borderRadius: "32px",
                    fontSize: "11px",
                    fontWeight: 900,
                    textTransform: "uppercase",
                    color: "#05292E",
                    outline: "none",
                    boxSizing: "border-box"
                  }} 
                />
              </div>

              {/* Confirm Password */}
              <div style={{ position: "relative" }}>
                <Lock style={{ position: "absolute", left: "20px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} size={18} />
                <input 
                  type="password" 
                  placeholder="CONFIRM PASSWORD" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  style={{
                    width: "100%",
                    padding: "16px 20px 16px 56px",
                    border: "1px solid #e2e8f0",
                    borderRadius: "32px",
                    fontSize: "11px",
                    fontWeight: 900,
                    textTransform: "uppercase",
                    color: "#05292E",
                    outline: "none",
                    boxSizing: "border-box"
                  }} 
                />
              </div>

              {/* Sponsor Code */}
              <div style={{ position: "relative" }}>
                <ChevronRight style={{ position: "absolute", left: "20px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} size={18} />
                <input 
                  type="text" 
                  placeholder="SPONSOR CODE (OPTIONAL)" 
                  value={referralCodeInput}
                  onChange={(e) => setReferralCodeInput(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "16px 20px 16px 56px",
                    border: "1px solid #e2e8f0",
                    borderRadius: "32px",
                    fontSize: "11px",
                    fontWeight: 900,
                    textTransform: "uppercase",
                    color: "#05292E",
                    outline: "none",
                    boxSizing: "border-box"
                  }} 
                />
              </div>

              {/* Next Button */}
              <button 
                type="submit" 
                style={{
                  width: "100%", padding: "18px", marginTop: "8px", backgroundColor: "#FFBF00", color: "#05292E",
                  border: "none", borderRadius: "32px", fontWeight: 1000, fontSize: "11px",
                  textTransform: "uppercase", letterSpacing: "1px", display: "flex", alignItems: "center",
                  justifyContent: "center", gap: "8px", cursor: "pointer", boxShadow: "0 10px 20px rgba(255, 191, 0, 0.15)", transition: "all 0.2s ease"
                }}
              >
                Continue Application <ArrowRight size={14} />
              </button>
            </form>
          )}

          {/* 🎯 STEP 2: METRIC CATEGORY BACKINGS & LEGAL INTERLOCK OVERLAY */}
          {formStep === 2 && (
            <form onSubmit={handleAgentSignup} style={{ display: "flex", flexDirection: "column", gap: "16px", textAlign: "left" }}>
              
              {/* BACKGROUND DROPDOWN MATRIX */}
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <label style={{ fontSize: "9px", fontWeight: 900, color: "#64748b", textTransform: "uppercase" }}>Primary Domain Classification</label>
                <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                  <Briefcase size={16} style={{ position: "absolute", left: "20px", color: "#94a3b8" }} />
                  <select
                    value={backgroundSector}
                    onChange={(e) => setBackgroundSector(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "16px 20px 16px 56px",
                      border: "1px solid #e2e8f0",
                      borderRadius: "32px",
                      fontSize: "11px",
                      fontWeight: 900,
                      color: "#05292E",
                      outline: "none",
                      backgroundColor: "#f8fafc",
                      cursor: "pointer",
                      appearance: "none"
                    }}
                  >
                    <option value="Social media influencer">Social media influencer</option>
                    <option value="Marketing and Advertising.">Marketing and Advertising</option>
                    <option value="Sales, customer service experience.">Sales, customer service experience</option>
                    <option value="Real Estate">Real Estate</option>
                    <option value="Auto Industry">Auto Industry</option>
                  </select>
                </div>
              </div>

              {/* TWO PARAGRAPH BIO FIELD */}
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <label style={{ fontSize: "9px", fontWeight: 900, color: "#64748b", textTransform: "uppercase" }}>Professional Narrative Overview</label>
                <div style={{ position: "relative", display: "flex" }}>
                  <FileText size={16} style={{ position: "absolute", left: "20px", top: "16px", color: "#94a3b8" }} />
                  <textarea 
                    required 
                    rows={4}
                    placeholder="Provide two brief insights: 1) Details regarding your business/sales timeline. 2) Your operational strategy to aggregate verified luxury asset listings onto your custom link storefront hooks..."
                    value={experienceBio}
                    onChange={(e) => setExperienceBio(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "16px 20px 16px 56px",
                      border: "1px solid #e2e8f0",
                      borderRadius: "24px",
                      fontSize: "12px",
                      fontWeight: 600,
                      color: "#05292E",
                      outline: "none",
                      backgroundColor: "#f8fafc",
                      resize: "none",
                      lineHeight: 1.4
                    }}
                  />
                </div>
              </div>

              {/* THE AGENT SCROLLABLE COVENANT SYSTEM */}
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <label style={{ fontSize: "9px", fontWeight: 900, color: "#64748b", textTransform: "uppercase" }}>Governance Framework Context</label>
                <div style={{ width: "100%", height: "100px", backgroundColor: "#05292E", color: "#94a3b8", border: "1px solid #e2e8f0", borderRadius: "20px", padding: "16px", boxSizing: "border-box", overflowY: "auto", fontFamily: "monospace", fontSize: "9px", lineHeight: "1.5" }}>
                  <p style={{ color: "#FFBF00", fontWeight: "bold", margin: "0 0 6px 0" }}>BAZARIA — LISTING STEWARD PROTOCOL v1.02</p>
                  <p>1. NON-EMPLOYMENT: This framework is an at-will, fully commission-based independent node link. Bazaria creates absolute zero corporate employer-employee obligations or tax holdings.</p>
                  <p>2. RATINGS DISBURSEMENT: Commissions are calculated and unlocked ONLY for listings generating Positive or Neutral client response ratings. Any negative score completely forfeits your performance fee share overrides.</p>
                  <p>3. TERMINATION RADAR: Accumulation of 3 consecutive negative rating scores or slipping into 2 full months of listing inactivity triggers an automated protocol purge sequence, instantly closing your dashboard workspace access rights.</p>
                </div>
              </div>

              {/* CHECKBOXES INTERLOCK BLOCK */}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", backgroundColor: "#f8fafc", padding: "14px", borderRadius: "20px", border: "1px solid #e2e8f0" }}>
                <label style={{ display: "flex", gap: "8px", alignItems: "flex-start", cursor: "pointer", fontSize: "11px", fontWeight: 700, color: "#334155" }}>
                  <input type="checkbox" checked={isAgeVerified} onChange={(e) => setIsAgeVerified(e.target.checked)} style={{ marginTop: "2px", accentColor: "#05292E" }} />
                  <span>I formally certify that I am at least eighteen (18) years of age or older.</span>
                </label>
                <label style={{ display: "flex", gap: "8px", alignItems: "flex-start", cursor: "pointer", fontSize: "11px", fontWeight: 700, color: "#334155" }}>
                  <input type="checkbox" checked={isProtocolAgreed} onChange={(e) => setIsProtocolAgreed(e.target.checked)} style={{ marginTop: "2px", accentColor: "#05292E" }} />
                  <span>I fully endorse and bind my activities to the Bazaria Steward Protocol.</span>
                </label>
              </div>

              {/* REGISTRATION ACTION TRIGGER */}
              <div style={{ display: "flex", gap: "10px", marginTop: "4px" }}>
                <button type="button" onClick={() => setFormStep(1)} style={{ flex: 1, padding: "16px", backgroundColor: "#e2e8f0", color: "#475569", border: "none", borderRadius: "32px", fontWeight: 900, fontSize: "11px", textTransform: "uppercase", cursor: "pointer" }}>Back</button>
                <button 
                  type="submit" 
                  disabled={loading || !isAgeVerified || !isProtocolAgreed} 
                  style={{
                    flex: 2, padding: "16px", backgroundColor: (!isAgeVerified || !isProtocolAgreed) ? "#cbd5e1" : "#05292E", color: (!isAgeVerified || !isProtocolAgreed) ? "#94a3b8" : "#FFBF00",
                    border: "none", borderRadius: "32px", fontWeight: 1000, fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", cursor: (loading || !isAgeVerified || !isProtocolAgreed) ? "not-allowed" : "pointer",
                    opacity: loading ? 0.5 : 1
                  }}
                >
                  {loading ? "Activating Node..." : "🔒 Authorize Profile"}
                </button>
              </div>
            </form>
          )}

          <div style={{ marginTop: "24px", textAlign: "center" }}>
            <span style={{ fontSize: "9px", color: "#64748b", fontWeight: 900, textTransform: "uppercase" }}>
              Looking to buy or sell instead?{" "}
              <a href="/register" style={{ color: "#05292E", textDecoration: "underline", fontWeight: 1000 }}>
                Register as User
              </a>
            </span>
          </div>

        </div>

      </div>

      {/* Embedded Mobile CSS Overrides */}
      <style jsx>{`
        @media (min-width: 1024px) {
          .lg-grid-cols-2-override {
            grid-template-columns: 1.2fr 0.8fr !important;
          }
        }
      `}</style>

    </div>
  );
}

function BenefitRow({ text }: { text: string }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
      <CheckCircle2 color="#14b8a6" style={{ marginTop: "2px", flexShrink: 0 }} size={16} />
      <span style={{ fontSize: "12px", color: "#f8fafc", lineHeight: "1.5", fontWeight: 600 }}>{text}</span>
    </div>
  );
}
