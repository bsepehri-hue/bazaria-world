"use client";

export const dynamic = 'force-dynamic'; // 🎯 Bypass the build-time search param check

import { 
  doc, 
  getDoc, 
  deleteDoc, 
  collection, 
  addDoc, 
  serverTimestamp, 
  updateDoc 
} from "firebase/firestore";

import { useState, useEffect, Suspense } from "react";
import { db, storage } from "@/lib/firebase/client";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  Car, 
  ShieldCheck, 
  ArrowLeft, 
  Camera, 
  Gauge,
  Fingerprint
} from "lucide-react";

const MOBILITY_CATEGORIES: Record<string, string[]> = {
  CARS: ["Sedan", "Coupe", "SUV", "Minivan", "Luxury", "Electric", "Classic"],
  "LIGHT DUTY TRUCKS": ["Pickup", "Commercial Van", "4x4 Off-Road"],
  "INDUSTRIAL TRUCKS": ["Semi-Trailer", "Box Truck", "Dump Truck", "Flatbed"],
  "HEAVY MACHINERY": ["Excavator", "Forklift", "Generator"],
  MOTORCYCLES: ["Sport", "Cruiser", "ATV/UTV", "Touring"],
  RVS: ["Motorhome", "Travel Trailer", "Camper Van"]
};

