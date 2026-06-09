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
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { auth, db, storage } from "@/lib/firebase/client";
import { 
  Car, 
  ShieldCheck, 
  ArrowLeft, 
  Camera, 
  Gauge,
  Fingerprint,
  Anchor
} from "lucide-react";

const MOBILITY_CATEGORIES: Record<string, string[]> = {
  CARS: ["Sedan", "SUV", "Coupe", "Minivan", "Convertible", "Exotic - Luxury"],
  TRUCKS: ["Pickup", "Commercial - Fleet", "Semi-Trailer", "Box Truck", "Dump Truck", "Flatbed"],
  RVS: ["Class A", "Motorhome", "Camper Van"],
  MOTORCYCLES: ["Sport", "Cruiser", "Off-Road", "Scooter - Moped"],
  // ⚓ MARINE EXTENSION ARRIVAL
  MARINE: ["Center Console", "Luxury Yacht", "Catamaran / Sail", "Jet Ski / PWC", "Express Cruiser"]
};

// 1️⃣ THE WRAPPER
export default function MobilityCreatePage() {
  return (
    <Suspense fallback={
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8f8f5' }}>
        <p style={{ fontSize: '10px', fonttextKey: '900', textTransform: 'uppercase', letterSpacing: '0.4em', color: '#014d4e' }}>
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
  const { user } = useAuth();

  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [isDeleteLocked, setIsDeleteLocked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  
  // 🛡️ NEW STATE: Terms Agreement
  const [isAgreed, setIsAgreed] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    year: "",
    imageUrls: [] as string[],
    category: "mobility", 
    subCategory: "",
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
    assetClass: "Mobility/Global-Fleet",
    // ⚓ EXTRA STRUCTURAL DATA SLOTS FOR REIL-SAFE DATA BACKING
    lengthFeet: "",
    engineDetails: ""
  });
  
  // 💧 HYDRATION LOGIC: Loads data when you click the Pencil
  useEffect(() => {
    const loadAsset = async () => { 
      if (!editId) return;
      try {
        const docSnap = await getDoc(doc(db, "listings", editId));
        if (docSnap.exists()) {
          const data = docSnap.data();
          
          // 🎯 THE SYNC: Force LOWERCASE to match the Logic and Database IDs
          const dbCat = (data.category || data.mobilityType || "mobility").toLowerCase();
          
          setFormData(prev => ({
            ...prev,
            ...data,
            category: dbCat, 
            subCategory: data.subCategory || data.subcategory || ""
          } as any));
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

  // 🛡️ SYNCED DELETE LOGIC
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
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 🛡️ 1. AGREEMENT CHECK
    if (!isAgreed) return;

    const activeUser = user || auth.currentUser;
    
    if (!activeUser) {
      alert("Authentication required. Please log in again.");
      return;
    }

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
      
      let finalEndTime = new Date();
      finalEndTime.setDate(finalEndTime.getDate() + 7);
      let createdTimestamp: any = serverTimestamp();

     if (editId) {
        const docRef = doc(db, "listings", editId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const existingData = docSnap.data();
          
          // 🛡️ SECURITY SHIELD: Extract original owner tracking IDs
          const originalOwner = existingData.stewardID || existingData.userId || existingData.sellerId || existingData.merchantId;
          
          // If an owner exists and doesn't match the currently logged-in user, freeze the transaction instantly
          if (originalOwner && originalOwner !== activeUser.uid) {
            console.error("🚨 SECURITY BREACH DENIED: Unauthorized profile storefront modification attempt!");
            alert("Security Error: You do not have permission to modify or reassign this asset listing.");
            setLoading(false);
            return; // Halt execution completely
          }

          // Retain original tracking values to block storefront hijacking
          if (existingData.endTime) {
            finalEndTime = existingData.endTime;
          }
          if (existingData.createdAt) {
            createdTimestamp = existingData.createdAt;
          }
          
          // Force protect the initial owner ID assignment back into the incoming form data
          if (formData) {
            formData.stewardID = originalOwner || activeUser.uid;
            if (formData.userId) formData.userId = originalOwner || activeUser.uid;
          }
        }
      }

      // 🧬 2. DATA CLEANUP
      const listingData = {
        ...formData,
        userId: activeUser.uid,
        ownerId: activeUser.uid,
        merchantName: activeUser.displayName || "Bazaria Merchant",
        description: formData.description || "", 
        mileage: parseFloat(formData.mileage) || 0,
        reservePrice: parseFloat(formData.reservePrice) || 0,
        buyNowPrice: parseFloat(formData.buyNowPrice) || 0,
        startingBid: parseFloat(formData.startingBid) || 0,
        currentBid: parseFloat(formData.startingBid) || 0,
        imageUrls: finalImageUrls,
        imageUrl: finalImageUrls[0] || "",
        listingType: formData.startingBid ? "auction" : "buy-now",
        endTime: typeof finalEndTime === 'string' ? finalEndTime : finalEndTime.toISOString(),
        durationDays: "7",
        searchKeywords: `${formData.title} ${formData.category} ${formData.vin} ${formData.description}`.toLowerCase(),
        updatedAt: serverTimestamp(),
      };

      if (editId) {
        await updateDoc(doc(db, "listings", editId), {
          ...listingData,
          createdAt: createdTimestamp,
        });
      } else {
        await addDoc(collection(db, "listings"), {
          ...listingData,
          createdAt: createdTimestamp,
        });
      }
      
      router.push(`/storefront/${activeUser.uid}`);
    } catch (error) {
      console.error(error);
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

        {/* 🏙️ HEADER */}
        <div style={{ marginBottom: '48px', borderLeft: '4px solid #014d4e', paddingLeft: '24px', textAlign: 'left' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#014d4e', marginBottom: '8px' }}>
            {formData.category === 'marine' ? <Anchor size={14} /> : <Car size={14} />}
            <span style={{ fontSize: '9px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.4em' }}>
              {formData.category === 'marine' ? "Maritime Fleet Intake" : "Mobility Asset Intake"}
            </span>
          </div>
          <h1 style={{ fontSize: '42px', fontWeight: '900', color: '#0f172a', margin: '0', textTransform: 'uppercase', letterSpacing: '-0.02em' }}>
            The <span style={{ color: '#014d4e' }}>{formData.category === 'marine' ? "Maritime" : "Mobility"}</span> Engine
          </h1>
          <p style={{ color: '#64748b', fontSize: '11px', fontWeight: '700', marginTop: '8px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            {formData.category === 'marine' 
              ? "Coastal Registry, Marine Infrastructure, and Watercraft Dissemination" 
              : "Global Fleet Registration, Commercial Logistics, and Vehicle Deployment"}
          </p>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-12 space-y-10">
            
            {/* SECTION 1: IDENTITY & CLASSIFICATION */}
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div style={{ textAlign: 'left' }} className="md:col-span-2 flex flex-col gap-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Asset Title</label>
                  <input value={formData.title || ""} placeholder={formData.category === 'marine' ? "e.g. 2023 Boston Whaler 280 Dauntless" : "e.g. 2024 Porsche 911 Carrera"} className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-teal-500 font-bold text-slate-900" onChange={(e) => setFormData({...formData, title: e.target.value})} required />
                </div>
                <div style={{ textAlign: 'left' }} className="flex flex-col gap-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Model Year</label>
                  <input type="number" value={formData.year || ""} placeholder="YYYY" className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-teal-500 font-bold text-slate-900" onChange={(e) => setFormData({...formData, year: e.target.value})} required />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div style={{ textAlign: 'left' }} className="flex flex-col gap-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Asset Category</label>
                  <select 
                    value={formData.category} 
                    className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-slate-900" 
                    onChange={(e) => setFormData({...formData, category: e.target.value, subCategory: ''})}
                  >
                    <option value="">-- Select Category --</option>
                    <option value="mobility">Cars (Automobiles)</option>
                    <option value="ev">Electric Vehicles (EV)</option>
                    <option value="trucks">Trucks (Commercial & Pickup)</option>
                    <option value="motorcycles">Motorcycles</option>
                    <option value="rvs">RVs & Campers</option>
                    {/* ⚓ NEW MARINE VERTICAL DETECTED BY THE TAXONOMY ENGINE */}
                    <option value="marine">Boats & Watercraft (Marine)</option>
                  </select>
                </div>
              </div>

              <div style={{ textAlign: 'left' }} className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-teal-600 font-bold">Registry Sub-Group</label>
                <select value={formData.subCategory || ""} className="w-full p-4 bg-white border-2 border-teal-500 rounded-2xl font-bold text-slate-900 shadow-sm" onChange={(e) => setFormData({...formData, subCategory: e.target.value})} required>
                  <option value="">-- Select Specific Group --</option>
                  {formData.category === 'mobility' && (
                    <><option value="Sedan">Sedan</option><option value="Coupe">Coupe</option><option value="SUVs">SUVs</option><option value="Minivan">Minivan</option><option value="Convertible">Convertible</option><option value="exotic">Exotic - Luxury</option></>
                  )}
                  {formData.category === 'ev' && (
                    <><option value="EV Sedan">EV Sedan</option><option value="EV SUV">Electric SUV</option><option value="EV Performance">Performance/Hypercar</option><option value="EV Utility">Electric Utility</option></>
                  )}
                  {formData.category === 'trucks' && (
                    <><option value="Pickup">Pickup</option><option value="commercial/ Fleet">commercial/ Fleet</option><option value="semi-trailer">semi-trailer</option><option value="box truck">box truck</option><option value="dump truck">dump truck</option><option value="Flatbed">Flatbed</option></>
                  )}
                  {formData.category === 'motorcycles' && (
                    <><option value="Sport">Sport</option><option value="Cruiser">Cruiser</option><option value="off-road">off-road</option><option value="scooter/ Moped">scooter/ Moped</option></>
                  )}
                  {formData.category === 'rvs' && (
                    <><option value="Class A">Class A</option><option value="Class C">Class C</option><option value="Motorhome">Motorhome</option><option value="Travel Trailer">Travel Trailer</option><option value="Camper Van">Camper Van</option></>
                  )}
                  {/* ⚓ EXTENSION: INJECTED MARINE SUB-TAXONOMY OPTIONS */}
                  {formData.category === 'marine' && (
                    <><option value="Center Console">Center Console</option><option value="Luxury Yacht">Luxury Yacht</option><option value="Catamaran / Sail">Catamaran / Sail</option><option value="Jet Ski / PWC">Jet Ski / PWC</option><option value="Express Cruiser">Express Cruiser</option></>
                  )}
                </select>
              </div>

              {/* ⚓ EXTENSION: CONDITIONAL SPECIFICATION SUITE FOR MARINE ASSETS */}
              {formData.category === 'marine' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
                  {/* Length metrics input */}
                  <div style={{ textAlign: 'left' }} className="flex flex-col gap-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Length (Feet)</label>
                    <input 
                      type="number"
                      value={formData.lengthFeet || ""}
                      placeholder="e.g. 32"
                      className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-teal-500 font-bold text-slate-900 placeholder:text-slate-300"
                      onChange={(e) => setFormData({...formData, lengthFeet: e.target.value})}
                      required
                    />
                  </div>

                  {/* Propulsion architecture mechanics */}
                  <div style={{ textAlign: 'left' }} className="flex flex-col gap-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Engine Configuration & Hours</label>
                    <input 
                      type="text"
                      value={formData.engineDetails || ""}
                      placeholder="e.g. Twin Mercury 300s, 120hrs"
                      className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-teal-500 font-bold text-slate-900 placeholder:text-slate-300"
                      onChange={(e) => setFormData({...formData, engineDetails: e.target.value})}
                      required
                    />
                  </div>
                </div>
              )}

              {/* 🏎️ SECTION 1.5: MOBILITY REGISTRY (VIN vs. HIN) */}
              {['mobility', 'ev', 'trucks', 'motorcycles', 'rvs', 'marine'].includes(formData.category) && (
                <div className="mt-8 pt-8 border-t border-slate-100">
                  <div style={{ textAlign: 'left' }} className="flex flex-col gap-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-teal-600 font-bold">
                      {formData.category === 'marine' ? "Hull Identification Number (HIN / Legal Requirement)" : "VIN Identification (Legal Requirement)"}
                    </label>
                    <input 
                      value={formData.vin || ""} 
                      placeholder={formData.category === 'marine' ? "12-Character Craft HIN Number" : "17-Digit VIN Number"} 
                      className="w-full p-4 bg-white border-2 border-teal-500 rounded-2xl outline-none font-bold text-slate-900 shadow-sm" 
                      onChange={(e) => setFormData({...formData, vin: e.target.value.toUpperCase()})} 
                      required 
                    />
                  </div>
                </div>
              )}
            </div>

            {/* SECTION 2: GALLERY */}
            <div style={{ textAlign: 'left' }} className="space-y-4 mt-12">
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
                    <button type="button" onClick={() => RemoveNewImage(idx)} style={{ position: 'absolute', top: '5px', right: '5px', backgroundColor: '#014d4e', color: 'white', width: '22px', height: '22px', borderRadius: '50%', border: 'none', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', zIndex: 10 }}>×</button>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 3: SPECS */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-8 rounded-[2rem] border-2 border-slate-100">
              <div style={{ textAlign: 'left' }} className="flex flex-col gap-2">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    {formData.category === 'marine' ? "Propulsion Run Time (Engine Hours)" : "Usage Reading (Odometer)"}
                  </label>
                  
                  {/* Hide MI/KM metric toggle when marine is selected since vessels use absolute engine hours */}
                  {formData.category !== 'marine' && (
                    <div style={{ display: 'flex', backgroundColor: '#f1f5f9', padding: '4px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                      {["MI", "KM"].map((u) => (
                        <button
                          key={u}
                          type="button"
                          onClick={() => setFormData({ ...formData, mileageUnit: u })}
                          style={{
                            padding: '4px 12px',
                            borderRadius: '8px',
                            fontSize: '9px',
                            fontWeight: '900',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            backgroundColor: (formData.mileageUnit || "KM") === u ? '#014d4e' : 'transparent',
                            color: (formData.mileageUnit || "KM") === u ? '#ffffff' : '#94a3b8',
                          }}
                        >
                          {u}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <input 
                  type="number"
                  value={formData.mileage || ""} 
                  placeholder={formData.category === 'marine' ? "e.g. 150" : "0.00"} 
                  className="w-full p-4 bg-white border-2 border-slate-200 rounded-xl font-bold text-slate-900 outline-none focus:border-teal-500" 
                  onChange={(e) => setFormData({...formData, mileage: e.target.value})} 
                />
              </div>

              <div style={{ textAlign: 'left' }} className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-slate-400">
                  <ShieldCheck size={14} />
                  <label className="text-[10px] font-black uppercase tracking-widest">Condition</label>
                </div>
                <select 
                  value={formData.condition} 
                  className="w-full p-4 bg-white border-2 border-slate-200 rounded-xl font-bold text-slate-900 outline-none focus:border-teal-500" 
                  onChange={(e) => setFormData({...formData, condition: e.target.value})}
                >
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
              <textarea className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-6 text-sm min-h-[150px] outline-none" placeholder={formData.category === 'marine' ? "Describe hull status, maintenance timeline, upholstery details, electronics..." : "Features, history, maintenance..."} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
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

            {/* 🛡️ THE LINKED BAZARIA AUTHORITY CHECKBOX */}
            <div className="flex items-start gap-4 p-6 bg-slate-50 rounded-2xl border-2 border-slate-100 mt-6">
              <input 
                type="checkbox" 
                id="mobility-protocol-check"
                checked={isAgreed}
                onChange={(e) => setIsAgreed(e.target.checked)}
                required 
                className="w-5 h-5 mt-1 accent-[#014d4e] cursor-pointer" 
              />
              <label 
                htmlFor="mobility-protocol-check" 
                className="text-[11px] text-slate-500 font-semibold leading-relaxed text-left cursor-pointer select-none"
              >
                I hereby certify that this mobility asset is under my legal authority and complies with the 
                <span className="text-[#014d4e] font-black"> Bazaria Sovereign Protocol</span>.
              </label>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-col gap-4 mt-8">
              <button 
                type="submit" 
                disabled={loading || !isAgreed} 
                style={{ 
                  width: '100%', 
                  backgroundColor: isAgreed ? '#014d4e' : '#cbd5e1', 
                  color: '#ffffff', 
                  padding: '24px', 
                  borderRadius: '20px', 
                  fontSize: '14px', 
                  fontWeight: '900', 
                  textTransform: 'uppercase', 
                  letterSpacing: '0.25em', 
                  cursor: isAgreed ? 'pointer' : 'not-allowed',
                  transition: 'all 0.3s ease',
                  border: 'none'
                }}
              >
                {loading ? "Registering..." : !isAgreed ? "Awaiting Fleet Certification" : (editId ? "Update Fleet Asset" : "Deploy Mobility Asset")}
              </button>

              {editId && (
                <button 
                  type="button" 
                  onClick={handleDelete} 
                  disabled={isDeleteLocked} 
                  style={{ 
                    width: '100%', 
                    backgroundColor: isConfirmingDelete ? '#ef4444' : 'transparent', 
                    color: isConfirmingDelete ? '#ffffff' : '#ef4444', 
                    border: '1px solid #ef4444', 
                    padding: '16px', 
                    borderRadius: '20px', 
                    fontWeight: '900', 
                    textTransform: 'uppercase', 
                    cursor: isDeleteLocked ? 'not-allowed' : 'pointer' 
                  }}
                >
                  {isDeleteLocked ? "WAITING..." : isConfirmingDelete ? "⚠️ CONFIRM DELETE" : "Remove From Fleet"}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  function RemoveExistingImage(url: string) {
    handleRemoveExistingImage(url);
  }

  function RemoveNewImage(idx: number) {
    setImageFiles(prev => prev.filter((_, i) => i !== idx));
  }
}
