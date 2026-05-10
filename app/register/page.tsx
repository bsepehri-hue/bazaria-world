"use client";

import React, { useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { ShieldCheck, Lock, Mail, Phone, ArrowRight } from "lucide-react";
import { app } from "@/lib/firebase/client";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const auth = getAuth(app);
      const db = getFirestore(app);

      // 1. Create the Auth Account (We sign up with email and password first)
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Initialize their Profile in Firestore
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        phone: phone, 
        role: "user",
        status: "pending_verification",
        createdAt: new Date().toISOString(),
      });

      // 3. Send them to the 2FA page to verify their newly registered phone
      router.push("/verify-phone");
    } catch (err: any) {
      console.error("Registration Error:", err);
      setError("Registry Request Failed: " + (err.message || "Unknown error"));
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#05292E', padding: '24px' }}>
      
      {/* Header Section */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '32px' }}>
        <div style={{ width: '64px', height: '64px', borderRadius: '16px', border: '1px solid #FFBF00', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
          <ShieldCheck color="#FFBF00" size={32} />
        </div>
        <h1 style={{ color: '#FFFFFF', fontSize: '24px', fontWeight: 1000, letterSpacing: '-0.5px', textAlign: 'center', margin: 0 }}>
          REQUEST<br />REGISTRY ACCESS
        </h1>
        <span style={{ color: '#64748b', fontSize: '9px', letterSpacing: '3px', marginTop: '12px', textTransform: 'uppercase', fontWeight: 900 }}>
          Secure Identity Enrollment
        </span>
      </div>

      {/* Form Card */}
      <div style={{ backgroundColor: '#ffffff', padding: '48px', borderRadius: '48px', boxShadow: '0 40px 100px -20px rgba(0,0,0,0.5)', width: '100%', maxWidth: '440px' }}>
        {error && (
          <div style={{ padding: '12px', marginBottom: '20px', backgroundColor: '#fecaca', color: '#991b1b', borderRadius: '8px', fontSize: '10px', fontWeight: 700 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* 1. Email Input */}
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

          {/* 2. Phone Input */}
          <div style={{ position: 'relative' }}>
            <Phone style={{ position: 'absolute', left: '24px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={18} />
            <input 
              type="tel" 
              placeholder="MOBILE PROTOCOL (e.g. +1...)" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              style={inputStyle} 
            />
          </div>

          {/* 3. Password Input */}
          <div style={{ position: 'relative' }}>
            <Lock style={{ position: 'absolute', left: '24px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={18} />
            <input 
              type="password" 
              placeholder="PASSWORD" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={inputStyle} 
            />
          </div>

          {/* 4. Confirm Password Input */}
          <div style={{ position: 'relative' }}>
            <Lock style={{ position: 'absolute', left: '24px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={18} />
            <input 
              type="password" 
              placeholder="CONFIRM PASSWORD" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
            {loading ? "ENROLLING..." : "INITIALIZE ENROLLMENT"} <ArrowRight size={14} />
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <span style={{ fontSize: '8px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Already registered?{" "}
            <a href="/login" style={{ color: '#05292E', textDecoration: 'underline', fontWeight: 1000 }}>
              Return to Portal
            </a>
          </span>
        </div>
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
