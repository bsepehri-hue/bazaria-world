
"use client";

import { useState } from "react";
import { db, storage } from "@/lib/firebase/client";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useRouter } from "next/navigation";
import { 
  Package, 
  Camera, 
  ShieldCheck, 
  ArrowLeft, 
  Tag, 
  MapPin, 
  Gavel,
  CheckCircle2
} from "lucide-react";

export default function GeneralMarketplaceCreate() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  
  const [formData, setFormData] = useState({
    title: "",
    category: "ART",
    condition: "Mint",
    location: "",
    city: "",
    province: "",
    price: "",
    saleMode: "Auction + Buy Now",
    durationDays: "3", 
    reservePrice: "",
    startingBid: "",
    buyNowPrice: "",
    description: "",
    autoRelist: true,
    isGeneralAsset: true
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const uploadedUrls = [];
      for (const file of imageFiles) {
        const fileRef = ref(storage, `general/${Date.now()}-${file.name}`);
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
        status: "active",
        auctionEnd: new Date(Date.now() + Number(formData.durationDays) * 24 * 60 * 60 * 1000),
        createdAt: serverTimestamp(),
      });
      
      router.push("/market"); 
    } catch (error) {
      console.error("General Marketplace Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    /* 🛡️ MASTER WRAPPER: 80px left padding clears the sidebar */
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
          onClick={() => router.push('/market/create')} 
          style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '32px', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.2em' }}
        >
          <ArrowLeft size={16} /> Main Gateway
        </button>

        {/* 🏙️ MINIMALIST HEADER */}
        <div style={{ marginBottom: '48px', borderLeft: '4px solid #0f172a', paddingLeft: '24px', textAlign: 'left' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0f172a', marginBottom: '8px' }}>
            <Package size={14} />
            <span style={{ fontSize: '9px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.4em' }}>
              General Asset Protocol
            </span>
          </div>
          <h1 style={{ fontSize: '42px', fontWeight: '900', color: '#0f172a', margin: '0', textTransform: 'uppercase', letterSpacing: '-0.02em' }}>
            General <span style={{ color: '#64748b' }}>Marketplace</span>
          </h1>
          <p style={{ color: '#64748b', fontSize: '11px', fontWeight: '700', marginTop: '8px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Art, Animals, & Sovereign Commodities Intake
          </p>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-12 space-y-10">
            
            {/* SECTION 1: IDENTITY & SECTOR */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div style={{ textAlign: 'left' }} className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Asset Title</label>
                <input 
                  placeholder="e.g. Rare Basquiat Study No. 4" 
                  className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-slate-900 font-bold text-slate-900" 
                  onChange={(e) => setFormData({...formData, title: e.target.value})} 
                  required 
                />
              </div>
              <div style={{ textAlign: 'left' }} className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Sector Classification</label>
                <select className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-slate-900" onChange={(e) => setFormData({...formData, category: e.target.value})}>
                  <option value="ART">Fine Art & Sculpture</option>
                  <option value="ANIMALS">Livestock & Pedigreed Animals</option>
                  <option value="COLLECTIBLES">Rare Collectibles</option>
                  <option value="ELECTRONICS">Industrial Electronics</option>
                </select>
              </div>
            </div>

            {/* SECTION 2: EVIDENCE GALLERY */}
            <div style={{ textAlign: 'left' }} className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Evidence Gallery (Max 6)</label>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                <label className="aspect-square bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-slate-900 transition-all text-slate-400">
                  <Camera size={20} />
                  <input type="file" multiple accept="image/*" className="hidden" 
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      setImageFiles((prev) => [...prev, ...files].slice(0, 6));
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

            {/* SECTION 3: LOCATION SUITE */}
            <div className="p-8 bg-slate-50 rounded-[2rem] border-2 border-slate-100 space-y-6">
              <div style={{ textAlign: 'left' }} className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-900 italic">Storage Location / Origin</label>
                <input placeholder="e.g. Freezone Vault, Geneva or Farm Address" className="w-full p-4 bg-white border-2 border-slate-200 rounded-xl font-bold text-slate-900" onChange={(e) => setFormData({...formData, location: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input placeholder="City" className="w-full p-4 bg-white border-2 border-slate-200 rounded-xl font-bold text-slate-900" onChange={(e) => setFormData({...formData, city: e.target.value})} />
                <input placeholder="Province / State" className="w-full p-4 bg-white border-2 border-slate-200 rounded-xl font-bold text-slate-900" onChange={(e) => setFormData({...formData, province: e.target.value})} />
              </div>
            </div>

            {/* SECTION 4: DEPLOYMENT LOGIC (Auction + Buy Now) */}
            <div className="space-y-6 bg-slate-900 p-10 rounded-[2.5rem] text-white">
              <div className="flex justify-between items-center border-b border-white/10 pb-6">
                <div style={{ textAlign: 'left' }}>
                  <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400 italic">Bidding Architecture</h3>
                  <p className="text-[9px] text-slate-500 font-bold uppercase mt-1">High-velocity 3-Day Cycle Protocol.</p>
                </div>
                <select className="bg-white/10 p-3 rounded-xl font-bold text-[10px] uppercase outline-none border border-white/20" onChange={(e) => setFormData({...formData, durationDays: e.target.value})}>
                  <option value="3">3 Day Velocity Cycle</option>
                  <option value="7">7 Day Exposure Window</option>
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

            {/* SECTION 5: NARRATIVE */}
            <div style={{ textAlign: 'left' }} className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Asset Narrative & Provenance</label>
              <textarea 
                rows={4}
                placeholder="List condition, health certificates, pedigree, or technical specifications..."
                className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-slate-900 font-bold text-slate-900"
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>

            {/* SECTION 6: PROTOCOL */}
            <div style={{ textAlign: 'left' }} className="space-y-4 bg-slate-50 p-8 rounded-[2rem] border-2 border-slate-200">
              <div className="flex items-start gap-4">
                <ShieldCheck size={24} className="text-slate-900" />
                <div>
                  <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-900">Bazaria Authority Protocol</h3>
                  <p className="text-[10px] font-bold text-slate-500 m-0 uppercase mt-2 leading-relaxed">
                    Withdrawal during a live bidding cycle is prohibited. Reputation metrics are permanently affected by non-compliance.
                  </p>
                </div>
              </div>
              <label className="flex items-center gap-3 bg-white p-5 rounded-xl border border-slate-200 cursor-pointer">
                <input type="checkbox" required className="w-5 h-5 rounded border-slate-300 text-slate-900" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">I commit to the Sovereign Market Window</span>
              </label>
            </div>

            {/* 🎯 SUBMIT BUTTON */}
            <div style={{ marginTop: '40px', paddingTop: '40px', borderTop: '2px solid #f1f5f9' }}>
              <button 
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  backgroundColor: '#0f172a',
                  color: '#ffffff',
                  padding: '24px',
                  borderRadius: '20px',
                  border: 'none',
                  fontSize: '14px',
                  fontWeight: '900',
                  textTransform: 'uppercase',
                  letterSpacing: '0.25em',
                  cursor: 'pointer',
                  boxShadow: '0 20px 40px -10px rgba(15, 23, 42, 0.4)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.backgroundColor = '#000000';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.backgroundColor = '#0f172a';
                }}
              >
                {loading ? "Deploying Asset..." : "Deploy to General Marketplace"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
