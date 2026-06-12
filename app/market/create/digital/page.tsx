"use client";

import { useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { doc, updateDoc, addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { ArrowLeft, Cpu, Link as LinkIcon, DollarSign, Percent } from "lucide-react";

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
    mediaUrl: "",
    royaltyBps: "",
    reservePrice: "",
    description: "",
    stewardID: "" 
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return alert("Auth required.");

    setLoading(true);
    try {
      // Logic to interact with your Verified Contract
      // NOTE FOR LATER: USDC uses 6 decimals.
      // const parsedPrice = ethers.parseUnits(formData.reservePrice, 6);
      
      const listingData = {
        ...formData,
        userId: user.uid,
        stewardID: user.uid,
        currency: "USDC",
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
        
        <button onClick={() => router.push('/market/create')} className="flex items-center gap-2 text-slate-400 uppercase text-[10px] font-black tracking-widest mb-8 hover:text-slate-900 transition-colors">
          <ArrowLeft size={16} /> Market Portal
        </button>

        <div className="mb-12 border-l-4 border-indigo-900 pl-6">
          <div className="flex items-center gap-2 text-indigo-900 mb-2">
            <Cpu size={14} />
            <span className="text-[9px] font-black uppercase tracking-[0.4em]">Sovereign Digital Registry</span>
          </div>
          <h1 className="text-5xl font-black text-slate-900 uppercase tracking-tighter">Digital <span className="text-slate-400">Assets</span></h1>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-2xl p-12 border border-slate-100">
          <form onSubmit={handleSubmit} className="space-y-10">
            
            {/* Core Identification */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Asset Identity</label>
                <input value={formData.title} placeholder="e.g. Genesis Governance Token" className="p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold w-full outline-none focus:border-indigo-900" onChange={(e) => setFormData({...formData, title: e.target.value})} required />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Token ID</label>
                <input value={formData.assetId} placeholder="On-Chain Token ID (e.g. 1)" className="p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold w-full outline-none focus:border-indigo-900" onChange={(e) => setFormData({...formData, assetId: e.target.value})} required />
              </div>
            </div>

            {/* Media & Royalties */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-slate-400">
                  <LinkIcon size={14} />
                  <label className="text-[10px] font-black uppercase tracking-widest">Metadata / IPFS URL</label>
                </div>
                <input value={formData.mediaUrl} placeholder="ipfs://..." className="p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold w-full outline-none focus:border-indigo-900" onChange={(e) => setFormData({...formData, mediaUrl: e.target.value})} />
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-slate-400">
                  <Percent size={14} />
                  <label className="text-[10px] font-black uppercase tracking-widest">Creator Royalty</label>
                </div>
                <input value={formData.royaltyBps} type="number" placeholder="e.g. 5%" className="p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold w-full outline-none focus:border-indigo-900" onChange={(e) => setFormData({...formData, royaltyBps: e.target.value})} />
              </div>
            </div>

            {/* Financials (USDC Focus) */}
            <div className="p-10 bg-indigo-50 rounded-[2rem] border-2 border-indigo-100">
              <div className="flex items-center gap-2 text-indigo-900 mb-4">
                <DollarSign size={18} />
                <label className="text-[12px] font-black uppercase tracking-[0.2em]">USDC Reserve Price</label>
              </div>
              <div className="flex items-baseline gap-4">
                <span className="text-2xl font-black text-indigo-300">USDC</span>
                <input value={formData.reservePrice} type="number" placeholder="0.00" className="w-full bg-transparent border-b-2 border-indigo-200 outline-none text-5xl font-black text-indigo-900 pb-2" onChange={(e) => setFormData({...formData, reservePrice: e.target.value})} required />
              </div>
              <p className="text-indigo-600 text-[10px] font-bold uppercase tracking-widest mt-4">Transactions settle exclusively in USD Coin (Polygon Amoy Network)</p>
            </div>

            {/* Narrative */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Digital Narrative</label>
              <textarea value={formData.description} placeholder="Describe the utility, rights, or visual details of this asset..." className="w-full p-6 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-sm min-h-[120px] outline-none focus:border-indigo-900" onChange={(e) => setFormData({...formData, description: e.target.value})} />
            </div>

            <button type="submit" disabled={loading} className="w-full bg-indigo-900 text-white p-6 rounded-2xl font-black uppercase tracking-[0.2em] text-sm hover:bg-indigo-800 transition-colors shadow-lg">
              {loading ? "Deploying Protocol..." : "Register Sovereign Asset"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
