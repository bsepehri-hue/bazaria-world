"use client";

import { useState } from "react";
import { db, storage } from "@/lib/firebase/client";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useRouter } from "next/navigation";
import { Truck, ArrowLeft, Camera, ShieldCheck } from "lucide-react";

const MOBILITY_CATEGORIES = {
  CARS: ["Sedan", "SUV", "Luxury", "Electric", "Classic"],
  "LIGHT DUTY TRUCKS": ["Pickup", "Commercial Van", "4x4 Off-Road"],
  "INDUSTRIAL TRUCKS": ["Semi-Trailer", "Box Truck", "Dump Truck", "Flatbed"],
  "HEAVY MACHINERY": ["Excavator", "Forklift", "Generator"],
  MOTORCYCLES: ["Sport", "Cruiser", "ATV/UTV"],
  RVS: ["Motorhome", "Travel Trailer", "Camper Van"]
};

export default function MobilityCreatePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]); // This handles the multi-photo array

  const [formData, setFormData] = useState({
    title: "",
    category: "CARS",
    subCategory: "Sedan",
    vin: "",
    mileage: "",
    price: "",
    condition: "Used",
    description: "",
    saleMode: "Auction",      // Defaulting to Auction for the 3-day cycle
    durationDays: "3",       // Your requested 3-day velocity
    autoRelist: true,        // The Infinite Loop logic
    reservePrice: "",
    startingBid: "",
    imageUrls: [] as string[],
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
        price: Number(formData.price || formData.startingBid),
        mileage: Number(formData.mileage),
        imageUrl,
        createdAt: serverTimestamp(),
        status: "active",
      });
      
      router.push("/market"); 
    } catch (error) {
      console.error("Mobility Error:", error);
      alert("Failed to register asset.");
    } finally {
      setLoading(false);
    }
  };

