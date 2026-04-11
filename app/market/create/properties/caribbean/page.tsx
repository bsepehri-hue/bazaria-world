"use client";

import { useState, useEffect, Suspense } from "react";
import { db, storage } from "@/lib/firebase/client";
import { doc, getDoc, collection, addDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useRouter, useSearchParams } from "next/navigation";
import { BedDouble, ShieldCheck, ArrowLeft, Camera, MapPin, Waves, Maximize2, Droplets } from "lucide-react";

export default function SanctuaryCaribbeanCreate() {
  return (
    <Suspense fallback={<div style={{ padding: '100px', textAlign: 'center' }}>Loading Protocol...</div>}>
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
    location: "", city: "", province: "", bedrooms: "", bathrooms: "",
    lotSize: "", saleMode: "Auction", startingBid: "", buyNowPrice: "",
    description: "", category: "Caribbean" 
  });

  const category = formData.category?.toLowerCase() || '';
  const isProperty = category === 'property' || category === 'caribbean' || category === 'villas';

  useEffect(() => {
    if (!editId) return;
    const loadData = async () => {
      try {
        const snap = await getDoc(doc(db, "listings", editId));
        if (snap.exists()) setFormData({ ...prev, ...snap.data() });
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
        updatedAt: serverTimestamp() 
      };
      if (editId) await updateDoc(doc(db, "listings", editId), finalData);
      else await addDoc(collection(db, "listings"), { ...finalData, createdAt: serverTimestamp() });
      router.push("/market");
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  return (
    <div style={{ padding: '60px 20px', backgroundColor: '#f8f9fa', minHeight: '100vh', textAlign: 'left' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        
        {/* HEADER */}
        <div style={{ marginBottom: '40px', borderLeft: '5px solid #014d4e', paddingLeft: '20px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '900', color: '#0f172a', margin: 0 }}>
            {isProperty ? "THE CARIBBEAN SANCTUARY" : "SOVEREIGN ASSET INTAKE"}
          </h1>
          <p style={{ fontSize: '12px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>
            {isProperty ? "Elite Vacation Estates" : "Global Trade Protocol Assets"}
          </p>
        </div>

        {/* MAIN FORM CARD */}
        <form onSubmit={handleSubmit} style={{ backgroundColor: 'white', padding: '40px', borderRadius: '30px', boxShadow: '0 20px 40px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', gap: '30px' }}>
          
          {/* ROW 1 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '10px', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase' }}>{isProperty ? "Estate Name" : "Asset Title"}</label>
              <input value={formData.title} style={{ padding: '15px', borderRadius: '12px', border: '2px solid #f1f5f9', background: '#f8fafc', fontWeight: 'bold' }} onChange={e => setFormData({...formData, title: e.target.value})} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '10px', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase' }}>Classification</label>
              <input value={formData.propertyType} style={{ padding: '15px', borderRadius: '12px', border: '2px solid #f1f5f9', background: '#f8fafc', fontWeight: 'bold' }} onChange={e => setFormData({...formData, propertyType: e.target.value})} />
            </div>
          </div>

          {/* ROW 2: LOCATION */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '20px', background: '#f8fafc', borderRadius: '20px' }}>
             <label style={{ fontSize: '10px', fontWeight: '900', color: '#014d4e', textTransform: 'uppercase' }}>{isProperty ? "Property Location" : "Asset Origin"}</label>
             <input value={formData.location} placeholder="City, Country" style={{ padding: '15px', borderRadius: '12px', border: '2px solid #e2e8f0', background: 'white', fontWeight: 'bold' }} onChange={e => setFormData({...formData, location: e.target.value})} />
          </div>

          {/* ROW 3: SPECS (DYNAMICALLY VISIBLE) */}
          {isProperty && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ fontSize: '10px', fontWeight: '900' }}>Bedrooms</label>
                <input value={formData.bedrooms} style={{ padding: '12px', borderRadius: '10px', border: '1px solid #ddd' }} onChange={e => setFormData({...formData, bedrooms: e.target.value})} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ fontSize: '10px', fontWeight: '900' }}>Bathrooms</label>
                <input value={formData.bathrooms} style={{ padding: '12px', borderRadius: '10px', border: '1px solid #ddd' }} onChange={e => setFormData({...formData, bathrooms: e.target.value})} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ fontSize: '10px', fontWeight: '900' }}>m²</label>
                <input value={formData.lotSize} style={{ padding: '12px', borderRadius: '10px', border: '1px solid #ddd' }} onChange={e => setFormData({...formData, lotSize: e.target.value})} />
              </div>
            </div>
          )}

          {/* ROW 4: PRICING */}
          <div style={{ padding: '30px', background: '#0f172a', borderRadius: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
             <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ fontSize: '9px', fontWeight: '900', color: '#2dd4bf', textTransform: 'uppercase' }}>Starting Bid</label>
                <input value={formData.startingBid} type="number" style={{ background: 'transparent', border: 'none', borderBottom: '2px solid #134e4a', color: 'white', fontSize: '24px', fontWeight: 'bold', outline: 'none' }} onChange={e => setFormData({...formData, startingBid: e.target.value})} />
             </div>
             <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ fontSize: '9px', fontWeight: '900', color: '#fbbf24', textTransform: 'uppercase' }}>Buy Now</label>
                <input value={formData.buyNowPrice} type="number" style={{ background: 'transparent', border: 'none', borderBottom: '2px solid #78350f', color: '#fbbf24', fontSize: '24px', fontWeight: 'bold', outline: 'none' }} onChange={e => setFormData({...formData, buyNowPrice: e.target.value})} />
             </div>
          </div>

          {/* BUTTON */}
          <button type="submit" style={{ padding: '20px', background: '#014d4e', color: 'white', borderRadius: '15px', border: 'none', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '2px', cursor: 'pointer' }}>
            {loading ? "Registering..." : (editId ? "Update Authority Protocol" : "Deploy Asset")}
          </button>

        </form>
      </div>
    </div>
  );
}