// 1️⃣ THE WRAPPER
export default function MobilityCreatePage() {
  return (
    <Suspense fallback={
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8f8f5' }}>
        <p style={{ fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.4em', color: '#014d4e' }}>
          Initializing Mobility Protocol...
        </p>
      </div>
    }>
      <MobilityFormCore />
    </Suspense>
  );
}

// 2️⃣ THE CORE ENGINE
function MobilityFormCore() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('edit');

  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [isDeleteLocked, setIsDeleteLocked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  
  const [formData, setFormData] = useState({
    title: "",
    imageUrls: [],
    category: "CARS", // 🎯 Internal state for the dropdown
    subCategory: "Sedan",
    vin: "",
    mileage: "",
    mileageUnit: "MI",
    condition: "Used / Excellent",
    description: "",
    saleMode: "Auction + Buy Now",
    startingBid: "",
    reservePrice: "",
    buyNowPrice: "",
    isMobilityAsset: true,
    assetClass: "Mobility/Global-Fleet"
  });

 // 💧 HYDRATION LOGIC: Loads data when you click the Pencil
  useEffect(() => {
    const loadAsset = async () => { 
      if (!editId) return;
      try {
        const docSnap = await getDoc(doc(db, "listings", editId));
        if (docSnap.exists()) {
          setFormData(docSnap.data() as any);
        }
      } catch (err) {
        console.error("Hydration Failed:", err);
      }
    };
    loadAsset();
  }, [editId]);

  // 📸 IMAGE REMOVAL LOGIC
  const handleRemoveExistingImage = (urlToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      imageUrls: prev.imageUrls.filter(url => url !== urlToRemove)
    }));
  };

  const handleRemoveNewImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  // 🛡️ DELETE LOGIC: Handles the "Remove From Fleet" button
  const handleDelete = async () => {
    if (!editId || isDeleteLocked) return;
    if (!isConfirmingDelete) {
      setIsConfirmingDelete(true);
      setIsDeleteLocked(true);
      setTimeout(() => setIsDeleteLocked(false), 1500);
      setTimeout(() => { setIsConfirmingDelete(false); setIsDeleteLocked(false); }, 5000);
      return;
    }

    try {
      setLoading(true);
      await deleteDoc(doc(db, "listings", editId));
      router.push("/market");
    } catch (error) {
      console.error("Deletion Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 📸 1. UPLOAD IMAGES
      const uploadedUrls = [];
      for (const file of imageFiles) {
        const storageRef = ref(storage, `mobility/${Date.now()}-${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        const url = await getDownloadURL(snapshot.ref);
        uploadedUrls.push(url);
      }

      const finalImageUrls = [...(formData.imageUrls || []), ...uploadedUrls];
      const bnp = Number(formData.buyNowPrice) || 0;
      const sbd = Number(formData.startingBid) || 0;
      const isFixedPrice = sbd === 0 && bnp > 0;

      // 🎯 2. UNIFIED PAYLOAD (The Fix for the Syntax Error)
      const listingData = {
        ...formData,
        category: "mobility",                          // Global marketplace key
        mobilityType: formData.category,               // e.g., "CARS"
        subcategory: formData.subCategory.toLowerCase(), // e.g., "sedan"
        isMobilityAsset: true,
        imageUrls: finalImageUrls,
        imageUrl: finalImageUrls[0] || "",
        price: isFixedPrice ? bnp : sbd, 
        buyNowPrice: bnp,
        startingBid: sbd,
        currentBid: sbd, 
        reservePrice: Number(formData.reservePrice) || 0,
        mileage: Number(formData.mileage) || 0,
        saleMode: isFixedPrice ? "Fixed Price" : "Auction + Buy Now", 
        updatedAt: serverTimestamp(),
        status: "active",
      };

      // 🚀 3. DATABASE DEPLOYMENT
      if (editId) {
        await updateDoc(doc(db, "listings", editId), listingData);
      } else {
        await addDoc(collection(db, "listings"), {
          ...listingData,
          createdAt: serverTimestamp(),
        });
      }
      router.push("/market");
    } catch (error) {
      console.error("Submission Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '80px 40px', backgroundColor: '#f8f8f5', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ width: '100%', maxWidth: '1000px' }}>
        
        <button 
          onClick={() => router.push('/market/create')} 
          style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '32px', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.2em' }}
        >
          <ArrowLeft size={16} /> Asset Gateway
        </button>

        {/* 🏙️ HEADER - Matching Residential */}
        <div style={{ marginBottom: '48px', borderLeft: '4px solid #014d4e', paddingLeft: '24px', textAlign: 'left' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#014d4e', marginBottom: '8px' }}>
            <Car size={14} />
            <span style={{ fontSize: '9px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.4em' }}>
              Mobility Asset Intake
            </span>
          </div>
          <h1 style={{ fontSize: '42px', fontWeight: '900', color: '#0f172a', margin: '0', textTransform: 'uppercase', letterSpacing: '-0.02em' }}>
            The <span style={{ color: '#014d4e' }}>Mobility</span> Engine
          </h1>
          <p style={{ color: '#64748b', fontSize: '11px', fontWeight: '700', marginTop: '8px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Global Fleet Registration, Commercial Logistics, and Vehicle Deployment
          </p>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-12 space-y-10">
            
            {/* SECTION 1: IDENTITY */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div style={{ textAlign: 'left' }} className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Asset Title</label>
                <input 
                  value={formData.title ?? ""} 
                  placeholder="e.g. Porsche 911 Carrera" 
                  className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-teal-500 font-bold text-slate-900" 
                  onChange={(e) => setFormData({...formData, title: e.target.value})} 
                  required 
                />
              </div>
              <div style={{ textAlign: 'left' }} className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">VIN / Serial Number</label>
                <input 
                  value={formData.vin ?? ""} 
                  placeholder="Enter VIN" 
                  className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-mono font-bold text-slate-900" 
                  onChange={(e) => setFormData({...formData, vin: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div style={{ textAlign: 'left' }} className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Asset Category</label>
                <select 
                  value={formData.category} 
                  className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-slate-900" 
                  onChange={(e) => setFormData({...formData, category: e.target.value, subCategory: MOBILITY_CATEGORIES[e.target.value][0]})}
                >
                  {Object.keys(MOBILITY_CATEGORIES).map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div style={{ textAlign: 'left' }} className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Vehicle Type / Spec</label>
                <select 
                  value={formData.subCategory} 
                  className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-slate-900" 
                  onChange={(e) => setFormData({...formData, subCategory: e.target.value})}
                >
                  {MOBILITY_CATEGORIES[formData.category]?.map(sub => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* SECTION 2: GALLERY */}
            <div style={{ textAlign: 'left' }} className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Asset Gallery</label>
              <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
                <label className="aspect-square bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-teal-600 transition-all text-slate-400 group">
                  <Camera size={20} className="group-hover:text-teal-600" />
                  <span style={{ fontSize: '8px', marginTop: '4px', fontWeight: '900' }}>ADD</span>
                  <input type="file" multiple accept="image/*" className="hidden" onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    setImageFiles((prev) => [...prev, ...files].slice(0, 8));
                  }} />
                </label>
                {formData.imageUrls?.map((url, idx) => (
                  <div key={`existing-${idx}`} style={{ position: 'relative', aspectRatio: '1/1', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                    <img src={url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="asset" />
                    <button type="button" onClick={() => handleRemoveExistingImage(url)} style={{ position: 'absolute', top: '5px', right: '5px', backgroundColor: '#ef4444', color: 'white', width: '22px', height: '22px', borderRadius: '50%', border: 'none', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', zIndex: 10 }}>×</button>
                  </div>
                ))}
                {imageFiles.map((file, idx) => (
                  <div key={`new-${idx}`} style={{ position: 'relative', aspectRatio: '1/1', borderRadius: '12px', overflow: 'hidden', border: '2px solid #014d4e' }}>
                    <img src={URL.createObjectURL(file)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="preview" />
                    <button type="button" onClick={() => handleRemoveNewImage(idx)} style={{ position: 'absolute', top: '5px', right: '5px', backgroundColor: '#014d4e', color: 'white', width: '22px', height: '22px', borderRadius: '50%', border: 'none', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', zIndex: 10 }}>×</button>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 3: SPECS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-8 rounded-[2rem] border-2 border-slate-100">
              <div style={{ textAlign: 'left' }} className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-slate-400"><Gauge size={14} /><label className="text-[10px] font-black uppercase tracking-widest">Usage Reading</label></div>
                  <div className="flex gap-2">
                    {["MI", "KM"].map(u => (
                      <button key={u} type="button" onClick={() => setFormData({...formData, mileageUnit: u})} style={{ fontSize: '8px', fontWeight: '900', color: formData.mileageUnit === u ? '#014d4e' : '#94a3b8', background: formData.mileageUnit === u ? '#fff' : 'transparent', border: '1px solid #e2e8f0', padding: '2px 8px', borderRadius: '4px', cursor: 'pointer' }}>{u}</button>
                    ))}
                  </div>
                </div>
                <input value={formData.mileage ?? ""} type="number" placeholder="Total Mileage" className="w-full p-4 bg-white border-2 border-slate-200 rounded-xl font-bold text-slate-900" onChange={(e) => setFormData({...formData, mileage: e.target.value})} />
              </div>

              <div style={{ textAlign: 'left' }} className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-slate-400"><ShieldCheck size={14} /><label className="text-[10px] font-black uppercase tracking-widest">Condition</label></div>
                <select value={formData.condition} className="w-full p-4 bg-white border-2 border-slate-200 rounded-xl font-bold text-slate-900" onChange={(e) => setFormData({...formData, condition: e.target.value})}>
                  <option>Used / Excellent</option>
                  <option>Used / Good</option>
                  <option>New / Mint</option>
                  <option>Project / Salvage</option>
                </select>
              </div>
            </div>

            {/* NARRATIVE */}
            <div style={{ textAlign: 'left' }} className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900">Asset Narrative</label>
              <textarea className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-6 text-sm min-h-[150px] outline-none" placeholder="Features, history, maintenance..." value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
            </div>

            {/* PRICING BLOCK */}
            <div className="bg-slate-900 p-10 rounded-[2.5rem] text-white space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div style={{ textAlign: 'left' }}>
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Starting Bid</label>
                  <input value={formData.startingBid ?? ""} type="number" className="w-full bg-transparent border-b-2 border-slate-800 outline-none font-black text-3xl pb-2 text-white" onChange={(e) => setFormData({...formData, startingBid: e.target.value})} />
                </div>
                <div style={{ textAlign: 'left' }}>
                  <label className="text-[9px] font-black uppercase tracking-widest text-amber-500">Buy Now</label>
                  <input value={formData.buyNowPrice ?? ""} type="number" className="w-full bg-transparent border-b-2 border-amber-800 outline-none font-black text-3xl pb-2 text-amber-500" onChange={(e) => setFormData({...formData, buyNowPrice: e.target.value})} />
                </div>
                <div style={{ textAlign: 'left' }}>
                  <label className="text-[9px] font-black uppercase tracking-widest text-rose-500">Reserve</label>
                  <input value={formData.reservePrice ?? ""} type="number" className="w-full bg-transparent border-b-2 border-rose-950 outline-none font-black text-3xl pb-2 text-rose-500" onChange={(e) => setFormData({...formData, reservePrice: e.target.value})} />
                </div>
              </div>
            </div>

            {/* 🎯 BAZARIA AUTHORITY CHECKBOX */}
            <div className="flex items-start gap-4 p-6 bg-slate-50 rounded-2xl border border-slate-200 mt-6">
              <input type="checkbox" required className="w-5 h-5 mt-1 accent-[#014d4e] cursor-pointer" />
              <p className="text-[11px] text-slate-500 font-semibold leading-relaxed text-left">
                I hereby certify that this mobility asset is under my legal authority and complies with the 
                <span className="text-[#014d4e] font-black"> Bazaria Sovereign Protocol</span>.
              </p>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-col gap-4 mt-8">
              <button type="submit" disabled={loading} style={{ width: '100%', backgroundColor: '#014d4e', color: '#ffffff', padding: '24px', borderRadius: '20px', fontSize: '14px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.25em', cursor: 'pointer' }}>
                {loading ? "Registering..." : (editId ? "Update Fleet Asset" : "Deploy Mobility Asset")}
              </button>
              {editId && (
                <button type="button" onClick={handleDelete} disabled={isDeleteLocked} style={{ width: '100%', backgroundColor: isConfirmingDelete ? '#ef4444' : 'transparent', color: isConfirmingDelete ? '#ffffff' : '#ef4444', border: '1px solid #ef4444', padding: '16px', borderRadius: '20px', fontWeight: '900', textTransform: 'uppercase', cursor: isDeleteLocked ? 'not-allowed' : 'pointer' }}>
                  {isDeleteLocked ? "WAITING..." : isConfirmingDelete ? "⚠️ CONFIRM DELETE" : "Remove From Fleet"}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
