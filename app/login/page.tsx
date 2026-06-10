"use client";

import React, { useState, Suspense } from "react";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider 
} from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, Lock, Mail, ArrowRight, Chrome } from "lucide-react";

import { app } from "@/lib/firebase/client";

function LoginContent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleAuthSuccess = async (user: any) => {
    try {
      setLoading(true);
      const db = getFirestore(app);
      
      // 🎯 HARMONIZED TARGET RESOLVER: Listen for both "redirect" and "callback" values
      const redirectTarget = searchParams.get("redirect") || searchParams.get("callback");

      // 🗺️ CONTEXT-AWARE REDIRECT RESOLVER
      if (redirectTarget) {
        let finalDestination = decodeURIComponent(redirectTarget);

        // 🚀 Intercept raw storefront redirects and append the user's authentic UID dynamically
        if (finalDestination === "/storefront" || finalDestination === "storefront") {
          finalDestination = `/storefront/${user.uid}`;
        }

        // 🔄 Use replace instead of push to avoid creating back-button history traps
        router.replace(finalDestination);
        return;
      }
      
      // 1. Fetch core user database document
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();

        // 🛡️ CRITICAL OVERRIDE 1: High-Level Admin Command Control Always Reroutes
        if (userData.role === "admin") {
          router.replace("/admin/command"); // 🔄 Overwrite history entry
          return;
        }

        // 🏆 CRITICAL OVERRIDE 2: Special Partner/Rewards Portal Tracking
        const partnerRef = doc(db, "partners", user.uid);
        const partnerSnap = await getDoc(partnerRef);

        if (partnerSnap.exists()) {
          router.replace("/rewards"); // 🔄 Overwrite history entry
          return;
        }

        // 🌐 FALLBACK DEFAULT DEFAULT: Hard replace to completely flush tab state caches
        window.location.replace("/market");
      } else {
        // 🆕 NEW USER DETECTED: Create basic entry and send straight to MARKETPLACE instead of onboarding
        await setDoc(userRef, {
          email: user.email,
          role: "user",
          status: "pending_setup",
          createdAt: new Date().toISOString(),
        });
        
        // ✨ FIXED: Send them directly to the main marketplace feed cleanly
        router.replace("/market"); 
      }
    } catch (err: any) {
      console.error("Routing Error:", err);
      setError("Failed to route user correctly.");
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    setError("");

    try {
      const auth = getAuth(app);
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: "select_account",
      });

      const result = await signInWithPopup(auth, provider);
      if (result.user) {
        await handleAuthSuccess(result.user);
      }
    } catch (err: any) {
      console.error("Google Auth Error:", err);
      setError("Sync Failed: " + (err.message || "Unknown error"));
      setLoading(false);
    }
  };

  const loginWithEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const auth = getAuth(app);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      await handleAuthSuccess(userCredential.user);
    } catch (err: any) {
      console.error("Email Login Error:", err);
      setError("Login Failed: " + (err.message || "Unknown error"));
      setLoading(false);
    }
  };
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#05292E', padding: '24px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '32px' }}>
        <div style={{ width: '64px', height: '64px', borderRadius: '16px', border: '1px solid #FFBF00', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
          <ShieldCheck color="#FFBF00" size={32} />
        </div>
        <h1 style={{ color: '#FFFFFF', fontSize: '28px', fontWeight: 1000, letterSpacing: '-0.5px', textAlign: 'center', margin: 0 }}>
          SOVEREIGN<br />PORTAL
        </h1>
        <span style={{ color: '#64748b', fontSize: '10px', letterSpacing: '3px', marginTop: '12px', textTransform: 'uppercase', fontWeight: 900 }}>
          Identity Verification Required
        </span>
      </div>

      <div style={{ backgroundColor: '#ffffff', padding: '48px', borderRadius: '48px', boxShadow: '0 40px 100px -20px rgba(0,0,0,0.5)', width: '100%', maxWidth: '440px' }}>
        {error && (
          <div style={{ padding: '12px', marginBottom: '20px', backgroundColor: '#fecaca', color: '#991b1b', borderRadius: '8px', fontSize: '10px', fontWeight: 700 }}>
            {error}
          </div>
        )}

        <form onSubmit={loginWithEmail} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ position: 'relative' }}>
            <Mail style={{ position: 'absolute', left: '24px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={18} />
            <input 
              type="email" 
              placeholder="REGISTRY EMAIL" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: '100%', padding: '16px 24px 16px 64px', borderRadius: '32px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '10px', textTransform: 'uppercase', fontWeight: 900, color: '#05292E' }} 
            />
          </div>

          <div style={{ position: 'relative' }}>
            <Lock style={{ position: 'absolute', left: '24px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={18} />
            <input 
              type="password" 
              placeholder="ACCESS KEY" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: '100%', padding: '16px 24px 16px 64px', borderRadius: '32px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '10px', textTransform: 'uppercase', fontWeight: 900, color: '#05292E' }} 
            />
          </div>

          <div style={{ textAlign: 'right', marginTop: '-4px' }}>
            <a href="/forgot" style={{ fontSize: '9px', color: '#64748b', textDecoration: 'none', fontWeight: 900 }}>
              FORGOT ACCESS KEY?
            </a>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{ width: '100%', padding: '16px', backgroundColor: '#FFBF00', color: '#05292E', border: 'none', borderRadius: '32px', fontWeight: 1000, cursor: 'pointer', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
          >
            {loading ? "INITIALIZING..." : "INITIALIZE ACCESS"} <ArrowRight size={14} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', textAlign: 'center', margin: '6px 0' }}>
            <hr style={{ flex: 1, borderTop: '1px solid #e2e8f0' }} />
            <span style={{ padding: '0 12px', fontSize: '8px', color: '#94a3b8', letterSpacing: '1px' }}>PROTOCOL SYNC</span>
            <hr style={{ flex: 1, borderTop: '1px solid #e2e8f0' }} />
          </div>

          <button 
            type="button"
            onClick={loginWithGoogle}
            disabled={loading}
            style={{ width: '100%', padding: '16px', backgroundColor: '#0e1726', color: '#ffffff', border: 'none', borderRadius: '32px', fontWeight: 1000, cursor: 'pointer', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            <Chrome size={16} /> Google ID Sync
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <span style={{ fontSize: '8px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            New to the economy?{" "}
            <Link href="/register" style={{ color: '#05292E', textDecoration: 'underline', fontWeight: 1000 }}>
              Request Registry Access
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#05292E', color: '#FFBF00', fontWeight: 900, fontSize: '12px' }}>PORTAL SECURING...</div>}>
      <LoginContent />
    </Suspense>
  );
}
