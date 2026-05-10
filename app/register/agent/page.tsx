
"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc, collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { app } from "@/lib/firebase/client";
import { 
  ShieldCheck, ArrowRight, Gavel, Car, Home, 
  Mail, Phone, Lock, ChevronRight, CheckCircle2 
} from "lucide-react";

export default function AgentSignupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Form States
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [referralCodeInput, setReferralCodeInput] = useState("");
  
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

  const handleAgentSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

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

      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        phone: phone,
        role: "agent",
        status: "pending_verification",
        agentTier: selectedTier,
        createdAt: new Date().toISOString(),
        myReferralCode: agentCode,
        referredByCode: validReferralCode || null,
        referralCount: 0,
        accruedRewards: 0,
        totalSalesVolume: 0
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

      router.push("/verify-phone");
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
            <p style={{ fontSize: "11px", fontWeight: 800, color: "#64748b", uppercase: true, textTransform: "uppercase", margin: 0 }}>
              No upfront charges. Complete credential authorization below.
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

          <form onSubmit={handleAgentSignup} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            
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

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={loading}
              style={{
                width: "100%",
                padding: "18px",
                marginTop: "8px",
                backgroundColor: "#FFBF00",
                color: "#05292E",
                border: "none",
                borderRadius: "32px",
                fontWeight: 1000,
                fontSize: "11px",
                textTransform: "uppercase",
                letterSpacing: "1px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                cursor: "pointer",
                boxShadow: "0 10px 20px rgba(255, 191, 0, 0.15)",
                transition: "all 0.2s ease",
                opacity: loading ? 0.5 : 1
              }}
            >
              {loading ? "INITIALIZING SECURE REGISTRY..." : "SUBMIT AGENT APPLICATION"} <ArrowRight size={14} />
            </button>

          </form>

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
