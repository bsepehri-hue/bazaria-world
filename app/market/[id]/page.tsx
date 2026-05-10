"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase/client";
import { doc, getDoc } from "firebase/firestore";
import { useParams, useRouter } from "next/navigation";
import { 
  ChevronLeft, MapPin, Gavel, ShoppingBag, 
  ShieldCheck, Share2, Printer, Clock 
} from "lucide-react";

export default function AssetDetailView() {
  const { id } = useParams();
  const router = useRouter();
  const [asset, setAsset] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAsset() {
      if (!id) return;
      const docRef = doc(db, "listings", id as string);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setAsset(docSnap.data());
      }
      setLoading(false);
    }
    fetchAsset();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-[#f8f8f5] flex items-center justify-center">
      <p className="text-[10px] font-black uppercase tracking-[0.5em] animate-pulse">Synchronizing Ledger...</p>
    </div>
  );

  if (!asset) return <div className="p-20 text-center">Asset Not Found</div>;

  const isAuction = asset.saleMode?.includes("Auction");

  return (
    <div className="min-h-screen bg-[#f8f8f5] pb-20 font-sans">
      {/* 🧭 NAVIGATION SECTION */}
      <div className="max-w-[1400px] mx-auto p-8 flex justify-between items-center">
        <button 
          onClick={() => router.back()} 
          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors"
        >
          <ChevronLeft size={16} /> Back to Exchange
        </button>
        <div className="flex gap-4 text-slate-300">
          <Share2 size={18} className="hover:text-slate-600 cursor-pointer" />
          <Printer size={18} className="hover:text-slate-600 cursor-pointer" />
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-8 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* 🖼️ LEFT: VISUALS & DESCRIPTION */}
        <div className="lg:col-span-8">
          <div className="bg-white rounded-[40px] overflow-hidden shadow-sm border border-slate-100 mb-10">
            <img 
              src={asset.imageUrl || asset.image || "https://via.placeholder.com/800x500"} 
              className="w-full aspect-[16/9] object-cover" 
              alt={asset.title} 
            />
          </div>

          <div className="bg-white rounded-[40px] p-12 border border-slate-100 shadow-sm">
            <div className="flex justify-between items-start mb-6">
               <div>
                 <h1 className="text-5xl font-black uppercase italic tracking-tighter text-slate-900 leading-none mb-4">
                   {asset.make ? `${asset.make} ${asset.model}` : asset.title}
                 </h1>
                 <div className="flex items-center gap-4 text-slate-400 font-black uppercase text-[10px] tracking-[0.2em]">
                    <span className="flex items-center gap-1"><MapPin size={14} /> {asset.location}</span>
                    <span className="text-teal-600">Protocol ID: {String(id).slice(0,8)}</span>
                 </div>
               </div>
               {/* Pillar Icon placeholder based on category */}
            </div>

            <div className="h-[1px] bg-slate-100 w-full my-10" />

            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6">Provenance & Details</h3>
            <p className="text-slate-600 text-xl leading-relaxed font-medium mb-12">
              {asset.description || "Secure asset verified by the Bazaria network. Full vetting report available upon request."}
            </p>

            {/* 📊 DYNAMIC SPECIFICATION GRID */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 p-8 bg-slate-50 rounded-[24px]">
               {asset.year && (
                 <div>
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Year</p>
                   <p className="text-sm font-black text-slate-900 uppercase">{asset.year}</p>
                 </div>
               )}
               {asset.mileage && (
                 <div>
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Mileage</p>
                   <p className="text-sm font-black text-slate-900 uppercase">{asset.mileage} mi</p>
                 </div>
               )}
               {asset.condition && (
                 <div>
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
                   <p className="text-sm font-black text-slate-900 uppercase">{asset.condition}</p>
                 </div>
               )}
               <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Asset Class</p>
                  <p className="text-sm font-black text-slate-900 uppercase">{asset.category || "General"}</p>
               </div>
            </div>
          </div>
        </div>

        {/* 💰 RIGHT: THE FINANCIAL TERMINAL */}
        <div className="lg:col-span-4">
          <div className="sticky top-10 bg-slate-900 rounded-[40px] p-10 text-white shadow-2xl overflow-hidden">
            {/* Subtle Gradient Accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 blur-[60px] rounded-full" />
            
            <div className="flex justify-between items-center mb-10 relative z-10">
              <div className="bg-white/10 px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
                {isAuction ? <Gavel size={14} className="text-teal-400" /> : <ShoppingBag size={14} className="text-teal-400" />}
                {isAuction ? "Active Auction" : "Direct Buy"}
              </div>
              <div className="text-[9px] font-black uppercase tracking-widest text-slate-500">
                <Clock size={14} className="inline mr-1" /> 2d 14h Left
              </div>
            </div>

            <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-2 relative z-10">
              {isAuction ? "Current Highest Bid" : "Retail Value"}
            </p>
            <h2 className="text-6xl font-black italic tracking-tighter mb-10 relative z-10">
              ${Number(asset.currentBid || asset.price).toLocaleString()}
            </h2>

            {isAuction && (
              <div className="flex justify-between border-t border-white/10 pt-10 mb-10 relative z-10">
                <div>
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Bids</p>
                  <p className="text-xl font-black italic">{asset.bidCount || 0}</p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Reserve</p>
                  <p className="text-xl font-black italic text-teal-400">MET</p>
                </div>
              </div>
            )}

            <button className="w-full py-6 bg-white text-slate-900 hover:bg-teal-400 rounded-2xl font-black uppercase tracking-widest text-[11px] transition-all active:scale-95 shadow-xl relative z-10">
              {isAuction ? "Place Sovereign Bid" : "Initiate Acquisition"}
            </button>
            
            <div className="mt-10 flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/10 relative z-10">
              <ShieldCheck size={20} className="text-teal-500" />
              <p className="text-[9px] font-bold text-slate-400 uppercase leading-tight">
                Secure transaction via <br/><span className="text-white">Bazaria Escrow Protocol</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
