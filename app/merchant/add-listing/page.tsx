"use client";

import React, { useState } from "react";
import { db, storage } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useRouter } from "next/navigation";
import { 
  Plus, Image as ImageIcon, CheckCircle2, 
  MapPin, Tag, Car, Home, Package, X, UploadCloud
} from "lucide-react";

export default function AddListingPage() {
  const router = useRouter();
  const [category, setCategory] = useState("Property");
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
    saleMode: "Buy Now",
    condition: "Mint",
    vin: "",
    mileage: "",
    beds: "",
    baths: "",
    lotSize: ""
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setImages((prev) => [...prev, ...selectedFiles]);
      const newPreviews = selectedFiles.map(file => URL.createObjectURL(file));
      setPreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const uploadedUrls = await Promise.all(
        images.map(async (file) => {
          const storageRef = ref(storage, `listings/${Date.now()}-${file.name}`);
          const snapshot = await uploadBytes(storageRef, file);
          return getDownloadURL(snapshot.ref);
        })
      );

      await addDoc(collection(db, "listings"), {
  ...formData,
  category: category, 
  // Force a clean field name and ensure the value is trimmed
  subCategory: formData.subCategory?.trim() || "", 
  imageUrls: uploadedUrls,
  imageUrl: uploadedUrls[0] || "",
  createdAt: serverTimestamp(),
  status: "pending"
});
      router.push("/merchant/dashboard");
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: '#fff', padding: '80px 24px', fontFamily: 'sans-serif' }}>
      
      <div style={{ maxWidth: '750px', margin: '0 auto' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 1000, textTransform: 'uppercase', letterSpacing: '-0.05em', margin: 0 }}>Asset Intake</h1>
          <p style={{ fontSize: '10px', fontWeight: 900, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5em', marginTop: '20px' }}>Protocol: Inventory Expansion</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
         {/* 01. CLASSIFICATION */}
<section style={cardStyle}>
  <p style={stepHeaderStyle}>01. Asset Classification</p>
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '16px' }}>
    {[
      { n: 'Property', i: <Home size={22}/> },
      { n: 'Mobility', i: <Car size={22}/> },
      { n: 'General', i: <Package size={22}/> }
    ].map((cat) => (
      <div 
        key={cat.n} 
        onClick={() => {
          setCategory(cat.n);
          // 🏆 THE FIX: Reset subCategory so "Trucks" doesn't stay selected when moving to "Property"
          setFormData(prev => ({ ...prev, subCategory: "" }));
        }} 
        style={{ 
          ...catButtonStyle, 
          backgroundColor: category === cat.n ? '#fff' : 'rgba(255,255,255,0.02)', 
          color: category === cat.n ? '#000' : '#475569', 
          border: category === cat.n ? 'none' : '1px solid rgba(255,255,255,0.05)' 
        }}
      >
        {cat.i}
        <div style={{ fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', marginTop: '12px' }}>{cat.n}</div>
      </div>
    ))}
  </div>
</section>

         {/* 02. DOSSIER */}
<section style={cardStyle}>
  <p style={stepHeaderStyle}>02. Primary Dossier</p>
  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
    
    {/* 🎯 NEW: SUB-CATEGORY SELECTOR */}
    <div style={{ marginBottom: '10px' }}>
      <label style={{ fontSize: '10px', fontWeight: 900, color: '#475569', display: 'block', marginBottom: '8px' }}>SUB-CLASSIFICATION</label>
      <select 
        name="subCategory" 
        onChange={handleChange} 
        required 
        style={inputStyle}
      >
        <option value="">SELECT SUB-CATEGORY</option>
        
        {/* MOBILITY SUBS */}
        {category === 'Mobility' && (
          <>
            <option value="Cars">CARS</option>
            <option value="Motorcycles">MOTORCYCLES</option>
            <option value="Trucks">TRUCKS</option>
            <option value="Heavy Equipment">HEAVY EQUIPMENT</option>
          </>
        )}

        {/* PROPERTY SUBS */}
        {category === 'Property' && (
          <>
            <option value="Villas">VILLAS</option>
            <option value="Land">LAND</option>
            <option value="Apartments">APARTMENTS</option>
            <option value="Commercial">COMMERCIAL</option>
          </>
        )}

       {/* GENERAL / ART SUBS */}
{category === 'General' && (
  <>
    <option value="Paintings">PAINTINGS</option>
    <option value="Sculptures">SCULPTURES</option>
    <option value="Digital Art / NFTs">DIGITAL ART / NFTS</option>
    <option value="Collectibles">COLLECTIBLES</option>
    {/* 🏆 ADD THIS ONE TO MATCH THE SUB-MENU BUTTON */}
    <option value="Other / Unique Art">OTHER / UNIQUE ART</option>
  </>
)}
      </select>
    </div>

    <input name="title" placeholder="ASSET TITLE" onChange={handleChange} required style={inputStyle} />
    <textarea name="description" placeholder="DETAILED PROVENANCE" onChange={handleChange} required style={{ ...inputStyle, height: '140px', paddingTop: '24px' }} />
    
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
      <input name="price" placeholder="MARKET VALUE ($)" onChange={handleChange} required style={inputStyle} />
      <input name="location" placeholder="LOCATION / HUB" onChange={handleChange} required style={inputStyle} />
    </div>
  </div>
</section>

          {/* 03. TECHNICALS */}
<section style={cardStyle}>
  <p style={stepHeaderStyle}>03. Technical Specifications / Tags</p>
  
 {/* 🎯 FIXED: Replaced placeholders with valid JSX */}
{category === 'Property' && <div>Property Fields</div>}
{category === 'Mobility' && <div>Mobility Fields</div>}

  {/* 🎨 NEW: ART / GENERAL TAGS */}
  {category === 'General' && (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <label style={{ fontSize: '10px', fontWeight: 900, color: '#475569' }}>SELECT ART CLASSIFICATION</label>
      <select 
        name="subCategory" 
        onChange={handleChange} 
        required 
        style={inputStyle}
      >
        <option value="">-- SELECT TYPE --</option>
        <option value="Paintings">PAINTINGS</option>
        <option value="Sculptures">SCULPTURES</option>
        <option value="Digital Art / NFTs">DIGITAL ART / NFTS</option>
        <option value="Collectibles">COLLECTIBLES</option>
        <option value="Other / Unique Art">OTHER / UNIQUE ART</option>
      </select>
      
      {/* Existing Condition field */}
      <select name="condition" onChange={handleChange} style={inputStyle}>
        <option value="Mint">MINT CONDITION</option>
        <option value="Excellent">EXCELLENT</option>
        <option value="Good">GOOD</option>
      </select>
    </div>
  )}
</section>

          {/* 04. VISUAL PROOF (NEW) */}
          <section style={cardStyle}>
            <p style={stepHeaderStyle}>04. Visual Proof</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '16px', marginBottom: '24px' }}>
              {previews.map((url, i) => (
                <div key={i} style={{ position: 'relative', width: '100px', height: '100px', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <img src={url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button onClick={() => removeImage(i)} style={{ position: 'absolute', top: '4px', right: '4px', backgroundColor: '#f43f5e', border: 'none', borderRadius: '50%', width: '24px', height: '24px', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={14}/></button>
                </div>
              ))}
              <label style={{ width: '100px', height: '100px', borderRadius: '16px', border: '2px dashed rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#475569' }}>
                <Plus size={24} />
                <input type="file" multiple onChange={handleImageChange} style={{ display: 'none' }} />
              </label>
            </div>
          </section>

          <button type="submit" disabled={loading} style={submitButtonStyle}>
            {loading ? "TRANSMITTING DATA..." : "INITIALIZE LISTING"}
            {!loading && <CheckCircle2 size={24} />}
          </button>

        </form>
      </div>
    </div>
  );
}

const cardStyle = { backgroundColor: 'rgba(255,255,255,0.02)', padding: '48px', borderRadius: '48px', border: '1px solid rgba(255,255,255,0.06)' };
const stepHeaderStyle = { fontSize: '11px', fontWeight: 900, color: '#14b8a6', textTransform: 'uppercase' as const, letterSpacing: '0.25em', marginBottom: '32px' };
const inputStyle = { width: '100%', height: '64px', backgroundColor: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '20px', padding: '0 24px', color: '#fff', fontSize: '12px', fontWeight: 900, textTransform: 'uppercase' as const, outline: 'none' };
const catButtonStyle = { padding: '32px 24px', borderRadius: '24px', textAlign: 'center' as const, cursor: 'pointer', transition: '0.2s' };
const submitButtonStyle = { height: '84px', backgroundColor: '#fff', color: '#000', borderRadius: '32px', border: 'none', fontSize: '15px', fontWeight: 1000, textTransform: 'uppercase' as const, letterSpacing: '0.4em', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' };
