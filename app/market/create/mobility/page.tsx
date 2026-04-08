"use client";

import { useState } from "react";
import { db, storage } from "@/lib/firebase/client";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useRouter } from "next/navigation";
import { Car, Truck, Construction, ShieldCheck, ArrowLeft, Camera } from "lucide-react";

const MOBILITY_CATEGORIES = {
  CARS: ["Sedan", "SUV", "Luxury", "Electric", "Classic"],
  TRUCKS: ["Pickup", "Box Truck", "Semi-Trailer", "Flatbed"],
  MACHINERY: ["Excavator", "Forklift", "Generator", "Industrial"],
  LOGISTICS: ["Van", "Trailer", "Specialized"]
};

export default function MobilityCreatePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
  // ... existing fields
  saleMode: "Fixed", // "Fixed" or "Auction"
  reservePrice: "",
  startingBid: "",
  durationDays: "7",
  buyItNowPrice: "",
});
  <div className="space-y-6 bg-slate-50 p-8 rounded-[2rem] border-2 border-slate-100">
  <div className="flex flex-col gap-2">
    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Deployment Mode</label>
    <div className="flex bg-white p-1 rounded-2xl border-2 border-slate-200">
      {["Fixed", "Auction"].map((mode) => (
        <button
          key={mode}
          type="button"
          onClick={() => setFormData({...formData, saleMode: mode})}
          className={`flex-1 py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
            formData.saleMode === mode 
              ? 'bg-[#034241] text-white shadow-xl' 
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          {mode === "Fixed" ? "Fixed Price / Buy Now" : "Live Auction / Bidding"}
        </button>
      ))}
    </div>
  </div>

  {/* Dynamic Auction Controls */}
  {formData.saleMode === "Auction" ? (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-top-2">
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-widest text-teal-600 ml-1 italic">Starting Bid (USD)</label>
        <input 
          type="number"
          placeholder="Min $1.00"
          className="w-full p-4 bg-white border-2 border-teal-100 rounded-2xl outline-none font-bold text-slate-900"
          onChange={(e) => setFormData({...formData, startingBid: e.target.value})}
        />
      </div>
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-widest text-rose-500 ml-1 italic">Reserve Price (Secret)</label>
        <input 
          type="number"
          placeholder="Min sale price"
          className="w-full p-4 bg-white border-2 border-rose-100 rounded-2xl outline-none font-bold text-slate-900"
          onChange={(e) => setFormData({...formData, reservePrice: e.target.value})}
        />
        <p className="text-[9px] text-slate-400 px-2 italic">Hidden until met.</p>
      </div>
      <div className="space-y-2 text-black">
        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Auction Duration</label>
        <select 
          className="w-full p-4 bg-white border-2 border-slate-100 rounded-2xl outline-none font-bold"
          onChange={(e) => setFormData({...formData, durationDays: e.target.value})}
        >
          <option value="3">3 Days (Flash)</option>
          <option value="7" selected>7 Days (Standard)</option>
          <option value="14">14 Days (Extended)</option>
          <option value="30">30 Days (Real Estate Scale)</option>
        </select>
      </div>
    </div>
  ) : (
    <div className="space-y-2 animate-in fade-in">
      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Listing Price (Direct Sale)</label>
      <input 
        type="number"
        placeholder="Enter total sale amount"
        className="w-full p-4 bg-white border-2 border-slate-100 rounded-2xl outline-none font-bold text-teal-600 text-xl"
        onChange={(e) => setFormData({...formData, price: e.target.value})}
      />
    </div>
  )}
</div>
  const [formData, setFormData] = useState({
    title: "",
    category: "CARS",
    subCategory: "Sedan",
    vin: "",
    mileage: "",
    price: "",
    condition: "Used",
    description: "",
    isMobilityAsset: true
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = "https://via.placeholder.com/600x400?text=No+Asset+Image";
      if (imageFile) {
        const fileRef = ref(storage, `mobility/${Date.now()}-${imageFile.name}`);
        const uploadTask = await uploadBytes(fileRef, imageFile);
        imageUrl = await getDownloadURL(uploadTask.ref);
      }

      await addDoc(collection(db, "listings"), {
        ...formData,
        price: Number(formData.price),
        mileage: Number(formData.mileage),
        imageUrl,
        createdAt: serverTimestamp(),
        status: "active",
      });
      
      router.push("/market"); 
    } catch (error) {
      console.error("Mobility Upload Error:", error);
      alert("Failed to register asset.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-3xl mx-auto">
        
        {/* Navigation Header */}
        <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-400 hover:text-teal-600 transition-colors mb-6 font-bold uppercase text-[10px] tracking-widest">
          <ArrowLeft size={16} /> Back to Gateway
        </button>

        <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden">
          {/* Engine Title Bar */}
          <div className="bg-[#034241] p-10 text-white flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-black uppercase tracking-tighter italic">Mobility Engine</h1>
              <p className="text-teal-400 text-xs font-bold uppercase tracking-[0.2em] mt-1">Asset Intake & Fleet Registration</p>
            </div>
            <Truck size={48} className="opacity-20" />
          </div>

          <form onSubmit={handleSubmit} className="p-10 space-y-8">
            
            {/* Section 1: Asset Core */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Asset Title</label>
                <input 
                  placeholder="e.g. 2024 Freightliner Cascadia"
                  className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-teal-500 transition-all font-bold text-slate-900"
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required 
                />
              </div>
              <div className="space-y-2 text-black">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Asset Image</label>
                <div className="relative group">
                  <input 
                    type="file" 
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  />
                  <div className="w-full p-4 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center gap-3 text-slate-400 group-hover:border-teal-500 group-hover:text-teal-600 transition-all">
                    <Camera size={20} />
                    <span className="text-xs font-bold uppercase">{imageFile ? imageFile.name : "Upload Vehicle Photo"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Fleet Metadata */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2 text-black">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Category</label>
                <select 
                  className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none font-bold"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value, subCategory: MOBILITY_CATEGORIES[e.target.value as keyof typeof MOBILITY_CATEGORIES][0]})}
                >
                  {Object.keys(MOBILITY_CATEGORIES).map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2 text-black">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Sub-Type</label>
                <select 
                  className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none font-bold"
                  value={formData.subCategory}
                  onChange={(e) => setFormData({...formData, subCategory: e.target.value})}
                >
                  {MOBILITY_CATEGORIES[formData.category as keyof typeof MOBILITY_CATEGORIES].map(sub => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Condition</label>
                <div className="flex bg-slate-50 p-1 rounded-2xl border-2 border-slate-100">
                  {["New", "Used"].map(c => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setFormData({...formData, condition: c})}
                      className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${formData.condition === c ? 'bg-[#034241] text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Section 3: Identity & Value */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">VIN / Serial Number</label>
                <input 
                  placeholder="Verification ID"
                  className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none uppercase font-mono text-sm font-bold"
                  onChange={(e) => setFormData({...formData, vin: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Mileage / Hours</label>
                <input 
                  type="number"
                  placeholder="Current Usage"
                  className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none font-bold"
                  onChange={(e) => setFormData({...formData, mileage: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Ask Price (USD)</label>
                <input 
                  type="number"
                  placeholder="0.00"
                  className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none font-bold text-teal-600"
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Technical Description</label>
                <textarea 
                  rows={4}
                  placeholder="Specify engine specs, maintenance history, or payload capacity..."
                  className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none font-medium text-slate-600"
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
            </div>

            <button 
              disabled={loading}
              className="w-full bg-[#034241] text-white p-6 rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl hover:bg-teal-900 transition-all disabled:bg-slate-300"
            >
              {loading ? "Registering Asset..." : "Register Mobility Asset"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
