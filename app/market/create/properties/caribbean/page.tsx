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
  const [formData, setFormData] = useState<any>({
    title: "",
    imageUrls: [],
    propertyType: "General Asset",
    location: "",
    city: "",
    province: "",
    bedrooms: "",
    bathrooms: "",
    lotSize: "",
    saleMode: "Auction + Buy Now",
    description: "",
    category: "" // Will be populated by hydration
  });

  // 🎯 SMART UI LOGIC
  const category = formData.category?.toLowerCase() || '';
  const isProperty = category === 'property' || category === 'caribbean' || category === 'villas';
  
  const ui = {
    header: isProperty ? "The Caribbean Sanctuary" : "Sovereign Asset Intake",
    label: isProperty ? "Estate Name" : "Asset Title",
    typeLabel: isProperty ? "Property Type" : "Asset Classification",
    locationLabel: isProperty ? "Estate Location" : "Origin / Location"
  };

  // 💧 HYDRATION LOGIC
  useEffect(() => {
    if (!editId) return;
    const loadData = async () => {
      try {
        const snap = await getDoc(doc(db, "listings", editId));
        if (snap.exists()) {
          const data = snap.data();
          setFormData((prev: any) => ({ ...prev, ...data }));
        }
      } catch (e) { console.error(e); }
    };
    loadData();
  }, [editId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // ... (Keep your existing handleSubmit logic here)
    router.push("/market");
  };

  return (
    <div style={{ padding: '80px 40px', backgroundColor: '#f8f8f5', minHeight: '100vh' }}>
      
      {/* 🏙️ DYNAMIC HEADER */}
      <div style={{ marginBottom: '48px', borderLeft: '4px solid #014d4e', paddingLeft: '24px', textAlign: 'left' }}>
        <h1 style={{ fontSize: '42px', fontWeight: '900', color: '#0f172a', textTransform: 'uppercase' }}>
          {ui.header}
        </h1>
        <p style={{ color: '#64748b', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase' }}>
          {isProperty ? "Elite Vacation Estates" : "Global Trade Protocol Assets"}
        </p>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden" style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <form onSubmit={handleSubmit} className="p-12 space-y-10">
          
          {/* SECTION 1: IDENTITY */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div style={{ textAlign: 'left' }} className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">{ui.label}</label>
              <input value={formData.title} className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold" onChange={(e) => setFormData({...formData, title: e.target.value})} />
            </div>
            <div style={{ textAlign: 'left' }} className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">{ui.typeLabel}</label>
              <input value={formData.propertyType} className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold" onChange={(e) => setFormData({...formData, propertyType: e.target.value})} />
            </div>
          </div>

          {/* SECTION 2: LOCATION */}
          <div className="p-8 bg-slate-50 rounded-[2rem] border-2 border-slate-100 space-y-6">
             <label className="text-[10px] font-black uppercase tracking-widest text-teal-600 block text-left">{ui.locationLabel}</label>
             <input value={formData.location} placeholder="Address" className="w-full p-4 bg-white border-2 border-slate-200 rounded-xl font-bold" onChange={(e) => setFormData({...formData, location: e.target.value})} />
          </div>

          {/* SECTION 3: GALLERY (FIXED PREVIEW SIZES) */}
          <div style={{ textAlign: 'left' }} className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Media Assets</label>
            <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
              <label className="aspect-square bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center cursor-pointer">
                <Camera size={20} /><input type="file" multiple className="hidden" onChange={(e) => setImageFiles(Array.from(e.target.files || []))} />
              </label>
              {formData.imageUrls?.map((url: string, idx: number) => (
                <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-slate-100">
                  <img src={url} className="w-full h-full object-cover" alt="asset" />
                </div>
              ))}
            </div>
          </div>
          
          {/* SECTION 4: SPECS (ONLY SHOWS FOR PROPERTIES) */}
          {isProperty && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-50 p-8 rounded-[2rem] border-2 border-slate-100">
               {/* ... Keep your Bedroom/Bathroom/LotSize inputs here ... */}
            </div>
          )}

          {/* SUBMIT */}
          <button type="submit" style={{ width: '100%', backgroundColor: '#014d4e', color: '#fff', padding: '24px', borderRadius: '20px', fontWeight: '900', textTransform: 'uppercase' }}>
            {loading ? "Processing..." : (editId ? "Update Asset Authority" : "Deploy Asset")}
          </button>
        </form>
      </div>
    </div>
  );
}
