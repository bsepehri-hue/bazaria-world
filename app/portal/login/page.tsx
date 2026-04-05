"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 1. GATING LOGIC: Where should this specific login page lead?
  const REQUIRED_ROLE = "steward"; // Change this for different login pages (e.g., "merchant", "reward")
  const REDIRECT_PATH = "/portal/dashboard";

  const handleAuthSuccess = async (user: any) => {
    const userDoc = await getDoc(doc(db, "users", user.uid));
    const userData = userDoc.data();

    // If you want to STOPS them from entering if they have the wrong role:
    if (userData && userData.role !== REQUIRED_ROLE && REQUIRED_ROLE !== "any") {
       setError(`Access Denied: This portal is for ${REQUIRED_ROLE}s only.`);
       return;
    }

    // Sync basic info
    await setDoc(doc(db, "users", user.uid), {
      email: user.email,
      lastLogin: serverTimestamp(),
      role: userData?.role || REQUIRED_ROLE 
    }, { merge: true });

    router.push(REDIRECT_PATH);
  };

  async function handleEmailLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      await handleAuthSuccess(res.user);
    } catch (err: any) {
      setError("Invalid credentials.");
    } finally { setLoading(false); }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#002d26] font-sans">
      <div className="bg-white p-10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] w-full max-w-md border-t-[6px] border-[#FFBF00]">
        
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-[#004d40] tracking-tighter mb-2">BAZARIA</h1>
          <div className="inline-block px-3 py-1 bg-teal-50 text-[#004d40] text-[10px] font-bold uppercase tracking-[2px] rounded-full">
            Steward Portal
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-xs font-bold uppercase">
            {error}
          </div>
        )}

        <form onSubmit={handleEmailLogin} className="space-y-6">
          <div className="group">
            <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest group-focus-within:text-[#004d40] transition-colors">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border-b-2 border-gray-100 py-3 focus:border-[#004d40] outline-none transition-all text-gray-800 font-medium placeholder-gray-300"
              placeholder="name@bazaria.world"
              required
            />
          </div>

          <div className="group">
            <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest group-focus-within:text-[#004d40] transition-colors">
              Secure Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-b-2 border-gray-100 py-3 focus:border-[#004d40] outline-none transition-all text-gray-800 font-medium"
              placeholder="••••••••"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#004d40] text-white py-4 rounded-xl font-black text-sm shadow-xl hover:bg-[#00332c] hover:-translate-y-1 active:scale-[0.98] transition-all disabled:opacity-50 mt-4 uppercase tracking-widest"
          >
            {loading ? "Verifying..." : "Enter Vault"}
          </button>
        </form>

        <div className="mt-10 text-center">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-relaxed">
            A Coin for a Buck <br />
            <span className="text-gray-300">"Welcome to the Living Economy"</span>
          </p>
        </div>
      </div>

      <style jsx global>{`
        body { margin: 0; padding: 0; }
      `}</style>
    </div>
  );
}
