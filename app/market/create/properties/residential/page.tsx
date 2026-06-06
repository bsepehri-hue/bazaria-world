"use client";

export const dynamic = 'force-dynamic';

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
import { auth, db, storage } from "@/lib/firebase/client";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
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

function ResidentialFormCore() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('edit');
  const { user } = useAuth(); 

  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [isDeleteLocked, setIsDeleteLocked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [isAgreed, setIsAgreed] = useState(false);

const [formData, setFormData] = useState({
    category: "property",
    subCategory: "For sale",
    title: "",
    imageUrls: [] as string[],
    propertyType: "Single Family Home",
    location: "",
    city: "",
    province: "",
    bedrooms: "",
    bathrooms: "",
    lotSize: "",
    lotSizeUnit: "SQF",
    saleMode: "Auction + Buy Now",
    durationDays: "30",
    startingBid: "",
    reservePrice: "",
    buyNowPrice: "",
    description: "",
    isSanctuaryAsset: false,
    assetClass: "Residential/Standard-Market",
    // 🔗 MLS Lite Federation Reference Strings (Risk-Free Fields)
    mlsId: "",
    mlsSourceUrl: ""
  });

  useEffect(() => {
    const syncPortal = async () => {
      const catParam = searchParams.get('category');
      
      if (!editId && catParam === 'land') {
        setFormData(prev => ({
          ...prev,
          category: "property",
          subCategory: "land",
          propertyType: "Land/Lot",
          lotSizeUnit: "Acres"
        }));
        return;
      }

      if (!editId) return;
      
      try {
        const docSnap = await getDoc(doc(db, "listings", editId));
        if (docSnap.exists()) {
          const data = docSnap.data();
          const rawCat = (data.category || "").toLowerCase().trim();
          const finalCat = (rawCat === 'timeshare') ? 'timeshare' : 'property';

          // Safe String Conversion Hydration prevents input display crashes
          setFormData({
            ...data,
            category: finalCat,
            subCategory: data.subCategory || "For sale",
            propertyType: data.propertyType || data.subCategory || "house",
            bedrooms: data.bedrooms !== undefined && data.bedrooms !== null ? String(data.bedrooms) : "",
            bathrooms: data.bathrooms !== undefined && data.bathrooms !== null ? String(data.bathrooms) : "",
            lotSize: data.lotSize !== undefined && data.lotSize !== null ? String(data.lotSize) : "",
            startingBid: data.startingBid !== undefined && data.startingBid !== null ? String(data.startingBid) : "",
            reservePrice: data.reservePrice !== undefined && data.reservePrice !== null ? String(data.reservePrice) : "",
            buyNowPrice: data.buyNowPrice !== undefined && data.buyNowPrice !== null ? String(data.buyNowPrice) : "",
          } as any);
        }
      } catch (err) {
        console.error("Hydration Failed:", err);
      }
    };

    syncPortal();
  }, [editId, searchParams]);
  
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
      setTimeout(() => {
        setIsConfirmingDelete(false);
        setIsDeleteLocked(false);
      }, 5000);
      return;
    }

    try {
      setLoading(true);
      if (formData.imageUrls && formData.imageUrls.length > 0) {
        for (const url of formData.imageUrls) {
          try {
            const imageRef = ref(storage, url);
            await deleteObject(imageRef);
          } catch (e) { console.warn("Image delete skip:", e); }
        }
      }
      await deleteDoc(doc(db, "listings", editId));
      router.push("/market");
    } catch (error) {
      console.error("Deletion Error:", error);
      setIsConfirmingDelete(false);
      setIsDeleteLocked(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAgreed) return;

    const activeUser = user || auth.currentUser;
    if (!activeUser) {
      alert("Authentication required. Please refresh.");
      return;
    }

    if (formData.startingBid && !formData.reservePrice) {
      alert("Auction mode requires a Reserve Price.");
      return;
    }

    setLoading(true);

    try {
      const uploadedUrls = [];
      for (const file of imageFiles) {
        const storageRef = ref(storage, `listings/${Date.now()}-${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        const url = await getDownloadURL(snapshot.ref);
        uploadedUrls.push(url);
      }

      const finalImageUrls = [...(formData.imageUrls || []), ...uploadedUrls];
      const bnp = Number(formData.buyNowPrice) || 0;
      const sbd = Number(formData.startingBid) || 0;
      
     const cleanSub = String(formData.subCategory || "").toLowerCase().trim();
      const isLand = cleanSub === 'land' || String(formData.propertyType || "").toLowerCase().includes('land');
      
      // Determine if the asset falls into the Caribbean Registry boundaries explicitly
      const isCaribbeanSanctuary = cleanSub.includes("caribbean") || 
                                   formData.location.toLowerCase().includes("dominican") || 
                                   formData.location.toLowerCase().includes("caribbean") ||
                                   formData.province.toLowerCase().includes("dominican");

      // Uniform Category Token Fallbacks
      let assignedCategory = formData.category.toLowerCase().trim();
      let assignedSubCategory = cleanSub;

      // Map variations safely into unified taxonomy fields
      if (cleanSub === "villas") {
        assignedSubCategory = "villas";
      } else if (cleanSub === "apartments") {
        assignedSubCategory = "apartments";
      } else if (isCaribbeanSanctuary) {
        assignedSubCategory = "caribbean";
      }

      let finalEndTime = new Date();
      finalEndTime.setDate(finalEndTime.getDate() + 30); 
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

      // Safe Normalization Pipeline ensures values map identically to marketplace configurations
      const listingData = {
        ...formData,
        userId: activeUser.uid,
        ownerId: activeUser.uid,
        merchantName: activeUser.displayName || "Bazaria Merchant",
        category: assignedCategory,
        subCategory: assignedSubCategory,
        
        // --- 🏠 MASTER INTEGRITY BLOCK ---
        isPropertyAsset: true,
        isLandAsset: isLand,
        isSanctuaryAsset: cleanSub.includes("caribbean"),
        
        // Enforces both names to populate identical value arrays
        beds: isLand ? 0 : (Number(formData.bedrooms) || 0),
        bedrooms: isLand ? 0 : (Number(formData.bedrooms) || 0),
        baths: isLand ? 0 : (Number(formData.bathrooms) || 0),
        bathrooms: isLand ? 0 : (Number(formData.bathrooms) || 0),
        lotSize: Number(formData.lotSize) || 0,
        
        price: sbd > 0 ? sbd : bnp,
        buyNowPrice: bnp,
        startingBid: sbd,
        currentBid: sbd,
        reservePrice: Number(formData.reservePrice) || 0,
        
        imageUrls: finalImageUrls,
        imageUrl: finalImageUrls[0] || "",
        endTime: typeof finalEndTime === 'string' ? finalEndTime : finalEndTime.toISOString(),
        durationDays: "30",
        updatedAt: serverTimestamp(),
        status: "active",
        // Force the layout filter strings (apartment, homes) explicitly into the keywords block
        searchKeywords: `${formData.title} ${formData.city} ${formData.province} ${formData.subCategory} apartment apartments homes home residential ${formData.description}`.toLowerCase(),
      };

      if (editId) {
        await updateDoc(doc(db, "listings", editId), {
          ...listingData,
          createdAt: createdTimestamp,
        });
      } else {
        await addDoc(collection(db, "listings"), { 
          ...listingData, 
          createdAt: createdTimestamp 
        });
      }
      
      router.push(`/storefront/${activeUser.uid}`);
    } catch (error) {
      console.error("Sovereign Deployment Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '80px 40px', backgroundColor: '#f8f8f5', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ width: '100%', maxWidth: '1000px' }}>
        
        <button 
          onClick={() => router.push('/market/create/properties')} 
          style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '32px', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.2em' }}
        >
          <ArrowLeft size={16} /> Property Portal
        </button>

        <div style={{ marginBottom: '48px', borderLeft: '4px solid #0f172a', paddingLeft: '24px', textAlign: 'left' }}>
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

        <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-12 space-y-10">
            
            {formData.subCategory.toLowerCase() === 'land' && (
              <div style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '10px', 
                backgroundColor: '#ecfdf5', 
                padding: '10px 16px', 
                borderRadius: '12px', 
                marginTop: '20px',
                border: '1.5px solid #10b981',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
              }}>
                <div style={{ 
                  width: '8px', 
                  height: '8px', 
                  borderRadius: '50%', 
                  backgroundColor: '#10b981'
                }} />
                <span style={{ 
                  fontSize: '10px', 
                  fontWeight: '900', 
                  color: '#064e3b', 
                  textTransform: 'uppercase', 
                  letterSpacing: '0.2em' 
                }}>
                  Protocol Engaged: Land & Acreage Registry
                </span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div style={{ textAlign: 'left' }} className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Property Title</label>
                <input 
                  value={formData.title} 
                  placeholder="e.g. Modern Downtown Loft" 
                  className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-slate-500 font-bold text-slate-900" 
                  onChange={(e) => setFormData({...formData, title: e.target.value})} 
                  required 
                />
              </div>

              <div style={{ textAlign: 'left' }} className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Inventory Classification</label>
                <select 
                  value={formData.category} 
                  className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-slate-900" 
                  onChange={(e) => setFormData({...formData, category: e.target.value, subCategory: ''})}
                >
                  <option value="property">Homes (Residential)</option>
                  <option value="rentals">Luxury Rentals</option>
                  <option value="rooms">Private/Shared Rooms</option>
                  <option value="timeshare">Timeshare Portfolio</option>
                </select>

                <div className="mt-2">
                  <select 
                    value={formData.subCategory || ""} 
                    className="w-full p-3 bg-white border-2 border-teal-500 rounded-xl font-bold text-teal-700 text-xs outline-none shadow-sm" 
                    onChange={(e) => setFormData({...formData, subCategory: e.target.value})}
                    required
                  >
                    <option value="">-- Select Specific Registry Group --</option>
                    
                    {formData.category === 'property' && (
                      <>
                        <option value="For Sale">For Sale</option>
                        <option value="For Rent">For Rent</option>
                        <option value="Villas">Villas</option>
                        <option value="Apartments">Apartments</option>
                        <option value="Caribbean Sanctuary">Caribbean Sanctuary</option>
                      </>
                    )}

                    {formData.category === 'rentals' && (
                      <>
                        <option value="Short Term">Short Term</option>
                        <option value="Long Term">Long Term</option>
                        <option value="Vacation">Vacation</option>
                      </>
                    )}

                    {formData.category === 'rooms' && (
                      <>
                        <option value="Private Rooms">Private Rooms</option>
                        <option value="Shared Rooms">Shared Rooms</option>
                      </>
                    )}

                    {formData.category === 'timeshare' && (
                      <>
                        <option value="rent">Timeshare Rent</option> 
                        <option value="sale">Timeshare Sale</option>
                      </>
                    )}
                  </select>
                </div>
              </div>
            </div>
            
            <div className="p-8 bg-slate-50 rounded-[2rem] border-2 border-slate-100 space-y-6">
               <div style={{ textAlign: 'left' }} className="flex flex-col gap-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-900 italic">Physical Location</label>
                  <input value={formData.location} placeholder="Street Address" className="w-full p-4 bg-white border-2 border-slate-200 rounded-xl font-bold text-slate-900" onChange={(e) => setFormData({...formData, location: e.target.value})} />
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <input value={formData.city} placeholder="City" className="w-full p-4 bg-white border-2 border-slate-200 rounded-xl font-bold text-slate-900" onChange={(e) => setFormData({...formData, city: e.target.value})} />
                  <input value={formData.province} placeholder="Province" className="w-full p-4 bg-white border-2 border-slate-200 rounded-xl font-bold text-slate-900" onChange={(e) => setFormData({...formData, province: e.target.value})} />
               </div>
            </div>

            <div style={{ textAlign: 'left' }} className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Property Gallery</label>
              <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
                <label className="aspect-square bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-slate-900 transition-all text-slate-400 group">
                  <Camera size={20} className="group-hover:text-slate-900" />
                  <span style={{ fontSize: '8px', marginTop: '4px', fontWeight: '900' }}>ADD</span>
                  <input type="file" multiple accept="image/*" className="hidden" onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    setImageFiles((prev) => [...prev, ...files].slice(0, 8));
                  }} />
                </label>

                {formData.imageUrls?.map((url, idx) => (
                  <div key={`existing-${idx}`} style={{ position: 'relative', aspectRatio: '1/1', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                    <img src={url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="asset" />
                    <button 
                      type="button" 
                      onClick={() => handleRemoveExistingImage(url)} 
                      style={{ position: 'absolute', top: '5px', right: '5px', backgroundColor: '#ef4444', color: 'white', width: '22px', height: '22px', borderRadius: '50%', border: 'none', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', zIndex: 10 }}
                    >×</button>
                  </div>
                ))}

                {imageFiles.map((file, idx) => (
                  <div key={`new-${idx}`} style={{ position: 'relative', aspectRatio: '1/1', borderRadius: '12px', overflow: 'hidden', border: '2px solid #64748b' }}>
                    <img src={URL.createObjectURL(file)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="preview" />
                    <button 
                      type="button" 
                      onClick={() => handleRemoveNewImage(idx)} 
                      style={{ position: 'absolute', top: '5px', right: '5px', backgroundColor: '#64748b', color: 'white', width: '22px', height: '22px', borderRadius: '50%', border: 'none', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', zIndex: 10 }}
                    >×</button>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-50 p-8 rounded-[2rem] border-2 border-slate-100">
              <div style={{ textAlign: 'left' }} className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-slate-400">
                  <Maximize2 size={14} />
                  <label className="text-[10px] font-black uppercase tracking-widest">Property Size</label>
                </div>
                <div className="flex gap-2">
                  <input 
                    value={formData.lotSize} 
                    placeholder="Size" 
                    className="flex-1 p-4 bg-white border-2 border-slate-200 rounded-xl font-bold text-slate-900 outline-none focus:border-slate-400" 
                    onChange={(e) => setFormData({...formData, lotSize: e.target.value})} 
                  />
                  <select 
                    value={formData.lotSizeUnit || "SQF"} 
                    className="p-4 bg-white border-2 border-slate-200 rounded-xl font-bold text-slate-900 text-[10px] cursor-pointer"
                    onChange={(e) => setFormData({...formData, lotSizeUnit: e.target.value})}
                  >
                    <option value="SQF">SQF</option>
                    <option value="M²">M²</option>
                  </select>
                </div>
              </div>

              <div style={{ textAlign: 'left' }} className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-slate-400">
                  <BedDouble size={14} />
                  <label className="text-[10px] font-black uppercase tracking-widest">Bedrooms</label>
                </div>
                <input 
                  value={formData.bedrooms} 
                  type="number" 
                  className="w-full p-4 bg-white border-2 border-slate-200 rounded-xl font-bold text-slate-900 outline-none focus:border-slate-400" 
                  onChange={(e) => setFormData({...formData, bedrooms: e.target.value})} 
                />
              </div>

              <div style={{ textAlign: 'left' }} className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-slate-400">
                  <Droplets size={14} />
                  <label className="text-[10px] font-black uppercase tracking-widest">Bathrooms</label>
                </div>
                <input 
                  value={formData.bathrooms} 
                  type="number" 
                  className="w-full p-4 bg-white border-2 border-slate-200 rounded-xl font-bold text-slate-900 outline-none focus:border-slate-400" 
                  onChange={(e) => setFormData({...formData, bathrooms: e.target.value})} 
                />
              </div>
            </div>

            <div style={{ textAlign: 'left' }} className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900">Property Narrative</label>
              <textarea className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-6 text-sm min-h-[150px] outline-none" placeholder="Home features..." value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
            </div>

            <div className="bg-slate-900 p-10 rounded-[2.5rem] text-white space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div style={{ textAlign: 'left' }}>
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Starting Bid</label>
                  <input value={formData.startingBid} type="number" className="w-full bg-transparent border-b-2 border-slate-800 outline-none font-black text-3xl pb-2 text-white" onChange={(e) => setFormData({...formData, startingBid: e.target.value})} />
                </div>
                <div style={{ textAlign: 'left' }}>
                  <label className="text-[9px] font-black uppercase tracking-widest text-amber-500">Buy Now</label>
                  <input value={formData.buyNowPrice} type="number" className="w-full bg-transparent border-b-2 border-amber-800 outline-none font-black text-3xl pb-2 text-amber-500" onChange={(e) => setFormData({...formData, buyNowPrice: e.target.value})} />
                </div>
                <div style={{ textAlign: 'left' }}>
                  <label className="text-[9px] font-black uppercase tracking-widest text-rose-500">Reserve</label>
                  <input value={formData.reservePrice} type="number" className="w-full bg-transparent border-b-2 border-rose-950 outline-none font-black text-3xl pb-2 text-rose-500" onChange={(e) => setFormData({...formData, reservePrice: e.target.value})} />
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 bg-slate-50 rounded-2xl border-2 border-slate-100 mt-6">
              <input 
                type="checkbox" 
                id="prop-agreed"
                checked={isAgreed} 
                onChange={(e) => setIsAgreed(e.target.checked)}
                className="w-5 h-5 mt-1 accent-[#0f172a] cursor-pointer" 
              />
              <label htmlFor="prop-agreed" className="text-[11px] text-slate-500 font-semibold leading-relaxed text-left cursor-pointer select-none">
                I hereby certify that this residential asset is under my legal authority and complies with the 
                <span className="text-[#0f172a] font-black"> Bazaria Sovereign Protocol</span>.
              </label>
            </div>

            <div className="flex flex-col gap-4 mt-8">
              <button 
                type="submit" 
                disabled={loading || !isAgreed} 
                style={{ 
                  width: '100%', 
                  backgroundColor: isAgreed ? '#0f172a' : '#cbd5e1', 
                  color: '#ffffff', 
                  padding: '24px', 
                  borderRadius: '20px', 
                  fontSize: '14px', 
                  fontWeight: '900', 
                  textTransform: 'uppercase', 
                  letterSpacing: '0.25em', 
                  cursor: isAgreed ? 'pointer' : 'not-allowed',
                  transition: 'all 0.3s ease'
                }}
              >
                {loading ? "Registering..." : !isAgreed ? "Awaiting Registry Certification" : (editId ? "Update Asset Registry" : "Deploy to Marketplace")}
              </button>

            {editId && (
              <button
                type="button" 
                disabled={loading || isDeleteLocked}
                onClick={handleDelete}
                style={{
                  width: '100%',
                  padding: '20px',
                  backgroundColor: isConfirmingDelete ? '#ef4444' : 'transparent',
                  color: isConfirmingDelete ? '#ffffff' : '#ef4444',
                  borderRadius: '20px',
                  fontSize: '11px',
                  fontWeight: '900',
                  textTransform: 'uppercase',
                  letterSpacing: '0.2em',
                  border: isConfirmingDelete ? 'none' : '1px solid #fee2e2',
                  cursor: (loading || isDeleteLocked) ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  marginTop: '10px'
                }}
              >
                {isDeleteLocked ? "PLEASE WAIT..." : 
                 isConfirmingDelete ? "CONFIRM PERMANENT DELETION?" : "🗑️ Delete Listing from Registry"}
              </button>
            )}
          </div>
          </form>
        </div>
      </div>
    </div>
  );
}
