"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  User
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase/client"; // Ensure db is exported from your client.ts

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        router.push("/portal/dashboard");
      }
    });
    return () => unsubscribe();
  }, [router]);

  // Sync login data to the "Stewards" collection
  const syncStewardData = async (user: User) => {
    try {
      await setDoc(doc(db, "stewards", user.uid), {
        email: user.email,
        lastLogin: serverTimestamp(),
        displayName: user.displayName || "Steward",
        photoURL: user.photoURL || ""
      }, { merge: true });
    } catch (err) {
      console.error("Steward Sync Error:", err);
    }
  };

  async function handleEmailLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      await syncStewardData(res.user);
      router.push("/portal/dashboard");
    } catch (err: any) {
      setError("Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const res = await signInWithPopup(auth, provider);
      await syncStewardData(res.user);
      router.push("/portal/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#002d26] px-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md border-t-4 border-[#FFBF00]">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-[#004d40] tracking-tight">BAZARIA</h1>
          <p className="text-gray-500 text-sm mt-2 font-medium uppercase tracking-widest">Steward Portal</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleEmailLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border-2 border-gray-100 rounded-lg px-4 py-3 focus:border-[#004d40] outline-none transition-all"
              placeholder="name@company.com"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-2 border-gray-100 rounded-lg px-4 py-3 focus:border-[#004d40] outline-none transition-all"
              placeholder="••••••••"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#004d40] text-white py-4 rounded-lg font-bold shadow-lg hover:bg-[#00332c] active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {loading ? "Authenticating..." : "ENTER PORTAL"}
          </button>
        </form>

        <div className="mt-8 relative">
          <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-200"></span></div>
          <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-4 text-gray-400 font-bold">Or continue with</span></div>
        </div>

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="mt-6 w-full flex items-center justify-center gap-3 border-2 border-gray-100 py-3 rounded-lg font-bold hover:bg-gray-50 transition-all active:scale-[0.98]"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/smartlock/google.svg" alt="Google" className="w-5 h-5" />
          Google Account
        </button>

        <p className="mt-8 text-center text-xs text-gray-400">
          A Coin for a Buck • Welcome to the Living Economy
        </p>
      </div>
    </div>
  );
}
