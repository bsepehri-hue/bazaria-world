"use client";

import { 
  doc, 
  getDoc, 
  deleteDoc, // Added from your 1st line
  collection, 
  addDoc, 
  serverTimestamp, 
  updateDoc 
} from "firebase/firestore";

import { useState, useEffect, Suspense } from "react";
import { db, storage } from "@/lib/firebase/client";
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

  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [isDeleteLocked, setIsDeleteLocked] = useState(false);
 
const handleDelete = async () => {
  if (!editId || isDeleteLocked) return; // Prevent any action if locked

  if (!isConfirmingDelete) {
    setIsConfirmingDelete(true);
    setIsDeleteLocked(true); // 🔒 LOCK THE BUTTON

    // Unlock the button after 1.5 seconds so they can actually confirm
    setTimeout(() => setIsDeleteLocked(false), 1500);

    // Reset everything if they don't click again within 5 seconds
    setTimeout(() => {
      setIsConfirmingDelete(false);
      setIsDeleteLocked(false);
    }, 5000);
    return;
  }

  // Final Action (only reachable after the 1.5s lockout is over)
  try {
    await deleteDoc(doc(db, "listings", editId));
    router.push("/market");
  } catch (error) {
    console.error("Deletion Error:", error);
    setIsConfirmingDelete(false);
    setIsDeleteLocked(false);
  }
};
  
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

    try {
      // 📸 Handle Image URL Merge
      const finalImageUrls = [...(formData.imageUrls || [])];
      
      // 💰 1. CALCULATE THE VALUES
      const bnp = Number(formData.buyNowPrice) || 0;
      const sbd = Number(formData.startingBid) || 0;
      const res = Number(formData.reservePrice) || 0;

      // 💡 THE LOGIC: If Starting Bid is 0, it's a Fixed Price listing.
      const isFixedPrice = sbd === 0 && bnp > 0;

     // 🎯 2. ASSEMBLE THE PAYLOAD
const listingData = {
  ...formData,
  category: "Sanctuary",
  // 🏝️ ADD THIS: This is likely what the Portfolio Page is filtering for
  propertyTier: "caribbean", 
  
  // 📍 Ensure location is strictly set to "Caribbean" if the page filters by region
  // You can move the user's specific address to a 'streetAddress' field if needed
  location: "Caribbean", 
  
  imageUrls: finalImageUrls,
  imageUrl: finalImageUrls[0] || "",
  
  // ... rest of your price logic
};
        
        // 💰 MASTER PRICE (What the Card Sees)
        // If it's fixed, show Buy Now. If it's an auction, show Starting Bid.
        price: isFixedPrice ? bnp : sbd, 
        
        // 🏗️ SYNC ALL DATABASE FIELDS
        buyNowPrice: bnp,
        startingBid: sbd,
        currentBid: sbd, 
        reservePrice: res,
        
        // 📐 TECHNICAL SPECS (Numbers only)
        bedrooms: Number(formData.bedrooms) || 0,
        bathrooms: Number(formData.bathrooms) || 0,
        lotSize: Number(formData.lotSize) || 0,
        
        // 🛡️ MODE DETECTION
        saleMode: isFixedPrice ? "Fixed Price" : "Auction + Buy Now", 
        
        updatedAt: serverTimestamp(),
        status: "active",
      };

      // 🚀 3. THE FIREBASE ENGINE
      if (editId) {
        await updateDoc(doc(db, "listings", editId), listingData);
        console.log("SUCCESS: Villa Authority Updated!");
      } else {
        await addDoc(collection(db, "listings"), {
          ...listingData,
          createdAt: serverTimestamp(),
        });
        console.log("SUCCESS: New Villa Deployed!");
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
      
     {/* 🎯 NAVIGATION - Wrapped to align with the Header and Form */}
<div style={{ maxWidth: '1000px', margin: '0 auto' }}>
  <button 
    onClick={() => router.push('/market/create/properties')} 
    style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: '8px', 
      color: '#94a3b8', 
      background: 'none', 
      border: 'none', 
      cursor: 'pointer', 
      marginBottom: '32px', 
      fontSize: '10px', 
      fontWeight: '900', 
      textTransform: 'uppercase', 
      letterSpacing: '0.2em' 
    }}
  >
    <ArrowLeft size={16} /> Sanctuary Gateway
  </button>
