"use client";

import { useState } from "react";
import { db, storage } from "@/lib/firebase/client";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useRouter } from "next/navigation";
import { 
  Bed, 
  Bath, 
  Maximize, 
  ShieldCheck, 
  ArrowLeft, 
  Camera, 
  Home, 
  MapPin 
} from "lucide-react";

export default function SanctuaryResidentialCreate() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  
  const [formData, setFormData] = useState({
    title: "",
    type: "Villa",
    location: "",
    city: "",
    province: "",
    sqft: "",
    beds: "",
    baths: "",
    saleMode: "Auction + Buy Now",
    durationDays: "14",
    startingBid: "",
    reservePrice: "",
    buyNowPrice: "",
    description: "",
    isSanctuaryAsset: true,
    assetClass: "Residential/Sovereign"
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const uploadedUrls = [];
      for (const file of imageFiles) {
        const fileRef = ref(storage, `sanctuary/residential/${Date.now()}-${file.name}`);
        const uploadTask = await uploadBytes(fileRef, file);
        const url = await getDownloadURL(uploadTask.ref);
        uploadedUrls.push(url);
      }

      await addDoc(collection(db, "listings"), {
        ...formData,
        imageUrls: uploadedUrls,
        imageUrl: uploadedUrls[0] || "",
        price: formData.saleMode === "Fixed Price" ? Number(formData.buyNowPrice) : Number(formData.startingBid),
        currentBid: Number(formData.startingBid),
        status: "pending_audit",
        auctionEnd: new Date(Date.now() + Number(formData.durationDays) * 24 * 60 * 60 * 1000),
        createdAt: serverTimestamp(),
      });
      
      router.push("/market"); 
    } catch (error) {
      console.error("Residential Deployment Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    /* 🛡️ MASTER WRAPPER: 80px left padding for sidebar clearance */
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
          onClick={() => router.push('/market/create/properties')} 
          style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '32px', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.2em' }}
        >
          <ArrowLeft size={16} /> Sanctuary Gateway
        </button>

        {/* 🏙️ MINIMALIST HEADER */}
        <div style={{ marginBottom: '48px', borderLeft: '4px solid #014d4e', paddingLeft: '24px', textAlign: 'left' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#014d4e', marginBottom: '8px' }}>
            <Home size={14} />
            <span style={{ fontSize: '9px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.4em' }}>
              Residential Portfolio Intake
            </span>
          </div>
          <h1 style={{ fontSize: '42px', fontWeight: '900', color: '#0f172a', margin: '0', textTransform: 'uppercase', letterSpacing: '-0.02em' }}>
            Residential <span style={{ color: '#014d4e' }}>Estates</span>
          </h1>
          <p style={{ color: '#64748b', fontSize: '11px', fontWeight: '700', marginTop: '8px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Elite Residential Asset Deployment & Luxury Vetting
          </p>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-12 space-y-10">
            
            {/* SECTION 1: IDENTITY & LOCATION */}
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div style={{ textAlign: 'left' }} className="flex flex-col gap-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Official Listing Title</label>
                  <input placeholder="e.g. Casa del Sol" className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-teal-500 font-bold text-slate-900" onChange={(e) => setFormData({...formData, title: e.target.value})} required />
                </div>
                <div style={{ textAlign: 'left' }} className="flex flex-col gap-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Property Sub-Type</label>
                  <select className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-slate-900" onChange={(e) => setFormData({...formData, type: e.target.value})}>
                    <option>Villa</option>
                    <option>Penthouse</option>
                    <option>Oceanfront Estate</option>
                    <option>Luxury Condo</option>
                  </select>
                </div>
              </div>

              {/* 📍 LOCATION SUITE */}
              <div className="p-8 bg-slate-50 rounded-[2rem] border-2 border-slate-100 space-y-6">
                 <div style={{ textAlign: 'left' }} className="flex flex-col gap-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-teal-600 italic">Address / GPS Coordinates</label>
                    <input placeholder="e.g. 123 Sanctuary Way" className="w-full p-4 bg-white border-2 border-slate-200 rounded-xl font-bold text-slate-900" onChange={(e) => setFormData({...formData, location: e.target.value})} />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <input placeholder="City" className="w-full p-4 bg-white border-2 border-slate-200 rounded-xl font-bold text-slate-900" onChange={(e) => setFormData({...formData, city: e.target.value})} />
                    <input placeholder="Province / State" className="w-full p-4 bg-white border-2 border-slate-200 rounded-xl font-bold text-slate-900" onChange={(e) => setFormData({...formData, province: e.target.value})} />
                 </div>
              </div>
            </div>

            {/* SECTION 2: GALLERY */}
            <div style={{ textAlign: 'left' }} className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Home Gallery (Max 10 Images)</label>
              <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
                <label className="aspect-square bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-teal-500 transition-all text-slate-400">
                  <Camera size={20} />
                  <input type="file" multiple accept="image/*" className="hidden" 
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      setImageFiles((prev) => [...prev, ...files].slice(0, 10));
                    }} 
                  />
                </label>
                {imageFiles.map((file, idx) => (
                  <div key={idx} className="aspect-square rounded-xl overflow-hidden border border-slate-100 relative group">
                    <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" alt="preview" />
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 3: TECH SPECS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-50 p-8 rounded-[2rem] border-2 border-slate-100">
              <div style={{ textAlign: 'left' }} className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-slate-400"><Maximize size={14} /><label className="text-[10px] font-black uppercase">Total Sq Ft</label></div>
                <input type="number" className="w-full p-4 bg-white border-2 border-slate-200 rounded-xl font-bold text-slate-900" onChange={(e) => setFormData({...formData, sqft: e.target.value})} />
              </div>
              <div style={{ textAlign: 'left' }} className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-slate-400"><Bed size={14} /><label className="text-[10px] font-black uppercase">Bedrooms</label></div>
                <input type="number" className="w-full p-4 bg-white border-2 border-slate-200 rounded-xl font-bold text-slate-900" onChange={(e) => setFormData({...formData, beds: e.target.value})} />
              </div>
              <div style={{ textAlign: 'left' }} className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-slate-400"><Bath size={14} /><label className="text-[10px] font-black uppercase">Bathrooms</label></div>
                <input type="number" className="w-full p-4 bg-white border-2 border-slate-200 rounded-xl font-bold text-slate-900" onChange={(e) => setFormData({...formData, baths: e.target.value})} />
              </div>
            </div>

            {/* SECTION 4: DEPLOYMENT MODE */}
            <div className="space-y-6 bg-slate-900 p-10 rounded-[2.5rem] text-white">
              <div className="flex justify-between items-center border-b border-white/10 pb-6">
                <div style={{ textAlign: 'left' }}>
                  <h3 className="text-[11px] font-black uppercase tracking-widest text-teal-400 italic">Deployment Strategy</h3>
                </div>
                <select className="bg-white/10 p-3 rounded-xl font-bold text-[10px] uppercase outline-none border border-white/20" onChange={(e) => setFormData({...formData, saleMode: e.target.value})}>
                  <option value="Auction + Buy Now" className="text-black">Hybrid (Auction + Buy Now)</option>
                  <option value="Auction Only" className="text-black">Pure Auction</option>
                  <option value="Fixed Price" className="text-black">Sovereign Direct (Fixed)</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
                <div style={{ textAlign: 'left' }} className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-teal-500">Starting Bid</label>
                  <input type="number" placeholder="0.00" className="w-full bg-transparent border-b-2 border-teal-800 outline-none font-black text-3xl pb-2" onChange={(e) => setFormData({...formData, startingBid: e.target.value})} />
                </div>
                <div style={{ textAlign: 'left' }} className="space-y-2 border-x border-white/5 px-6">
                  <label className="text-[9px] font-black uppercase tracking-widest text-amber-500">Buy Now Price</label>
                  <input type="number" placeholder="0.00" className="w-full bg-transparent border-b-2 border-amber-800 outline-none font-black text-3xl pb-2 text-amber-500" onChange={(e) => setFormData({...formData, buyNowPrice: e.target.value})} />
                </div>
                <div style={{ textAlign: 'left' }} className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-rose-500">Reserve Price</label>
                  <input type="number" placeholder="0.00" className="w-full bg-transparent border-b-2 border-rose-900 outline-none font-black text-3xl pb-2" onChange={(e) => setFormData({...formData, reservePrice: e.target.value})} />
                </div>
              </div>
            </div>

            {/* SECTION 5: AUDIT */}
            <div style={{ textAlign: 'left' }} className="bg-rose-50 border-2 border-rose-100 p-8 rounded-[2rem] flex items-start gap-6">
              <ShieldCheck size={32} className="text-rose-600 shrink-0" />
              <div className="space-y-2">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-rose-900">Sanctuary Audit Required</h4>
                <p className="text-[10px] font-bold text-rose-800 leading-relaxed uppercase">
                  All properties must clear the Bazaria Title Audit. Fraudulent documentation results in permanent account seizure.
                </p>
                <label className="flex items-center gap-3 mt-4 cursor-pointer">
                  <input type="checkbox" required className="w-5 h-5 rounded border-rose-300" />
                  <span className="text-[9px] font-black uppercase text-rose-900">I accept the Sovereign Protocol</span>
                </label>
              </div>
            </div>

            {/* 🎯 SUBMIT */}
            <div style={{ marginTop: '40px', paddingTop: '40px', borderTop: '2px solid #f1f5f9' }}>
              <button 
                type="submit"
                disabled={loading}
                style={{
                  width: '100%', backgroundColor: '#014d4e', color: '#ffffff', padding: '24px', borderRadius: '20px', border: 'none',
                  fontSize: '14px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.25em', cursor: 'pointer',
                  boxShadow: '0 20px 40px -10px rgba(1, 77, 78, 0.4)'
                }}
              >
                {loading ? "Vetting Property..." : "Deploy to Sanctuary Portfolio"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
