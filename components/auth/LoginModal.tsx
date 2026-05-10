"use client";
import React, { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase/client';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { X } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';

export default function LoginModal({ 
  isOpen, 
  onClose 
}: { 
  isOpen: boolean, 
  onClose: () => void 
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // 🎯 Dynamic Redirection Logic
  const handleRedirect = () => {
    if (pathname.includes('rewards')) {
      router.push('/rewards');
    } else {
      // Default fallback destination when coming from other screens
      router.push('/dashboard/payouts');
    }
    onClose();
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      handleRedirect();
    } catch (err: any) {
      setError("Invalid email or password.");
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      handleRedirect();
    } catch (err) {
      setError("Google login failed.");
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden relative">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors z-50"
        >
          <X size={20} className="text-gray-500" />
        </button>

        <div className="p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-2 uppercase tracking-tight">Access Registry</h2>
          <p className="text-sm text-slate-500 mb-8 font-medium">Verify your identity to engage with assets.</p>

          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label className="text-[10px] font-black text-slate-400 ml-1 uppercase tracking-widest">Email Address</label>
              <input 
                type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full mt-1 p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#014d4e] outline-none transition-all text-sm"
                placeholder="operator@bazaria.io"
              />
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-400 ml-1 uppercase the-tracking-widest">Password</label>
              <input 
                type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full mt-1 p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#014d4e] outline-none transition-all text-sm"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-xl">
                <p className="text-red-600 text-xs font-bold text-center uppercase tracking-tighter">{error}</p>
              </div>
            )}

            <button 
              type="submit" 
              className="w-full py-4 bg-[#014d4e] text-white text-xs font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-teal-900/20 hover:scale-[1.02] transition-all active:scale-[0.98]"
            >
              Initialize Session
            </button>
          </form>

          <div className="relative my-8 text-center">
            <hr className="border-slate-100" />
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4 text-[10px] text-slate-300 font-bold uppercase tracking-[0.3em]">Protocol</span>
          </div>

          <button 
            onClick={handleGoogleLogin} 
            className="w-full py-4 bg-white border border-slate-200 text-slate-700 text-xs font-black uppercase tracking-[0.1em] rounded-2xl flex items-center justify-center gap-3 hover:bg-slate-50 transition-all shadow-sm"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-4 h-4" alt="Google" />
            Continue with Google
          </button>
        </div>
      </div>
    </div>
  );
}
