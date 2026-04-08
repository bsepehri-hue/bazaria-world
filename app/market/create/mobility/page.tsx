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
    <div className="min-h-screen bg-slate-50 p-6 md:p-12 text-left">
      <div className="max-w-3xl mx-auto">
        
        <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-400 hover:text-teal-600 transition-colors mb-6 font-bold uppercase text-[10px] tracking-widest">
          <ArrowLeft size={16} /> Back to Gateway
        </button>

        <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden">
          <div className="bg-[#034241] p-10 text-white flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-black uppercase tracking-tighter italic text-left">Mobility Engine</h1>
              <p className="text-teal-400 text-xs font-bold uppercase tracking-[0.2em] mt-1 text-left">Asset Intake & Fleet Registration</p>
            </div>
            <Truck size={48} className="opacity-20" />
          </div>

          <form onSubmit={handleSubmit} className="p-10 space-y-8">
            
            {/* Section 1: Title & Gallery */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Asset Title</label>
                <input 
                  placeholder="e.g. 2024 Freightliner Cascadia"
                  className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-teal-500 font-bold text-slate-900"
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required 
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 text-left block">Asset Gallery (Max 6)</label>
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
                      <button type="button" onClick={() => setImageFiles(imageFiles.filter((_, i) => i !== idx))} className="absolute top-1 right-1 bg-rose-500 text-white rounded-full p-0.5 shadow-lg"><div className="w-3 h-3 text-[8px] font-black">X</div></button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Section 2: Deployment Mode (Auction/Fixed) */}
            <div className="space-y-6 bg-slate-50 p-8 rounded-[2rem] border-2 border-slate-100">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Deployment Mode</label>
                <div className="flex bg-white p-1 rounded-2xl border-2 border-slate-200">
                  {["Fixed", "Auction"].map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setFormData({...formData, saleMode: mode})}
                      className={`flex-1 py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${formData.saleMode === mode ? 'bg-[#034241] text-white shadow-xl' : 'text-slate-400'}`}
                    >
                      {mode === "Fixed" ? "Buy Now" : "Live Auction"}
                    </button>
                  ))}
                </div>
              </div>

              {formData.saleMode === "Auction" ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-teal-600 ml-1 italic">Starting Bid</label>
                    <input type="number" className="w-full p-4 bg-white border-2 border-teal-100 rounded-2xl font-bold text-slate-900" onChange={(e) => setFormData({...formData, startingBid: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-rose-500 ml-1 italic">Reserve (Secret)</label>
                    <input type="number" className="w-full p-4 bg-white border-2 border-rose-100 rounded-2xl font-bold text-slate-900" onChange={(e) => setFormData({...formData, reservePrice: e.target.value})} />
                  </div>
                  <div className="space-y-2 text-black">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Duration Cycle</label>
                    <select className="w-full p-4 bg-white border-2 border-slate-100 rounded-2xl font-bold" value={formData.durationDays} onChange={(e) => setFormData({...formData, durationDays: e.target.value})}>
                      <option value="3">3 Days (Automated Loop)</option>
                      <option value="7">7 Days</option>
                    </select>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Listing Price (USD)</label>
                  <input type="number" className="w-full p-4 bg-white border-2 border-slate-100 rounded-2xl font-bold text-teal-600 text-xl" onChange={(e) => setFormData({...formData, price: e.target.value})} />
                </div>
              )}
            </div>

            {/* Section 3: Tech Specs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2 text-black">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Category</label>
                <select className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                  {Object.keys(MOBILITY_CATEGORIES).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">VIN / Serial</label>
                <input className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-mono font-bold uppercase text-black" onChange={(e) => setFormData({...formData, vin: e.target.value})} />
              </div>
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
} // <--- THIS BRACE CLOSES THE FUNCTION
