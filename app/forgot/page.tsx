"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { app } from "@/lib/firebase/client";
import { KeyRound, Mail, ArrowRight } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const auth = getAuth(app);
      
      // 🚀 Send the official secure recovery link via Firebase
      await sendPasswordResetEmail(auth, email);
      
      setMessage("A secure recovery transmission has been dispatched to your email address.");
      setLoading(false);
    } catch (err: any) {
      console.error("Password Reset Error:", err);
      setError("Recovery request failed: " + (err.message || "Email not found."));
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#05292E', padding: '24px' }}>
      
      {/* Header Section */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '32px' }}>
        <div style={{ width: '64px', height: '64px', borderRadius: '16px', border: '1px solid #FFBF00', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
          <KeyRound color="#FFBF00" size={32} />
        </div>
        <h1 style={{ color: '#FFFFFF', fontSize: '24px', fontWeight: 1000, letterSpacing: '-0.5px', textAlign: 'center', margin: 0 }}>
          RECOVER ACCESS KEY
        </h1>
        <span style={{ color: '#64748b', fontSize: '9px', letterSpacing: '3px', marginTop: '12px', textTransform: 'uppercase', fontWeight: 900 }}>
          Security Credentials Recovery
        </span>
      </div>

      {/* Form Card */}
      <div style={{ backgroundColor: '#ffffff', padding: '48px', borderRadius: '48px', boxShadow: '0 40px 100px -20px rgba(0,0,0,0.5)', width: '100%', maxWidth: '440px' }}>
        
        {error && (
          <div style={{ padding: '12px', marginBottom: '20px', backgroundColor: '#fecaca', color: '#991b1b', borderRadius: '8px', fontSize: '10px', fontWeight: 700, textAlign: 'center' }}>
            {error}
          </div>
        )}

        {message ? (
          <div style={{ textAlign: "center" }}>
            <div style={{ padding: '16px', marginBottom: '24px', backgroundColor: '#d1fae5', color: '#065f46', borderRadius: '16px', fontSize: '12px', fontWeight: 700, lineHeight: '1.6' }}>
              {message}
            </div>
            <button 
              onClick={() => router.push("/login")}
              style={buttonStyle}
            >
              RETURN TO LOGIN <ArrowRight size={14} />
            </button>
          </div>
        ) : (
          <form onSubmit={handleReset} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            <p style={{ color: '#64748b', fontSize: '11px', fontWeight: 600, textAlign: 'center', margin: '0 0 12px 0', lineHeight: '1.6' }}>
              Input your registered identity email below. We will transmit a secure access link to reset your password.
            </p>

            {/* Email Input */}
            <div style={{ position: 'relative' }}>
              <Mail style={{ position: 'absolute', left: '24px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={18} />
              <input 
                type="email" 
                placeholder="REGISTRY EMAIL" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={inputStyle} 
              />
            </div>

            {/* Gold Submit Button */}
            <button 
              type="submit" 
              disabled={loading}
              style={buttonStyle}
            >
              {loading ? "DISPATCHING..." : "SEND RECOVERY LINK"} <ArrowRight size={14} />
            </button>
          </form>
        )}

        {!message && (
          <div style={{ marginTop: '24px', textAlign: 'center' }}>
            <span style={{ fontSize: '8px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Remember your access key?{" "}
              <a href="/login" style={{ color: '#05292E', textDecoration: 'underline', fontWeight: 1000 }}>
                Return to Portal
              </a>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '16px 24px 16px 64px',
  borderRadius: '32px',
  border: '1px solid #cbd5e1',
  outline: 'none',
  fontSize: '10px',
  textTransform: 'uppercase' as const,
  fontWeight: 900,
  color: '#05292E'
};

const buttonStyle = {
  width: '100%',
  padding: '16px',
  backgroundColor: '#FFBF00',
  color: '#05292E',
  border: 'none',
  borderRadius: '32px',
  fontWeight: 1000,
  cursor: 'pointer',
  fontSize: '10px',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.1em',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '8px',
  marginTop: '8px'
};
