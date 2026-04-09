"use client";

import { useState } from "react";
import { db, storage } from "@/lib/firebase/client";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useRouter } from "next/navigation";
import { 
  BedDouble, 
  CalendarDays, 
  ShieldCheck, 
  ArrowLeft, 
  Camera, 
  Clock, 
  Star,
  Palmtree 
} from "lucide-react";

export default function SanctuaryCaribbeanCreate() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  
  const [formData, setFormData] = useState({
    title: "",
    hospitalityType: "Luxury Suite", 
    location: "",
    roomType: "Entire Space", 
    bathroomAccess: "Private", 
    weekNumber: "", 
    price: "",
    saleMode: "Auction",
    durationDays: "7", 
    reservePrice: "",
    startingBid: "",
    description: "",
    isSanctuaryAsset: true,
    assetClass: "Hospitality/Timeshare"
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
        price: formData.saleMode === "Auction" ? Number(formData.startingBid) : Number(formData.price),
        currentBid: Number(formData.startingBid),
        status: "active",
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
        
        {/* Fixed Navigation */}
        <button 
          onClick={() => router.push('/market/create/properties')} 
          style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '32px', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.2em' }}
        >
          <ArrowLeft size={16} /> Sanctuary Gateway
        </button>

        {/* 🏙️ MINIMALIST HEADER */}
        <div style={{ 
          marginBottom: '48px', 
          borderLeft: '4px solid #014d4e', 
          paddingLeft: '24px',
          textAlign: 'left'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#014d4e', marginBottom: '8px' }}>
            <Palmtree size={14} />
            <span style={{ fontSize: '9px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.4em' }}>
              Hospitality Intake Protocol
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
            The <span style={{ color: '#014d4e' }}>Caribbean</span> Sanctuary
          </h1>
          <p style={{ color: '#64748b', fontSize: '11px', fontWeight: '700', marginTop: '8px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Boutique Stays & Timeshare Asset Deployment
          </p>
        </div>

        {/* 📄 FORM CARD */}
        <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-12 space-y-10">
            
            {/* SECTION 1: IDENTITY */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div style={{ textAlign: 'left' }} className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Listing Title</label>
                <input 
                  placeholder="e.g. Royal Indigo Suite - Week 42" 
                  className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-teal-500 font-bold text-slate-900" 
                  onChange={(e) => setFormData({...formData, title: e.target.value})} 
                  required 
                />
              </div>
              <div style={{ textAlign: 'left' }} className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Asset Classification</label>
                <select className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-slate-900" onChange={(e) => setFormData({...formData, hospitalityType: e.target.value})}>
                  <option>Luxury Suite</option>
                  <option>Boutique Room</option>
                  <option>Timeshare Certificate (Ownership)</option>
                  <option>Timeshare Week (Rental)</option>
                </select>
              </div>
            </div>

            {/* SECTION 2: EXPERIENCE GALLERY */}
            <div style={{ textAlign: 'left' }} className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Experience Gallery (Max 8 Images)</label>
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

            {/* SECTION 3: STAY INTELLIGENCE */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-50 p-8 rounded-[2rem] border-2 border-slate-100">
              <div style={{ textAlign: 'left' }} className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-slate-400">
                  <CalendarDays size={14} />
                  <label className="text-[10px] font-black uppercase tracking-widest">Calendar Week</label>
                </div>
                <input placeholder="e.g. Week 42" className="w-full p-4 bg-white border-2 border-slate-200 rounded-xl font-bold text-slate-900" onChange={(e) => setFormData({...formData, weekNumber: e.target.value})} />
              </div>
              <div style={{ textAlign: 'left' }} className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-slate-400">
                  <BedDouble size={14} />
                  <label className="text-[10px] font-black uppercase tracking-widest">Privacy Level</label>
                </div>
                <select className="w-full p-4 bg-white border-2 border-slate-200 rounded-xl font-bold text-slate-900" onChange={(e) => setFormData({...formData, roomType: e.target.value})}>
                  <option>Entire Space</option>
                  <option>Private Room</option>
                  <option>Shared Villa</option>
                </select>
              </div>
              <div style={{ textAlign: 'left' }} className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-slate-400">
                  <Clock size={14} />
                  <label className="text-[10px] font-black uppercase tracking-widest">Min. Stay Terms</label>
                </div>
                <input placeholder="e.g. Sat-Sat" className="w-full p-4 bg-white border-2 border-slate-200 rounded-xl font-bold text-slate-900" />
              </div>
            </div>

            {/* SECTION 4: NARRATIVE */}
            <div style={{ textAlign: 'left' }} className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Experience Description</label>
              <textarea 
                rows={4}
                placeholder="Detail the views, amenities, proximity to beaches, and exclusive resort access..."
                className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-teal-500 font-bold text-slate-900"
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>

            {/* SECTION 5: DEPLOYMENT STRATEGY */}
            <div className="space-y-6 bg-slate-50 p-8 rounded-[2rem] border-2 border-slate-100">
              <div style={{ textAlign: 'left' }} className="flex justify-between items-center">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Bidding Architecture</label>
                <select className="p-3 rounded-xl font-bold text-[10px] uppercase border-2 border-slate-200 text-slate-900" onChange={(e) => setFormData({...formData, durationDays: e.target.value})}>
                  <option value="3">3 Day Flash Auction</option>
                  <option value="7">7 Day Standard Cycle</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div style={{ textAlign: 'left' }} className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-teal-600 italic">Opening Bid (USD)</label>
                  <input type="number" className="w-full p-4 bg-white border-2 border-teal-100 rounded-2xl font-bold text-teal-900 text-2xl" placeholder="0.00" onChange={(e) => setFormData({...formData, startingBid: e.target.value})} />
                </div>
                <div style={{ textAlign: 'left' }} className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-rose-500 italic">Reserve Requirement</label>
                  <input type="number" className="w-full p-4 bg-white border-2 border-rose-100 rounded-2xl font-bold text-rose-900 text-2xl" placeholder="0.00" onChange={(e) => setFormData({...formData, reservePrice: e.target.value})} />
                </div>
              </div>
            </div>

            {/* SECTION 6: PROTOCOL */}
            <div style={{ textAlign: 'left' }} className="space-y-4 bg-slate-900 p-8 rounded-[2rem] border-2 border-slate-800 text-white">
              <div className="flex items-start gap-4">
                <ShieldCheck size={24} style={{ color: '#fbbf24' }} />
                <div>
                  <h3 style={{ color: '#fbbf24', margin: '0' }} className="text-[11px] font-black uppercase tracking-widest italic">Authority Bidding Protocol</h3>
                  <div className="mt-4 space-y-3">
                    <p className="text-[10px] font-bold text-slate-400 m-0 leading-relaxed uppercase">
                      1. Once deployed, hospitality weeks are locked for the duration of the cycle.
                    </p>
                    <p className="text-[10px] font-bold text-slate-400 m-0 leading-relaxed uppercase">
                      2. Cancellation or withdrawal after bidding commences results in revocation of listing authority.
                    </p>
                  </div>
                </div>
              </div>
              <label className="flex items-center gap-3 bg-white/5 p-5 rounded-xl border border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
                <input type="checkbox" required className="w-5 h-5 rounded border-slate-700 bg-slate-800" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-200">Acknowledge Hospitality Protocol</span>
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
                {loading ? "Registering Stay..." : "Deploy Caribbean Asset"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
