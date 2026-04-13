"use client";

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
  BedDouble, 
  ShieldCheck, 
  ArrowLeft, 
  Camera, 
  Home, 
  Maximize2, 
  Droplets,
  Building2 
} from "lucide-react";

// 1️⃣ THE WRAPPER
export default function ResidentialHomeCreate() {
  return (
    <Suspense fallback={
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8f8f5' }}>
        <p style={{ fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.4em', color: '#014d4e' }}>
          Initializing Residential Protocol...
        </p>
      </div>
    }>
      <ResidentialFormCore />
    </Suspense>
  );
}

// 2️⃣ THE CORE ENGINE
function ResidentialFormCore() {
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
    propertyType: "Single Family Home",
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
    isSanctuaryAsset: false,
    assetClass: "Residential/Standard-Market"
  });

  // 💧 HYDRATION LOGIC
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

  // 📸 IMAGE MANAGEMENT LOGIC (The logic we built tonight)
  const handleRemoveExistingImage = (urlToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      imageUrls: prev.imageUrls.filter(url => url !== urlToRemove)
    }));
  };

  const handleRemoveNewImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  // 🛡️ FULL ASSET DELETION (Including Storage cleanup)
  const handleDelete = async () => {
    if (!editId || isDeleteLocked) return;

    if (!isConfirmingDelete) {
      setIsConfirmingDelete(true);
      setIsDeleteLocked(true);
      setTimeout(() => setIsDeleteLocked(false), 1500);
      setTimeout(() => {
        setIsConfirmingDelete(false);
        setIsDeleteLocked(false);
      }, 5000);
      return;
    }

    try {
      setLoading(true);
      // Clean up images in storage first
      if (formData.imageUrls && formData.imageUrls.length > 0) {
        for (const url of formData.imageUrls) {
          try {
            const imageRef = ref(storage, url);
            await deleteObject(imageRef);
          } catch (e) { console.warn("Image delete skip:", e); }
        }
      }
      await deleteDoc(doc(db, "listings", editId));
      router.push("/market");
    } catch (error) {
      console.error("Deletion Error:", error);
      setIsConfirmingDelete(false);
      setIsDeleteLocked(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Upload New Images
      const uploadedUrls = [];
      for (const file of imageFiles) {
        const storageRef = ref(storage, `listings/${Date.now()}-${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        const url = await getDownloadURL(snapshot.ref);
        uploadedUrls.push(url);
      }

      const finalImageUrls = [...(formData.imageUrls || []), ...uploadedUrls];
      const bnp = Number(formData.buyNowPrice) || 0;
      const sbd = Number(formData.startingBid) || 0;
      const isFixedPrice = sbd === 0 && bnp > 0;

    const listingData = {
        ...formData,
        // 🎯 CATEGORY & SUBCAT
        category: "homes", 
        subcategory: formData.propertyType?.toLowerCase() || "single family", 
        
        // 🎯 THE FIREWALL (Add these explicitly to override formData)
        isCaribbean: false,
        isSanctuaryAsset: false,
        assetClass: "Residential/Standard-Market",
        
        imageUrls: finalImageUrls,
        imageUrl: finalImageUrls[0] || "",
        price: isFixedPrice ? bnp : sbd, 
        buyNowPrice: bnp,
        startingBid: sbd,
        currentBid: sbd, 
        reservePrice: Number(formData.reservePrice) || 0,
        bedrooms: Number(formData.bedrooms) || 0,
        bathrooms: Number(formData.bathrooms) || 0,
        lotSize: Number(formData.lotSize) || 0,
        saleMode: isFixedPrice ? "Fixed Price" : "Auction + Buy Now", 
        updatedAt: serverTimestamp(),
        status: "active",
      };

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
      console.error("Sovereign Deployment Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '80px 40px', backgroundColor: '#f8f8f5', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      <div style={{ width: '100%', maxWidth: '1000px' }}>
        
        {/* Navigation */}
        <button 
          onClick={() => router.push('/market/create/properties')} 
          style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '32px', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.2em' }}
        >
          <ArrowLeft size={16} /> Property Portal
        </button>

        {/* 🏙️ HEADER - Centered Alignment */}
        <div style={{ marginBottom: '48px', borderLeft: '4px solid #0f172a', paddingLeft: '24px', textAlign: 'left' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0f172a', marginBottom: '8px' }}>
            <Home size={14} />
            <span style={{ fontSize: '9px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.4em' }}>
              Residential Asset Intake
            </span>
          </div>
          <h1 style={{ fontSize: '42px', fontWeight: '900', color: '#0f172a', margin: '0', textTransform: 'uppercase', letterSpacing: '-0.02em' }}>
            The <span style={{ color: '#64748b' }}>Residential</span> Portal
          </h1>
          <p style={{ color: '#64748b', fontSize: '11px', fontWeight: '700', marginTop: '8px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Standard Housing, Condominiums, and Domestic Estate Management
          </p>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-12 space-y-10">
            
            {/* SECTION 1: IDENTITY */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
  {/* Left Column: Title */}
  <div style={{ textAlign: 'left' }} className="flex flex-col gap-2">
    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Property Title</label>
    <input 
      value={formData.title} 
      placeholder="e.g. Modern Downtown Loft" 
      className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-slate-500 font-bold text-slate-900" 
      onChange={(e) => setFormData({...formData, title: e.target.value})} 
      required 
    />
  </div>

  {/* Right Column: Classification (The Fix) */}
  <div style={{ textAlign: 'left' }} className="flex flex-col gap-2">
    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Classification</label>
    <select 
      value={formData.propertyType} 
      className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-slate-900" 
      onChange={(e) => setFormData({...formData, propertyType: e.target.value})}
    >
      {/* 🎯 Explicit values here ensure the database gets the right string, not the old ghost data */}
      <option value="single family">Single Family Home</option>
      <option value="condo">Condominium</option>
      <option value="townhouse">Townhouse</option>
      <option value="apartment">Luxury Apartment</option>
    </select>
  </div>
</div>
            {/* SECTION 2: LOCATION */}
            <div className="p-8 bg-slate-50 rounded-[2rem] border-2 border-slate-100 space-y-6">
               <div style={{ textAlign: 'left' }} className="flex flex-col gap-2">
                 <label className="text-[10px] font-black uppercase tracking-widest text-slate-900 italic">Physical Location</label>
                  <input value={formData.location} placeholder="Street Address" className="w-full p-4 bg-white border-2 border-slate-200 rounded-xl font-bold text-slate-900" onChange={(e) => setFormData({...formData, location: e.target.value})} />
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <input value={formData.city} placeholder="City" className="w-full p-4 bg-white border-2 border-slate-200 rounded-xl font-bold text-slate-900" onChange={(e) => setFormData({...formData, city: e.target.value})} />
                  <input value={formData.province} placeholder="Province" className="w-full p-4 bg-white border-2 border-slate-200 rounded-xl font-bold text-slate-900" onChange={(e) => setFormData({...formData, province: e.target.value})} />
               </div>
            </div>

            {/* SECTION 3: GALLERY (Restored Full Logic) */}
            <div style={{ textAlign: 'left' }} className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Property Gallery</label>
              <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
                <label className="aspect-square bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-slate-900 transition-all text-slate-400 group">
                  <Camera size={20} className="group-hover:text-slate-900" />
                  <span style={{ fontSize: '8px', marginTop: '4px', fontWeight: '900' }}>ADD</span>
                  <input type="file" multiple accept="image/*" className="hidden" onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    setImageFiles((prev) => [...prev, ...files].slice(0, 8));
                  }} />
                </label>

                {/* Existing Images from Firebase */}
                {formData.imageUrls?.map((url, idx) => (
                  <div key={`existing-${idx}`} style={{ position: 'relative', aspectRatio: '1/1', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                    <img src={url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="asset" />
                    <button 
                      type="button" 
                      onClick={() => handleRemoveExistingImage(url)} 
                      style={{ position: 'absolute', top: '5px', right: '5px', backgroundColor: '#ef4444', color: 'white', width: '22px', height: '22px', borderRadius: '50%', border: 'none', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', zIndex: 10 }}
                    >×</button>
                  </div>
                ))}

                {/* New Live Previews */}
                {imageFiles.map((file, idx) => (
                  <div key={`new-${idx}`} style={{ position: 'relative', aspectRatio: '1/1', borderRadius: '12px', overflow: 'hidden', border: '2px solid #64748b' }}>
                    <img src={URL.createObjectURL(file)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="preview" />
                    <button 
                      type="button" 
                      onClick={() => handleRemoveNewImage(idx)} 
                      style={{ position: 'absolute', top: '5px', right: '5px', backgroundColor: '#64748b', color: 'white', width: '22px', height: '22px', borderRadius: '50%', border: 'none', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', zIndex: 10 }}
                    >×</button>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 4: SPECS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-50 p-8 rounded-[2rem] border-2 border-slate-100">
              <div style={{ textAlign: 'left' }} className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-slate-400"><Maximize2 size={14} /><label className="text-[10px] font-black uppercase tracking-widest">Sq Ft</label></div>
                <input value={formData.lotSize} placeholder="sq ft" className="w-full p-4 bg-white border-2 border-slate-200 rounded-xl font-bold text-slate-900" onChange={(e) => setFormData({...formData, lotSize: e.target.value})} />
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
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900">Property Narrative</label>
              <textarea className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-6 text-sm min-h-[150px] outline-none" placeholder="Home features..." value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
            </div>

            {/* DEPLOYMENT BLOCK */}
            <div className="bg-slate-900 p-10 rounded-[2.5rem] text-white space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div style={{ textAlign: 'left' }}>
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Starting Bid</label>
                  <input value={formData.startingBid} type="number" className="w-full bg-transparent border-b-2 border-slate-800 outline-none font-black text-3xl pb-2 text-white" onChange={(e) => setFormData({...formData, startingBid: e.target.value})} />
                </div>
                <div style={{ textAlign: 'left' }}>
                  <label className="text-[9px] font-black uppercase tracking-widest text-amber-500">Buy Now</label>
                  <input value={formData.buyNowPrice} type="number" className="w-full bg-transparent border-b-2 border-amber-800 outline-none font-black text-3xl pb-2 text-amber-500" onChange={(e) => setFormData({...formData, buyNowPrice: e.target.value})} />
                </div>
                <div style={{ textAlign: 'left' }}>
                  <label className="text-[9px] font-black uppercase tracking-widest text-rose-500">Reserve</label>
                  <input value={formData.reservePrice} type="number" className="w-full bg-transparent border-b-2 border-rose-950 outline-none font-black text-3xl pb-2 text-rose-500" onChange={(e) => setFormData({...formData, reservePrice: e.target.value})} />
                </div>
              </div>
            </div>

            {/* 🎯 BAZARIA AUTHORITY CHECKBOX */}
            <div className="flex items-start gap-4 p-6 bg-slate-50 rounded-2xl border border-slate-200">
              <input type="checkbox" required className="w-5 h-5 mt-1 accent-slate-900 cursor-pointer" />
              <p className="text-[11px] text-slate-500 font-semibold leading-relaxed text-left">
                I hereby certify that this asset is under my legal authority and complies with the 
                <span className="text-slate-900 font-black"> Bazaria Sovereign Protocol</span>. 
              </p>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-col gap-4">
              <button 
                type="submit" 
                disabled={loading} 
                style={{ width: '100%', backgroundColor: '#0f172a', color: '#ffffff', padding: '24px', borderRadius: '20px', fontSize: '14px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.25em', cursor: 'pointer' }}
              >
                {loading ? "Registering..." : (editId ? "Update Property" : "Deploy Residential Asset")}
              </button>

              {editId && (
                <button 
                  type="button" 
                  onClick={handleDelete} 
                  disabled={isDeleteLocked} 
                  style={{ width: '100%', backgroundColor: isConfirmingDelete ? '#ef4444' : 'transparent', color: isConfirmingDelete ? '#ffffff' : '#ef4444', border: '1px solid #ef4444', padding: '16px', borderRadius: '20px', fontWeight: '900', textTransform: 'uppercase', cursor: isDeleteLocked ? 'not-allowed' : 'pointer', transition: 'all 0.3s ease' }}
                >
                  {isDeleteLocked ? "WAITING..." : isConfirmingDelete ? "⚠️ CONFIRM DELETE" : "Delete Property Permanently"}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
