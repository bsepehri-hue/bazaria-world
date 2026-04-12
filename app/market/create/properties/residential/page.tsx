
"use client";

import { 
  doc, 
  getDoc, 
  deleteDoc, 
  collection, 
  addDoc, 
  serverTimestamp, 
  updateDoc 
} from "firebase/firestore";

import { useState, useEffect, Suspense } from "react";
import { db } from "@/lib/firebase/client";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  BedDouble, 
  ShieldCheck, 
  ArrowLeft, 
  Camera, 
  Home, 
  Maximize2, 
  Droplets,
  Building2 
} from "lucide-react";

// 1️⃣ THE WRAPPER
export default function ResidentialHomeCreate() {
  return (
    <Suspense fallback={
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8f8f5' }}>
        <p style={{ fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.4em', color: '#014d4e' }}>
          Initializing Residential Protocol...
        </p>
      </div>
    }>
      <ResidentialFormCore />
    </Suspense>
  );
}

// 2️⃣ THE CORE ENGINE
function ResidentialFormCore() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('edit');

  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [isDeleteLocked, setIsDeleteLocked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  
  const [formData, setFormData] = useState({
    title: "",
    imageUrls: [],
    propertyType: "Single Family Home",
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
    description: "",
    isSanctuaryAsset: false, // Set to false for standard residential
    assetClass: "Residential/Standard-Market"
  });

  // 🛡️ DELETE LOGIC
  const handleDelete = async () => {
    if (!editId || isDeleteLocked) return;
    if (!isConfirmingDelete) {
      setIsConfirmingDelete(true);
      setIsDeleteLocked(true);
      setTimeout(() => setIsDeleteLocked(false), 1500);
      setTimeout(() => {
        setIsConfirmingDelete(false);
        setIsDeleteLocked(false);
      }, 5000);
      return;
    }
    try {
      await deleteDoc(doc(db, "listings", editId));
      router.push("/market");
    } catch (error) {
      console.error("Deletion Error:", error);
      setIsConfirmingDelete(false);
      setIsDeleteLocked(false);
    }
  };
  
  // 💧 HYDRATION LOGIC
  useEffect(() => {
    const loadAsset = async () => { 
      if (!editId) return;
      try {
        const docSnap = await getDoc(doc(db, "listings", editId));
        if (docSnap.exists()) {
          setFormData(docSnap.data() as any);
        }
      } catch (err) {
        console.error("Hydration Failed:", err);
      }
    };
    loadAsset();
  }, [editId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const finalImageUrls = [...(formData.imageUrls || [])];
      const bnp = Number(formData.buyNowPrice) || 0;
      const sbd = Number(formData.startingBid) || 0;
      const res = Number(formData.reservePrice) || 0;

      const isFixedPrice = sbd === 0 && bnp > 0;

      const listingData = {
        ...formData,
        category: "Residential", // 🎯 MASTER CATEGORY CHANGE
        imageUrls: finalImageUrls,
        imageUrl: finalImageUrls[0] || "",
        price: isFixedPrice ? bnp : sbd, 
        buyNowPrice: bnp,
        startingBid: sbd,
        currentBid: sbd, 
        reservePrice: res,
        bedrooms: Number(formData.bedrooms) || 0,
        bathrooms: Number(formData.bathrooms) || 0,
        lotSize: Number(formData.lotSize) || 0,
        saleMode: isFixedPrice ? "Fixed Price" : "Auction + Buy Now", 
        updatedAt: serverTimestamp(),
        status: "active",
      };

      if (editId) {
        await updateDoc(doc(db, "listings", editId), listingData);
      } else {
        await addDoc(collection(db, "listings"), {
          ...listingData,
          createdAt: serverTimestamp(),
        });
      }
      router.push("/market");
    } catch (error) {
      console.error("Deployment Error:", error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div style={{ 
      padding: '80px 40px', 
      backgroundColor: '#f8f8f5', 
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center' // 🎯 Forces the entire column to center
    }}>
      
      {/* 1. Navigation Wrapper */}
      <div style={{ width: '100%', maxWidth: '1000px' }}>
        <button 
          onClick={() => router.push('/market/create/properties')} 
          style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '32px', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.2em' }}
        >
          <ArrowLeft size={16} /> Property Portal
        </button>

        {/* 2. Header */}
        <div style={{ marginBottom: '48px', borderLeft: '4px solid #0f172a', paddingLeft: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0f172a', marginBottom: '8px' }}>
            <Home size={14} />
            <span style={{ fontSize: '9px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.4em' }}>
              Residential Asset Intake
            </span>
          </div>
          <h1 style={{ fontSize: '42px', fontWeight: '900', color: '#0f172a', margin: '0', textTransform: 'uppercase', letterSpacing: '-0.02em' }}>
            The <span style={{ color: '#64748b' }}>Residential</span> Portal
          </h1>
          <p style={{ color: '#64748b', fontSize: '11px', fontWeight: '700', marginTop: '8px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Standard Housing, Condominiums, and Domestic Estate Management
          </p>
        </div>

        {/* 3. Main Form Card */}
        <div style={{ 
          backgroundColor: '#ffffff', 
          borderRadius: '40px', 
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)', 
          border: '1px solid #f1f5f9',
          overflow: 'hidden'
        }}>
          <form onSubmit={handleSubmit} style={{ padding: '60px', display: 'flex', flexDirection: 'column', gap: '40px' }}>
            
            {/* IDENTITY SECTION */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <label style={{ fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', color: '#94a3b8', letterSpacing: '0.1em' }}>Property Title</label>
                <input value={formData.title} placeholder="e.g. Modern Downtown Loft" style={{ padding: '16px', backgroundColor: '#f8fafc', border: '2px solid #f1f5f9', borderRadius: '16px', fontWeight: '700', outline: 'none' }} onChange={(e) => setFormData({...formData, title: e.target.value})} required />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <label style={{ fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', color: '#94a3b8', letterSpacing: '0.1em' }}>Classification</label>
                <select value={formData.propertyType} style={{ padding: '16px', backgroundColor: '#f8fafc', border: '2px solid #f1f5f9', borderRadius: '16px', fontWeight: '700' }} onChange={(e) => setFormData({...formData, propertyType: e.target.value})}>
                  <option>Single Family Home</option>
                  <option>Condominium</option>
                  <option>Townhouse</option>
                  <option>Luxury Apartment</option>
                </select>
              </div>
            </div>

            {/* GALLERY SECTION */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <label style={{ fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', color: '#94a3b8' }}>Property Gallery</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: '12px' }}>
                <label style={{ aspectRatio: '1/1', border: '2px dashed #e2e8f0', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#94a3b8' }}>
                  <Camera size={20} />
                  <input type="file" multiple className="hidden" onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    setImageFiles((prev) => [...prev, ...files].slice(0, 8));
                  }} />
                </label>
                {formData.imageUrls?.map((url, idx) => (
                  <div key={idx} style={{ position: 'relative', aspectRatio: '1/1', borderRadius: '12px', overflow: 'hidden' }}>
                    <img src={url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))}
              </div>
            </div>

            {/* PRICING BLOCK */}
            <div style={{ backgroundColor: '#0f172a', padding: '40px', borderRadius: '32px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '40px' }}>
              <div>
                <label style={{ color: '#94a3b8', fontSize: '9px', fontWeight: '900', textTransform: 'uppercase' }}>Starting Bid</label>
                <input value={formData.startingBid} type="number" style={{ width: '100%', background: 'none', border: 'none', borderBottom: '2px solid #1e293b', color: 'white', fontSize: '24px', fontWeight: '900', outline: 'none' }} onChange={(e) => setFormData({...formData, startingBid: e.target.value})} />
              </div>
              <div>
                <label style={{ color: '#f59e0b', fontSize: '9px', fontWeight: '900', textTransform: 'uppercase' }}>Buy Now</label>
                <input value={formData.buyNowPrice} type="number" style={{ width: '100%', background: 'none', border: 'none', borderBottom: '2px solid #78350f', color: '#f59e0b', fontSize: '24px', fontWeight: '900', outline: 'none' }} onChange={(e) => setFormData({...formData, buyNowPrice: e.target.value})} />
              </div>
              <div>
                <label style={{ color: '#f43f5e', fontSize: '9px', fontWeight: '900', textTransform: 'uppercase' }}>Reserve</label>
                <input value={formData.reservePrice} type="number" style={{ width: '100%', background: 'none', border: 'none', borderBottom: '2px solid #881337', color: '#f43f5e', fontSize: '24px', fontWeight: '900', outline: 'none' }} onChange={(e) => setFormData({...formData, reservePrice: e.target.value})} />
              </div>
            </div>

            {/* 🎯 AUTHORITY CHECKBOX */}
            <div style={{ backgroundColor: '#f8fafc', padding: '24px', borderRadius: '20px', border: '1px solid #e2e8f0', display: 'flex', gap: '16px' }}>
              <input type="checkbox" required style={{ width: '20px', height: '20px', accentColor: '#0f172a', cursor: 'pointer' }} />
              <p style={{ margin: 0, fontSize: '11px', color: '#64748b', fontWeight: '600', lineHeight: '1.5' }}>
                I confirm this property is legally under my authority for deployment on 
                <span style={{ color: '#0f172a', fontWeight: '900' }}> BAZARIA WORLD</span>. 
                I agree to the Sovereign Asset Protocol and certify all data is accurate.
              </p>
            </div>

            {/* BUTTONS */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <button type="submit" disabled={loading} style={{ padding: '24px', backgroundColor: '#0f172a', color: 'white', borderRadius: '16px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.2em', cursor: 'pointer' }}>
                {loading ? "PROCESSING..." : (editId ? "Update Property" : "Deploy Residential Asset")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
