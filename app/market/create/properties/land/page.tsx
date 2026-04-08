"use client";

import { useState } from "react";
import { db, storage } from "@/lib/firebase/client";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useRouter } from "next/navigation";
import { Map, ShieldCheck, ArrowLeft, Camera, Maximize2, Droplets, Zap, Gavel } from "lucide-react";

export default function SanctuaryLandCreate() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  
  const [formData, setFormData] = useState({
    title: "",
    landType: "Coastal Plot", // Coastal, Acreage, Residential Lot, Commercial
    location: "",
    lotSize: "", // Acres or Sq Meters
    zoning: "Residential", // Agricultural, Tourism, Commercial, Industrial
    hasWater: false,
    hasElectric: false,
    price: "",
    saleMode: "Auction",
    durationDays: "30", // Land usually needs the full 30-day discovery
    reservePrice: "",
    startingBid: "",
    description: "",
    isSanctuaryAsset: true,
    assetClass: "Land/Development"
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const uploadedUrls = [];
      for (const file of imageFiles) {
        const fileRef = ref(storage, `sanctuary/land/${Date.now()}-${file.name}`);
        const uploadTask = await uploadBytes(fileRef, file);
        const url = await getDownloadURL(uploadTask.ref);
        uploadedUrls.push(url);
      }

      await addDoc(collection(db, "listings"), {
        ...formData,
        imageUrls: uploadedUrls,
        imageUrl: uploadedUrls[0] || "",
        price: formData.saleMode === "Auction" ? Number(formData.startingBid) : Number(formData.price),
        currentBid: Number(formData.startingBid),
        status: "pending_audit",
        auctionEnd: new Date(Date.now() + Number(formData.durationDays) * 24 * 60 * 60 * 1000),
        createdAt: serverTimestamp(),
      });
      
      router.push("/market"); 
    } catch (error) {
      console.error("Land Deployment Error:", error);
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

        <div className="bg-white rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden text-black">
          {/* Earth Header */}
          <div className="bg-[#1a2f2a] p-12 text-white border-b-8 border-amber-600">
            <h1 className="text-4xl font-black uppercase tracking-tighter italic">Land Intake</h1>
            <p className="text-amber-500 text-xs font-bold uppercase tracking-[0.4em] mt-2 text-left">Sovereign Soil & Development Deployment</p>
          </div>

          <form onSubmit={handleSubmit} className="p-10 space-y-10">
            
            {/* Gallery (Survey & Maps) */}
            <div className="space-y-4 text-left">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Topography & Survey Images (Max 8)</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <label className="aspect-square bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-amber-600 transition-all text-slate-400">
                  <Camera size={24} />
                  <input type="file" multiple accept="image/*" className="hidden" 
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      setImageFiles((prev) => [...prev, ...files].slice(0, 8));
                    }} 
                  />
                </label>
                {imageFiles.map((file, idx) => (
                  <div key={idx} className="aspect-square rounded-2xl overflow-hidden border border-slate-100 relative group">
                    <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" />
                    <button type="button" onClick={() => setImageFiles(imageFiles.filter((_, i) => i !== idx))} className="absolute inset-0 bg-rose-500/90 text-white opacity-0 group-hover:opacity-100 transition-opacity font-black text-xs uppercase">Delete</button>
                  </div>
                ))}
              </div>
            </div>

            {/* Core Land Specs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2 text-left">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 italic">Lot Designation</label>
                <input placeholder="e.g. Hilltop Acreage - Phase 2" className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold" onChange={(e) => setFormData({...formData, title: e.target.value})} required />
              </div>
              <div className="space-y-2 text-left">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 italic">Land Classification</label>
                <select className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold" onChange={(e) => setFormData({...formData, landType: e.target.value})}>
                  <option>Coastal Plot</option>
                  <option>Agricultural Acreage</option>
                  <option>Residential Lot</option>
                  <option>Commercial Development Site</option>
                </select>
              </div>
            </div>

            {/* Technical Detail Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-amber-50/50 p-8 rounded-[2rem] border border-amber-100">
              <div className="space-y-1 text-left">
                <div className="flex items-center gap-2 mb-2 text-amber-700">
                   <Maximize2 size={16} />
                   <label className="text-[10px] font-black uppercase tracking-widest">Total Size</label>
                </div>
                <input placeholder="e.g. 2.5 Acres" className="w-full p-4 bg-white border-2 border-amber-100 rounded-xl font-bold" onChange={(e) => setFormData({...formData, lotSize: e.target.value})} />
              </div>
              <div className="space-y-1 text-left">
                <div className="flex items-center gap-2 mb-2 text-amber-700">
                   <Gavel size={16} />
                   <label className="text-[10px] font-black uppercase tracking-widest">Zoning</label>
                </div>
                <select className="w-full p-4 bg-white border-2 border-amber-100 rounded-xl font-bold" onChange={(e) => setFormData({...formData, zoning: e.target.value})}>
                  <option>Residential</option>
                  <option>Commercial</option>
                  <option>Industrial</option>
                  <option>Tourism/Resort</option>
                </select>
              </div>
              <div className="space-y-1 text-left">
                <label className="text-[10px] font-black uppercase tracking-widest text-amber-700 ml-1 mb-2 block">Infrastructure</label>
                <div className="flex gap-2">
                  <button type="button" onClick={() => setFormData({...formData, hasWater: !formData.hasWater})} className={`flex-1 p-3 rounded-xl border-2 font-black text-[10px] uppercase transition-all ${formData.hasWater ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-200 text-slate-400'}`}>Water</button>
                  <button type="button" onClick={() => setFormData({...formData, hasElectric: !formData.hasElectric})} className={`flex-1 p-3 rounded-xl border-2 font-black text-[10px] uppercase transition-all ${formData.hasElectric ? 'bg-yellow-500 border-yellow-500 text-white' : 'bg-white border-slate-200 text-slate-400'}`}>Electric</button>
                </div>
              </div>
            </div>

            {/* Price Discovery Strategy */}
            <div className="bg-[#1a2f2a] p-10 rounded-[2.5rem] text-white">
              <div className="flex justify-between items-center border-b border-white/10 pb-6 mb-8 text-left">
                <div>
                  <h3 className="text-sm font-black uppercase tracking-widest italic">Capital Deployment</h3>
                  <p className="text-[10px] text-amber-500 font-bold uppercase">Land discovery requires high visibility windows.</p>
                </div>
                <select className="bg-white/10 p-3 rounded-xl font-bold text-xs uppercase outline-none" onChange={(e) => setFormData({...formData, durationDays: e.target.value})}>
                  <option value="30" className="text-black">30 Day Market Window</option>
                  <option value="60" className="text-black">60 Day Strategic Cycle</option>
                </select>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-2 text-left">
                  <label className="text-[10px] font-black uppercase tracking-widest text-amber-500">Opening Offer (USD)</label>
                  <input type="number" className="w-full bg-transparent border-b-4 border-amber-600 outline-none font-black text-4xl" placeholder="0.00" onChange={(e) => setFormData({...formData, startingBid: e.target.value})} />
                </div>
                <div className="space-y-2 text-left">
                  <label className="text-[10px] font-black uppercase tracking-widest text-rose-500 italic">Reserve Requirement</label>
                  <input type="number" className="w-full bg-transparent border-b-4 border-rose-600 outline-none font-black text-4xl" placeholder="0.00" onChange={(e) => setFormData({...formData, reservePrice: e.target.value})} />
                </div>
              </div>
            </div>

            {/* Audit Protocol */}
            <div className="bg-slate-900 p-8 rounded-[2rem] flex items-center gap-6 text-white border-l-8 border-amber-600">
               <ShieldCheck size={40} className="text-amber-500 shrink-0" />
               <div className="text-left space-y-2">
                 <h4 className="text-[11px] font-black uppercase tracking-widest text-amber-500 italic underline">Territorial Audit Required</h4>
                 <p className="text-[9px] font-bold uppercase leading-relaxed text-slate-400">
                   All land registrations are subject to the Bazaria Territorial Audit. Title deeds, survey points, and ownership history must be uploaded for Authority review. 
                 </p>
                 <label className="flex items-center gap-3 mt-3 cursor-pointer">
                    <input type="checkbox" required className="w-5 h-5 rounded bg-slate-800 border-slate-700" />
                    <span className="text-[10px] font-black uppercase tracking-widest italic">I Accept the Sovereign Land Covenant</span>
                 </label>
               </div>
            </div>

            <button disabled={loading} className="w-full bg-amber-600 text-white p-8 rounded-[2rem] font-black uppercase tracking-[0.4em] shadow-2xl hover:bg-amber-700 transition-all disabled:bg-slate-300">
              {loading ? "Verifying Topography..." : "Deploy Land Asset"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
