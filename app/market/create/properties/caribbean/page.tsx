"use client";

import { useState, useEffect, Suspense } from "react";
import { db, storage } from "@/lib/firebase/client";
import { doc, getDoc, collection, addDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useRouter, useSearchParams } from "next/navigation";
import { BedDouble, ShieldCheck, ArrowLeft, Camera, MapPin, Waves, Maximize2, Droplets, Gavel, ShoppingBag, Timer } from "lucide-react";

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
        if (snap.exists()) {
          const data = snap.data();
          setFormData((prev: any) => ({ 
            ...prev, 
            ...data,
            startingBid: data.startingBid?.toString() || "",
            buyNowPrice: data.buyNowPrice?.toString() || "",
          }));
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
      
      {/* ⬅️ BACK BUTTON */}
      <button 
        onClick={() => router.push('/market')} 
        style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '32px', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.2em' }}
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

      <div style={{ maxWidth: '1000px', margin: '0 auto', backgroundColor: 'white', borderRadius: '40px', boxShadow: '0 20px 50px rgba(0,0,0,0.05)', overflow: 'hidden', border: '1px solid #f1f5f9' }}>
        <form onSubmit={handleSubmit} style={{ padding: '60px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          {/* IDENTITY ROW */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '10px', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase' }}>{isProperty ? "Estate Name" : "Asset Title"}</label>
              <input value={formData.title} style={{ padding: '16px', borderRadius: '16px', border: '2px solid #f1f5f9', background: '#f8fafc', fontWeight: '800' }} onChange={e => setFormData({...formData, title: e.target.value})} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '10px', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase' }}>Classification</label>
              <input value={formData.propertyType} style={{ padding: '16px', borderRadius: '16px', border: '2px solid #f1f5f9', background: '#f8fafc', fontWeight: '800' }} onChange={e => setFormData({...formData, propertyType: e.target.value})} />
            </div>
          </div>

          {/* LOCATION */}
          <div style={{ padding: '32px', background: '#f8fafc', borderRadius: '24px', border: '2px solid #f1f5f9' }}>
            <label style={{ fontSize: '10px', fontWeight: '900', color: '#014d4e', textTransform: 'uppercase', marginBottom: '16px', display: 'block' }}>{isProperty ? "Property Location" : "Asset Origin"}</label>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
              <input value={formData.location} placeholder="Street Address" style={{ padding: '16px', borderRadius: '16px', border: '2px solid #e2e8f0', background: 'white', fontWeight: '700' }} onChange={e => setFormData({...formData, location: e.target.value})} />
              <input value={formData.zipCode} placeholder="Zip Code" style={{ padding: '16px', borderRadius: '16px', border: '2px solid #e2e8f0', background: 'white', fontWeight: '700' }} onChange={e => setFormData({...formData, zipCode: e.target.value})} />
            </div>
          </div>

          {/* SPECS (ONLY FOR PROPERTIES) */}
          {isProperty && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '10px', fontWeight: '900', color: '#94a3b8' }}>BEDROOMS</label>
                <input value={formData.bedrooms} style={{ padding: '16px', borderRadius: '16px', border: '2px solid #f1f5f9', fontWeight: '800' }} onChange={e => setFormData({...formData, bedrooms: e.target.value})} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '10px', fontWeight: '900', color: '#94a3b8' }}>BATHROOMS</label>
                <input value={formData.bathrooms} style={{ padding: '16px', borderRadius: '16px', border: '2px solid #f1f5f9', fontWeight: '800' }} onChange={e => setFormData({...formData, bathrooms: e.target.value})} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '10px', fontWeight: '900', color: '#94a3b8' }}>LOT SIZE (m²)</label>
                <input value={formData.lotSize} style={{ padding: '16px', borderRadius: '16px', border: '2px solid #f1f5f9', fontWeight: '800' }} onChange={e => setFormData({...formData, lotSize: e.target.value})} />
              </div>
            </div>
          )}

          {/* GALLERY */}
          <div style={{ textAlign: 'left' }}>
            <label style={{ fontSize: '10px', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '12px', display: 'block' }}>Media Presentation</label>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <label style={{ width: '100px', height: '100px', backgroundColor: '#f8fafc', border: '2px dashed #e2e8f0', borderRadius: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <Camera size={24} color="#94a3b8" />
                <input type="file" multiple className="hidden" onChange={e => setImageFiles(Array.from(e.target.files || []))} />
              </label>
              {formData.imageUrls?.map((url: any, i: number) => (
                <img key={i} src={url} style={{ width: '100px', height: '100px', borderRadius: '20px', objectFit: 'cover' }} alt="asset" />
              ))}
            </div>
          </div>

          {/* DESCRIPTION */}
          <div style={{ textAlign: 'left' }}>
            <label style={{ fontSize: '10px', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '12px', display: 'block' }}>Narrative & Provenance</label>
            <textarea value={formData.description} style={{ width: '100%', minHeight: '120px', padding: '20px', borderRadius: '20px', border: '2px solid #f1f5f9', background: '#f8fafc', fontWeight: '600' }} placeholder="Asset History..." onChange={e => setFormData({...formData, description: e.target.value})} />
          </div>

          {/* PRICING BLOCK */}
          <div style={{ background: '#1e293b', padding: '40px', borderRadius: '32px', color: 'white' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <label style={{ fontSize: '9px', fontWeight: '900', color: '#2dd4bf', textTransform: 'uppercase' }}>Starting Bid / Price</label>
                <input value={formData.startingBid} type="number" style={{ background: 'transparent', border: 'none', borderBottom: '2px solid #0d9488', color: 'white', fontSize: '32px', fontWeight: '900', outline: 'none' }} onChange={e => setFormData({...formData, startingBid: e.target.value})} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <label style={{ fontSize: '9px', fontWeight: '900', color: '#fbbf24', textTransform: 'uppercase' }}>Buy Now Option</label>
                <input value={formData.buyNowPrice} type="number" style={{ background: 'transparent', border: 'none', borderBottom: '2px solid #d97706', color: '#fbbf24', fontSize: '32px', fontWeight: '900', outline: 'none' }} onChange={e => setFormData({...formData, buyNowPrice: e.target.value})} />
              </div>
            </div>
          </div>

          {/* SUBMIT */}
          <button type="submit" disabled={loading} style={{ width: '100%', padding: '24px', background: '#014d4e', color: 'white', borderRadius: '20px', border: 'none', fontWeight: '900', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '2px', cursor: 'pointer' }}>
            {loading ? "INITIALIZING..." : (editId ? "Update Authority Protocol" : "Deploy Asset")}
          </button>
        </form>
      </div>
    </div>
  );
}
