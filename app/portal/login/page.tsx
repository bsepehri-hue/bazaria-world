"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const REQUIRED_ROLE = "steward"; 
  const REDIRECT_PATH = "/portal/dashboard";

  const handleAuthSuccess = async (user: any) => {
    const userDoc = await getDoc(doc(db, "users", user.uid));
    const userData = userDoc.data();

    if (userData && userData.role !== REQUIRED_ROLE && REQUIRED_ROLE !== "any") {
       setError(`Access Denied: This portal is for ${REQUIRED_ROLE}s only.`);
       return;
    }

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

  async function handleGoogleLogin() {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const res = await signInWithPopup(auth, provider);
      await handleAuthSuccess(res.user);
    } catch (err: any) {
      setError(err.message);
    } finally { setLoading(false); }
  }

  // --- STYLES OBJECTS ---
  const styles = {
    container: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#002d26', fontFamily: 'sans-serif', padding: '20px' },
    card: { backgroundColor: 'white', padding: '40px', borderRadius: '16px', boxShadow: '0 20px 50px rgba(0,0,0,0.3)', width: '100%', maxWidth: '400px', borderTop: '6px solid #FFBF00', textAlign: 'center' as const },
    title: { fontSize: '32px', fontWeight: '900', color: '#004d40', margin: '0 0 8px 0', letterSpacing: '-1px' },
    badge: { display: 'inline-block', padding: '4px 12px', backgroundColor: '#f0fdfa', color: '#004d40', fontSize: '10px', fontWeight: 'bold', borderRadius: '100px', letterSpacing: '2px', marginBottom: '30px', textTransform: 'uppercase' as const },
    inputGroup: { textAlign: 'left' as const, marginBottom: '20px' },
    label: { fontSize: '10px', fontWeight: 'bold', color: '#9ca3af', textTransform: 'uppercase' as const, marginBottom: '8px', display: 'block', letterSpacing: '1px' },
    input: { width: '100%', padding: '12px 0', border: 'none', borderBottom: '2px solid #f3f4f6', outline: 'none', fontSize: '16px', color: '#1f2937', transition: 'border-color 0.2s' },
    button: { width: '100%', backgroundColor: '#004d40', color: 'white', padding: '16px', borderRadius: '12px', border: 'none', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer', boxShadow: '0 10px 20px rgba(0,77,64,0.2)', textTransform: 'uppercase' as const, letterSpacing: '1px', marginTop: '10px' },
    googleBtn: { width: '100%', backgroundColor: 'white', border: '2px solid #f3f4f6', padding: '12px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontWeight: 'bold', color: '#4b5563', cursor: 'pointer', marginTop: '20px' },
    footer: { fontSize: '10px', color: '#9ca3af', marginTop: '30px', fontWeight: 'bold', letterSpacing: '0.5px' }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>BAZARIA</h1>
        <div style={styles.badge}>Steward Portal</div>

        {error && <div style={{ color: '#dc2626', fontSize: '12px', marginBottom: '20px', fontWeight: 'bold' }}>{error}</div>}

        <form onSubmit={handleEmailLogin}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={styles.input} placeholder="name@bazaria.world" required />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Secure Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={styles.input} placeholder="••••••••" required />
          </div>

          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? "Verifying..." : "Enter Vault"}
          </button>
        </form>

        <div style={{ margin: '25px 0', position: 'relative' }}>
          <div style={{ borderTop: '1px solid #f3f4f6' }}></div>
          <span style={{ position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)', backgroundColor: 'white', padding: '0 15px', color: '#9ca3af', fontSize: '10px', fontWeight: 'bold' }}>OR</span>
        </div>

        <button onClick={handleGoogleLogin} style={styles.googleBtn}>
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/smartlock/google.svg" width="18" alt="G" />
          Google Account
        </button>

        <div style={styles.footer}>
          A COIN FOR A BUCK <br />
          <span style={{ color: '#d1d5db' }}>WELCOME TO THE LIVING ECONOMY</span>
        </div>
      </div>
    </div>
  );
}
