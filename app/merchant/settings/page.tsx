"use client";

import React, { useState, useEffect } from "react";
import { db, storage } from "@/lib/firebase/client"; 
import { doc, setDoc, getDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Camera, Image as ImageIcon, Save, Mail, Phone, MapPin, PackagePlus, Globe } from "lucide-react";
import Link from "next/link";

export default function StorefrontManagement() {
  const sellerSlug = "test-store"; // This will eventually be dynamic based on the logged-in user
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);
  const [isStorePrivate, setIsStorePrivate] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    tagline: "",
    email: "",
    phone: "",
    address: "",
    website: "",
    logoUrl: "",
    bannerUrl: ""
  });

  // Load existing data
  useEffect(() => {
    async function loadData() {
      const docRef = doc(db, "storefronts", sellerSlug);
      const snap = await getDoc(docRef);
      if (snap.exists()) setFormData(prev => ({ ...prev, ...snap.data() }));
      setLoading(false);
    }
    loadData();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'logoUrl' | 'bannerUrl') => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(field);
    try {
      const storageRef = ref(storage, `storefronts/${sellerSlug}/${field}_${Date.now()}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setFormData(prev => ({ ...prev, [field]: url }));
    } catch (err) { console.error(err); }
    setUploading(null);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, "storefronts", sellerSlug), { ...formData, updatedAt: new Date() }, { merge: true });
      alert("Storefront Identity Updated!");
    } catch (err) { console.error(err); }
    setSaving(false);
  };

  if (loading) return <div className="p-20 text-center animate-pulse text-[#014d4e] font-black uppercase tracking-[10px]">Accessing Registry...</div>;

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-24">
      {/* 🏗️ TOP NAVIGATION BAR */}
      <nav className="bg-white border-b px-8 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-[#014d4e] rounded-lg flex items-center justify-center text-[#f59e0b] font-black italic">B</div>
          <h2 className="font-black italic uppercase tracking-tighter text-[#014d4e]">Management Console</h2>
        </div>
        <div className="flex gap-4">
          <Link href="/storefront/test-store" target="_blank" className="px-6 py-2 border-2 border-[#014d4e] text-[#014d4e] rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-[#014d4e] hover:text-white transition-all">
            View Live Store
          </Link>
          <button onClick={handleSave} disabled={saving} className="px-8 py-2 bg-[#f59e0b] text-[#014d4e] rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-amber-200">
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto mt-12 px-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 🎨 LEFT COLUMN: BRANDING & IDENTITY */}
        <div className="lg:col-span-2 space-y-8">
          
        {/* BANNER SECTION */}
          <div className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-gray-100">
            <div className="h-48 bg-gray-100 relative">
              {formData.bannerUrl ? (
                <img src={formData.bannerUrl} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300">No Banner Set</div>
              )}
              <label className="absolute bottom-4 right-4 bg-white/90 backdrop-blur px-4 py-2 rounded-full cursor-pointer shadow-xl flex items-center gap-2 border border-gray-200">
                <ImageIcon className="w-4 h-4 text-[#014d4e]" />
                <span className="text-[10px] font-bold uppercase text-[#014d4e]">{uploading === 'bannerUrl' ? 'Uploading...' : 'Change Banner'}</span>
                <input type="file" className="hidden" onChange={(e) => handleUpload(e, 'bannerUrl')} />
              </label>
            </div>
            
            <div className="p-8 pt-0 -mt-12 flex flex-col items-center">
              <div className="w-32 h-32 rounded-full border-8 border-white bg-[#00251a] shadow-2xl relative overflow-hidden flex items-center justify-center">
                {formData.logoUrl ? (
                  <img src={formData.logoUrl} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-[#f59e0b] text-4xl font-black italic">{formData.name?.charAt(0) || "B"}</span>
                )}
                <label className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                   <Camera className="text-white w-6 h-6" />
                   <input type="file" className="hidden" onChange={(e) => handleUpload(e, 'logoUrl')} />
                </label>
              </div>
              
              <div className="mt-6 w-full space-y-4">
                <input 
                  className="w-full text-center text-3xl font-black uppercase italic text-[#014d4e] border-none focus:ring-0 outline-none bg-transparent"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="STORE TITLE"
                />
                <input 
                  className="w-full text-center text-xs font-bold tracking-[6px] text-amber-500 border-none focus:ring-0 outline-none bg-transparent uppercase"
                  value={formData.tagline}
                  onChange={(e) => setFormData({...formData, tagline: e.target.value})}
                  placeholder="YOUR BRAND TAGLINE"
                />

                {/* 🔒 BOUTIQUE PRIVACY TOGGLE */}
                <div className="mt-8 pt-6 border-t border-gray-50 flex items-center justify-center gap-6">
                  <div className="text-right">
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#014d4e]">
                      {formData.isPrivate ? "Private Mode" : "Ecosystem Mode"}
                    </p>
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter">
                      {formData.isPrivate ? "🔒 Hidden from Marketplace" : "🌍 Listed in Marketplace"}
                    </p>
                  </div>
                  
                  <button 
                    onClick={() => setFormData({...formData, isPrivate: !formData.isPrivate})}
                    className={`w-12 h-6 rounded-full transition-all flex items-center px-1 shadow-inner ${formData.isPrivate ? 'bg-[#f59e0b]' : 'bg-gray-200'}`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${formData.isPrivate ? 'translate-x-6' : 'translate-x-0'}`} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 📦 PRODUCT UPLOAD BRIDGE */}
          <div className="bg-[#014d4e] p-8 rounded-[32px] text-white flex justify-between items-center group cursor-pointer hover:bg-[#00251a] transition-all">
            <div>
              <h3 className="text-xl font-black italic uppercase tracking-tight">Manage Inventory</h3>
              <p className="text-amber-500 text-[10px] font-bold tracking-[4px] uppercase mt-1">Add or edit products in your registry</p>
            </div>
            <Link href="/merchant/add-listing" className="bg-white/10 p-4 rounded-2xl group-hover:bg-amber-500 transition-colors">
              <PackagePlus className="w-8 h-8 text-white group-hover:text-[#014d4e]" />
            </Link>
          </div>
        </div>

        {/* 📞 RIGHT COLUMN: CONCIERGE INFO */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 space-y-6">
            <h3 className="text-xs font-black tracking-[4px] uppercase text-gray-400 border-b pb-4">Concierge Details</h3>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4 bg-gray-50 p-3 rounded-2xl border border-transparent focus-within:border-amber-200 focus-within:bg-white transition-all">
                <Mail className="w-4 h-4 text-gray-300" />
                <input className="bg-transparent text-sm font-medium outline-none w-full" placeholder="Public Email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
              </div>
              <div className="flex items-center gap-4 bg-gray-50 p-3 rounded-2xl border border-transparent focus-within:border-amber-200 focus-within:bg-white transition-all">
                <Phone className="w-4 h-4 text-gray-300" />
                <input className="bg-transparent text-sm font-medium outline-none w-full" placeholder="Phone Number" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
              </div>
              <div className="flex items-center gap-4 bg-gray-50 p-3 rounded-2xl border border-transparent focus-within:border-amber-200 focus-within:bg-white transition-all">
                <Globe className="w-4 h-4 text-gray-300" />
                <input className="bg-transparent text-sm font-medium outline-none w-full" placeholder="Official Website" value={formData.website} onChange={(e) => setFormData({...formData, website: e.target.value})} />
              </div>
              <div className="flex items-start gap-4 bg-gray-50 p-3 rounded-2xl border border-transparent focus-within:border-amber-200 focus-within:bg-white transition-all">
                <MapPin className="w-4 h-4 text-gray-300 mt-1" />
                <textarea rows={3} className="bg-transparent text-sm font-medium outline-none w-full resize-none" placeholder="Physical Address" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
