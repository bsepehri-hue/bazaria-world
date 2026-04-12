"use client";

import { doc, getDoc, deleteDoc, collection, addDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { useState, useEffect, Suspense } from "react";
import { db } from "@/lib/firebase/client";
import { useRouter, useSearchParams } from "next/navigation";
import { BedDouble, ArrowLeft, Camera, Home, Maximize2, Droplets } from "lucide-react";

export default function ResidentialHomeCreate() {
  return (
    <Suspense fallback={<div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8f8f5' }}>
      <p style={{ fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.4em', color: '#014d4e' }}>INITIALIZING PROTOCOL...</p>
    </div>}>
      <ResidentialFormCore />
    </Suspense>
  );
}

function ResidentialFormCore() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('edit');

  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [isDeleteLocked, setIsDeleteLocked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [formData, setFormData] = useState({
    title: "", imageUrls: [], propertyType: "Single Family Home", location: "", city: "", province: "",
    bedrooms: "", bathrooms: "", lotSize: "", saleMode: "Auction + Buy Now", startingBid: "",
    reservePrice: "", buyNowPrice: "", description: "", isSanctuaryAsset: false
  });

  useEffect(() => {
    if (!editId) return;
    const load = async () => {
      const snap = await getDoc(doc(db, "listings", editId));
      if (snap.exists()) setFormData(snap.data() as any);
    };
    load();
  }, [editId]);

  const handleDelete = async () => {
    if (!editId || isDeleteLocked) return;
    if (!isConfirmingDelete) {
      setIsConfirmingDelete(true);
      setIsDeleteLocked(true);
      setTimeout(() => setIsDeleteLocked(false), 1500);
      return;
    }
    await deleteDoc(doc(db, "listings", editId));
    router.push("/market");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = { ...formData, category: "Residential", updatedAt: serverTimestamp(), status: "active" };
      if (editId) await updateDoc(doc(db, "listings", editId), data);
      else await addDoc(collection(db, "listings"), { ...data, createdAt: serverTimestamp() });
      router.push("/market");
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  return (
    <div style={{ padding: '80px 40px', backgroundColor: '#f8f8f5', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      {/* 🎯 MASTER CENTERED WRAPPER */}
      <div style={{ width: '100%', maxWidth: '1000px' }}>
        
        {/* Centered Back Button */}
        <button onClick={() => router.push('/market/create/properties')} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '32px', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.2em' }}>
          <ArrowLeft size={16} /> Property Portal
        </button>

        {/* Centered Header */}
        <div style={{ marginBottom: '48px', borderLeft: '4px solid #0f172a', paddingLeft: '24px', textAlign: 'left' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0f172a', marginBottom: '8px' }}>
            <Home size={14} />
            <span style={{ fontSize: '9px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.4em' }}>Residential Asset Intake</span>
          </div>
          <h1 style={{ fontSize: '42px', fontWeight: '900', color: '#0f172a', margin: '0', textTransform: 'uppercase', letterSpacing: '-0.02em' }}>The <span style={{ color: '#64748b' }}>Residential</span> Portal</h1>
        </div>

        {/* Your Original Card UI */}
        <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-12 space-y-10">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col gap-2 text-left">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Home Title</label>
                <input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold" required />
              </div>
              <div className="flex flex-col gap-2 text-left">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Classification</label>
                <select value={formData.propertyType} onChange={e => setFormData({...formData, propertyType: e.target.value})} className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold">
                  <option>Single Family Home</option><option>Condominium</option><option>Townhouse</option>
                </select>
              </div>
            </div>

            {/* Gallery Section - Restored Delete Buttons */}
            <div className="text-left space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Property Gallery</label>
              <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
                <label className="aspect-square bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center cursor-pointer hover:border-slate-900 transition-colors">
                  <Camera size={20} className="text-slate-400" />
                  <input type="file" multiple className="hidden" onChange={e => {
                    const files = Array.from(e.target.files || []);
                    setImageFiles(prev => [...prev, ...files].slice(0, 8));
                  }} />
                </label>
                {formData.imageUrls?.map((url, idx) => (
                  <div key={idx} style={{ position: 'relative', aspectRatio: '1/1', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                    <img src={url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <button type="button" onClick={() => setFormData({...formData, imageUrls: formData.imageUrls.filter((_, i) => i !== idx)})} style={{ position: 'absolute', top: '5px', right: '5px', backgroundColor: '#ef4444', color: 'white', width: '20px', height: '20px', borderRadius: '50%', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}>×</button>
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing Section */}
            <div className="bg-slate-900 p-10 rounded-[2.5rem] grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-left">
                <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Starting Bid</label>
                <input value={formData.startingBid} type="number" onChange={e => setFormData({...formData, startingBid: e.target.value})} className="w-full bg-transparent border-b-2 border-slate-800 outline-none font-black text-2xl py-2 text-white" />
              </div>
              <div className="text-left">
                <label className="text-[9px] font-black uppercase tracking-widest text-amber-500">Buy Now</label>
                <input value={formData.buyNowPrice} type="number" onChange={e => setFormData({...formData, buyNowPrice: e.target.value})} className="w-full bg-transparent border-b-2 border-amber-900 outline-none font-black text-2xl py-2 text-amber-500" />
              </div>
              <div className="text-left">
                <label className="text-[9px] font-black uppercase tracking-widest text-rose-500">Reserve</label>
                <input value={formData.reservePrice} type="number" onChange={e => setFormData({...formData, reservePrice: e.target.value})} className="w-full bg-transparent border-b-2 border-rose-950 outline-none font-black text-2xl py-2 text-rose-500" />
              </div>
            </div>

            {/* Authority Checkbox */}
            <div className="flex items-start gap-4 p-6 bg-slate-50 rounded-2xl border border-slate-200 text-left">
              <input type="checkbox" required className="w-5 h-5 mt-1 accent-slate-900 cursor-pointer" />
              <p className="text-[11px] text-slate-500 font-semibold leading-relaxed">
                I hereby certify that this asset is under my legal authority and complies with the <span className="text-slate-900 font-black">Bazaria Sovereign Protocol</span>.
              </p>
            </div>

            {/* Restored Action Buttons */}
            <div className="flex flex-col gap-4">
              <button type="submit" disabled={loading} style={{ width: '100%', backgroundColor: '#0f172a', color: '#ffffff', padding: '24px', borderRadius: '20px', fontSize: '14px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.25em', cursor: 'pointer' }}>
                {loading ? "PROCESSING..." : (editId ? "Update Property" : "Deploy Residential Asset")}
              </button>
              {editId && (
                <button type="button" onClick={handleDelete} disabled={isDeleteLocked} style={{ width: '100%', backgroundColor: isConfirmingDelete ? '#ef4444' : 'transparent', color: isConfirmingDelete ? '#ffffff' : '#ef4444', border: '1px solid #ef4444', padding: '16px', borderRadius: '20px', fontWeight: '900', textTransform: 'uppercase', cursor: isDeleteLocked ? 'not-allowed' : 'pointer' }}>
                  {isDeleteLocked ? "WAITING..." : isConfirmingDelete ? "⚠️ CONFIRM DELETE" : "Delete Permanently"}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
