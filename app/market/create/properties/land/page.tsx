
"use client";

import { useState } from "react";
import { db, storage } from "@/lib/firebase/client";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useRouter } from "next/navigation";
import { 
  Map, 
  ShieldCheck, 
  ArrowLeft, 
  Camera, 
  Maximize2, 
  Droplets, 
  Zap, 
  Gavel,
  Compass
} from "lucide-react";

export default function SanctuaryLandCreate() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  
  const [formData, setFormData] = useState({
    title: "",
    landType: "Coastal Plot", 
    location: "",
    lotSize: "", 
    zoning: "Residential", 
    hasWater: false,
    hasElectric: false,
    price: "",
    saleMode: "Auction",
    durationDays: "30", 
    reservePrice: "",
    startingBid: "",
    description: "",
    isSanctuaryAsset: true,
    assetClass: "Land/Development"
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const uploadedUrls = [];
      for (const file of imageFiles) {
        const fileRef = ref(storage, `sanctuary/land/${Date.now()}-${file.name}`);
        const uploadTask = await uploadBytes(fileRef, file);
        const url = await getDownloadURL(uploadTask.ref);
        uploadedUrls.push(url);
      }

      await addDoc(collection(db, "listings"), {
        ...formData,
        imageUrls: uploadedUrls,
        imageUrl: uploadedUrls[0] || "",
        price: formData.saleMode === "Auction" ? Number(formData.startingBid) : Number(formData.price),
        currentBid: Number(formData.startingBid),
        status: "pending_audit",
        auctionEnd: new Date(Date.now() + Number(formData.durationDays) * 24 * 60 * 60 * 1000),
        createdAt: serverTimestamp(),
      });
      
      router.push("/market"); 
    } catch (error) {
      console.error("Land Deployment Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    /* 🛡️ MASTER WRAPPER: 80px left padding clears the sidebar, 140px bottom padding protects the button */
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
          onClick={() => router.back()} 
          style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '32px', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.2em' }}
        >
          <ArrowLeft size={16} /> Sanctuary Gateway
        </button>

        {/* 🏙️ MINIMALIST HEADER: Professional Document Style */}
        <div style={{ 
          marginBottom: '48px', 
          borderLeft: '4px solid #014d4e', 
          paddingLeft: '24px',
          textAlign: 'left'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#014d4e', marginBottom: '8px' }}>
            <Compass size={14} />
            <span style={{ fontSize: '9px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.4em' }}>
              Territorial Intake Protocol
            </span>
          </div>
          <h1 style={{ 
            fontSize: '42px', 
            fontWeight: '900', 
            color: '#0f172a', 
            margin: '0', 
            textTransform: 'uppercase', 
            letterSpacing: '-0.02em' 
          }}>
            Land <span style={{ color: '#014d4e' }}>Deployment</span>
          </h1>
          <p style={{ color: '#64748b', fontSize: '11px', fontWeight: '700', marginTop: '8px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Sovereign Soil & Development Acquisition Logic
          </p>
        </div>

        {/* 📄 FORM CARD */}
        <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-12 space-y-10">
            
            {/* SECTION 1: IDENTITY */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div style={{ textAlign: 'left' }} className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Lot Designation</label>
                <input 
                  placeholder="e.g. Hilltop Acreage - Phase 2" 
                  className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-teal-500 font-bold text-slate-900" 
                  onChange={(e) => setFormData({...formData, title: e.target.value})} 
                  required 
                />
              </div>
              <div style={{ textAlign: 'left' }} className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Land Classification</label>
                <select className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-slate-900" onChange={(e) => setFormData({...formData, landType: e.target.value})}>
                  <option>Coastal Plot</option>
                  <option>Agricultural Acreage</option>
                  <option>Residential Lot</option>
                  <option>Commercial Development Site</option>
                </select>
              </div>
            </div>

            {/* SECTION 2: TOPOGRAPHY GALLERY */}
            <div style={{ textAlign: 'left' }} className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Topography & Survey Images (Max 8)</label>
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
                  <div key={idx} className="aspect-square rounded-xl overflow-hidden border border-slate-100 relative group">
                    <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" />
                    <button type="button" onClick={() => setImageFiles(imageFiles.filter((_, i) => i !== idx))} style={{ border: 'none' }} className="absolute top-1 right-1 bg-rose-500 text-white rounded-full p-1 shadow-lg cursor-pointer flex items-center justify-center"><div className="w-3 h-3 text-[8px] font-black">X</div></button>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 3: TECH SPECS (The "Amber" Detail Grid upgraded) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-50 p-8 rounded-[2rem] border-2 border-slate-100">
              <div style={{ textAlign: 'left' }} className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-slate-400">
                  <Maximize2 size={14} />
                  <label className="text-[10px] font-black uppercase tracking-widest">Total Size</label>
                </div>
                <input placeholder="e.g. 2.5 Acres" className="w-full p-4 bg-white border-2 border-slate-200 rounded-xl font-bold text-slate-900" onChange={(e) => setFormData({...formData, lotSize: e.target.value})} />
              </div>
              <div style={{ textAlign: 'left' }} className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-slate-400">
                  <Gavel size={14} />
                  <label className="text-[10px] font-black uppercase tracking-widest">Zoning</label>
                </div>
                <select className="w-full p-4 bg-white border-2 border-slate-200 rounded-xl font-bold text-slate-900" onChange={(e) => setFormData({...formData, zoning: e.target.value})}>
                  <option>Residential</option>
                  <option>Commercial</option>
                  <option>Industrial</option>
                  <option>Tourism/Resort</option>
                </select>
              </div>
              <div style={{ textAlign: 'left' }} className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Infrastructure</label>
                <div className="flex gap-2">
                  <button type="button" onClick={() => setFormData({...formData, hasWater: !formData.hasWater})} className={`flex-1 p-3 rounded-xl border-2 font-black text-[9px] uppercase transition-all cursor-pointer ${formData.hasWater ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-200 text-slate-400'}`}>Water</button>
                  <button type="button" onClick={() => setFormData({...formData, hasElectric: !formData.hasElectric})} className={`flex-1 p-3 rounded-xl border-2 font-black text-[9px] uppercase transition-all cursor-pointer ${formData.hasElectric ? 'bg-amber-500 border-amber-500 text-white' : 'bg-white border-slate-200 text-slate-400'}`}>Electric</button>
                </div>
              </div>
            </div>

{/* LAND NARRATIVE & PROVENANCE */}
<div style={{ textAlign: 'left' }} className="space-y-2">
  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900">
    Land Provenance & Development Narrative
  </label>
  <textarea 
    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-6 text-sm min-h-[150px] outline-none focus:border-slate-400 transition-all"
    placeholder="Describe zoning details, soil type, water access, or historical plot data..."
    value={formData.description}
    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
  />
</div>
            
            {/* SECTION 4: DEPLOYMENT STRATEGY */}
            <div className="space-y-6 bg-slate-50 p-8 rounded-[2rem] border-2 border-slate-100">
              <div style={{ textAlign: 'left' }} className="flex justify-between items-center">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Price Discovery Strategy</label>
                <select className="p-3 rounded-xl font-bold text-[10px] uppercase border-2 border-slate-200 text-slate-900" onChange={(e) => setFormData({...formData, durationDays: e.target.value})}>
                  <option value="30">30 Day Market Window</option>
                  <option value="60">60 Day Strategic Cycle</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div style={{ textAlign: 'left' }} className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-teal-600 italic">Opening Offer (USD)</label>
                  <input type="number" className="w-full p-4 bg-white border-2 border-teal-100 rounded-2xl font-bold text-teal-900 text-2xl" placeholder="0.00" onChange={(e) => setFormData({...formData, startingBid: e.target.value})} />
                </div>
                <div style={{ textAlign: 'left' }} className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-rose-500 italic">Reserve Requirement</label>
                  <input type="number" className="w-full p-4 bg-white border-2 border-rose-100 rounded-2xl font-bold text-rose-900 text-2xl" placeholder="0.00" onChange={(e) => setFormData({...formData, reservePrice: e.target.value})} />
                </div>
              </div>
            </div>

            {/* SECTION 5: AUDIT PROTOCOL */}
            <div style={{ textAlign: 'left' }} className="space-y-4 bg-amber-50/50 p-8 rounded-[2rem] border-2 border-amber-100">
              <div className="flex items-start gap-4">
                <ShieldCheck size={24} style={{ color: '#d97706' }} />
                <div>
                  <h3 style={{ color: '#92400e', margin: '0' }} className="text-[11px] font-black uppercase tracking-widest">Territorial Audit Required</h3>
                  <div className="mt-4 space-y-3">
                    <p className="text-[10px] font-bold text-amber-800 m-0 leading-relaxed uppercase">
                      1. Title deeds, survey points, and ownership history must be uploaded for Authority review.
                    </p>
                    <p className="text-[10px] font-bold text-amber-800 m-0 leading-relaxed uppercase">
                      2. Land registrations are subject to the Bazaria Territorial Audit.
                    </p>
                    <p className="text-[10px] font-black text-amber-600 m-0 italic mt-2 underline">
                      I ACCEPT THE SOVEREIGN LAND COVENANT
                    </p>
                  </div>
                </div>
              </div>
              <label className="flex items-center gap-3 bg-white p-5 rounded-xl border border-amber-200 cursor-pointer">
                <input type="checkbox" required className="w-5 h-5 rounded border-amber-300 text-amber-600" />
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-900">Acknowledge Territorial Audit Protocol</span>
              </label>
            </div>

            {/* 🎯 SUBMIT BUTTON */}
            <div style={{ marginTop: '40px', paddingTop: '40px', borderTop: '2px solid #f1f5f9' }}>
              <button 
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  backgroundColor: '#014d4e',
                  color: '#ffffff',
                  padding: '24px',
                  borderRadius: '20px',
                  border: 'none',
                  fontSize: '14px',
                  fontWeight: '900',
                  textTransform: 'uppercase',
                  letterSpacing: '0.25em',
                  cursor: 'pointer',
                  boxShadow: '0 20px 40px -10px rgba(1, 77, 78, 0.4)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.backgroundColor = '#0891b2';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.backgroundColor = '#014d4e';
                }}
              >
                {loading ? "Verifying Topography..." : "Deploy Land Asset"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
