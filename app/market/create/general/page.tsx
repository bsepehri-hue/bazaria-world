"use client";

import { useState } from "react";
import { db, storage } from "@/lib/firebase/client";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useRouter } from "next/navigation";
import { Package, Camera, ShieldCheck, ArrowLeft, Tag, Info } from "lucide-react";

export default function GeneralMarketplaceCreate() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  
  const [formData, setFormData] = useState({
    title: "",
    category: "ART", // ART, ANIMALS, ELECTRONICS, COLLECTIBLES
    condition: "Mint",
    price: "",
    saleMode: "Auction",
    durationDays: "3", // Back to high-velocity 3-day cycle
    reservePrice: "",
    startingBid: "",
    description: "",
    autoRelist: true,
    isGeneralAsset: true
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const uploadedUrls = [];
      for (const file of imageFiles) {
        const fileRef = ref(storage, `general/${Date.now()}-${file.name}`);
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
        status: "active",
        auctionEnd: new Date(Date.now() + Number(formData.durationDays) * 24 * 60 * 60 * 1000),
        createdAt: serverTimestamp(),
      });
      
      router.push("/market"); 
    } catch (error) {
      console.error("General Marketplace Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12 text-left">
      <div className="max-w-3xl mx-auto">
        
        <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-400 hover:text-teal-600 transition-colors mb-6 font-black uppercase text-[10px] tracking-widest">
          <ArrowLeft size={16} /> Main Gateway
        </button>

        <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden text-black">
          {/* Marketplace Header */}
          <div className="bg-slate-900 p-10 text-white flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-black uppercase tracking-tighter italic">General Intake</h1>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.3em] mt-1">Art, Animals, & Sovereign Goods</p>
            </div>
            <Package size={40} className="opacity-20" />
          </div>

          <form onSubmit={handleSubmit} className="p-10 space-y-8">
            
            {/* Gallery Intake */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Evidence Gallery (Max 6)</label>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                <label className="aspect-square bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center cursor-pointer hover:border-teal-500 transition-all text-slate-400">
                  <Camera size={20} />
                  <input type="file" multiple accept="image/*" className="hidden" 
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      setImageFiles((prev) => [...prev, ...files].slice(0, 6));
                    }} 
                  />
                </label>
                {imageFiles.map((file, idx) => (
                  <div key={idx} className="aspect-square rounded-xl overflow-hidden border border-slate-200 shadow-sm relative group">
                    <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" />
                    <button type="button" onClick={() => setImageFiles(imageFiles.filter((_, i) => i !== idx))} className="absolute inset-0 bg-rose-500/80 text-white opacity-0 group-hover:opacity-100 transition-opacity font-black text-[10px] uppercase">Del</button>
                  </div>
                ))}
              </div>
            </div>

            {/* Core Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Asset Title</label>
                <input placeholder="Item Name / Pedigree / Series" className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold outline-none focus:border-slate-900" onChange={(e) => setFormData({...formData, title: e.target.value})} required />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Sector</label>
                <select className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold" onChange={(e) => setFormData({...formData, category: e.target.value})}>
                  <option value="ART">Fine Art & Sculpture</option>
                  <option value="ANIMALS">Livestock & Pedigreed Animals</option>
                  <option value="COLLECTIBLES">Rare Collectibles</option>
                  <option value="ELECTRONICS">Industrial Electronics</option>
                </select>
              </div>
            </div>

            {/* Auction Setup (High Velocity) */}
            <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-200 space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <Tag size={16} className="text-slate-900" />
                <h3 className="text-[10px] font-black uppercase tracking-widest">3-Day Velocity Auction</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1 text-left">
                  <label className="text-[9px] font-black uppercase text-slate-400 ml-1 italic">Opening Bid (USD)</label>
                  <input type="number" placeholder="0.00" className="w-full p-4 bg-white border-2 border-slate-100 rounded-xl font-black text-xl text-slate-900" onChange={(e) => setFormData({...formData, startingBid: e.target.value})} />
                </div>
                <div className="space-y-1 text-left">
                  <label className="text-[9px] font-black uppercase text-rose-500 ml-1 italic">Secret Reserve</label>
                  <input type="number" placeholder="0.00" className="w-full p-4 bg-white border-2 border-rose-100 rounded-xl font-black text-xl text-rose-900" onChange={(e) => setFormData({...formData, reservePrice: e.target.value})} />
                </div>
              </div>
            </div>

            {/* Description / Narrative */}
            <div className="space-y-2 text-left">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Asset Narrative & Condition</label>
              <textarea 
                rows={4}
                placeholder="List condition, provenance, health certificates, or technical specs..."
                className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-slate-900 font-medium text-slate-700"
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>

            {/* Sovereign Protocol Acknowledgement */}
            <div className="flex items-start gap-4 p-6 bg-slate-900 rounded-2xl text-white">
              <ShieldCheck size={24} className="text-teal-400 shrink-0" />
              <div className="text-left">
                <p className="text-[9px] font-bold uppercase tracking-widest leading-relaxed">
                  The Bazaria Authority Protocol applies. Mid-cycle withdrawal is prohibited. Your reputation is your currency.
                </p>
                <label className="flex items-center gap-2 mt-3 cursor-pointer">
                  <input type="checkbox" required className="w-4 h-4 rounded border-slate-700 bg-slate-800" />
                  <span className="text-[9px] font-black uppercase tracking-tighter">I commit to the 3-day window</span>
                </label>
              </div>
            </div>

            <button disabled={loading} className="w-full bg-slate-900 text-white p-6 rounded-2xl font-black uppercase tracking-[0.3em] shadow-xl hover:bg-black transition-all disabled:bg-slate-300">
              {loading ? "Registering Asset..." : "Deploy to General Market"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
