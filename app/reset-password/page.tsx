"use client";

import React, { useState } from "react";
import { auth } from "@/lib/firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import { useRouter } from "next/navigation";
import { ShieldAlert, Mail, ArrowLeft, Send } from "lucide-react";

export default function ResetPasswordPage() {
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
      await sendPasswordResetEmail(auth, email);
      setMessage("Recovery link dispatched to your registry email.");
      setLoading(false);
    } catch (err: any) {
      setError("Registry email not found in protocol.");
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', position: 'relative', overflow: 'hidden', color: '#fff', fontFamily: 'sans-serif' }}>
      
      {/* 🌌 AMBIENT ATMOSPHERE */}
      <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '600px', height: '600px', backgroundColor: 'rgba(244, 63, 94, 0.05)', filter: 'blur(120px)', borderRadius: '50%' }} />
      
      <div style={{ width: '100%', maxWidth: '440px', position: 'relative', zIndex: 10 }}>
        
        {/* LOGO BOX */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '80px', height: '80px', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '28px', border: '1px solid rgba(255,255,255,0.08)', marginBottom: '32px', backdropFilter: 'blur(12px)' }}>
             <ShieldAlert size={40} style={{ color: '#f43f5e' }} strokeWidth={1.5} />
          </div>
          <h1 style={{ fontSize: '32px', fontWeight: 1000, textTransform: 'uppercase', letterSpacing: '-0.04em', lineHeight: '1', margin: '0' }}>Recovery Protocol</h1>
          <p style={{ fontSize: '11px', fontWeight: 900, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.4em', marginTop: '20px' }}>Credential Restoration</p>
        </div>

        {/* 💳 RESET CARD */}
        <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(60px)', padding: '48px', borderRadius: '56px', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 40px 80px -20px rgba(0,0,0,0.6)' }}>
          
          {!message ? (
            <form onSubmit={handleReset} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <p style={{ fontSize: '12px', color: '#94a3b8', lineHeight: '1.6', textAlign: 'center', marginBottom: '10px' }}>
                Enter your verified email to receive a secure access restoration link.
              </p>
              
              <div style={{ position: 'relative' }}>
                <Mail style={{ position: 'absolute', left: '24px', top: '50%', transform: 'translateY(-50%)', color: '#475569' }} size={18} />
                <input 
                  type="email" 
                  placeholder="REGISTRY EMAIL"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ width: '100%', height: '72px', backgroundColor: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', paddingLeft: '64px', paddingRight: '24px', color: '#fff', fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', outline: 'none' }}
                  required
                />
              </div>

              {error && <p style={{ color: '#f43f5e', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', textAlign: 'center' }}>{error}</p>}

              <button 
                type="submit" 
                disabled={loading}
                style={{ width: '100%', height: '72px', backgroundColor: '#fff', color: '#000', borderRadius: '24px', border: 'none', fontWeight: 1000, textTransform: 'uppercase', letterSpacing: '0.25em', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', transition: 'all 0.2s ease' }}
              >
                {loading ? "DISPATCHING..." : "SEND RECOVERY LINK"}
                {!loading && <Send size={18} />}
              </button>
            </form>
          ) : (
            <div style={{ textAlign: 'center' }}>
               <div style={{ color: '#2dd4bf', fontSize: '13px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '32px', lineHeight: '1.6' }}>
                 {message}
               </div>
               <button 
                onClick={() => router.push('/login')}
                style={{ width: '100%', height: '64px', backgroundColor: 'rgba(255,255,255,0.05)', color: '#fff', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', cursor: 'pointer' }}
              >
                Return to Login
              </button>
            </div>
          )}

          <div style={{ marginTop: '32px', textAlign: 'center' }}>
            <button 
              onClick={() => router.back()}
              style={{ background: 'none', border: 'none', color: '#475569', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', margin: '0 auto' }}
            >
              <ArrowLeft size={14} /> Back to Gateway
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