return (
    /* 🛡️ MASTER WRAPPER */
    <div style={{ 
      padding: '60px 40px 140px 80px', 
      backgroundColor: '#f8f8f5', 
      minHeight: '100vh', 
      width: '100%', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center' 
    }}>
      <div style={{ maxWidth: '900px', width: '100%' }}>
        
        {/* Back Button */}
        <button onClick={() => router.back()} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '24px', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.2em' }}>
          <ArrowLeft size={16} /> Back to Gateway
        </button>

        <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden">
          
          {/* 🟢 HEADER: Forced White Text */}
          <div style={{ backgroundColor: '#014d4e' }} className="p-10 flex justify-between items-center">
            <div style={{ textAlign: 'left' }}>
              <h1 style={{ color: '#ffffff', margin: '0' }} className="text-3xl font-black uppercase tracking-tighter italic">Mobility Engine</h1>
              <p style={{ color: '#5eead4', margin: '4px 0 0' }} className="text-xs font-bold uppercase tracking-[0.2em]">Asset Intake & Fleet Registration</p>
            </div>
            <Truck size={48} style={{ color: '#ffffff', opacity: 0.2 }} />
          </div>

          <form onSubmit={handleSubmit} className="p-10 space-y-8">
            
            {/* 🏎️ SECTION 1: IDENTITY (Title, Year, Trim) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div style={{ textAlign: 'left' }} className="md:col-span-1 flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Asset Title</label>
                <input 
                  placeholder="e.g. Freightliner Cascadia"
                  className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-teal-500 font-bold text-slate-900"
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required 
                />
              </div>
              <div style={{ textAlign: 'left' }} className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Model Year</label>
                <input 
                  placeholder="2024"
                  className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-slate-900"
                  onChange={(e) => setFormData({...formData, year: e.target.value})}
                />
              </div>
              <div style={{ textAlign: 'left' }} className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Trim / Spec</label>
                <input 
                  placeholder="e.g. Platinum Edition"
                  className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-slate-900"
                  onChange={(e) => setFormData({...formData, trim: e.target.value})}
                />
              </div>
            </div>

            {/* 📸 SECTION 2: GALLERY */}
            <div style={{ textAlign: 'left' }} className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Asset Gallery (Max 6)</label>
                <div className="grid grid-cols-6 gap-2">
                  <label style={{ backgroundColor: '#f8fafc', border: '2px dashed #e2e8f0' }} className="aspect-square rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-teal-500 transition-all text-slate-400 relative">
                    <Camera size={18} />
                    <input type="file" multiple accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      setImageFiles((prev) => [...prev, ...files].slice(0, 6));
                    }} />
                  </label>
                  {imageFiles.map((file, idx) => (
                    <div key={idx} className="aspect-square rounded-xl bg-slate-100 overflow-hidden relative border border-slate-200">
                      <img src={URL.createObjectURL(file)} alt="preview" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
            </div>

            {/* ⚡ SECTION 3: DEPLOYMENT (Hulk-Proofed Buttons) */}
            <div className="space-y-6 bg-slate-50 p-8 rounded-[2rem] border-2 border-slate-100">
              <div style={{ textAlign: 'left' }} className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Deployment Mode</label>
                <div style={{ backgroundColor: '#ffffff', border: '2px solid #e2e8f0' }} className="flex p-1 rounded-2xl">
                  {["Fixed", "Auction"].map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setFormData({...formData, saleMode: mode})}
                      style={{
                        backgroundColor: formData.saleMode === mode ? '#014d4e' : 'transparent',
                        color: formData.saleMode === mode ? '#ffffff' : '#94a3b8',
                      }}
                      className="flex-1 py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all border-none cursor-pointer"
                    >
                      {mode === "Fixed" ? "Buy Now" : "Live Auction"}
                    </button>
                  ))}
                </div>
              </div>

              {formData.saleMode === "Auction" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   <div style={{ textAlign: 'left' }} className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-teal-600 italic">Starting Bid</label>
                    <input type="number" className="w-full p-4 bg-white border-2 border-teal-100 rounded-2xl font-bold" />
                  </div>
                  <div style={{ textAlign: 'left' }} className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-rose-500 italic">Reserve Price</label>
                    <input type="number" className="w-full p-4 bg-white border-2 border-rose-100 rounded-2xl font-bold" />
                  </div>
                  <div style={{ textAlign: 'left' }} className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Post-Cycle Logic</label>
                    <select className="w-full p-4 bg-white border-2 border-slate-100 rounded-2xl font-bold text-slate-900">
                      <option>Re-list Automatically</option>
                      <option>Remove from Market</option>
                      <option>Convert to Buy Now</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* 📏 SECTION 4: USAGE (KM/MI Toggle) */}
            <div style={{ textAlign: 'left' }} className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
              <div className="space-y-2">
                <div className="flex justify-between items-end">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Usage Reading</label>
                  <div style={{ backgroundColor: '#f1f5f9' }} className="flex p-1 rounded-lg border">
                    {["MI", "KM"].map((unit) => (
                      <button 
                        key={unit} 
                        type="button" 
                        onClick={() => setFormData({...formData, mileageUnit: unit})}
                        style={{
                          backgroundColor: formData.mileageUnit === unit ? '#ffffff' : 'transparent',
                          color: formData.mileageUnit === unit ? '#014d4e' : '#94a3b8'
                        }}
                        className="px-3 py-1 rounded-md text-[9px] font-black border-none cursor-pointer"
                      >
                        {unit}
                      </button>
                    ))}
                  </div>
                </div>
                <input 
                  type="number" 
                  placeholder={`Total ${formData.mileageUnit === 'MI' ? 'Miles' : 'Kilometers'}`} 
                  className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-xl" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">VIN / Serial Number</label>
                <input className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl font-mono font-bold uppercase" />
              </div>
            </div>

            {/* 📜 SECTION 5: PROTOCOL RULES */}
            <div style={{ textAlign: 'left' }} className="space-y-4 bg-rose-50 p-8 rounded-[2rem] border-2 border-rose-100">
              <div className="flex items-start gap-4">
                <ShieldCheck size={24} style={{ color: '#e11d48' }} />
                <div>
                  <h3 style={{ color: '#9f1239', margin: '0' }} className="text-[11px] font-black uppercase tracking-widest">Bazaria Authority Protocol</h3>
                  <div className="mt-4 space-y-3">
                    <p className="text-[10px] font-bold text-rose-800 m-0">1. CONTRACTUAL LOCK: Assets enter a binding 3-day market cycle upon deployment.</p>
                    <p className="text-[10px] font-bold text-rose-800 m-0">2. NO WITHDRAWAL: You cannot terminate a live auction once bidding is active.</p>
                    <p className="text-[10px] font-black text-rose-600 m-0 italic mt-2 underline">PENALTY: BREACH OF PROTOCOL RESULTS IN PERMANENT ACCOUNT SEIZURE.</p>
                  </div>
                </div>
              </div>
              <label className="flex items-center gap-3 bg-white p-5 rounded-xl border border-rose-200 cursor-pointer">
                <input type="checkbox" required className="w-5 h-5 rounded border-rose-300 text-rose-600" />
                <span className="text-[10px] font-black uppercase tracking-widest text-rose-900">I acknowledge the Authority Protocol.</span>
              </label>
            </div>

            {/* 🎯 SUBMIT BUTTON */}
            <div style={{ marginTop: '40px', paddingTop: '40px', borderTop: '2px solid #f1f5f9' }}>
              <button 
                type="submit"
                style={{
                  width: '100%',
                  backgroundColor: '#014d4e',
                  color: '#ffffff',
                  padding: '24px',
                  borderRadius: '20px',
                  border: 'none',
                  fontSize: '14px',
                  fontWeight: '900',
                  textTransform: 'uppercase',
                  letterSpacing: '0.25em',
                  cursor: 'pointer',
                  boxShadow: '0 20px 40px -10px rgba(1, 77, 78, 0.4)'
                }}
              >
                Deploy Asset to Market
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} // <--- THIS BRACE CLOSES THE FUNCTION
