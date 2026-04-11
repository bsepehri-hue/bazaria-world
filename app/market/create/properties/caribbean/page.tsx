"use client";

import { useState, useEffect, Suspense } from "react";
import { db, storage } from "@/lib/firebase/client";
import { doc, getDoc, collection, addDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useRouter, useSearchParams } from "next/navigation";
import { BedDouble, ShieldCheck, ArrowLeft, Camera, MapPin, Waves, Maximize2, Droplets } from "lucide-react";

// 1️⃣ THE WRAPPER
export default function SanctuaryCaribbeanCreate() {
  return (
    <Suspense fallback={
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8f8f5' }}>
        <p style={{ fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.4em', color: '#014d4e' }}>
          Initializing Authority Protocol...
        </p>
      </div>
    }>
      <CaribbeanFormCore />
    </Suspense>
  );
}

// 2️⃣ THE CORE ENGINE
function CaribbeanFormCore() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('edit');
  
  const [loading, setLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    imageUrls: [],
    propertyType: "Oceanfront Villa",
    location: "",
    city: "",
    province: "",
    bedrooms: "",
    bathrooms: "",
    lotSize: "",
    saleMode: "Auction + Buy Now",
    durationDays: "30",
    startingBid: "",
    reservePrice: "",
    buyNowPrice: "",
    description: "",
    isSanctuaryAsset: true,
    assetClass: "International/High-Authority"
  });

  // 💧 HYDRATION LOGIC: This pulls your data from Firebase
  useEffect(() => {
    const loadAsset = async () => { 
      if (!editId) return;
      try {
        const docSnap = await getDoc(doc(db, "listings", editId));
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFormData(data as any);
        }
      } catch (err) {
        console.error("Hydration Failed:", err);
      }
    };
    loadAsset();
  }, [editId]);

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  // 🕵️ DEBUG: Check what the "Brain" actually sees before saving
  console.log("BRAIN CHECK - Sale Mode:", formData.saleMode);
  console.log("BRAIN CHECK - Buy Now:", formData.buyNowPrice);
  console.log("BRAIN CHECK - Starting Bid:", formData.startingBid);

  try {
    const finalImageUrls = [...(formData.imageUrls || [])];
    
    // 🎯 1. CALCULATE THE MASTER PRICE
    // We use a "Smart Default" - if one is empty, use the other
    const bnp = Number(formData.buyNowPrice) || 0;
    const sbd = Number(formData.startingBid) || 0;
    
    // If it's Fixed, use BNP. If it's anything else (Auction), use SBD.
    const masterPrice = formData.saleMode === "Fixed Price" ? bnp : sbd;

    // 🎯 2. ASSEMBLE THE PAYLOAD
    const listingData = {
      ...formData,
      category: "Sanctuary",
      imageUrls: finalImageUrls,
      imageUrl: finalImageUrls[0] || "",
      
      // 💰 FORCE EVERY PRICE FIELD TO UPDATE
      price: masterPrice,
      buyNowPrice: bnp,
      startingBid: sbd,
      reservePrice: Number(formData.reservePrice) || 0,
      
      // 📐 OTHERS
      bedrooms: Number(formData.bedrooms),
      bathrooms: Number(formData.bathrooms),
      updatedAt: serverTimestamp(),
      status: "active",
    };

    if (editId) {
      await updateDoc(doc(db, "listings", editId), listingData);
      console.log("SUCCESS: Villa Authority Updated!");
    } else {
      await addDoc(collection(db, "listings"), {
        ...listingData,
        createdAt: serverTimestamp(),
      });
    }

    router.push("/market");
  } catch (error) {
    console.error("Sovereign Deployment Error:", error);
  } finally {
    setLoading(false);
  }
};
  
  return (
    <div style={{ padding: '80px 40px', backgroundColor: '#f8f8f5', minHeight: '100vh' }}>
      
      {/* Navigation */}
      <button 
        onClick={() => router.push('/market')} 
        style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '32px', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.2em' }}
      >
        <ArrowLeft size={16} /> Sanctuary Gateway
      </button>

      {/* 🏙️ HEADER */}
      <div style={{ marginBottom: '48px', borderLeft: '4px solid #014d4e', paddingLeft: '24px', textAlign: 'left' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#014d4e', marginBottom: '8px' }}>
          <Waves size={14} />
          <span style={{ fontSize: '9px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.4em' }}>
            International Portfolio Intake
          </span>
        </div>
        <h1 style={{ fontSize: '42px', fontWeight: '900', color: '#0f172a', margin: '0', textTransform: 'uppercase', letterSpacing: '-0.02em' }}>
          The <span style={{ color: '#014d4e' }}>Caribbean</span> Sanctuary
        </h1>
        <p style={{ color: '#64748b', fontSize: '11px', fontWeight: '700', marginTop: '8px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          Elite Vacation Estates & International Asset Deployment
        </p>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden" style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <form onSubmit={handleSubmit} className="p-12 space-y-10">
          
          {/* SECTION 1: IDENTITY */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div style={{ textAlign: 'left' }} className="flex flex-col gap-2">
<label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
  {formData.category === 'Caribbean' ? "Estate Name" : "Asset Title"}
</label>
              <input value={formData.title} placeholder="e.g. Villa Mariposa" className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-teal-500 font-bold text-slate-900" onChange={(e) => setFormData({...formData, title: e.target.value})} required />
            </div>
            <div style={{ textAlign: 'left' }} className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
  {formData.category === 'Caribbean' ? "Estate Classification" : "Asset Category"}
</label>
              <select value={formData.propertyType} className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-slate-900" onChange={(e) => setFormData({...formData, propertyType: e.target.value})}>
                <option>Oceanfront Villa</option>
                <option>International Estate</option>
                <option>Boutique Hotel</option>
              </select>
            </div>
          </div>

          {/* SECTION 2: LOCATION */}
          <div className="p-8 bg-slate-50 rounded-[2rem] border-2 border-slate-100 space-y-6">
             <div style={{ textAlign: 'left' }} className="flex flex-col gap-2">
               <label className="text-[10px] font-black uppercase tracking-widest text-teal-600 italic">
  {formData.category === 'Caribbean' ? "Property Location" : "Asset Origin"}
</label>
                <input value={formData.location} placeholder="Address" className="w-full p-4 bg-white border-2 border-slate-200 rounded-xl font-bold text-slate-900" onChange={(e) => setFormData({...formData, location: e.target.value})} />
             </div>
             <div className="grid grid-cols-2 gap-4">
                <input value={formData.city} placeholder="City" className="w-full p-4 bg-white border-2 border-slate-200 rounded-xl font-bold text-slate-900" onChange={(e) => setFormData({...formData, city: e.target.value})} />
                <input value={formData.province} placeholder="Province" className="w-full p-4 bg-white border-2 border-slate-200 rounded-xl font-bold text-slate-900" onChange={(e) => setFormData({...formData, province: e.target.value})} />
             </div>
          </div>

{/* SECTION 3: ESTATE GALLERY */}
<div style={{ textAlign: 'left' }} className="space-y-4">
  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
    {formData.category === 'Caribbean' ? "Estate Presentation" : "Asset Gallery"} (Current & New Assets)
  </label>
            
  <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
    {/* 1. THE UPLOAD BUTTON */}
    <label className="aspect-square bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-[#014d4e] transition-all text-slate-400 group">
      <Camera size={20} className="group-hover:text-[#014d4e]" />
      <span style={{ fontSize: '8px', marginTop: '4px', fontWeight: '900' }}>ADD</span>
      <input 
        type="file" 
        multiple 
        accept="image/*" 
        className="hidden" 
        onChange={(e) => {
          const files = Array.from(e.target.files || []);
          setImageFiles((prev) => [...prev, ...files].slice(0, 8));
        }} 
      />
    </label>

              {/* 2. SHOW EXISTING PHOTOS (From Database) */}
              {formData.imageUrls?.map((url, idx) => (
                <div key={`existing-${idx}`} className="relative aspect-square rounded-xl overflow-hidden border border-slate-100 group">
                  <img src={url} className="w-full h-full object-cover" alt="existing asset" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span style={{ color: 'white', fontSize: '8px', fontWeight: '900' }}>EXISTING</span>
                  </div>
                </div>
              ))}

              {/* 3. SHOW NEW UPLOADS (Live Preview) */}
              {imageFiles.map((file, idx) => (
                <div key={`new-${idx}`} className="relative aspect-square rounded-xl overflow-hidden border-2 border-teal-500 group">
                  <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" alt="new upload preview" />
                  <button 
                    type="button"
                    onClick={() => setImageFiles(prev => prev.filter((_, i) => i !== idx))}
                    className="absolute top-1 right-1 bg-rose-500 text-white rounded-full w-5 h-5 flex items-center justify-center shadow-lg"
                  >
                    <span style={{ fontSize: '12px', fontWeight: 'bold' }}>×</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
          
          {/* SECTION 3: SPECS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-50 p-8 rounded-[2rem] border-2 border-slate-100">
            <div style={{ textAlign: 'left' }} className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-slate-400"><Maximize2 size={14} /><label className="text-[10px] font-black uppercase tracking-widest">Lot Size</label></div>
              <input value={formData.lotSize} placeholder="m²" className="w-full p-4 bg-white border-2 border-slate-200 rounded-xl font-bold text-slate-900" onChange={(e) => setFormData({...formData, lotSize: e.target.value})} />
            </div>
            <div style={{ textAlign: 'left' }} className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-slate-400"><BedDouble size={14} /><label className="text-[10px] font-black uppercase tracking-widest">Bedrooms</label></div>
              <input value={formData.bedrooms} type="number" className="w-full p-4 bg-white border-2 border-slate-200 rounded-xl font-bold text-slate-900" onChange={(e) => setFormData({...formData, bedrooms: e.target.value})} />
            </div>
            <div style={{ textAlign: 'left' }} className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-slate-400"><Droplets size={14} /><label className="text-[10px] font-black uppercase tracking-widest">Bathrooms</label></div>
              <input value={formData.bathrooms} type="number" className="w-full p-4 bg-white border-2 border-slate-200 rounded-xl font-bold text-slate-900" onChange={(e) => setFormData({...formData, bathrooms: e.target.value})} />
            </div>
          </div>

          {/* NARRATIVE */}
          <div style={{ textAlign: 'left' }} className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-teal-600">Asset Provenance & Narrative</label>
            <textarea 
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-6 text-sm min-h-[150px] outline-none"
              placeholder="Villa History..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          {/* DEPLOYMENT */}
          <div className="bg-slate-900 p-10 rounded-[2.5rem] text-white space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div style={{ textAlign: 'left' }}>
                <label className="text-[9px] font-black uppercase tracking-widest text-teal-500">Starting Bid</label>
                <input value={formData.startingBid} type="number" className="w-full bg-transparent border-b-2 border-teal-800 outline-none font-black text-3xl pb-2 text-white" onChange={(e) => setFormData({...formData, startingBid: e.target.value})} />
              </div>
              <div style={{ textAlign: 'left' }}>
                <label className="text-[9px] font-black uppercase tracking-widest text-amber-500">Buy Now</label>
                <input value={formData.buyNowPrice} type="number" className="w-full bg-transparent border-b-2 border-amber-800 outline-none font-black text-3xl pb-2 text-amber-500" onChange={(e) => setFormData({...formData, buyNowPrice: e.target.value})} />
              </div>
              <div style={{ textAlign: 'left' }}>
                <label className="text-[9px] font-black uppercase tracking-widest text-rose-500">Reserve</label>
                <input value={formData.reservePrice} type="number" className="w-full bg-transparent border-b-2 border-rose-900 outline-none font-black text-3xl pb-2 text-rose-500" onChange={(e) => setFormData({...formData, reservePrice: e.target.value})} />
              </div>
            </div>
          </div>

          {/* SUBMIT */}
          <button 
            type="submit"
            disabled={loading}
            style={{
              width: '100%', backgroundColor: '#014d4e', color: '#ffffff', padding: '24px', borderRadius: '20px',
              fontSize: '14px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.25em', cursor: 'pointer'
            }}
          >
            {loading ? "Registering..." : (editId ? "Update Sanctuary Asset" : "Deploy Caribbean Asset")}
          </button>
        </form>
      </div>
    </div>
  );
}
