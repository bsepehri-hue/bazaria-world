"use client";

import React, { useState } from "react";
import { db, storage } from "@/lib/firebase/client"; 
import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Camera, Image as ImageIcon, Save, CheckCircle } from "lucide-react";

export default function StorefrontOnboarding({ sellerSlug = "test-store" }) {
  const [step, setStep] = useState(1);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    tagline: "",
    email: "",
    phone: "",
    logoUrl: "",
    bannerUrl: ""
  });

  // 📸 HANDLE IMAGE UPLOADS
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'banner') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const storageRef = ref(storage, `storefronts/${sellerSlug}/${type}_${Date.now()}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setFormData(prev => ({ ...prev, [type === 'logo' ? 'logoUrl' : 'bannerUrl']: url }));
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setUploading(false);
    }
  };

  const finishOnboarding = async () => {
    try {
      await setDoc(doc(db, "storefronts", sellerSlug), {
        ...formData,
        onboardingComplete: true,
        updatedAt: new Date()
      }, { merge: true });
      alert("Storefront Identity Created!");
      // Redirect to Management Console here
    } catch (error) {
      console.error("Save failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-xl w-full bg-white rounded-[40px] shadow-2xl shadow-gray-200 overflow-hidden">
        
        {/* --- HEADER --- */}
        <div className="bg-[#014d4e] p-10 text-center">
          <h2 className="text-3xl font-black italic uppercase text-white tracking-tighter">Boutique Identity</h2>
          <p className="text-[#f59e0b] text-[10px] font-bold tracking-[5px] uppercase mt-2">Registry Onboarding</p>
        </div>

        <div className="p-10 space-y-8">
          {/* --- UPLOAD SECTION --- */}
          <div className="flex flex-col items-center gap-6">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full border-4 border-dashed border-gray-100 bg-gray-50 flex items-center justify-center overflow-hidden">
                {formData.logoUrl ? (
                  <img src={formData.logoUrl} className="w-full h-full object-cover" />
                ) : (
                  <Camera className="text-gray-300 w-8 h-8" />
                )}
              </div>
              <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleFileUpload(e, 'logo')} />
              <div className="absolute bottom-0 right-0 bg-[#f59e0b] p-2 rounded-full text-white shadow-lg">
                <CheckCircle className="w-4 h-4" />
              </div>
              <label className="block text-center text-[9px] font-bold text-gray-400 uppercase mt-2">Upload Logo</label>
            </div>

            <div className="w-full h-32 rounded-3xl border-2 border-dashed border-gray-100 bg-gray-50 flex items-center justify-center overflow-hidden relative">
               {formData.bannerUrl ? (
                  <img src={formData.bannerUrl} className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <ImageIcon className="text-gray-300 w-6 h-6" />
                    <span className="text-[9px] font-bold text-gray-400 uppercase">Upload Banner</span>
                  </div>
                )}
                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleFileUpload(e, 'banner')} />
            </div>
          </div>

          {/* --- TEXT FIELDS --- */}
          <div className="space-y-4">
            <input 
              placeholder="Store Name"
              className="w-full p-5 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-[#f59e0b] font-bold text-[#014d4e]"
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
            <input 
              placeholder="Tagline (e.g. Rare Automotive Collectibles)"
              className="w-full p-5 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-[#f59e0b]"
              onChange={(e) => setFormData({...formData, tagline: e.target.value})}
            />
            <div className="grid grid-cols-2 gap-4">
               <input 
                placeholder="Public Email"
                className="w-full p-5 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-[#f59e0b] text-sm"
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
              <input 
                placeholder="Public Phone"
                className="w-full p-5 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-[#f59e0b] text-sm"
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </div>
          </div>

          <button 
            onClick={finishOnboarding}
            disabled={uploading}
            className="w-full py-5 bg-[#014d4e] text-[#f59e0b] font-black uppercase italic tracking-[4px] rounded-2xl shadow-xl shadow-[#014d4e]/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            {uploading ? "Uploading Media..." : "Launch Boutique"}
          </button>
        </div>
      </div>
    </div>
  );
}
