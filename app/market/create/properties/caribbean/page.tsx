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
  ChevronRight,
  Gavel,
  ShoppingBag
} from "lucide-react";

export default function SanctuaryCaribbeanCreate() {
  return (
    <Suspense fallback={<div style={{ padding: '100px', textAlign: 'center' }}>Initializing Protocol...</div>}>
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
    title: "", imageUrls: [], propertyType: "Oceanfront Villa",
    location: "", city: "Santo Domingo", province: "Dominican Republic", zipCode: "",
    bedrooms: "", bathrooms: "", lotSize: "", 
    saleMode: "Auction", startingBid: "", buyNowPrice: "",
    description: "", category: "Caribbean"
  });

  const isProperty = formData.category?.toLowerCase() === 'caribbean' || formData.category?.toLowerCase() === 'property';

  useEffect(() => {
    if (!editId) return;
    const loadData = async () => {
      try {
        const snap = await getDoc(doc(db, "listings", editId));
        if (snap.exists()) setFormData((prev: any) => ({ ...prev, ...snap.data() }));
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
        price: Number(formData.startingBid) || Number(formData.buyNowPrice) || 0,
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
        
        <button 
          onClick={() => router.back()} 
          style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '32px', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.2em' }}
        >
          <ArrowLeft size={16} /> Back to Gateway
        </button>

        <div style={{ marginBottom: '48px', borderLeft: '4px solid #014d4e', paddingLeft: '24px', textAlign: 'left' }}>
          <div className="flex items-center gap-2 text-[#014d4e] mb-2">
            <Waves size={14} />
            <span className="text-[9px] font-black uppercase tracking-[0.4em]">Asset Intake Protocol</span>
          </div>
          <h1 className="text-[42px] font-black text-slate-900 m-0 uppercase tracking-tighter">
            {isProperty ? (<>Caribbean <span className="text-[#014d4e]">Sanctuary</span></>) : (<>Sovereign <span className="text-[#014d4e]">Asset</span></>)}
          </h1>
          <p className="text-[#64748b] text-[11px] font-bold mt-2 uppercase tracking-widest">
            Elite Vacation Estates & International Asset Deployment
          </p>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-12 space-y-10">
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1 flex flex-col gap-2 text-left">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">{isProperty ? "Estate Name" : "Asset Title"}</label>
                <input value={formData.title} className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold" onChange={(e) => setFormData({...formData, title: e.target.value})} required />
              </div>
              <div className="flex flex-col gap-2 text-left">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Classification</label>
                <input value={formData.propertyType} className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold" onChange={(e) => setFormData({...formData, propertyType: e.target.value})} />
              </div>
              <div className="flex flex-col gap-2 text-left">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">City / Region</label>
                <input value={formData.city} className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold" onChange={(e) => setFormData({...formData, city: e.target.value})} />
              </div>
            </div>

            <div className="space-y-2 text-left">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Condition Narrative & History</label>
              <textarea rows={4} value={formData.description} className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold" onChange={(e) => setFormData({...formData, description: e.target.value})} />
            </div>

            <div className="space-y-4 text-left">
               <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Gallery Presentation</label>
               <div className="flex gap-4 flex-wrap">
                  <label className="w-20 h-20 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-[#014d4e]">
                    <Camera size={20} className="text-slate-400" />
                    <span className="text-[8px] mt-1 font-black text-slate-400">ADD</span>
                    <input type="file" multiple className="hidden" onChange={(e) => setImageFiles(Array.from(e.target.files || []))} />
                  </label>
                  {formData.imageUrls?.map((url: string, i: number) => (
                    <img key={i} src={url} className="w-20 h-20 rounded-xl object-cover" />
                  ))}
               </div>
            </div>

            <div className="space-y-6 bg-slate-50 p-8 rounded-[2rem] border-2 border-slate-100">
              <div className="flex flex-col gap-2 text-left">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Deployment Mode</label>
                <div className="flex p-1 bg-white border-2 border-slate-100 rounded-2xl">
                  {["Fixed", "Auction"].map((mode) => (
                    <button
                      key={mode} type="button"
                      onClick={() => setFormData({...formData, saleMode: mode})}
                      style={{ backgroundColor: formData.saleMode === mode ? '#014d4e' : 'transparent', color: formData.saleMode === mode ? '#ffffff' : '#94a3b8' }}
                      className="flex-1 py-4 rounded-xl text-xs font-black border-none cursor-pointer"
                    >
                      {mode === "Fixed" ? "Buy Now" : "Live Auction"}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="flex flex-col gap-2 text-left">
                    <label className="text-[10px] font-black uppercase tracking-widest text-teal-600 italic">Starting Bid / Price</label>
                    <input type="number" value={formData.startingBid} className="w-full p-4 bg-white border-2 border-teal-500 rounded-2xl font-bold text-xl" onChange={(e) => setFormData({...formData, startingBid: e.target.value})} />
                 </div>
                 <div className="flex flex-col gap-2 text-left">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Buy Now Option</label>
                    <input type="number" value={formData.buyNowPrice} className="w-full p-4 bg-white border-2 border-slate-100 rounded-2xl font-bold text-slate-400" onChange={(e) => setFormData({...formData, buyNowPrice: e.target.value})} />
                 </div>
              </div>
            </div>

            <div className="space-y-4 bg-rose-50 p-8 rounded-[2rem] border-2 border-rose-100 text-left">
              <div className="flex items-start gap-4">
                <ShieldCheck size={24} className="text-rose-600" />
                <div>
                  <h3 className="text-[11px] font-black uppercase text-rose-900">Sanctuary Authority Protocol</h3>
                  <p className="text-[10px] font-bold text-rose-800 m-0 mt-2">I acknowledge the 3-day market cycle protocol and certify asset provenance.</p>
                </div>
              </div>
              <label className="flex items-center gap-3 bg-white p-5 rounded-xl border border-rose-200 cursor-pointer">
                <input type="checkbox" required className="w-5 h-5" />
                <span className="text-[10px] font-black uppercase text-rose-900">Acknowledge Authority Protocol</span>
              </label>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-[#014d4e] text-white p-6 rounded-2xl font-black uppercase tracking-[0.2em] cursor-pointer border-none shadow-xl">
              {loading ? "Registering..." : "Deploy Sanctuary Asset"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
