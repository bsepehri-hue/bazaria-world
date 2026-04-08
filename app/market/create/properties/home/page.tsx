"use client";

import { useState } from "react";
import { db, storage } from "@/lib/firebase/client";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useRouter } from "next/navigation";
import { Home, ShieldCheck, ArrowLeft, Camera, Bed, Bath, Maximize } from "lucide-react";

export default function SanctuaryHomeCreate() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  
  const [formData, setFormData] = useState({
    title: "",
    type: "Villa", // Villa, Penthouse, Estate, Condo
    location: "",
    sqft: "",
    beds: "",
    baths: "",
    price: "",
    saleMode: "Auction",
    durationDays: "14",
    reservePrice: "",
    startingBid: "",
    description: "",
    autoRelist: true,
    isSanctuaryAsset: true,
    assetClass: "Home/Villa"
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const uploadedUrls = [];
      for (const file of imageFiles) {
        const fileRef = ref(storage, `sanctuary/homes/${Date.now()}-${file.name}`);
        const uploadTask = await uploadBytes(fileRef, file);
        const url = await getDownloadURL(uploadTask.ref);
        uploadedUrls.push(url);
      }

      await addDoc(collection(db, "listings"), {
        ...formData,
        imageUrls: uploadedUrls,
        imageUrl: uploadedUrls[0] || "",
        price: formData.saleMode === "Auction" ? Number(formData.startingBid) : Number(formData.price),
        currentBid: formData.saleMode === "Auction" ? Number(formData.startingBid) : Number(formData.price),
        status: "pending_audit", // Mandatory Authority Vetting
        auctionEnd: new Date(Date.now() + Number(formData.durationDays) * 24 * 60 * 60 * 1000),
        createdAt: serverTimestamp(),
      });
      
      router.push("/market"); 
    } catch (error) {
      console.error("Sanctuary Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12 text-left">
      <div className="max-w-4xl mx-auto">
        
        <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-400 hover:text-teal-600 transition-colors mb-6 font-black uppercase text-[10px] tracking-widest">
          <ArrowLeft size={16} /> Sanctuary Gateway
        </button>

        <div className="bg-white rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden">
          {/* Elite Header */}
          <div className="bg-[#034241] p-12 text-white border-b-8 border-teal-500">
            <h1 className="text-4xl font-black uppercase tracking-tighter italic">Villa Intake</h1>
            <p className="text-teal-300 text-xs font-bold uppercase tracking-[0.4em] mt-2">Elite Residential Asset Deployment</p>
          </div>

          <form onSubmit={handleSubmit} className="p-10 space-y-10">
            
            {/* Gallery Section */}
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Home Gallery (Up to 10 High-Res Images)</label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                <label className="aspect-square bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-teal-500 transition-all text-slate-400">
                  <Camera size={24} />
                  <input type="file" multiple accept="image/*" className="hidden" 
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      setImageFiles((prev) => [...prev, ...files].slice(0, 10));
                    }} 
                  />
                </label>
                {imageFiles.map((file, idx) => (
                  <div key={idx} className="aspect-square rounded-2xl overflow-hidden relative group">
                    <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" />
                    <button type="button" onClick={() => setImageFiles(imageFiles.filter((_, i) => i !== idx))} className="absolute inset-0 bg-rose-500/80 text-white opacity-0 group-hover:opacity-100 transition-opacity font-black text-xs uppercase">Remove</button>
                  </div>
                ))}
              </div>
            </div>

            {/* Core Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Official Listing Title</label>
                <input placeholder="e.g. Casa del Sol - Oceanfront Estate" className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold" onChange={(e) => setFormData({...formData, title: e.target.value})} required />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 text-black">Property Sub-Type</label>
                <select className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-black" onChange={(e) => setFormData({...formData, type: e.target.value})}>
                  <option>Villa</option>
                  <option>Penthouse</option>
                  <option>Oceanfront Estate</option>
                  <option>Luxury Condo</option>
                </select>
              </div>
            </div>

            {/* Specs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-[#034241]/5 p-8 rounded-[2rem] border border-[#034241]/10">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white rounded-xl shadow-sm text-teal-700"><Maximize size={20} /></div>
                <div className="flex-1">
                  <label className="text-[9px] font-black uppercase text-slate-400">Total Sq Ft</label>
                  <input type="number" className="w-full bg-transparent border-b-2 border-slate-200 outline-none font-bold text-lg text-black" onChange={(e) => setFormData({...formData, sqft: e.target.value})} />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white rounded-xl shadow-sm text-teal-700"><Bed size={20} /></div>
                <div className="flex-1">
                  <label className="text-[9px] font-black uppercase text-slate-400">Bedrooms</label>
                  <input type="number" className="w-full bg-transparent border-b-2 border-slate-200 outline-none font-bold text-lg text-black" onChange={(e) => setFormData({...formData, beds: e.target.value})} />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white rounded-xl shadow-sm text-teal-700"><Bath size={20} /></div>
                <div className="flex-1">
                  <label className="text-[9px] font-black uppercase text-slate-400">Bathrooms</label>
                  <input type="number" className="w-full bg-transparent border-b-2 border-slate-200 outline-none font-bold text-lg text-black" onChange={(e) => setFormData({...formData, baths: e.target.value})} />
                </div>
              </div>
            </div>

            {/* Auction Architecture */}
            <div className="space-y-6 bg-slate-900 p-10 rounded-[2.5rem] text-white">
              <div className="flex justify-between items-center border-b border-white/10 pb-6">
                <h3 className="text-sm font-black uppercase tracking-[0.2em]">Deployment Strategy</h3>
                <select className="bg-white/10 p-3 rounded-xl font-bold text-xs uppercase" onChange={(e) => setFormData({...formData, durationDays: e.target.value})}>
                  <option value="14" className="text-black">14 Days (Standard)</option>
                  <option value="30" className="text-black">30 Days (Market Discovery)</option>
                </select>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-teal-400 italic">Starting Bid (USD)</label>
                  <input type="number" className="w-full bg-transparent border-b-2 border-teal-500 outline-none font-black text-3xl" placeholder="$0.00" onChange={(e) => setFormData({...formData, startingBid: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-rose-400 italic">Reserve Price (Confidential)</label>
                  <input type="number" className="w-full bg-transparent border-b-2 border-rose-500 outline-none font-black text-3xl" placeholder="$0.00" onChange={(e) => setFormData({...formData, reservePrice: e.target.value})} />
                </div>
              </div>
            </div>

            {/* Sanctuary Protocol */}
            <div className="bg-rose-50 border-2 border-rose-100 p-8 rounded-[2rem] flex items-start gap-6">
              <ShieldCheck size={32} className="text-rose-600 shrink-0 mt-1" />
              <div className="space-y-2 text-left">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-rose-900">Sanctuary Audit Required</h4>
                <p className="text-[10px] font-bold text-rose-800 leading-relaxed uppercase">
                  All property deployments must clear the Bazaria Title Audit. By listing, you agree that your account will be seized and legal action taken if title documentation is falsified.
                </p>
                <label className="flex items-center gap-3 mt-4 cursor-pointer">
                  <input type="checkbox" required className="w-5 h-5 rounded border-rose-300" />
                  <span className="text-[9px] font-black uppercase text-rose-900">I accept the Sovereign Protocol</span>
                </label>
              </div>
            </div>

            <button disabled={loading} className="w-full bg-[#034241] text-white p-8 rounded-[2rem] font-black uppercase tracking-[0.4em] shadow-2xl hover:bg-teal-900 transition-all disabled:bg-slate-300">
              {loading ? "Vetting Property..." : "Deploy to Sanctuary Portfolio"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
