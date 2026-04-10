"use client";

import { useState } from "react";
import { db, storage } from "@/lib/firebase/client";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useRouter } from "next/navigation";
import { 
  BedDouble, 
  ShieldCheck, 
  ArrowLeft, 
  Camera, 
  Maximize2,
  Droplets,
  Waves,
  MapPin
} from "lucide-react";

export default function SanctuaryCaribbeanCreate() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  
const [formData, setFormData] = useState({
    title: "",
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
    description: "", // 📝 This is your new narrative field
    isSanctuaryAsset: true,
    assetClass: "International/High-Authority"
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const uploadedUrls = [];
      for (const file of imageFiles) {
        const fileRef = ref(storage, `sanctuary/caribbean/${Date.now()}-${file.name}`);
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
      console.error("Caribbean Deployment Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
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

        <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-12 space-y-10">
            
            {/* SECTION 1: IDENTITY & LOCATION */}
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div style={{ textAlign: 'left' }} className="flex flex-col gap-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Estate Name</label>
                  <input placeholder="e.g. Villa Mariposa" className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-teal-500 font-bold text-slate-900" onChange={(e) => setFormData({...formData, title: e.target.value})} required />
                </div>
                <div style={{ textAlign: 'left' }} className="flex flex-col gap-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Asset Classification</label>
                  <select className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-slate-900" onChange={(e) => setFormData({...formData, propertyType: e.target.value})}>
                    <option>Oceanfront Villa</option>
                    <option>International Estate</option>
                    <option>Boutique Hotel</option>
                  </select>
                </div>
              </div>

              {/* 📍 LOCATION SUITE */}
              <div className="p-8 bg-slate-50 rounded-[2rem] border-2 border-slate-100 space-y-6">
                 <div style={{ textAlign: 'left' }} className="flex flex-col gap-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-teal-600 italic">Property Location (Address/GPS)</label>
                    <input placeholder="e.g. Calle Las Galeras, Samaná" className="w-full p-4 bg-white border-2 border-slate-200 rounded-xl font-bold text-slate-900" onChange={(e) => setFormData({...formData, location: e.target.value})} />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <input placeholder="City" className="w-full p-4 bg-white border-2 border-slate-200 rounded-xl font-bold text-slate-900" onChange={(e) => setFormData({...formData, city: e.target.value})} />
                    <input placeholder="Province/State" className="w-full p-4 bg-white border-2 border-slate-200 rounded-xl font-bold text-slate-900" onChange={(e) => setFormData({...formData, province: e.target.value})} />
                 </div>
              </div>
            </div>

            {/* SECTION 2: GALLERY */}
            <div style={{ textAlign: 'left' }} className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Estate Presentation (Max 8 Images)</label>
              <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
                <label className="aspect-square bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-teal-500 transition-all text-slate-400">
                  <Camera size={20} />
                  <input type="file" multiple accept="image/*" className="hidden" 
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      setImageFiles((prev) => [...prev, ...files].slice(0, 8));
                    }} 
                  />
                </label>
                {imageFiles.map((file, idx) => (
                  <div key={idx} className="aspect-square rounded-xl overflow-hidden border border-slate-100">
                    <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" alt="preview" />
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 3: SPECS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-50 p-8 rounded-[2rem] border-2 border-slate-100">
              <div style={{ textAlign: 'left' }} className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-slate-400"><Maximize2 size={14} /><label className="text-[10px] font-black uppercase tracking-widest">Lot Size (m²)</label></div>
                <input placeholder="e.g. 1,200 m²" className="w-full p-4 bg-white border-2 border-slate-200 rounded-xl font-bold text-slate-900" onChange={(e) => setFormData({...formData, lotSize: e.target.value})} />
              </div>
              <div style={{ textAlign: 'left' }} className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-slate-400"><BedDouble size={14} /><label className="text-[10px] font-black uppercase tracking-widest">Bedrooms</label></div>
                <input type="number" placeholder="4" className="w-full p-4 bg-white border-2 border-slate-200 rounded-xl font-bold text-slate-900" onChange={(e) => setFormData({...formData, bedrooms: e.target.value})} />
              </div>
              <div style={{ textAlign: 'left' }} className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-slate-400"><Droplets size={14} /><label className="text-[10px] font-black uppercase tracking-widest">Bathrooms</label></div>
                <input type="number" placeholder="4.5" className="w-full p-4 bg-white border-2 border-slate-200 rounded-xl font-bold text-slate-900" onChange={(e) => setFormData({...formData, bathrooms: e.target.value})} />
              </div>
            </div>

            {/* SECTION 4: DEPLOYMENT LOGIC */}
            <div className="space-y-6 bg-slate-900 p-10 rounded-[2.5rem] text-white">
              <div className="flex justify-between items-center border-b border-white/10 pb-6">
                <div style={{ textAlign: 'left' }}>
                  <h3 className="text-[11px] font-black uppercase tracking-widest text-teal-400 italic">Deployment Strategy</h3>
                  <p className="text-[9px] text-slate-400 font-bold uppercase mt-1">Select the exit protocol for this asset.</p>
                </div>
                <select className="bg-white/10 p-3 rounded-xl font-bold text-[10px] uppercase outline-none border border-white/20" onChange={(e) => setFormData({...formData, saleMode: e.target.value})}>
                  <option value="Auction + Buy Now" className="text-black">Hybrid (Auction + Buy Now)</option>
                  <option value="Auction Only" className="text-black">Pure Auction</option>
                  <option value="Fixed Price" className="text-black">Sovereign Direct (Fixed)</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
                <div style={{ textAlign: 'left' }} className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-teal-500">Starting Bid (USD)</label>
                  <input type="number" placeholder="0.00" className="w-full bg-transparent border-b-2 border-teal-800 outline-none font-black text-3xl pb-2" onChange={(e) => setFormData({...formData, startingBid: e.target.value})} />
                </div>
                <div style={{ textAlign: 'left' }} className="space-y-2 border-x border-white/5 px-6">
                  <label className="text-[9px] font-black uppercase tracking-widest text-amber-500">Buy Now Price (USD)</label>
                  <input type="number" placeholder="0.00" className="w-full bg-transparent border-b-2 border-amber-800 outline-none font-black text-3xl pb-2 text-amber-500" onChange={(e) => setFormData({...formData, buyNowPrice: e.target.value})} />
                </div>
                <div style={{ textAlign: 'left' }} className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-rose-500">Reserve Price (USD)</label>
                  <input type="number" placeholder="0.00" className="w-full bg-transparent border-b-2 border-rose-900 outline-none font-black text-3xl pb-2" onChange={(e) => setFormData({...formData, reservePrice: e.target.value})} />
                </div>
              </div>
            </div>

            {/* SECTION 5: PROTOCOL */}
            <div style={{ textAlign: 'left' }} className="space-y-4 bg-slate-50 p-8 rounded-[2rem] border-2 border-slate-100">
              <div className="flex items-start gap-4">
                <ShieldCheck size={24} className="text-teal-600" />
                <div>
                  <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-900">International Audit Protocol</h3>
                  <p className="text-[10px] font-bold text-slate-500 m-0 uppercase mt-2">Title verification and international lien search required.</p>
                </div>
              </div>
              <label className="flex items-center gap-3 bg-white p-5 rounded-xl border border-slate-200 cursor-pointer">
                <input type="checkbox" required className="w-5 h-5 rounded border-slate-300 text-teal-600" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">Acknowledge International Audit Protocol</span>
              </label>
            </div>

{/* 📝 ASSET PROVENANCE & NARRATIVE */}
<div className="space-y-4 pt-4">
  <div className="flex flex-col">
    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">
      Asset Provenance & Narrative
    </label>
    <p className="text-[11px] text-slate-500 mb-4 leading-relaxed">
      Detail the unique history, specifications, and strategic value of this asset. 
      For Sanctuary listings, include details on concierge facilitation and local acquisition complexity.
    </p>
  </div>
  
  <textarea 
    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-6 text-sm text-slate-700 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none min-h-[180px] resize-none leading-relaxed"
    placeholder="Enter the full story of this asset..."
    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
    value={formData.description || ''}
  />
  
  <div className="flex justify-end">
    <span className="text-[10px] text-slate-400 font-medium italic">
      Structured for the Global Trade Protocol
    </span>
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
                {loading ? "Registering Estate..." : "Deploy Caribbean Asset"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
