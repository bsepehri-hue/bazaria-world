"use client";

import { useState } from "react";
import { db, storage } from "@/lib/firebase/client";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useRouter } from "next/navigation";
import { 
  Car, // 🏎️ Add this one!
  Truck, 
  ArrowLeft, 
  ShieldCheck, 
  Camera, 
  ChevronRight 
} from "lucide-react";

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
    /* 🛡️ MASTER WRAPPER: 80px left padding clears the sidebar */
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
        
        {/* Navigation */}
        <button 
          onClick={() => router.back()} 
          style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '32px', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.2em' }}
        >
          <ArrowLeft size={16} /> Back to Gateway
        </button>

        {/* 🏙️ MINIMALIST HEADER: Professional Document Style */}
        <div style={{ 
          marginBottom: '48px', 
          borderLeft: '4px solid #014d4e', 
          paddingLeft: '24px',
          textAlign: 'left'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#014d4e', marginBottom: '8px' }}>
            <Car size={14} />
            <span style={{ fontSize: '9px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.4em' }}>
              Asset Intake Protocol
            </span>
          </div>
          <h1 style={{ 
            fontSize: '42px', 
            fontWeight: '900', 
            color: '#0f172a', 
            margin: '0', 
            textTransform: 'uppercase', 
            letterSpacing: '-0.02em' 
          }}>
            Mobility <span style={{ color: '#014d4e' }}>Engine</span>
          </h1>
          <p style={{ color: '#64748b', fontSize: '11px', fontWeight: '700', marginTop: '8px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Global Fleet Registration & Logistics Deployment
          </p>
        </div>

        {/* 📄 FORM CARD */}
        <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-12 space-y-10">
            
            {/* 🏎️ SECTION 1: IDENTITY */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div style={{ textAlign: 'left' }} className="md:col-span-1 flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Asset Title</label>
                <input 
                  placeholder="e.g. Porsche 911 Carrera"
                  className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-teal-500 font-bold text-slate-900"
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required 
                />
              </div>
              <div style={{ textAlign: 'left' }} className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Model Year</label>
                <input placeholder="2024" className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-slate-900" />
              </div>
              <div style={{ textAlign: 'left' }} className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Trim / Spec</label>
                <input placeholder="e.g. GTS Package" className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-slate-900" />
              </div>
            </div>

            {/* 📝 OWNER'S NARRATIVE */}
            <div style={{ textAlign: 'left' }} className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Condition Narrative & History</label>
              <textarea 
                rows={4}
                placeholder="Describe condition, maintenance, performance add-ons..."
                className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-teal-500 font-bold text-slate-900"
              />
            </div>

            {/* 🛡️ CARFAX / TRUST LAYER */}
            <div style={{ textAlign: 'left', backgroundColor: '#f0f9ff', padding: '24px', borderRadius: '20px', border: '1px solid #bae6fd' }} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div style={{ backgroundColor: '#0070ba', color: 'white', padding: '8px 12px', borderRadius: '8px', fontWeight: '900', fontSize: '12px' }}>CARFAX</div>
                <p className="text-[11px] font-bold text-slate-600 m-0">Verifiable History Report?</p>
              </div>
              <input 
                placeholder="Link or 'Available on Request'" 
                className="flex-1 max-w-sm p-3 bg-white border border-slate-200 rounded-xl text-xs font-bold"
              />
            </div>

           {/* ⚡ DEPLOYMENT MODE */}
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

              {/* 🏷️ FIXED PRICE FIELDS */}
              {formData.saleMode === "Fixed" ? (
                <div style={{ textAlign: 'left' }} className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-teal-600 italic">Listing Price (USD)</label>
                  <input 
                    type="number" 
                    placeholder="e.g. 85000"
                    className="w-full p-4 bg-white border-2 border-teal-100 rounded-2xl font-bold text-teal-900 text-xl" 
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    required
                  />
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tight ml-1">Asset will be deployed for immediate acquisition at this price point.</p>
                </div>
              ) : (
                /* 🔨 AUCTION FIELDS */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div style={{ textAlign: 'left' }} className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-teal-600 italic">Starting Bid</label>
                    <input 
                      type="number" 
                      placeholder="e.g. 50000"
                      className="w-full p-4 bg-white border-2 border-teal-100 rounded-2xl font-bold text-slate-900" 
                      onChange={(e) => setFormData({...formData, startingBid: e.target.value})}
                    />
                  </div>
                  <div style={{ textAlign: 'left' }} className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Post-Cycle Strategy (After 3-Day Cycle)</label>
                    <select 
                      className="w-full p-4 bg-white border-2 border-slate-100 rounded-2xl font-bold text-slate-900"
                      onChange={(e) => setFormData({...formData, postCycle: e.target.value})}
                    >
                      <option>🔄 Re-list for another 3-Day Cycle</option>
                      <option>🛑 End Deployment & Remove Listing</option>
                      <option>🏷️ Convert to 'Buy Now' Fixed Price</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* 📏 USAGE & VIN */}
            <div style={{ textAlign: 'left' }} className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
              <div className="space-y-2">
                <div className="flex justify-between items-end">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Usage Reading</label>
                  <div style={{ backgroundColor: '#f1f5f9' }} className="flex p-1 rounded-lg border">
                    {["MI", "KM"].map((unit) => (
                      <button 
                        key={unit} type="button" 
                        onClick={() => setFormData({...formData, mileageUnit: unit})}
                        style={{ backgroundColor: formData.mileageUnit === unit ? '#ffffff' : 'transparent', color: formData.mileageUnit === unit ? '#014d4e' : '#94a3b8' }}
                        className="px-3 py-1 rounded-md text-[9px] font-black border-none cursor-pointer"
                      >
                        {unit}
                      </button>
                    ))}
                  </div>
                </div>
                <input type="number" placeholder={`Total ${formData.mileageUnit === 'MI' ? 'Miles' : 'Kilometers'}`} className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-xl" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">VIN / Serial Number</label>
                <input className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl font-mono font-bold uppercase" />
              </div>
            </div>

            {/* 📜 PROTOCOL RULES */}
            <div style={{ textAlign: 'left' }} className="space-y-4 bg-rose-50 p-8 rounded-[2rem] border-2 border-rose-100">
              <div className="flex items-start gap-4">
                <ShieldCheck size={24} style={{ color: '#e11d48' }} />
                <div>
                  <h3 style={{ color: '#9f1239', margin: '0' }} className="text-[11px] font-black uppercase tracking-widest">Authority Commitment Protocol</h3>
                  <div className="mt-4 space-y-3">
                    <p className="text-[10px] font-bold text-rose-800 m-0">1. THE 3-DAY LOCK: Once deployed, assets are contractually bound for a 72-hour cycle.</p>
                    <p className="text-[10px] font-bold text-rose-800 m-0">2. NO MID-CYCLE REMOVAL: No withdrawals while the cycle is active.</p>
                    <p className="text-[10px] font-black text-rose-600 m-0 italic mt-2 underline">BREACH RESULTS IN PERMANENT ACCOUNT SEIZURE.</p>
                  </div>
                </div>
              </div>
              <label className="flex items-center gap-3 bg-white p-5 rounded-xl border border-rose-200 cursor-pointer">
                <input type="checkbox" required className="w-5 h-5 rounded border-rose-300 text-rose-600" />
                <span className="text-[10px] font-black uppercase tracking-widest text-rose-900">I acknowledge the 3-day market cycle protocol.</span>
              </label>
            </div>

            {/* 🎯 SUBMIT */}
            <div style={{ marginTop: '40px', paddingTop: '40px', borderTop: '2px solid #f1f5f9' }}>
              <button 
                type="submit"
                style={{
                  width: '100%', backgroundColor: '#014d4e', color: '#ffffff', padding: '24px', borderRadius: '20px', border: 'none',
                  fontSize: '14px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.25em', cursor: 'pointer',
                  boxShadow: '0 20px 40px -10px rgba(1, 77, 78, 0.4)'
                }}
              >
                Deploy Mobility Asset
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} // <--- THIS BRACE CLOSES THE FUNCTION
