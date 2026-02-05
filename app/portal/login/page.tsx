"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, signOut, User } from "firebase/auth";
import { app } from "@/lib/firebase/client";


export default function LoginPage() {
  const router = useRouter();
  const auth = getAuth(app);
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        router.push("/portal/dashboard");
      }
    });
    return () => unsubscribe();
  }, [auth, router]);

  async function handleEmailLogin(e: React.FormEvent) {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/portal/dashboard");
    } catch (err: any) {
      setError(err.message);
    }
  }

  async function handleGoogleLogin() {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      router.push("/portal/dashboard");
    } catch (err: any) {
      setError(err.message);
    }
  }

  // ✅ return is inside the component
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6">ListToBid Steward Login</h1>

        {error && <div className="mb-4 text-red-600 font-medium">{error}</div>}

        <form onSubmit={handleEmailLogin} className="space-y-4">
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border rounded px-3 py-2" required />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border rounded px-3 py-2" required />
          <button type="submit" className="w-full bg-teal-600 text-white py-2 rounded hover:bg-teal-700">Sign In</button>
        </form>

        <div className="mt-6 text-center">
          <button onClick={handleGoogleLogin} className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600">
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
}