</div>

    {/* 🏙️ HEADER - Aligned and Centered with the Form */}
<div style={{ maxWidth: '1000px', margin: '0 auto 48px auto', width: '100%' }}>
  <div style={{ borderLeft: '4px solid #014d4e', paddingLeft: '24px', textAlign: 'left' }}>
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
  <div 
    key={`existing-${idx}`} 
    style={{ 
      position: 'relative', 
      aspectRatio: '1/1', 
      borderRadius: '12px', 
      overflow: 'hidden', 
      border: '1px solid #e2e8f0',
      backgroundColor: '#0f172a' 
    }}
  >
    <img 
      src={url} 
      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
      alt="asset" 
    />
    
    {/* 🎯 FORCED RED BUTTON - NO TAILWIND CLASSES */}
    <button 
      type="button"
      onClick={(e) => {
        e.preventDefault();
        const updatedUrls = formData.imageUrls.filter((_, i) => i !== idx);
        setFormData({ ...formData, imageUrls: updatedUrls });
      }}
      style={{ 
        position: 'absolute',
        top: '8px',
        right: '8px',
        backgroundColor: '#ef4444', // 🔴 Forced Red
        color: 'white',
        width: '28px',
        height: '28px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '2px solid white',
        cursor: 'pointer',
        zIndex: 99, // 🛡️ Above everything
        opacity: 1, // 🛡️ Forced visibility
        boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
        padding: 0,
        fontWeight: 'bold',
        fontSize: '16px'
      }}
    >
      ×
    </button>

    <div style={{
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      color: 'white',
      fontSize: '8px',
      textAlign: 'center',
      padding: '2px 0',
      fontWeight: '900',
      pointerEvents: 'none'
    }}>
      EXISTING
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
  </div> {/* 🎯 Correctly closes the Grid */}
</div> {/* 🎯 Correctly closes Section 3 Container */}
          
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

{/* 🎯 THE BAZARIA AUTHORITY CHECKBOX */}
<div className="flex items-start gap-4 p-6 bg-slate-50 rounded-2xl border border-slate-200 mt-6">
  <input 
    type="checkbox" 
    required 
    className="w-5 h-5 mt-1 accent-[#014d4e] cursor-pointer" 
  />
  <p className="text-[11px] text-slate-500 font-semibold leading-relaxed text-left">
    I hereby certify that this asset is under my legal authority and complies with the 
    <span className="text-[#014d4e] font-black"> Bazaria Sovereign Protocol</span>. 
    I understand that fraudulent listings will result in permanent suspension from the living economy.
  </p>
</div>
          
          {/* ACTION BUTTONS */}
          <div className="flex flex-col gap-4 mt-8">
            {/* SUBMIT BUTTON */}
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

            {/* DELETE BUTTON - Only shows when editing existing assets */}
           {editId && (
  <button 
    type="button"
    onClick={handleDelete}
    disabled={isDeleteLocked} // 🎯 THIS IS THE KEY
    style={{ 
      width: '100%',
      backgroundColor: isConfirmingDelete ? '#ef4444' : 'transparent', 
      color: isConfirmingDelete ? '#ffffff' : '#ef4444', 
      border: '1px solid #ef4444',
      padding: '16px',
      borderRadius: '20px',
      fontWeight: '900',
      textTransform: 'uppercase',
      cursor: isDeleteLocked ? 'not-allowed' : 'pointer', 
      transition: 'all 0.3s ease',
      marginTop: '15px',
      opacity: isDeleteLocked ? 0.6 : 1 // Dim it slightly while locked
    }}
  >
    {isDeleteLocked 
      ? "WAITING..." 
      : isConfirmingDelete 
        ? "⚠️ CONFIRM PERMANENT DELETE" 
        : "Delete Asset Permanently"}
  </button>
)}
          </div>
        </form>
      </div>
    </div>
  );
}
