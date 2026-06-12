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
import { ArrowLeft, Camera, Cpu } from "lucide-react";

export default function DigitalMarketCreate() {
  return (
    <Suspense fallback={
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8f8f5' }}>
        <p style={{ fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.4em', color: '#014d4e' }}>
          Initializing Digital Protocol...
        </p>
      </div>
    }>
      <DigitalFormCore />
    </Suspense>
  );
}

function DigitalFormCore() {
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
    title: "",
    category: "digital-asset",
    subCategory: "",
    imageUrls: [] as string[],
    description: "",
    assetId: "",
    mediaUrl: "",
    royaltyBps: "",
    startingBid: "",
    buyNowPrice: "",
    reservePrice: "",
    stewardID: ""
  });

  useEffect(() => {
    if (!editId) return;
    const fetchAsset = async () => {
      try {
        const docSnap = await getDoc(doc(db, "listings", editId));
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.category !== "digital-asset") {
            alert("System Alert: Invalid asset class detected for this portal.");
            router.push("/market/create");
            return;
          }
          setFormData({
            ...data,
            title: data.title || "",
            subCategory: data.subCategory || "",
            assetId: data.assetId || "",
            mediaUrl: data.mediaUrl || "",
            royaltyBps: data.royaltyBps || "",
            startingBid: data.startingBid ? String(data.startingBid) : "",
            buyNowPrice: data.buyNowPrice ? String(data.buyNowPrice) : "",
            reservePrice: data.reservePrice ? String(data.reservePrice) : "",
            description: data.description || "",
            imageUrls: data.imageUrls || []
          } as any);
        }
      } catch (err) {
        console.error("Hydration Failed:", err);
      }
    };
    fetchAsset();
  }, [editId, router]);

  const handleRemoveExistingImage = (urlToRemove: string) => {
    setFormData(prev => ({ ...prev, imageUrls: prev.imageUrls.filter(url => url !== urlToRemove) }));
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
      if (formData.imageUrls && formData.imageUrls.length > 0) {
        for (const url of formData.imageUrls) {
          try { await deleteObject(ref(storage, url)); } catch (e) { console.warn("Image delete skip:", e); }
        }
      }
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
        const storageRef = ref(storage, `listings/digital/${Date.now()}-${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        const url = await getDownloadURL(snapshot.ref);
        uploadedUrls.push(url);
      }

      const finalImageUrls = [...(formData.imageUrls || []), ...uploadedUrls];
      const bnp = Number(formData.buyNowPrice) || 0;
      const sbd = Number(formData.startingBid) || 0;
      const res = Number(formData.reservePrice) || 0;

      let createdTimestamp: any = serverTimestamp();
      let originalOwner = activeUser.uid;

      if (editId) {
        const docRef = doc(db, "listings", editId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const existingData = docSnap.data();
          originalOwner = existingData.stewardID || existingData.userId || activeUser.uid;
          if (originalOwner !== activeUser.uid) {
            alert("Security Error: You do not have permission to modify this asset.");
            setLoading(false);
            return;
          }
          if (existingData.createdAt) createdTimestamp = existingData.createdAt;
        }
      }

      const listingData = {
        ...formData,
        userId: activeUser.uid,
        ownerId: activeUser.uid,
        stewardID: originalOwner,
        merchantName: activeUser.displayName || "Bazaria Merchant",
        currency: "USDC", 
        price: sbd > 0 ? sbd : bnp,
        buyNowPrice: bnp,
        startingBid: sbd,
        currentBid: sbd,
        reservePrice: res,
        imageUrls: finalImageUrls,
        imageUrl: finalImageUrls[0] || "",
        updatedAt: serverTimestamp(),
        status: "active",
        searchKeywords: `${formData.title} ${formData.subCategory} digital crypto nft token ${formData.description}`.toLowerCase(),
      };

      if (editId) {
        await updateDoc(doc(db, "listings", editId), { ...listingData, createdAt: createdTimestamp });
      } else {
        await addDoc(collection(db, "listings"), { ...listingData, createdAt: createdTimestamp });
      }
      
      router.push(`/storefront/${activeUser.uid}`);
    } catch (error) {
      console.error("Deployment Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '40px 40px', backgroundColor: '#f8f8f5', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ width: '100%', maxWidth: '800px' }}>
        
        <button 
          onClick={() => router.push('/market/create')} 
          style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '32px', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.2em' }}
        >
          <ArrowLeft size={16} /> Asset Gateway
        </button>

        <div style={{ marginBottom: '32px', borderLeft: '3px solid #0f172a', paddingLeft: '16px', textAlign: 'left' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0f172a', marginBottom: '4px' }}>
            <Cpu size={14} />
            <span style={{ fontSize: '9px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.3em' }}>
              Digital Asset Protocol
            </span>
          </div>
          <h1 style={{ fontSize: '32px', fontWeight: '900', color: '#0f172a', margin: '0', textTransform: 'uppercase', letterSpacing: '-0.02em' }}>
            THE <span style={{ color: '#64748b' }}>DIGITAL</span> MARKETPLACE
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 text-sm" style={{ textAlign: 'left' }}>
          
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-semibold text-slate-700">Asset Title</label>
            <input value={formData.title} className="w-full p-2 border border-slate-300 rounded focus:outline-none focus:border-slate-500" onChange={(e) => setFormData({...formData, title: e.target.value})} required />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-semibold text-slate-700">Classification</label>
            <select disabled className="w-full p-2 border border-slate-300 rounded bg-slate-100 text-slate-500 cursor-not-allowed">
              <option>Digital Assets (Sovereign Protocol)</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-semibold text-slate-700">Registry Sub-Group (Critical for Sorting)</label>
            <select value={formData.subCategory} className="w-full p-2 border border-slate-300 rounded focus:outline-none focus:border-slate-500" onChange={(e) => setFormData({...formData, subCategory: e.target.value})} required>
              <option value="">-- Select Specific Sub-Category --</option>
              <option value="NFT Art">NFT Art & Media</option>
              <option value="Domain Names">Domain Names & ENS</option>
              <option value="Virtual Real Estate">Virtual Real Estate</option>
              <option value="Governance Tokens">Governance / Utility Tokens</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold text-slate-700">On-Chain Token ID</label>
              <input value={formData.assetId} placeholder="e.g. 1" className="w-full p-2 border border-slate-300 rounded focus:outline-none focus:border-slate-500" onChange={(e) => setFormData({...formData, assetId: e.target.value})} required />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold text-slate-700">Creator Royalty (%)</label>
              <input type="number" value={formData.royaltyBps} placeholder="e.g. 5" className="w-full p-2 border border-slate-300 rounded focus:outline-none focus:border-slate-500" onChange={(e) => setFormData({...formData, royaltyBps: e.target.value})} />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-semibold text-slate-700">Metadata URI / External Link (Optional)</label>
            <input value={formData.mediaUrl} placeholder="ipfs://..." className="w-full p-2 border border-slate-300 rounded focus:outline-none focus:border-slate-500" onChange={(e) => setFormData({...formData, mediaUrl: e.target.value})} />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-semibold text-slate-700 flex items-center gap-1"><Camera size={12}/> Evidence Gallery</label>
            <div className="w-full p-2 border border-slate-300 rounded bg-white flex items-center gap-2">
              <label className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs py-1 px-3 rounded cursor-pointer border border-slate-400">
                Choose Files
                <input type="file" multiple accept="image/*" className="hidden" onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  setImageFiles((prev) => [...prev, ...files].slice(0, 8));
                }} />
              </label>
              <span className="text-xs text-slate-500">
                {imageFiles.length === 0 && formData.imageUrls.length === 0 ? "No file chosen" : `${imageFiles.length + formData.imageUrls.length} file(s) selected`}
              </span>
            </div>
            
            {(imageFiles.length > 0 || formData.imageUrls.length > 0) && (
              <div className="grid grid-cols-4 md:grid-cols-6 gap-2 mt-2">
                {formData.imageUrls?.map((url, idx) => (
                  <div key={`existing-${idx}`} className="relative aspect-square border border-slate-200 rounded overflow-hidden">
                    <img src={url} className="w-full h-full object-cover" alt="asset" />
                    <button type="button" onClick={() => handleRemoveExistingImage(url)} className="absolute top-1 right-1 bg-red-500 text-white w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold">×</button>
                  </div>
                ))}
                {imageFiles.map((file, idx) => (
                  <div key={`new-${idx}`} className="relative aspect-square border border-slate-400 rounded overflow-hidden">
                    <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" alt="preview" />
                    <button type="button" onClick={() => handleRemoveNewImage(idx)} className="absolute top-1 right-1 bg-slate-600 text-white w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold">×</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-semibold text-slate-700">Asset Narrative</label>
            <p className="text-[10px] text-slate-500 -mt-1 mb-1">Detail the provenance, utility, or specific contract data of this digital asset</p>
            <textarea value={formData.description} placeholder="e.g. This utility token grants access to..." className="w-full p-2 border border-slate-300 rounded h-32 focus:outline-none focus:border-slate-500 resize-y" onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
          </div>

          {/* ========================================= */}
          {/* PRICING BLOCK (Missing in screenshot) */}
          {/* ========================================= */}
          <div className="flex flex-col gap-3 mt-4">
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold text-slate-700">Starting Bid (USDC)</label>
              <input value={formData.startingBid} type="number" placeholder="0" className="w-full p-2 border border-slate-300 rounded focus:outline-none focus:border-slate-500" onChange={(e) => setFormData({...formData, startingBid: e.target.value})} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold text-slate-700">Buy Now (USDC)</label>
              <input value={formData.buyNowPrice} type="number" placeholder="0" className="w-full p-2 border border-slate-300 rounded focus:outline-none focus:border-slate-500" onChange={(e) => setFormData({...formData, buyNowPrice: e.target.value})} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold text-slate-700">Reserve (USDC)</label>
              <input value={formData.reservePrice} type="number" placeholder="0" className="w-full p-2 border border-slate-300 rounded focus:outline-none focus:border-slate-500" onChange={(e) => setFormData({...formData, reservePrice: e.target.value})} />
            </div>
            <p className="text-[10px] text-slate-600 text-center font-medium mt-2">Note: Assets with a Start Bid require a Reserve Price to initialize the auction protocol.</p>
          </div>

         {/* ========================================= */}
          {/* BULLETPROOF CHECKBOX & BUTTON BLOCK */}
          {/* ========================================= */}
          <div style={{ marginTop: '32px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <input 
                type="checkbox" 
                id="protocol-agreed" 
                checked={isAgreed} 
                onChange={(e) => setIsAgreed(e.target.checked)} 
                style={{ marginTop: '4px', cursor: 'pointer', width: '16px', height: '16px' }} 
              />
              <label htmlFor="protocol-agreed" style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px', color: '#475569', fontWeight: 800, lineHeight: '1.6', cursor: 'pointer', userSelect: 'none' }}>
                I ACKNOWLEDGE THAT ALL ASSET INFORMATION IS ACCURATE. I UNDERSTAND THAT BAZARIA TRANSACTS THIS ASSET EXCLUSIVELY IN USDC ON THE POLYGON NETWORK AND AGREE TO THE MERCHANT PROTOCOL AGREEMENT.
              </label>
            </div>

            <button 
              type="submit" 
              disabled={loading || !isAgreed} 
              style={{
                width: '100%',
                padding: '20px',
                borderRadius: '12px',
                fontWeight: 900,
                textTransform: 'uppercase',
                letterSpacing: '2px',
                fontSize: '12px',
                border: 'none',
                cursor: (!isAgreed || loading) ? 'not-allowed' : 'pointer',
                backgroundColor: isAgreed ? '#0f172a' : '#e2e8f0',
                color: isAgreed ? '#ffffff' : '#94a3b8',
                transition: 'all 0.3s ease',
                boxShadow: isAgreed ? '0 10px 25px -5px rgba(15, 23, 42, 0.3)' : 'none'
              }}
            >
              {loading ? "PROCESSING PROTOCOL..." : !isAgreed ? "AWAITING PROTOCOL AGREEMENT" : (editId ? "UPDATE ASSET REGISTRY" : "DEPLOY TO MARKETPLACE")}
            </button>

            {editId && (
              <button
                type="button" 
                disabled={loading || isDeleteLocked}
                onClick={handleDelete}
                style={{
                  width: '100%', padding: '16px', borderRadius: '12px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px', fontSize: '12px',
                  backgroundColor: isConfirmingDelete ? '#dc2626' : 'transparent',
                  color: isConfirmingDelete ? '#ffffff' : '#ef4444',
                  border: isConfirmingDelete ? 'none' : '1px solid #fca5a5',
                  cursor: isDeleteLocked ? 'not-allowed' : 'pointer'
                }}
              >
                {isDeleteLocked ? "PLEASE WAIT..." : isConfirmingDelete ? "CONFIRM PERMANENT DELETION?" : "DELETE LISTING FROM REGISTRY"}
              </button>
            )}

          </div>
        </form>
      </div>
    </div>
  );
}
