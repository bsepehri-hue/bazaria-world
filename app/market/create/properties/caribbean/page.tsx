"use client";

import { useState, useEffect, Suspense } from "react";
import { db, storage } from "@/lib/firebase/client";
import { doc, getDoc, collection, addDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useRouter, useSearchParams } from "next/navigation";
import { BedDouble, ShieldCheck, ArrowLeft, Camera, MapPin, Waves, Maximize2, Droplets, Gavel, ShoppingBag, CheckCircle2 } from "lucide-react";

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
  const [agreedToRules, setAgreedToRules] = useState(false);
  
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
          setFormData((prev: any) => ({ ...prev, ...data }));
        }
      } catch (e) { console.error(e); }
    };
    loadData();
  }, [editId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedToRules) { alert("Please acknowledge the Bazaria Trade Rules."); return; }
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
    <div style={{ padding: '40px 5%', backgroundColor: '#f8f8f5', minHeight: '100vh', textAlign: 'left' }}>
      
      {/* ⬅️ BACK BUTTON */}
      <button 
        onClick={() => router.push('/market')} 
        style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '32px', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase' }}
      >
        <ArrowLeft size={16} /> Sanctuary Gateway
      </button>

      {/* 🏙️ HEADER */}
      <div style={{ maxWidth: '1000px', margin: '0 auto 48px', borderLeft: '4px solid #014d4e', paddingLeft: '24px' }}>
        <h1 style={{ fontSize: 'clamp(24px, 5vw, 42px)', fontWeight: '900', color: '#0f172a', margin: '0', textTransform: 'uppercase' }}>
          {isProperty ? (<>The <span style={{ color: '#014d4e' }}>Caribbean</span> Sanctuary</>) : (<>Sovereign <span style={{ color: '#014d4e' }}>Asset</span> Intake</>)}
        </h1>
        <p style={{ color: '#64748b', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          Elite Trade Protocol & High-Authority Asset Registry
        </p>
      </div>

      <div style={{ maxWidth: '1000px', margin: '0 auto', backgroundColor: 'white', borderRadius: '32px', boxShadow: '0 20px 50px rgba(0,0,0,0.05)', overflow: 'hidden', border: '1px solid #f1f5f9' }}>
        <form onSubmit={handleSubmit} style={{ padding: 'clamp(20px, 5%, 60px)', display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          {/* IDENTITY */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '10px', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase' }}>{isProperty ? "Estate Name" : "Asset Title"}</label>
                <input value={formData.title} style={{ padding: '16px', borderRadius: '16px', border: '2px solid #f1f5f9', background: '#f8fafc', fontWeight: '800' }} onChange={e => setFormData({...formData, title: e.target.value})} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '10px', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase' }}>Classification</label>
                <input value={formData.propertyType} style={{ padding: '16px', borderRadius: '16px', border: '2px solid #f1f5f9', background: '#f8fafc', fontWeight: '800' }} onChange={e => setFormData({...formData, propertyType: e.target.value})} />
              </div>
            </div>
          </div>

          {/* GEOLOCATION */}
          <div style={{ padding: '24px', background: '#f8fafc', borderRadius: '24px' }}>
            <label style={{ fontSize: '10px', fontWeight: '900', color: '#014d4e', textTransform: 'uppercase', marginBottom: '12px', display: 'block' }}>Location Protocol (100-Mile Radius Sync)</label>
            <input value={formData.location} placeholder="Street Address, City, Zip" style={{ width: '100%', boxSizing: 'border-box', padding: '16px', borderRadius: '16px', border: '2px solid #e2e8f0', background: 'white', fontWeight: '700' }} onChange={e => setFormData({...formData, location: e.target.value})} />
          </div>

          {/* MEDIA GALLERY */}
          <div style={{ textAlign: 'left' }}>
            <label style={{ fontSize: '10px', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '12px', display: 'block' }}>Media Assets</label>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <label style={{ width: '80px', height: '80px', backgroundColor: '#f8fafc', border: '2px dashed #e2e8f0', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <Camera size={20} color="#94a3b8" />
                <input type="file" multiple style={{ display: 'none' }} onChange={e => setImageFiles(Array.from(e.target.files || []))} />
              </label>
              {formData.imageUrls?.map((url: any, i: number) => (
                <img key={i} src={url} style={{ width: '80px', height: '80px', borderRadius: '16px', objectFit: 'cover' }} />
              ))}
            </div>
          </div>

          {/* DESCRIPTION */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '10px', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase' }}>Provenance Narrative</label>
            <textarea value={formData.description} style={{ width: '100%', boxSizing: 'border-box', minHeight: '100px', padding: '16px', borderRadius: '16px', border: '2px solid #f1f5f9', background: '#f8fafc', fontWeight: '600' }} onChange={e => setFormData({...formData, description: e.target.value})} />
          </div>

          {/* PRICING (WHITE THEME) */}
          <div style={{ background: '#ffffff', padding: '32px', borderRadius: '24px', border: '2px solid #014d4e' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '32px' }}>
              <div>
                <label style={{ fontSize: '9px', fontWeight: '900', color: '#014d4e', textTransform: 'uppercase' }}>Starting Bid</label>
                <input value={formData.startingBid} type="number" style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: '2px solid #014d4e', color: '#014d4e', fontSize: '32px', fontWeight: '900', outline: 'none' }} onChange={e => setFormData({...formData, startingBid: e.target.value})} />
              </div>
              <div>
                <label style={{ fontSize: '9px', fontWeight: '900', color: '#b45309', textTransform: 'uppercase' }}>Buy Now Price</label>
                <input value={formData.buyNowPrice} type="number" style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: '2px solid #b45309', color: '#b45309', fontSize: '32px', fontWeight: '900', outline: 'none' }} onChange={e => setFormData({...formData, buyNowPrice: e.target.value})} />
              </div>
            </div>
          </div>

          {/* BAZARIA RULES CHECKBOX */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '20px', backgroundColor: '#f0fdfa', borderRadius: '16px', border: '1px solid #ccfbf1' }}>
            <input type="checkbox" checked={agreedToRules} onChange={e => setAgreedToRules(e.target.checked)} style={{ marginTop: '4px', cursor: 'pointer', width: '18px', height: '18px' }} />
            <p style={{ margin: 0, fontSize: '11px', fontWeight: '700', color: '#134e4a', lineHeight: '1.5' }}>
              I acknowledge the <span style={{ textDecoration: 'underline', cursor: 'pointer' }}>Bazaria Global Trade Rules</span>. I certify that this asset is under my legal authority and matches the provenance described above.
            </p>
          </div>

          <button type="submit" disabled={loading} style={{ width: '100%', padding: '24px', background: agreedToRules ? '#014d4e' : '#cbd5e1', color: 'white', borderRadius: '20px', border: 'none', fontWeight: '900', textTransform: 'uppercase', cursor: agreedToRules ? 'pointer' : 'not-allowed' }}>
            {loading ? "COMMENCING DEPLOYMENT..." : (editId ? "Update Authority Protocol" : "Deploy Asset")}
          </button>
        </form>
      </div>
    </div>
  );
}
