"use client";

import { useState, useEffect, Suspense } from "react";
import { db, storage } from "@/lib/firebase/client";
import { doc, getDoc, collection, addDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useRouter, useSearchParams } from "next/navigation";
import { BedDouble, ShieldCheck, ArrowLeft, Camera, MapPin, Waves, Maximize2, Droplets, Gavel, ShoppingBag } from "lucide-react";

export default function SanctuaryCaribbeanCreate() {
  return (
    <Suspense fallback={<div style={{ padding: '100px', textAlign: 'center', fontWeight: '900' }}>INITIALIZING PROTOCOL...</div>}>
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
    title: "", imageUrls: [], propertyType: "General Asset",
    location: "", city: "Santo Domingo", province: "Dominican Republic", 
    bedrooms: "", bathrooms: "", lotSize: "", 
    saleMode: "Auction", startingBid: "", buyNowPrice: "",
    description: "", category: "Caribbean", zipCode: ""
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
        const fileRef = ref(storage, `listings/${Date.now()}_${file.name}`);
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
    <div style={{ padding: '80px 40px', backgroundColor: '#f8f8f5', minHeight: '100vh', textAlign: 'left' }}>
      
      {/* ⬅️ BACK BUTTON (Sanctuary Gateway) */}
      <button 
        onClick={() => router.push('/market')} 
        style={{ 
          display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8', 
          background: 'none', border: 'none', cursor: 'pointer', marginBottom: '32px', 
          fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.2em' 
        }}
      >
        <ArrowLeft size={16} /> Sanctuary Gateway
      </button>

      {/* 🏙️ TWO-TONE HEADER */}
      <div style={{ maxWidth: '1000px', margin: '0 auto 48px', borderLeft: '4px solid #014d4e', paddingLeft: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#014d4e', marginBottom: '8px' }}>
          <Waves size={14} />
          <span style={{ fontSize: '9px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.4em' }}>
            International Portfolio Intake
          </span>
        </div>
        
        <h1 style={{ fontSize: '42px', fontWeight: '900', color: '#0f172a', margin: '0', textTransform: 'uppercase', letterSpacing: '-0.02em' }}>
          {isProperty ? (
            <>The <span style={{ color: '#014d4e' }}>Caribbean</span> Sanctuary</>
          ) : (
            <>Sovereign <span style={{ color: '#014d4e' }}>Asset</span> Intake</>
          )}
        </h1>
        
        <p style={{ color: '#64748b', fontSize: '11px', fontWeight: '700', marginTop: '8px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          {isProperty ? "Elite Vacation Estates & International Asset Deployment" : "Global Trade Protocol & High-Authority Asset Registry"}
        </p>
      </div>
        
        {/* HEADER */}
        <div style={{ marginBottom: '40px', borderLeft: '6px solid #014d4e', paddingLeft: '24px' }}>
          <h1 style={{ fontSize: '38px', fontWeight: '900', color: '#0f172a', margin: 0, letterSpacing: '-1px' }}>
            {isProperty ? "CARIBBEAN SANCTUARY" : "ASSET AUTHORITY INTAKE"}
          </h1>
          <p style={{ fontSize: '11px', color: '#014d4e', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '2px' }}>
            {isProperty ? "Portfolio: Elite Vacation Estates" : "Protocol: Global Trade Assets"}
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* CARD 1: IDENTITY */}
          <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '32px', boxShadow: '0 10px 30px rgba(0,0,0,0.04)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '10px', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase' }}>{isProperty ? "Estate Name" : "Asset Title"}</label>
              <input value={formData.title} style={{ padding: '16px', borderRadius: '16px', border: '2px solid #f1f5f9', background: '#f8fafc', fontWeight: '800', fontSize: '16px' }} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Title" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '10px', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase' }}>Classification</label>
              <input value={formData.propertyType} style={{ padding: '16px', borderRadius: '16px', border: '2px solid #f1f5f9', background: '#f8fafc', fontWeight: '800' }} onChange={e => setFormData({...formData, propertyType: e.target.value})} placeholder="e.g. Exotic Car / Villa" />
            </div>
          </div>

          {/* CARD 2: LOCATION & LOGISTICS (For the 100-mile sorting) */}
          <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '32px', boxShadow: '0 10px 30px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <label style={{ fontSize: '10px', fontWeight: '900', color: '#014d4e', textTransform: 'uppercase' }}>Geolocation & Sorting Info</label>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
              <input value={formData.location} placeholder="Street Address" style={{ padding: '16px', borderRadius: '16px', border: '2px solid #f1f5f9', background: '#f8fafc', fontWeight: '700' }} onChange={e => setFormData({...formData, location: e.target.value})} />
              <input value={formData.zipCode} placeholder="Zip/Postal" style={{ padding: '16px', borderRadius: '16px', border: '2px solid #f1f5f9', background: '#f8fafc', fontWeight: '700' }} onChange={e => setFormData({...formData, zipCode: e.target.value})} />
            </div>
          </div>

          {/* CARD 3: GALLERY */}
          <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '32px', boxShadow: '0 10px 30px rgba(0,0,0,0.04)' }}>
            <label style={{ fontSize: '10px', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '16px', display: 'block' }}>Visual Presentation</label>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <label style={{ width: '80px', height: '80px', backgroundColor: '#f1f5f9', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: '2px dashed #cbd5e1' }}>
                <Camera size={24} color="#94a3b8" />
                <input type="file" multiple className="hidden" onChange={e => setImageFiles(Array.from(e.target.files || []))} />
              </label>
              {formData.imageUrls?.map((url: any, i: number) => (
                <img key={i} src={url} style={{ width: '80px', height: '80px', borderRadius: '16px', objectFit: 'cover' }} />
              ))}
            </div>
          </div>

          {/* CARD 4: DESCRIPTION & PROVENANCE */}
          <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '32px', boxShadow: '0 10px 30px rgba(0,0,0,0.04)' }}>
            <label style={{ fontSize: '10px', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '12px', display: 'block' }}>Asset Provenance & Narrative</label>
            <textarea value={formData.description} style={{ width: '100%', minHeight: '120px', padding: '20px', borderRadius: '20px', border: '2px solid #f1f5f9', background: '#f8fafc', fontWeight: '600', outline: 'none' }} placeholder="Detail the history and condition of this asset..." onChange={e => setFormData({...formData, description: e.target.value})} />
          </div>

          {/* CARD 5: DEPLOYMENT (The Softened Box) */}
          <div style={{ backgroundColor: '#1e293b', padding: '40px', borderRadius: '40px', color: 'white' }}>
            <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
               <button type="button" onClick={() => setFormData({...formData, saleMode: 'Auction'})} style={{ flex: 1, padding: '16px', borderRadius: '16px', border: 'none', background: formData.saleMode === 'Auction' ? '#014d4e' : '#334155', color: 'white', fontWeight: '900', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                 <Gavel size={16} /> AUCTION
               </button>
               <button type="button" onClick={() => setFormData({...formData, saleMode: 'Fixed'})} style={{ flex: 1, padding: '16px', borderRadius: '16px', border: 'none', background: formData.saleMode === 'Fixed' ? '#014d4e' : '#334155', color: 'white', fontWeight: '900', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                 <ShoppingBag size={16} /> FIXED PRICE
               </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
              <div>
                <label style={{ fontSize: '9px', fontWeight: '900', color: '#2dd4bf', textTransform: 'uppercase' }}>Starting Bid</label>
                <input value={formData.startingBid} type="number" style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: '2px solid #0d9488', color: 'white', fontSize: '32px', fontWeight: '900', outline: 'none' }} onChange={e => setFormData({...formData, startingBid: e.target.value})} />
              </div>
              <div>
                <label style={{ fontSize: '9px', fontWeight: '900', color: '#fbbf24', textTransform: 'uppercase' }}>Buy Now Price</label>
                <input value={formData.buyNowPrice} type="number" style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: '2px solid #d97706', color: '#fbbf24', fontSize: '32px', fontWeight: '900', outline: 'none' }} onChange={e => setFormData({...formData, buyNowPrice: e.target.value})} />
              </div>
            </div>
          </div>

          <button type="submit" disabled={loading} style={{ width: '100%', padding: '24px', borderRadius: '24px', background: '#014d4e', color: 'white', border: 'none', fontWeight: '900', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '3px', cursor: 'pointer', boxShadow: '0 20px 40px rgba(1, 77, 78, 0.2)' }}>
            {loading ? "COMMENCING DEPLOYMENT..." : "FINALIZE AUTHORITY PROTOCOL"}
          </button>

        </form>
      </div>
    </div>
  );
}
