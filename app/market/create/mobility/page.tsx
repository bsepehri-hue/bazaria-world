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
    /* 🛡️ THE MASTER WRAPPER: 80px left padding clears the sidebar, 140px bottom padding protects the button */
    <div style={{ 
      padding: '60px 40px 140px 80px', 
      backgroundColor: '#f8f8f5', 
      minHeight: '100vh', 
      width: '100%', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center' 
    }}>
      <div style={{ maxWidth: '800px', width: '100%' }}>
        
        {/* Navigation */}
        <button onClick={() => router.back()} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '24px', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.2em' }}>
          <ArrowLeft size={16} /> Back to Gateway
        </button>

        <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden">
          {/* Header */}
          <div style={{ backgroundColor: '#014d4e' }} className="p-10 text-white flex justify-between items-center">
            <div style={{ textAlign: 'left' }}>
              <h1 className="text-3xl font-black uppercase tracking-tighter italic m-0">Mobility Engine</h1>
              <p className="text-teal-400 text-xs font-bold uppercase tracking-[0.2em] mt-1">Asset Intake & Fleet Registration</p>
            </div>
            <Truck size={48} className="opacity-20" />
          </div>

          <form onSubmit={handleSubmit} className="p-10 space-y-8">
            
            {/* Section 1: Title & Gallery */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div style={{ textAlign: 'left' }} className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Asset Title</label>
                <input 
                  placeholder="e.g. 2024 Freightliner Cascadia"
                  className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-teal-500 font-bold text-slate-900"
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required 
                />
              </div>

              <div style={{ textAlign: 'left' }} className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 block">Asset Gallery (Max 6)</label>
                <div className="grid grid-cols-3 gap-2">
                  <label className="aspect-square bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-teal-500 transition-all text-slate-400 relative">
                    <Camera size={18} />
                    <input 
                      type="file" multiple accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" 
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        setImageFiles((prev) => [...prev, ...files].slice(0, 6));
                      }} 
                    />
                  </label>
                  {imageFiles.map((file, idx) => (
                    <div key={idx} className="aspect-square rounded-xl bg-slate-100 overflow-hidden relative border border-slate-200">
                      <img src={URL.createObjectURL(file)} alt="preview" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => setImageFiles(imageFiles.filter((_, i) => i !== idx))} style={{ border: 'none' }} className="absolute top-1 right-1 bg-rose-500 text-white rounded-full p-0.5 shadow-lg cursor-pointer"><div className="w-3 h-3 text-[8px] font-black flex items-center justify-center">X</div></button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Section 2: Deployment Mode */}
            <div className="space-y-6 bg-slate-50 p-8 rounded-[2rem] border-2 border-slate-100">
              <div style={{ textAlign: 'left' }} className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Deployment Mode</label>
                <div className="flex bg-white p-1 rounded-2xl border-2 border-slate-200">
                  {["Fixed", "Auction"].map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setFormData({...formData, saleMode: mode})}
                      className={`flex-1 py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all border-none cursor-pointer ${formData.saleMode === mode ? 'bg-[#034241] text-white shadow-xl' : 'text-slate-400 bg-transparent'}`}
                    >
                      {mode === "Fixed" ? "Buy Now" : "Live Auction"}
                    </button>
                  ))}
                </div>
              </div>

              {formData.saleMode === "Auction" ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div style={{ textAlign: 'left' }} className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-teal-600 ml-1 italic">Starting Bid</label>
                    <input type="number" className="w-full p-4 bg-white border-2 border-teal-100 rounded-2xl font-bold text-slate-900" onChange={(e) => setFormData({...formData, startingBid: e.target.value})} />
                  </div>
                  <div style={{ textAlign: 'left' }} className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-rose-500 ml-1 italic">Reserve (Secret)</label>
                    <input type="number" className="w-full p-4 bg-white border-2 border-rose-100 rounded-2xl font-bold text-slate-900" onChange={(e) => setFormData({...formData, reservePrice: e.target.value})} />
                  </div>
                  <div style={{ textAlign: 'left' }} className="space-y-2 text-black">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Duration Cycle</label>
                    <select className="w-full p-4 bg-white border-2 border-slate-100 rounded-2xl font-bold" value={formData.durationDays} onChange={(e) => setFormData({...formData, durationDays: e.target.value})}>
                      <option value="3">3 Days (Automated Loop)</option>
                      <option value="7">7 Days</option>
                    </select>
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: 'left' }} className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Listing Price (USD)</label>
                  <input type="number" className="w-full p-4 bg-white border-2 border-slate-100 rounded-2xl font-bold text-teal-600 text-xl" onChange={(e) => setFormData({...formData, price: e.target.value})} />
                </div>
              )}
            </div>

            {/* Section 3: Tech Specs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div style={{ textAlign: 'left' }} className="space-y-2 text-black">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Category</label>
                <select className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                  {Object.keys(MOBILITY_CATEGORIES).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div style={{ textAlign: 'left' }} className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">VIN / Serial</label>
                <input className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-mono font-bold uppercase text-black" onChange={(e) => setFormData({...formData, vin: e.target.value})} />
              </div>
            </div>

            {/* Section 5: Narrative */}
            <div className="space-y-2 text-left pt-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Condition Narrative & Upgrades</label>
              <div className="relative group">
                <textarea 
                  rows={5}
                  placeholder="Describe the overall condition, recent maintenance, etc..."
                  className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-[2rem] outline-none focus:border-teal-500 font-medium text-slate-700 leading-relaxed transition-all shadow-inner"
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>
            </div>

            {/* Section 4: Usage Metrics */}
            <div style={{ textAlign: 'left' }} className="grid grid-cols-1 gap-6 pt-4 border-t border-slate-100">
              <div className="space-y-2">
                <div className="flex justify-between items-end ml-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    {formData.category === "HEAVY MACHINERY" ? "Operational Hours" : "Usage Reading"}
                  </label>
                  {formData.category !== "HEAVY MACHINERY" && (
                    <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
                      {["MI", "KM"].map((unit) => (
                        <button key={unit} type="button" onClick={() => setFormData({...formData, mileageUnit: unit})} className={`px-3 py-1 rounded-md text-[9px] font-black transition-all border-none cursor-pointer ${formData.mileageUnit === unit ? 'bg-white text-[#034241] shadow-sm' : 'text-slate-400 bg-transparent'}`}>
                          {unit}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="relative">
                  <input type="number" className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-teal-500 font-bold text-xl text-slate-900" onChange={(e) => setFormData({...formData, mileage: e.target.value})} required />
                </div>
              </div>
            </div>

            {/* Section 6: Protocol Acknowledgement */}
            <div style={{ textAlign: 'left' }} className="space-y-4 bg-rose-50/50 p-6 rounded-[2rem] border-2 border-rose-100/50 my-8">
              <div className="flex items-start gap-4">
                <div className="bg-rose-600 text-white p-2 rounded-lg shrink-0 shadow-lg">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h3 className="text-[11px] font-black uppercase tracking-[0.1em] text-rose-900 m-0">Protocol Rules</h3>
                  <p className="text-[10px] font-bold text-rose-800 leading-relaxed uppercase m-0 mt-2">1. Contractual Lock Required.</p>
                </div>
              </div>
              <label className="flex items-center gap-3 bg-white p-4 rounded-xl border border-rose-200 cursor-pointer">
                <input type="checkbox" required className="w-5 h-5 rounded border-rose-300 text-rose-600" />
                <span className="text-[10px] font-black uppercase tracking-widest text-rose-900">I acknowledge the commitment.</span>
              </label>
            </div>          

            {/* 🎯 THE MISSING SUBMIT SECTION: Added here with custom styling */}
            <div style={{ 
              marginTop: '60px', 
              paddingTop: '40px', 
              borderTop: '2px solid #f1f5f9',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '20px'
            }}>
              <button 
                type="submit"
                disabled={loading}
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
                  boxShadow: '0 20px 40px -10px rgba(1, 77, 78, 0.4)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.backgroundColor = '#0891b2';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.backgroundColor = '#014d4e';
                }}
              >
                {loading ? "Encrypting Asset..." : "Deploy Asset to Market"}
              </button>
              <p style={{ fontSize: '9px', color: '#94a3b8', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.2em' }}>
                Authority Protocol Active // Secure Deployment
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} // <--- THIS BRACE CLOSES THE FUNCTION
