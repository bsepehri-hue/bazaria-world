"use client";

import { useState, Suspense, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { doc, getDoc, updateDoc, addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { ShieldCheck, ArrowLeft, Database, Cpu } from "lucide-react";
import { DIGITAL_MARKET_CONFIG } from "@/lib/marketplaceConstants";

export default function DigitalMarketCreate() {
  return (
    <Suspense fallback={<div className="p-20 text-center font-black uppercase text-xs tracking-[0.4em]">Initializing Protocol...</div>}>
      <DigitalFormCore />
    </Suspense>
  );
}

function DigitalFormCore() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    assetId: "",
    reservePrice: "",
    description: "",
    stewardID: "" // 🛡️ Security field for owner tracking
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return alert("Auth required.");

    setLoading(true);
    try {
      // 1. Logic to interact with your Verified Contract (0x7c211077...)
      // const tx = await contract.listAsset(formData.assetId, ethers.parseEther(formData.reservePrice));
      
      // 2. Security Shield: Ensure listing is tied to user
      const listingData = {
        ...formData,
        userId: user.uid,
        stewardID: user.uid, // Hard-locking ownership
        createdAt: serverTimestamp(),
        category: "digital-asset",
        status: "active"
      };

      await addDoc(collection(db, "listings"), listingData);
      router.push(`/storefront/${user.uid}`);
    } catch (err) {
      console.error("Registry Breach Attempt:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '80px 40px', backgroundColor: '#f8f8f5', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ width: '100%', maxWidth: '1000px' }}>
        
        {/* Navigation */}
        <button onClick={() => router.push('/market/create')} className="flex items-center gap-2 text-slate-400 uppercase text-[10px] font-black tracking-widest mb-8">
          <ArrowLeft size={16} /> Market Portal
        </button>

        {/* Header */}
        <div className="mb-12 border-l-4 border-indigo-900 pl-6">
          <div className="flex items-center gap-2 text-indigo-900 mb-2">
            <Cpu size={14} />
            <span className="text-[9px] font-black uppercase tracking-[0.4em]">Sovereign Digital Registry</span>
          </div>
          <h1 className="text-5xl font-black text-slate-900 uppercase tracking-tighter">Digital <span className="text-slate-400">Assets</span></h1>
        </div>

        {/* Secure Form */}
        <div className="bg-white rounded-[2.5rem] shadow-2xl p-12 border border-slate-100">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <input value={formData.title} placeholder="Digital Asset Name" className="p-4 bg-slate-50 rounded-2xl font-bold w-full" onChange={(e) => setFormData({...formData, title: e.target.value})} required />
              <input value={formData.assetId} placeholder="Asset ID (Contract Token ID)" className="p-4 bg-slate-50 rounded-2xl font-bold w-full" onChange={(e) => setFormData({...formData, assetId: e.target.value})} required />
            </div>

            <div className="p-8 bg-indigo-50 rounded-[2rem] border border-indigo-100">
              <label className="text-[10px] font-black text-indigo-900 uppercase">Reserve Price (Polygon MATIC)</label>
              <input value={formData.reservePrice} type="number" className="w-full bg-transparent border-b-2 border-indigo-200 outline-none text-3xl font-black text-indigo-900 pb-2" onChange={(e) => setFormData({...formData, reservePrice: e.target.value})} required />
            </div>

            <button type="submit" disabled={loading} className="w-full bg-indigo-900 text-white p-6 rounded-2xl font-black uppercase tracking-widest text-sm">
              {loading ? "Deploying to Chain..." : "Register Digital Asset"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
