"use client";

import React, { useState } from "react";
import { 
  getAuth, 
  createUserWithEmailAndPassword,
  sendEmailVerification,
  multiFactor,
  PhoneAuthProvider,
  PhoneMultiFactorGenerator,
  RecaptchaVerifier
} from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { ShieldCheck, Lock, Mail, Phone, ArrowRight, CheckCircle } from "lucide-react";
import { app } from "@/lib/firebase/client";

declare global {
  interface Window {
    recaptchaVerifier: any;
  }
}

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Pipeline State Management
  const [step, setStep] = useState<"CREATE" | "VERIFY_EMAIL" | "VERIFY_PHONE">("CREATE");
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationId, setVerificationId] = useState("");
  const [currentUser, setCurrentUser] = useState<any>(null);

  const router = useRouter();

  // STEP 1: Create Account & Send Email Link
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
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      setCurrentUser(user);

      // Send the mandatory verification email
      await sendEmailVerification(user);
      
      setStep("VERIFY_EMAIL"); // Move to Step 2
      setLoading(false);

    } catch (err: any) {
      console.error("Registration Error:", err);
      setError("Registry Request Failed: " + (err.message || "Unknown error"));
      setLoading(false);
    }
  };

  // STEP 2: Check if they clicked the email link, then trigger SMS
  const handleCheckEmailVerified = async () => {
    setLoading(true);
    setError("");

    try {
      // Force Firebase to fetch the newest status of the user
      await currentUser.reload(); 

      if (!currentUser.emailVerified) {
        setError("Email not verified yet. Please check your inbox and click the link.");
        setLoading(false);
        return;
      }

      // If email IS verified, prepare to send the SMS
      const auth = getAuth(app);

      if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
          size: 'invisible'
        });
      }

      const session = await multiFactor(currentUser).getSession();
      const phoneInfoOptions = { phoneNumber: phone, session: session };

      const phoneAuthProvider = new PhoneAuthProvider(auth);
      const vId = await phoneAuthProvider.verifyPhoneNumber(
        phoneInfoOptions,
        window.recaptchaVerifier
      );

      setVerificationId(vId);
      setStep("VERIFY_PHONE"); // Move to Step 3
      setLoading(false);

   } catch (err: any) {
  console.error("SMS Trigger Error:", err);
  setError("SMS Error: " + (err.code || err.message)); // <-- The updated debugger
  setLoading(false);
}
  };

  // STEP 3: Validate SMS and Save Profile
  const handleVerifyAndEnroll = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const db = getFirestore(app);
      const cred = PhoneAuthProvider.credential(verificationId, verificationCode);
      const multiFactorAssertion = PhoneMultiFactorGenerator.assertion(cred);
      
      await multiFactor(currentUser).enroll(multiFactorAssertion, "Primary Device");

      await setDoc(doc(db, "users", currentUser.uid), {
        email: currentUser.email,
        phone: phone, 
        role: "user",
        status: "verified_account",
        createdAt: new Date().toISOString(),
      });

      router.replace("/market");

    } catch (err: any) {
      console.error("MFA Enrollment Error:", err);
      setError("Invalid security code. Registration denied.");
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#05292E', padding: '24px' }}>
      
      <div id="recaptcha-container"></div>

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

      <div style={{ backgroundColor: '#ffffff', padding: '48px', borderRadius: '48px', boxShadow: '0 40px 100px -20px rgba(0,0,0,0.5)', width: '100%', maxWidth: '440px' }}>
        {error && (
          <div style={{ padding: '12px', marginBottom: '20px', backgroundColor: '#fecaca', color: '#991b1b', borderRadius: '8px', fontSize: '10px', fontWeight: 700 }}>
            {error}
          </div>
        )}

        {/* STEP 1 UI: INITIAL FORM */}
        {step === "CREATE" && (
          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ position: 'relative' }}>
              <Mail style={{ position: 'absolute', left: '24px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={18} />
              <input type="email" placeholder="REGISTRY EMAIL" value={email} onChange={(e) => setEmail(e.target.value)} required style={inputStyle} />
            </div>
            <div style={{ position: 'relative' }}>
              <Phone style={{ position: 'absolute', left: '24px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={18} />
              <input type="tel" placeholder="MOBILE PROTOCOL (e.g. +1...)" value={phone} onChange={(e) => setPhone(e.target.value)} required style={inputStyle} />
            </div>
            <div style={{ position: 'relative' }}>
              <Lock style={{ position: 'absolute', left: '24px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={18} />
              <input type="password" placeholder="PASSWORD" value={password} onChange={(e) => setPassword(e.target.value)} required style={inputStyle} />
            </div>
            <div style={{ position: 'relative' }}>
              <Lock style={{ position: 'absolute', left: '24px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={18} />
              <input type="password" placeholder="CONFIRM PASSWORD" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required style={inputStyle} />
            </div>
            <button type="submit" disabled={loading} style={buttonStyle}>
              {loading ? "PROCESSING..." : "INITIALIZE ENROLLMENT"} <ArrowRight size={14} />
            </button>
          </form>
        )}

        {/* STEP 2 UI: EMAIL VERIFICATION */}
        {step === "VERIFY_EMAIL" && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'center' }}>
            <h3 style={{ color: '#05292E', margin: 0, textTransform: 'uppercase', fontWeight: 900 }}>Verify Email</h3>
            <p style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.5' }}>
              We sent a verification link to <strong>{email}</strong>. <br/><br/>
              Please check your inbox, click the link to verify your identity, and then press continue below to setup your device security.
            </p>
            <button onClick={handleCheckEmailVerified} disabled={loading} style={buttonStyle}>
              {loading ? "CHECKING STATUS..." : "I HAVE VERIFIED MY EMAIL"} <CheckCircle size={14} />
            </button>
          </div>
        )}

        {/* STEP 3 UI: SMS VERIFICATION */}
        {step === "VERIFY_PHONE" && (
          <form onSubmit={handleVerifyAndEnroll} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
              <h3 style={{ color: '#05292E', margin: 0, textTransform: 'uppercase', fontWeight: 900 }}>Confirm Device</h3>
              <p style={{ fontSize: '10px', color: '#64748b' }}>Enter the 6-digit code transmitted to {phone}.</p>
            </div>
            <div style={{ position: 'relative' }}>
              <input 
                type="text" 
                maxLength={6}
                placeholder="000000" 
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                required
                style={{ width: '100%', padding: '16px', borderRadius: '32px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '16px', textAlign: 'center', letterSpacing: '8px', fontWeight: 900, color: '#05292E' }} 
              />
            </div>
            <button type="submit" disabled={loading} style={buttonStyle}>
              {loading ? "VERIFYING DEVICE..." : "VALIDATE CODES"}
            </button>
          </form>
        )}

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

const inputStyle = { width: '100%', padding: '16px 24px 16px 64px', borderRadius: '32px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '10px', textTransform: 'uppercase' as const, fontWeight: 900, color: '#05292E' };
const buttonStyle = { width: '100%', padding: '16px', backgroundColor: '#FFBF00', color: '#05292E', border: 'none', borderRadius: '32px', fontWeight: 1000, cursor: 'pointer', fontSize: '10px', textTransform: 'uppercase' as const, letterSpacing: '0.1em', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginTop: '8px' };
