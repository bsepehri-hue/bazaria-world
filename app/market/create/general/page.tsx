
"use client";

import { useState, useEffect } from "react"; // 🎯 Added useEffect
import { db, storage } from "@/lib/firebase/client";
import { collection, addDoc, doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore"; // 🎯 Added doc, getDoc, updateDoc
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useRouter, useSearchParams } from "next/navigation"; // 🎯 Added useSearchParams
import { 
  Package, 
  Camera, 
  ShieldCheck, 
  ArrowLeft, 
  CheckCircle2
} from "lucide-react";

export default function GeneralMarketplaceCreate() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('edit'); // 🔍 The ID from the pencil
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false); // 🔍 Loading state for fetching data
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  
  const [formData, setFormData] = useState({
    title: "",
    category: "ART",
    condition: "Mint",
    location: "",
    city: "",
    province: "",
    price: "",
    saleMode: "Auction + Buy Now",
    durationDays: "3", 
    reservePrice: "",
    startingBid: "",
    buyNowPrice: "",
    description: "",
    autoRelist: true,
    isGeneralAsset: true
  });

  // 🐾 THE HYDRATION LOGIC: Load the Cat/Asset data if editId exists
  useEffect(() => {
    async function loadAsset() {
      if (!editId) return;
      setFetching(true);
      try {
        const docRef = doc(db, "listings", editId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFormData({
            title: data.title || "",
            category: data.category || "ART",
            condition: data.condition || "Mint",
            location: data.location || "",
            city: data.city || "",
            province: data.province || "",
            price: data.price?.toString() || "",
            saleMode: data.saleMode || "Auction + Buy Now",
            durationDays: data.durationDays?.toString() || "3",
            reservePrice: data.reservePrice?.toString() || "",
            startingBid: data.startingBid?.toString() || "",
            buyNowPrice: data.buyNowPrice?.toString() || "",
            description: data.description || "",
            autoRelist: data.autoRelist ?? true,
            isGeneralAsset: true
          });
          if (data.imageUrls) setExistingImages(data.imageUrls);
        }
      } catch (err) {
        console.error("Hydration Error:", err);
      } finally {
        setFetching(false);
      }
    }
    loadAsset();
  }, [editId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const uploadedUrls = [...existingImages];
      for (const file of imageFiles) {
        const fileRef = ref(storage, `general/${Date.now()}-${file.name}`);
        const uploadTask = await uploadBytes(fileRef, file);
        const url = await getDownloadURL(uploadTask.ref);
        uploadedUrls.push(url);
      }

      const finalData = {
        ...formData,
        imageUrls: uploadedUrls,
        imageUrl: uploadedUrls[0] || "",
        price: formData.saleMode === "Fixed Price" ? Number(formData.buyNowPrice) : Number(formData.startingBid),
        currentBid: Number(formData.startingBid),
        status: "active",
        updatedAt: serverTimestamp(),
      };

      if (editId) {
        // 🔄 UPDATE existing asset (The Cat)
        await updateDoc(doc(db, "listings", editId), finalData);
      } else {
        // 🆕 CREATE new asset
        await addDoc(collection(db, "listings"), {
          ...finalData,
          createdAt: serverTimestamp(),
          auctionEnd: new Date(Date.now() + Number(formData.durationDays) * 24 * 60 * 60 * 1000),
        });
      }
      
      router.push("/market"); 
    } catch (error) {
      console.error("General Marketplace Error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8f8f5' }}>
        <p style={{ fontWeight: 900, letterSpacing: '0.4em', color: '#0f172a' }}>AUTHENTICATING ASSET...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '60px 40px 140px 80px', backgroundColor: '#f8f8f5', minHeight: '100vh', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ maxWidth: '900px', width: '100%' }}>
        
        <button onClick={() => router.push('/market/create')} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '32px', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.2em' }}>
          <ArrowLeft size={16} /> Main Gateway
        </button>

        <div style={{ marginBottom: '48px', borderLeft: '4px solid #0f172a', paddingLeft: '24px', textAlign: 'left' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0f172a', marginBottom: '8px' }}>
            <Package size={14} />
            <span style={{ fontSize: '9px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.4em' }}>General Asset Protocol</span>
          </div>
          <h1 style={{ fontSize: '42px', fontWeight: '900', color: '#0f172a', margin: '0', textTransform: 'uppercase', letterSpacing: '-0.02em' }}>
            {editId ? "Edit" : "General"} <span style={{ color: '#64748b' }}>Marketplace</span>
          </h1>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-12 space-y-10">
            
            {/* SECTION 1: IDENTITY */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div style={{ textAlign: 'left' }} className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Asset Title</label>
                <input 
                  value={formData.title} // 🎯 Added Value Binding
                  placeholder="e.g. Rare Vintage Rolex" 
                  className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-slate-900 font-bold text-slate-900" 
                  onChange={(e) => setFormData({...formData, title: e.target.value})} 
                  required 
                />
              </div>
              <div style={{ textAlign: 'left' }} className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Sector Classification</label>
                <select value={formData.category} className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-slate-900" onChange={(e) => setFormData({...formData, category: e.target.value})}>
                  <option value="ART">Fine Art & Sculpture</option>
                  <option value="ANIMALS">Livestock & Pedigreed Animals</option>
                  <option value="COLLECTIBLES">Rare Collectibles</option>
                  <option value="ELECTRONICS">Industrial Electronics</option>
                  <option value="MISC">Miscellaneous</option>
                </select>
              </div>
            </div>

            {/* SECTION 2: EVIDENCE GALLERY */}
            <div style={{ textAlign: 'left' }} className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                {editId ? "Update Asset Visuals" : "Evidence Gallery (Max 6)"}
              </label>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                <label className="aspect-square bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-slate-900 transition-all text-slate-400">
                  <Camera size={20} />
                  <input type="file" multiple accept="image/*" className="hidden" 
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      setImageFiles((prev) => [...prev, ...files].slice(0, 6));
                    }} 
                  />
                </label>
                {/* Show Existing Firebase Images */}
                {existingImages.map((url, idx) => (
                  <div key={`exist-${idx}`} className="aspect-square rounded-xl overflow-hidden border border-slate-900 relative">
                    <img src={url} className="w-full h-full object-cover" alt="existing" />
                    <div className="absolute top-1 right-1 bg-slate-900 text-[8px] text-white px-2 py-1 rounded-full">LIVE</div>
                  </div>
                ))}
                {/* Show New Local Previews */}
                {imageFiles.map((file, idx) => (
                  <div key={`new-${idx}`} className="aspect-square rounded-xl overflow-hidden border border-teal-500 relative">
                    <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" alt="preview" />
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 3: LOCATION */}
            <div className="p-8 bg-slate-50 rounded-[2rem] border-2 border-slate-100 space-y-6">
              <input value={formData.location} placeholder="Storage Location" className="w-full p-4 bg-white border-2 border-slate-200 rounded-xl font-bold text-slate-900" onChange={(e) => setFormData({...formData, location: e.target.value})} />
              <div className="grid grid-cols-2 gap-4">
                <input value={formData.city} placeholder="City" className="w-full p-4 bg-white border-2 border-slate-200 rounded-xl font-bold text-slate-900" onChange={(e) => setFormData({...formData, city: e.target.value})} />
                <input value={formData.province} placeholder="Province" className="w-full p-4 bg-white border-2 border-slate-200 rounded-xl font-bold text-slate-900" onChange={(e) => setFormData({...formData, province: e.target.value})} />
              </div>
            </div>

            {/* SECTION 4: BIDDING */}
            <div className="space-y-6 bg-slate-900 p-10 rounded-[2.5rem] text-white">
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div style={{ textAlign: 'left' }}>
                  <label className="text-[9px] font-black uppercase tracking-widest text-teal-500">Starting Bid</label>
                  <input value={formData.startingBid} type="number" className="w-full bg-transparent border-b-2 border-teal-800 outline-none font-black text-3xl pb-2" onChange={(e) => setFormData({...formData, startingBid: e.target.value})} />
                </div>
                <div style={{ textAlign: 'left' }}>
                  <label className="text-[9px] font-black uppercase tracking-widest text-amber-500">Buy Now</label>
                  <input value={formData.buyNowPrice} type="number" className="w-full bg-transparent border-b-2 border-amber-800 outline-none font-black text-3xl pb-2 text-amber-500" onChange={(e) => setFormData({...formData, buyNowPrice: e.target.value})} />
                </div>
                <div style={{ textAlign: 'left' }}>
                  <label className="text-[9px] font-black uppercase tracking-widest text-rose-500">Reserve</label>
                  <input value={formData.reservePrice} type="number" className="w-full bg-transparent border-b-2 border-rose-900 outline-none font-black text-3xl pb-2" onChange={(e) => setFormData({...formData, reservePrice: e.target.value})} />
                </div>
              </div>
            </div>

            {/* SECTION 5: NARRATIVE */}
            <div style={{ textAlign: 'left' }} className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Asset Narrative</label>
              <textarea 
                value={formData.description}
                rows={4}
                className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-slate-900 font-bold text-slate-900"
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>

            <button type="submit" disabled={loading} style={{ width: '100%', backgroundColor: '#0f172a', color: '#ffffff', padding: '24px', borderRadius: '20px', border: 'none', fontSize: '14px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.25em', cursor: 'pointer', boxShadow: '0 20px 40px -10px rgba(15, 23, 42, 0.4)' }}>
              {loading ? "Processing..." : editId ? "Update Asset Authority" : "Deploy to Marketplace"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
