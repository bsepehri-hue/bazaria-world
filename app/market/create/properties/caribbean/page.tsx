"use client";

import { useState } from "react";
import { db, storage } from "@/lib/firebase/client";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useRouter } from "next/navigation";
import { BedDouble, CalendarDays, ShieldCheck, ArrowLeft, Camera, Clock, Star } from "lucide-react";

export default function SanctuaryHospitalityCreate() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  
  const [formData, setFormData] = useState({
    title: "",
    hospitalityType: "Luxury Suite", // Luxury Suite, Boutique Room, Timeshare Week
    location: "",
    roomType: "Entire Space", // Entire Space, Private Room
    bathroomAccess: "Private", 
    weekNumber: "", // Specific for Timeshares
    price: "",
    saleMode: "Auction",
    durationDays: "7", // Hospitality moves faster than Villas
    reservePrice: "",
    startingBid: "",
    description: "",
    isSanctuaryAsset: true,
    assetClass: "Hospitality/Timeshare"
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const uploadedUrls = [];
      for (const file of imageFiles) {
        const fileRef = ref(storage, `sanctuary/hospitality/${Date.now()}-${file.name}`);
        const uploadTask = await uploadBytes(fileRef, file);
        const url = await getDownloadURL(uploadTask.ref);
        uploadedUrls.push(url);
      }

      await addDoc(collection(db, "listings"), {
        ...formData,
        imageUrls: uploadedUrls,
        imageUrl: uploadedUrls[0] || "",
        price: formData.saleMode === "Auction" ? Number(formData.startingBid) : Number(formData.price),
        currentBid: Number(formData.startingBid),
        status: "active", // Hospitality usually requires less vetting than Land
        auctionEnd: new Date(Date.now() + Number(formData.durationDays) * 24 * 60 * 60 * 1000),
        createdAt: serverTimestamp(),
      });
      
      router.push("/market"); 
    } catch (error) {
      console.error("Hospitality Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12 text-left">
      <div className="max-w-4xl mx-auto">
        
        <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-400 hover:text-teal-600 transition-colors mb-6 font-black uppercase text-[10px] tracking-widest">
          <ArrowLeft size={16} /> Sanctuary Gateway
        </button>

        <div className="bg-white rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden text-black">
          {/* Hospitality Header */}
          <div className="bg-[#4338ca] p-12 text-white border-b-8 border-indigo-400">
            <h1 className="text-4xl font-black uppercase tracking-tighter italic">Hospitality Intake</h1>
            <p className="text-indigo-200 text-xs font-bold uppercase tracking-[0.4em] mt-2">Boutique Stays & Timeshare Deployment</p>
          </div>

          <form onSubmit={handleSubmit} className="p-10 space-y-10">
            
            {/* High-End Gallery */}
            <div className="space-y-4 text-left">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Experience Gallery (Max 8 Images)</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <label className="aspect-square bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-indigo-600 transition-all text-slate-400">
                  <Camera size={24} />
                  <input type="file" multiple accept="image/*" className="hidden" 
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      setImageFiles((prev) => [...prev, ...files].slice(0, 8));
                    }} 
                  />
                </label>
                {imageFiles.map((file, idx) => (
                  <div key={idx} className="aspect-square rounded-2xl overflow-hidden border border-slate-100 relative group">
                    <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" />
                    <button type="button" onClick={() => setImageFiles(imageFiles.filter((_, i) => i !== idx))} className="absolute inset-0 bg-rose-500/90 text-white opacity-0 group-hover:opacity-100 transition-opacity font-black text-xs uppercase">Delete</button>
                  </div>
                ))}
              </div>
            </div>

            {/* Stay Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2 text-left">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 italic">Listing Title</label>
                <input placeholder="e.g. Royal Indigo Suite - Week 42" className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold" onChange={(e) => setFormData({...formData, title: e.target.value})} required />
              </div>
              <div className="space-y-2 text-left">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 italic">Asset Type</label>
                <select className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold" onChange={(e) => setFormData({...formData, hospitalityType: e.target.value})}>
                  <option>Luxury Suite</option>
                  <option>Boutique Room</option>
                  <option>Timeshare Certificate (Ownership)</option>
                  <option>Timeshare Week (Rental)</option>
                </select>
              </div>
            </div>

            {/* Timeshare & Room Intelligence */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-indigo-50/50 p-8 rounded-[2rem] border border-indigo-100">
              <div className="space-y-1 text-left">
                <div className="flex items-center gap-2 mb-2 text-indigo-700">
                   <CalendarDays size={16} />
                   <label className="text-[10px] font-black uppercase tracking-widest">Calendar Week</label>
                </div>
                <input placeholder="e.g. Week 42" className="w-full p-4 bg-white border-2 border-indigo-100 rounded-xl font-bold" onChange={(e) => setFormData({...formData, weekNumber: e.target.value})} />
              </div>
              <div className="space-y-1 text-left">
                <div className="flex items-center gap-2 mb-2 text-indigo-700">
                   <BedDouble size={16} />
                   <label className="text-[10px] font-black uppercase tracking-widest">Privacy Level</label>
                </div>
                <select className="w-full p-4 bg-white border-2 border-indigo-100 rounded-xl font-bold" onChange={(e) => setFormData({...formData, roomType: e.target.value})}>
                  <option>Entire Space</option>
                  <option>Private Room</option>
                  <option>Shared Villa</option>
                </select>
              </div>
              <div className="space-y-1 text-left">
                <div className="flex items-center gap-2 mb-2 text-indigo-700">
                   <Clock size={16} />
                   <label className="text-[10px] font-black uppercase tracking-widest">Min. Stay / Terms</label>
                </div>
                <input placeholder="e.g. 7 Days / Sat-Sat" className="w-full p-4 bg-white border-2 border-indigo-100 rounded-xl font-bold" />
              </div>
            </div>

            {/* Auction Architecture */}
            <div className="bg-[#1e1b4b] p-10 rounded-[2.5rem] text-white">
              <div className="flex justify-between items-center border-b border-white/10 pb-6 mb-8 text-left">
                <div>
                  <h3 className="text-sm font-black uppercase tracking-widest italic">Hospitality Bidding</h3>
                  <p className="text-[10px] text-indigo-400 font-bold uppercase italic">Quick turnarounds for high-demand weeks.</p>
                </div>
                <select className="bg-white/10 p-3 rounded-xl font-bold text-xs uppercase outline-none" onChange={(e) => setFormData({...formData, durationDays: e.target.value})}>
                  <option value="3" className="text-black">3 Day Flash</option>
                  <option value="7" className="text-black">7 Day Standard</option>
                </select>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-2 text-left">
                  <label className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Opening Bid (USD)</label>
                  <input type="number" className="w-full bg-transparent border-b-4 border-indigo-500 outline-none font-black text-4xl" placeholder="0.00" onChange={(e) => setFormData({...formData, startingBid: e.target.value})} />
                </div>
                <div className="space-y-2 text-left">
                  <label className="text-[10px] font-black uppercase tracking-widest text-rose-400 italic">Reserve Requirement</label>
                  <input type="number" className="w-full bg-transparent border-b-4 border-rose-600 outline-none font-black text-4xl" placeholder="0.00" onChange={(e) => setFormData({...formData, reservePrice: e.target.value})} />
                </div>
              </div>
            </div>

            <button disabled={loading} className="w-full bg-indigo-700 text-white p-8 rounded-[2rem] font-black uppercase tracking-[0.4em] shadow-2xl hover:bg-indigo-800 transition-all disabled:bg-slate-300">
              {loading ? "Deploying Stay..." : "Deploy Hospitality Asset"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
