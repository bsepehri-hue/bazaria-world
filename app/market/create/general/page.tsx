"use client";

export const dynamic = 'force-dynamic';

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  doc, 
  getDoc, 
  deleteDoc, 
  collection, 
  addDoc, 
  updateDoc, 
  serverTimestamp 
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, db, storage } from "@/lib/firebase/client";
import { useAuth } from "@/context/AuthContext";
import { 
  Package, 
  ArrowLeft, 
  Camera,
  ShieldCheck,
  ArrowRight,
  Frame
} from "lucide-react";

// 2️⃣ THE CORE ENGINE
function GeneralFormCore() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('edit');
  const { user } = useAuth();

  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [isDeleteLocked, setIsDeleteLocked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  
  // 🛡️ TERMS AGREEMENT
  const [isAgreed, setIsAgreed] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    imageUrls: [] as string[],
    category: "misc",
    subCategory: "",
    condition: "Mint",
    location: "",
    city: "",
    province: "",
    saleMode: "Auction + Buy Now",
    startingBid: "",
    reservePrice: "",
    buyNowPrice: "",
    description: "",
    make: "",
    model: "",
    isGeneralAsset: true
  });

  // 🛡️ HARD INTERLOCK: Stop General Form from rendering for heavy-duty vehicles
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const category = params.get("category") || "";
    const type = params.get("type") || "";

    if (
      category.includes("truck") ||
      category.includes("rv") ||
      category.includes("mobility") ||
      type.includes("truck") ||
      type.includes("rv")
    ) {
      router.push("/market/create/mobility");
    }
  }, [router]);

  // 💧 HYDRATION LOGIC
  useEffect(() => {
    const loadAsset = async () => { 
      if (!editId) return;
      try {
        const docSnap = await getDoc(doc(db, "listings", editId));
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFormData(prev => ({
            ...prev,
            ...data,
            imageUrls: data.imageUrls || data.images || [],
            category: (data.category || "misc").toLowerCase().trim()
          } as any));
        }
      } catch (err) {
        console.error("Hydration Failed:", err);
      }
    };
    loadAsset();
  }, [editId]);

  const handleRemoveExistingImage = (urlToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      imageUrls: prev.imageUrls.filter(url => url !== urlToRemove)
    }));
  };

  const handleRemoveNewImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleDelete = async () => {
    if (!editId || isDeleteLocked) return;
    if (!isConfirmingDelete) {
      setIsConfirmingDelete(true);
      setIsDeleteLocked(true);
      setTimeout(() => setIsDeleteLocked(false), 1500);
      setTimeout(() => { setIsConfirmingDelete(false); setIsDeleteLocked(false); }, 5000);
      return;
    }

    try {
      setLoading(true);
      await deleteDoc(doc(db, "listings", editId));
      router.push("/market");
    } catch (error) {
      console.error("Deletion Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAgreed) {
      alert("Please acknowledge the Terms of Deployment.");
      return;
    }
    
    const activeUser = user || auth.currentUser;
    if (!activeUser) {
      alert("Authentication required. Please refresh or log in again.");
      return;
    }

    // 🛡️ BAZARIA PROTOCOL: REFINED MOBILITY REDIRECTION
    const isMobilityItem = (() => {
      const cat = (formData.category || "").toLowerCase();
      const title = (formData.title || "").toLowerCase();
      const desc = (formData.description || "").toLowerCase();

      if (cat.includes('service')) return false;

      const mobilityTerms = ['rv', 'truck', 'trailer', 'auto', 'motorcycle', 'heavy-machinery'];
      const hasMobilityKeyword = mobilityTerms.some((term) => {
        const regex = new RegExp(`\\b${term}\\b`, 'i'); 
        return regex.test(title) || regex.test(desc) || regex.test(cat);
      });

      return cat === "mobility" || hasMobilityKeyword;
    })();

    if (isMobilityItem) {
      alert("This classification belongs to Mobility & Logistics. Rerouting to the appropriate protocol.");
      router.push("/market/create/mobility");
      return;
    }

    // 💰 BID VS BUY LOGIC GUARD
    if (formData.startingBid && !formData.reservePrice) {
      alert("Auction mode requires a Reserve Price.");
      return;
    }

    setLoading(true);

    try {
      // 📸 1. UPLOAD NEW IMAGES
      const uploadedUrls = [];
      for (const file of imageFiles) {
        const storageRef = ref(storage, `general/${Date.now()}-${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        const url = await getDownloadURL(snapshot.ref);
        uploadedUrls.push(url);
      }

      const finalImageUrls = [...(formData.imageUrls || []), ...uploadedUrls];
      let finalEndTime = new Date();
      finalEndTime.setDate(finalEndTime.getDate() + 3);
      let createdTimestamp: any = serverTimestamp();

      if (editId) {
        const docRef = doc(db, "listings", editId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const existingData = docSnap.data();
          if (existingData.endTime) {
            finalEndTime = existingData.endTime;
          }
          if (existingData.createdAt) {
            createdTimestamp = existingData.createdAt;
          }
        }
      }

      const listingData = {
        ...formData,
        reservePrice: parseFloat(formData.reservePrice as any) || 0,
        buyNowPrice: parseFloat(formData.buyNowPrice as any) || 0,
        startingBid: parseFloat(formData.startingBid as any) || 0,
        imageUrls: finalImageUrls,
        imageUrl: finalImageUrls[0] || "",
        userId: activeUser.uid,
        ownerId: activeUser.uid,
        merchantName: activeUser.displayName || "Bazaria Merchant",
        listingType: formData.startingBid ? "auction" : "buy-now",
        endTime: typeof finalEndTime === 'string' ? finalEndTime : (finalEndTime as Date).toISOString(),
        durationDays: "3",
        searchKeywords: `${formData.title} ${formData.category} ${formData.subCategory || ""} ${formData.make || ""} ${formData.model || ""} ${formData.description}`.toLowerCase(),
        updatedAt: serverTimestamp(),
      };

      if (editId) {
        await updateDoc(doc(db, "listings", editId), {
          ...listingData,
          createdAt: createdTimestamp,
        });
        alert("Protocol Updated Successfully");
      } else {
        await addDoc(collection(db, "listings"), {
          ...listingData,
          createdAt: createdTimestamp,
        });
        alert("Asset Deployed Successfully");
      }
      
      router.push(`/storefront/${activeUser.uid}`);
    } catch (error) {
      console.error("Submission Error:", error);
      alert("Deployment failed. Please check your connection.");
    } Platform: {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '80px 40px', backgroundColor: '#f8f8f5', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ width: '100%', maxWidth: '1000px' }}>
        
        <button onClick={() => router.push('/market/create')} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '32px', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.2em' }}>
          <ArrowLeft size={16} /> Asset Gateway
        </button>

        <div style={{ marginBottom: '48px', borderLeft: '4px solid #0f172a', paddingLeft: '24px', textAlign: 'left' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0f172a', marginBottom: '8px' }}>
            <Package size={14} />
            <span style={{ fontSize: '9px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.4em' }}>General Asset Protocol</span>
          </div>
          <h1 style={{ fontSize: '42px', fontWeight: '900', color: '#0f172a', margin: '0', textTransform: 'uppercase', letterSpacing: '-0.02em' }}>
            The <span style={{ color: '#64748b' }}>General</span> Marketplace
          </h1>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-12 space-y-10">
            
            {/* SECTION 1: IDENTITY */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div style={{ textAlign: 'left' }} className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Asset Title</label>
                <input value={formData.title} className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-slate-900" onChange={(e) => setFormData({...formData, title: e.target.value})} required />
              </div>

              <div style={{ textAlign: 'left' }} className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Classification</label>
                <select 
                  value={formData.category} 
                  className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-slate-900" 
                  onChange={(e) => {
                    const selectedValue = e.target.value;
                    if (selectedValue === "mobility" || selectedValue === "auto" || selectedValue === "trucks") {
                      alert("Redirecting to the Mobility Intake Protocol...");
                      router.push("/market/create/mobility");
                      return;
                    }
                    setFormData({...formData, category: selectedValue, subCategory: ''});
                  }}
                >
                  <option value="misc">Miscellaneous (General Protocol)</option>
                  <option value="mobility">Automotive, Trucks & RVs</option>
                  <option value="watches">Luxury Watches & Timepieces</option>
                  {/* 🧥 CONNECTED CLOTHING PROTOCOL PIPELINE */}
                  <option value="apparel">Apparel, Footwear & Accessories</option>
                  <option value="furniture">Designer & Antique Furniture</option>
                  <option value="art">Fine Arts & Sculpture</option>
                  <option value="Pets">Pedigreed Animals & Livestock</option>
                  <option value="services">Professional & Luxury Services</option>
                  <option value="electronics">Industrial & High-End Electronics</option>
                </select>
              </div>
            </div>

            {/* SUB-GROUP REGISTRY */}
            {(formData.category === 'art' || 
              formData.category === 'services' || 
              formData.category === 'misc' || 
              formData.category === 'Pets' || 
              formData.category === 'watches' ||
              formData.category === 'apparel' ||
              formData.category === 'electronics' ||
              formData.category === 'furniture') && (
              <div style={{ textAlign: 'left' }} className="mt-6 flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-teal-600 font-bold">
                  Registry Sub-Group (Critical for Sorting)
                </label>
                <select 
                  value={formData.subCategory || ""} 
                  className="w-full p-4 bg-white border-2 border-teal-500 rounded-2xl font-bold text-slate-900 shadow-sm" 
                  onChange={(e) => setFormData({...formData, subCategory: e.target.value})}
                  required
                >
                  <option value="">-- Select Specific Sub-Category --</option>
                  
                  {formData.category === 'art' && (
                    <>
                      <option value="paintings">paintings</option>
                      <option value="Prints">Prints</option>
                      <option value="Sculptures">Sculptures</option>
                      <option value="Digital Art/NFTs">Digital Art/NFTs</option>
                      <option value="Other/ Unique Art">Other/ Unique Art</option>
                    </>
                  )}
                  
                  {formData.category === 'Pets' && (
                    <>
                      <option value="Cats">Cats</option>
                      <option value="Dogs">Dogs</option>
                      <option value="Birds">Birds</option>
                      <option value="horses">horses</option>
                      <option value="other/ rare pets">other/ rare pets</option>
                    </>
                  )}
                  
                  {formData.category === 'services' && (
                    <>
                      <option value="Auto Services">Auto Services</option>
                      <option value="Home Services">Home Services</option>
                      <option value="Technical services">Technical services</option>
                      <option value="Elite Concierge">Elite Concierge</option>
                    </>
                  )}

                  {/* 🧥 DYNAMIC REGISTRY SUB-GROUPS GENERATOR FOR HIGH-VOLUME APPAREL */}
                  {formData.category === 'apparel' && (
                    <>
                      <option value="Outerwear & Jackets">Outerwear & Jackets</option>
                      <option value="Premium Streetwear">Premium Streetwear</option>
                      <option value="Luxury Handbags & Leather Goods">Luxury Handbags & Leather Goods</option>
                      <option value="Footwear & Sneakers">Footwear & Sneakers</option>
                      <option value="Fine Accessories">Fine Accessories</option>
                      <option value="Other - Miscellaneous">Other - Miscellaneous</option>
                    </>
                  )}

                  {(formData.category === 'misc' || formData.category === 'watches' || formData.category === 'electronics' || formData.category === 'furniture') && (
                    <>
                      <option value="Electronics">Electronics</option>
                      <option value="Appliances">Appliances</option>
                      <option value="Furniture">Furniture</option>
                      <option value="Luxury watches">Luxury watches</option>
                      <option value="Fine jewelry">Fine jewelry</option>
                      <option value="Rent">Timeshare Rent</option>
                      <option value="Sale">Timeshare Sale</option>
                      <option value="Other - Miscellaneous">Other - Miscellaneous</option>
                    </>
                  )}
                </select>
              </div>
            )}

            {/* SECTION 2: GALLERY */}
            <div style={{ textAlign: 'left' }} className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Evidence Gallery</label>
              <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
                <label className="aspect-square bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-slate-900 transition-all text-slate-400">
                  <Camera size={20} />
                  <input type="file" multiple accept="image/*" className="hidden" onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    setImageFiles((prev) => [...prev, ...files].slice(0, 8));
                  }} />
                </label>
                {formData.imageUrls?.map((url, idx) => (
                  <div key={`existing-${idx}`} style={{ position: 'relative', aspectRatio: '1/1', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                    <img src={url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="asset" />
                    <button type="button" onClick={() => handleRemoveExistingImage(url)} style={{ position: 'absolute', top: '5px', right: '5px', backgroundColor: '#ef4444', color: 'white', width: '22px', height: '22px', borderRadius: '50%', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>×</button>
                  </div>
                ))}
                {imageFiles.map((file, idx) => (
                  <div key={`new-${idx}`} style={{ position: 'relative', aspectRatio: '1/1', borderRadius: '12px', overflow: 'hidden', border: '2px solid #0f172a' }}>
                    <img src={URL.createObjectURL(file)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="preview" />
                    <button type="button" onClick={() => handleRemoveNewImage(idx)} style={{ position: 'absolute', top: '5px', right: '5px', backgroundColor: '#0f172a', color: 'white', width: '22px', height: '22px', borderRadius: '50%', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>×</button>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 5: ASSET NARRATIVE */}
            <div style={{ textAlign: 'left' }} className="space-y-4">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Asset Narrative</label>
                <p className="text-[9px] text-slate-400 font-bold uppercase">Detail the provenance, specifications, or unique history of this asset</p>
              </div>
              <textarea 
                value={formData.description}
                placeholder="e.g. This premium vintage outerwear piece features direct hand-stitch details..."
                rows={8}
                className="w-full p-6 bg-slate-50 border-2 border-slate-100 rounded-[2rem] outline-none focus:border-slate-900 font-medium text-slate-900 leading-relaxed"
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>
            
            {/* PRICING BLOCK */}
            <div className="bg-slate-900 p-10 rounded-[2.5rem] text-white space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div style={{ textAlign: 'left' }}>
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Starting Bid ($)</label>
                  <input value={formData.startingBid} type="number" placeholder="0" className="w-full bg-transparent border-b-2 border-slate-800 outline-none font-black text-3xl pb-2" onChange={(e) => setFormData({...formData, startingBid: e.target.value})} />
                </div>
                <div style={{ textAlign: 'left' }}>
                  <label className="text-[9px] font-black uppercase tracking-widest text-amber-500">Buy Now ($)</label>
                  <input value={formData.buyNowPrice} type="number" placeholder="0" className="w-full bg-transparent border-b-2 border-amber-800 outline-none font-black text-3xl pb-2 text-amber-500" onChange={(e) => setFormData({...formData, buyNowPrice: e.target.value})} />
                </div>
                <div style={{ textAlign: 'left' }}>
                  <label className="text-[9px] font-black uppercase tracking-widest text-rose-500">Reserve ($)</label>
                  <input value={formData.reservePrice} type="number" placeholder="0" className="w-full bg-transparent border-b-2 border-rose-950 outline-none font-black text-3xl pb-2 text-rose-500" onChange={(e) => setFormData({...formData, reservePrice: e.target.value})} />
                </div>
              </div>
              <p className="text-[9px] text-slate-500 font-bold uppercase tracking-tighter text-center pt-4">
                Note: Assets with a Start Bid require a Reserve Price to initialize the auction protocol.
              </p>
            </div>

            {/* SECTION: TERMS OF AGREEMENT */}
            <div className="flex items-start gap-4 p-6 bg-slate-50 rounded-2xl border-2 border-slate-100">
              <input 
                type="checkbox" 
                id="terms" 
                checked={isAgreed} 
                onChange={(e) => setIsAgreed(e.target.checked)}
                className="mt-1 w-5 h-5 accent-slate-900 cursor-pointer"
              />
              <label htmlFor="terms" className="text-[11px] text-slate-600 font-bold leading-relaxed cursor-pointer select-none">
                I ACKNOWLEDGE THAT ALL ASSET INFORMATION IS ACCURATE. I UNDERSTAND THAT BAZARIA CHARGES A SUCCESS FEE UPON COMPLETED TRANSACTION AND AGREE TO THE <span className="text-slate-900 underline underline-offset-4">MERCHANT PROTOCOL AGREEMENT</span>.
              </label>
            </div>
            
            {/* ACTION BUTTONS */}
            <div className="flex flex-col gap-4 mt-8">
              <button 
                type="submit" 
                disabled={loading || !isAgreed} 
                style={{ 
                  width: '100%', 
                  backgroundColor: !isAgreed ? '#cbd5e1' : '#0f172a', 
                  color: '#ffffff', 
                  padding: '24px', 
                  borderRadius: '20px', 
                  fontSize: '14px', 
                  fontWeight: '900', 
                  textTransform: 'uppercase', 
                  letterSpacing: '0.25em', 
                  cursor: !isAgreed ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                {loading ? "Processing..." : !isAgreed ? "Awaiting Protocol Agreement" : (editId ? "Update Asset Authority" : "Deploy to Marketplace")}
              </button>
              {editId && (
                <button type="button" onClick={handleDelete} disabled={isDeleteLocked} style={{ width: '100%', backgroundColor: isConfirmingDelete ? '#ef4444' : 'transparent', color: isConfirmingDelete ? '#ffffff' : '#ef4444', border: '1px solid #ef4444', padding: '16px', borderRadius: '20px', fontWeight: '900', textTransform: 'uppercase', cursor: isDeleteLocked ? 'not-allowed' : 'pointer' }}>
                  {isDeleteLocked ? "WAITING..." : isConfirmingDelete ? "⚠️ CONFIRM DELETE" : "Rescind Asset from Marketplace"}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// 1️⃣ THE WRAPPER (Runs hydration and handles layout interlocks)
export default function GeneralMarketplaceCreate() {
  return (
    <Suspense 
      fallback={
        <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyStyle: 'center', backgroundColor: '#f8f8f5', justifyContent: 'center' }}>
          <p style={{ fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.4em', color: '#0f172a' }}>
            Initializing General Protocol...
          </p>
        </div>
      }
    >
      <GeneralFormCore />
    </Suspense>
  );
}
