
"use client";

import { useState, useEffect, Suspense } from "react";
import { db, storage } from "@/lib/firebase/client";
import { doc, getDoc, collection, addDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  Waves, 
  ArrowLeft, 
  ShieldCheck, 
  Camera, 
  BedDouble, 
  Droplets, 
  Maximize2,
  MapPin,
  Gavel,
  ShoppingBag
} from "lucide-react";

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

function CaribbeanFormCore() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('edit');
  const [loading, setLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  
  const [formData, setFormData] = useState<any>({
    title: "", imageUrls: [], propertyType: "Elite Estate",
    location: "", city: "Santo Domingo", province: "Dominican Republic", zipCode: "",
    bedrooms: "", bathrooms: "", lotSize: "", 
    saleMode: "Auction", startingBid: "", buyNowPrice: "",
    description: "", category: "Caribbean", isSanctuaryAsset: true
  });

  // 🎯 SMART UI LOGIC (For Cars/Cats/Villas)
  const isProperty = formData.category?.toLowerCase() === 'caribbean' || formData.category?.toLowerCase() === 'property';

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
    try {
      let uploadedUrls = [];
      for (const file of imageFiles) {
        const fileRef = ref(storage, `sanctuary/${Date.now()}_${file.name}`);
        const snap = await uploadBytes(fileRef, file);
        const url = await getDownloadURL(snap.ref);
        uploadedUrls.push(url);
      }
      const finalData = { 
        ...formData, 
        imageUrls: [...(formData.imageUrls || []), ...uploadedUrls],
        imageUrl: uploadedUrls[0] || formData.imageUrls[0] || "",
        price: formData.saleMode === "Auction" ? Number(formData.startingBid) : Number(formData.buyNowPrice),
        updatedAt: serverTimestamp() 
      };
      if (editId) await updateDoc(doc(db, "listings", editId), finalData);
      else await addDoc(collection(db, "listings"), { ...finalData, createdAt: serverTimestamp() });
      router.push("/market");
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  return (
    <div style={{ padding: '60px 40px 140px 80px', backgroundColor: '#f8f8f5', minHeight: '100vh', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ maxWidth: '900px', width: '100%' }}>
        
        {/* Navigation */}
        <button 
          onClick={() => router.push('/market')} 
          style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '32px', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.2em' }}
        >
          <ArrowLeft size={16} /> Back to Gateway
        </button>

        {/* 🏙️ HEADER (Mobility Style) */}
        <div style={{ marginBottom: '48px', borderLeft: '4px solid #014d4e', paddingLeft: '24px', textAlign: 'left' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#014d4e', marginBottom: '8px' }}>
            <Waves size={14} />
            <span style={{ fontSize: '9px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.4em' }}>
              International Intake Protocol
            </span>
          </div>
          <h1 style={{ fontSize: '42px', fontWeight: '900', color: '#0f172a', margin: '0', textTransform: 'uppercase', letterSpacing: '-0.02em' }}>
            {isProperty ? (<>Caribbean <span style={{ color: '#014d4e' }}>Sanctuary</span></>) : (<>Sovereign <span style={{ color: '#014d4e' }}>Asset</span></>)}
          </h1>
          <p style={{ color: '#64748b', fontSize: '11px', fontWeight: '700', marginTop: '8px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            {isProperty ? "Elite Vacation Estates & Logistics Deployment" : "Global Trade Registry & High-Authority Intake"}
          </p>
        </div>

        {/* 📄 FORM CARD */}
        <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-12 space-y-10">
            
            {/* SECTION 1: IDENTITY */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div style={{ textAlign: 'left' }} className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">{isProperty ? "Estate Name" : "Asset Title"}</label>
                <input value={formData.title} placeholder={isProperty ? "e.g. Villa Mariposa" : "Asset Description"} className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-teal-500 font-bold text-slate-900" onChange={(e) => setFormData({...formData, title: e.target.value})} required />
              </div>
              <div style={{ textAlign: 'left' }} className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Classification</label>
                <input value={formData.propertyType} placeholder="e.g. Oceanfront / Exotic" className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-slate-900" onChange={(e) => setFormData({...formData, propertyType: e.target.value})} />
              </div>
            </div>

            {/* SECTION 2: LOCATION & SORTING */}
            <div className="p-8 bg-slate-50 rounded-[2rem] border-2 border-slate-100 space-y-6">
              <label className="text-[10px] font-black uppercase tracking-widest text-teal-600 block text-left">Location Protocol (Radius Sync)</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input value={formData.location} placeholder="Street Address" className="w-full p-4 bg-white border-2 border-slate-200 rounded-xl font-bold" onChange={(e) => setFormData({...formData, location: e.target.value})} />
                <input value={formData.zipCode} placeholder="Zip / Postal Code" className="w-full p-4 bg-white border-2 border-slate-200 rounded-xl font-bold" onChange={(e) => setFormData({...formData, zipCode: e.target.value})} />
              </div>
            </div>

            {/* SECTION 3: MEDIA */}
            <div style={{ textAlign: 'left' }} className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Asset Gallery</label>
              <div className="flex gap-4 flex-wrap">
                <label style={{ width: '100px', height: '100px', background: '#f8fafc', border: '2px dashed #e2e8f0', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <Camera size={24} color="#94a3b8" />
                  <input type="file" multiple className="hidden" onChange={(e) => setImageFiles(Array.from(e.target.files || []))} />
                </label>
                {formData.imageUrls?.map((url: string, i: number) => (
                  <img key={i} src={url} style={{ width: '100px', height: '100px', borderRadius: '20px', objectFit: 'cover' }} />
                ))}
              </div>
            </div>

            {/* SECTION 4: PROPERTY SPECS (Only if it's a Villa) */}
            {isProperty && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-50">
                <div style={{ textAlign: 'left' }} className="flex flex-col gap-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Bedrooms</label>
                  <input value={formData.bedrooms} type="number" className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-xl font-bold" onChange={(e) => setFormData({...formData, bedrooms: e.target.value})} />
                </div>
                <div style={{ textAlign: 'left' }} className="flex flex-col gap-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Bathrooms</label>
                  <input value={formData.bathrooms} type="number" className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-xl font-bold" onChange={(e) => setFormData({...formData, bathrooms: e.target.value})} />
                </div>
                <div style={{ textAlign: 'left' }} className="flex flex-col gap-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Lot Size (m²)</label>
                  <input value={formData.lotSize} className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-xl font-bold" onChange={(e) => setFormData({...formData, lotSize: e.target.value})} />
                </div>
              </div>
            )}

            {/* SECTION 5: NARRATIVE */}
            <div style={{ textAlign: 'left' }} className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Provenance & Narrative</label>
              <textarea value={formData.description} rows={4} className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold" onChange={(e) => setFormData({...formData, description: e.target.value})} />
            </div>

            {/* SECTION 6: DEPLOYMENT MODE */}
            <div className="space-y-6 bg-slate-50 p-8 rounded-[2rem] border-2 border-slate-100">
              <div style={{ textAlign: 'left' }} className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Deployment Strategy</label>
                <div style={{ backgroundColor: '#ffffff', border: '2px solid #e2e8f0' }} className="flex p-1 rounded-2xl">
                  {["Auction", "Fixed"].map((mode) => (
                    <button
                      key={mode} type="button"
                      onClick={() => setFormData({...formData, saleMode: mode})}
                      style={{ backgroundColor: formData.saleMode === mode ? '#014d4e' : 'transparent', color: formData.saleMode === mode ? '#ffffff' : '#94a3b8' }}
                      className="flex-1 py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all cursor-pointer border-none"
                    >
                      {mode === "Auction" ? <><Gavel size={14} /> Live Auction</> : <><ShoppingBag size={14} /> Buy Now</>}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div style={{ textAlign: 'left' }}>
                  <label className="text-[9px] font-black uppercase tracking-widest text-teal-600 italic">Starting Bid / Reserve</label>
                  <input value={formData.startingBid} type="number" className="w-full p-4 bg-white border-2 border-teal-100 rounded-2xl font-bold text-2xl" onChange={(e) => setFormData({...formData, startingBid: e.target.value})} />
                </div>
                <div style={{ textAlign: 'left' }}>
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Buy Now Price (Optional)</label>
                  <input value={formData.buyNowPrice} type="number" className="w-full p-4 bg-white border-2 border-slate-100 rounded-2xl font-bold text-2xl" onChange={(e) => setFormData({...formData, buyNowPrice: e.target.value})} />
                </div>
              </div>
            </div>

            {/* SECTION 7: PROTOCOL RULES */}
            <div style={{ textAlign: 'left' }} className="space-y-4 bg-rose-50 p-8 rounded-[2rem] border-2 border-rose-100">
              <div className="flex items-start gap-4">
                <ShieldCheck size={24} style={{ color: '#e11d48' }} />
                <div>
                  <h3 className="text-[11px] font-black uppercase tracking-widest text-rose-900">Sanctuary Authority Protocol</h3>
                  <p className="text-[10px] font-bold text-rose-800 mt-2">I certify that this asset matches the description provided and I acknowledge the 3-day market cycle deployment rule.</p>
                </div>
              </div>
              <label className="flex items-center gap-3 bg-white p-5 rounded-xl border border-rose-200 cursor-pointer">
                <input type="checkbox" required className="w-5 h-5 rounded border-rose-300 text-rose-600" />
                <span className="text-[10px] font-black uppercase tracking-widest text-rose-900">Acknowledge Authority Protocol</span>
              </label>
            </div>

            <button type="submit" disabled={loading} style={{ width: '100%', backgroundColor: '#014d4e', color: '#ffffff', padding: '24px', borderRadius: '20px', fontSize: '14px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.25em', cursor: 'pointer', border: 'none', boxShadow: '0 20px 40px -10px rgba(1, 77, 78, 0.4)' }}>
              {loading ? "COMMENCING DEPLOYMENT..." : (editId ? "Update Authority Protocol" : "Deploy Sanctuary Asset")}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
