"use client";

import { useState } from "react";
import { db, storage } from "@/lib/firebase/client";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useRouter } from "next/navigation";
import { Home, Map, Key, ShieldCheck, ArrowLeft, Camera, FileText } from "lucide-react";

const SANCTUARY_CATEGORIES = {
  REAL_ESTATE: ["Villa", "Penthouse", "Estate", "Commercial"],
  LAND: ["Coastal Plot", "Acreage", "Development Site"],
  HOSPITALITY: ["Luxury Room", "Boutique Suite", "Timeshare Week"],
};

export default function SanctuaryCreatePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  
  const [formData, setFormData] = useState({
    title: "",
    category: "REAL_ESTATE",
    subCategory: "Villa",
    location: "",
    size: "", // Sq Ft or Acreage
    beds: "",
    baths: "",
    price: "",
    saleMode: "Auction",
    durationDays: "14", // Longer default for Real Estate
    reservePrice: "",
    startingBid: "",
    description: "",
    autoRelist: true,
    isSanctuaryAsset: true
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const uploadedUrls = [];
      for (const file of imageFiles) {
        const fileRef = ref(storage, `sanctuary/${Date.now()}-${file.name}`);
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
        createdAt: serverTimestamp(),
        auctionEnd: new Date(Date.now() + Number(formData.durationDays) * 24 * 60 * 60 * 1000),
        status: "pending_audit", // Sanctuary assets require manual vetting
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
        
        <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-400 hover:text-teal-600 transition-colors mb-6 font-black uppercase text-[10px] tracking-[0.2em]">
          <ArrowLeft size={16} /> Exit Portfolio
        </button>

        <div className="bg-white rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden">
          {/* Sanctuary Header */}
          <div className="bg-[#034241] p-12 text-white flex justify-between items-center relative overflow-hidden">
            <div className="relative z-10">
              <h1 className="text-4xl font-black uppercase tracking-tighter italic">Sanctuary Intake</h1>
              <p className="text-teal-400 text-xs font-bold uppercase tracking-[0.3em] mt-2">Elite Property & Land Deployment</p>
            </div>
            <Home size={80} className="absolute right-[-10px] bottom-[-10px] opacity-10 rotate-12" />
          </div>

          <form onSubmit={handleSubmit} className="p-12 space-y-10">
            
            {/* Asset Core & Gallery */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Property Title</label>
                  <input 
                    placeholder="e.g. Azure Bay Villa - Plot 04"
                    className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-teal-500 font-bold text-slate-900"
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    required 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Geographic Location</label>
                  <input 
                    placeholder="Sector, City, or Coordinates"
                    className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-teal-500 font-bold text-slate-900"
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    required 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Property Gallery (Max 10)</label>
                <div className="grid grid-cols-4 gap-2">
                  <label className="aspect-square bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-teal-500 transition-all text-slate-400">
                    <Camera size={20} />
                    <input type="file" multiple accept="image/*" className="hidden" 
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        setImageFiles((prev) => [...prev, ...files].slice(0, 10));
                      }} 
                    />
                  </label>
                  {imageFiles.map((file, idx) => (
                    <div key={idx} className="aspect-square rounded-xl overflow-hidden border border-slate-200 shadow-sm relative">
                      <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" />
                      <button type="button" onClick={() => setImageFiles(imageFiles.filter((_, i) => i !== idx))} className="absolute top-1 right-1 bg-rose-500 text-white rounded-full p-0.5"><div className="w-3 h-3 text-[8px] font-black">X</div></button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Property Specs */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 bg-slate-50 p-8 rounded-3xl border border-slate-100">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Category</label>
                <select className="w-full p-4 bg-white border-2 border-slate-100 rounded-xl font-bold" onChange={(e) => setFormData({...formData, category: e.target.value})}>
                  {Object.keys(SANCTUARY_CATEGORIES).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Size (SqFt/Acres)</label>
                <input className="w-full p-4 bg-white border-2 border-slate-100 rounded-xl font-bold" onChange={(e) => setFormData({...formData, size: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Beds</label>
                <input type="number" className="w-full p-4 bg-white border-2 border-slate-100 rounded-xl font-bold" onChange={(e) => setFormData({...formData, beds: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Baths</label>
                <input type="number" className="w-full p-4 bg-white border-2 border-slate-100 rounded-xl font-bold" onChange={(e) => setFormData({...formData, baths: e.target.value})} />
              </div>
            </div>

            {/* Auction Strategy */}
            <div className="space-y-6 bg-teal-50/30 p-10 rounded-[2.5rem] border-2 border-teal-100">
               <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between">
                  <div>
                    <h3 className="text-sm font-black uppercase text-teal-900 tracking-widest">Auction Cycle Strategy</h3>
                    <p className="text-[10px] text-teal-600 font-bold italic">Sanctuary assets use extended discovery windows.</p>
                  </div>
                  <select 
                    className="p-4 bg-white border-2 border-teal-200 rounded-2xl font-black text-teal-800 uppercase text-xs"
                    value={formData.durationDays}
                    onChange={(e) => setFormData({...formData, durationDays: e.target.value})}
                  >
                    <option value="7">7 Days (Short Cycle)</option>
                    <option value="14">14 Days (Standard)</option>
                    <option value="30">30 Days (Full Market Exposure)</option>
                  </select>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-teal-600">Starting Bid (USD)</label>
                    <input type="number" className="w-full p-5 bg-white border-2 border-teal-100 rounded-2xl font-black text-2xl text-[#034241]" onChange={(e) => setFormData({...formData, startingBid: e.target.value})} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-rose-500">Secret Reserve Price</label>
                    <input type="number" className="w-full p-5 bg-white border-2 border-rose-100 rounded-2xl font-black text-2xl text-rose-900" onChange={(e) => setFormData({...formData, reservePrice: e.target.value})} />
                  </div>
               </div>
            </div>

            {/* Protocol Notice */}
            <div className="bg-rose-600 p-8 rounded-[2rem] text-white flex gap-6 items-center">
              <ShieldCheck size={40} className="shrink-0" />
              <p className="text-[10px] font-black uppercase tracking-widest leading-loose">
                Mandatory Sanctuary Audit: All property deployments are placed in "Pending" status for Title Deed verification. Any fraudulent property listings result in immediate seizure of the Bazaria Authority Profile.
              </p>
            </div>

            <button 
              disabled={loading}
              className="w-full bg-[#034241] text-white p-8 rounded-[2rem] font-black uppercase tracking-[0.4em] shadow-2xl hover:bg-teal-900 transition-all disabled:bg-slate-300"
            >
              {loading ? "Vetting Asset..." : "Deploy to Sanctuary Portfolio"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
