"use client";

import { useState } from "react";
import { db } from "@/lib/firebase/client";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function NewPropertyListingPage() {
  // 🛡️ THE SOVEREIGN STATES
  const [isCaribbean, setIsCaribbean] = useState(false);
  
  // Existing States
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [type, setType] = useState("house");
  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [sqft, setSqft] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  // 🏛️ THE SANCTUARY AUDIT STATES
  const [energy, setEnergy] = useState("None");
  const [security, setSecurity] = useState("Standard");
  const [internet, setInternet] = useState("Standard Cable");
  const [confotur, setConfotur] = useState("Not Applicable");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addDoc(collection(db, "listings"), {
        title,
        price: Number(price),
        type,
        bedrooms: Number(bedrooms),
        bathrooms: Number(bathrooms),
        sqft: Number(sqft),
        location,
        description,
        // Sovereign Fields
        isCaribbeanFacilitation: isCaribbean,
        energyRedundancy: energy,
        securityTier: security,
        internetGrade: internet,
        confoturStatus: confotur,
        category: "properties",
        createdAt: serverTimestamp(),
      });

      setLoading(false);
      alert(isCaribbean ? "Sanctuary Listing Published!" : "Standard Listing Created!");
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className={`transition-colors duration-500 min-h-screen p-6 ${isCaribbean ? 'bg-[#034241] text-white' : 'bg-white text-slate-900'}`}>
      <div className="max-w-2xl mx-auto">
        
        {/* 🛡️ THE MASTER TOGGLE */}
        <div className={`mb-8 p-6 rounded-3xl border-2 transition-all ${isCaribbean ? 'border-teal-400 bg-[#0C364C]' : 'border-slate-200 bg-slate-50'}`}>
          <div className="flex justify-between items-center">
            <div>
              <h2 className="font-black text-lg uppercase tracking-tighter">Caribbean Facilitation</h2>
              <p className="text-xs opacity-70">Enable for elite portfolio vetting and direct Florida-to-DR leads.</p>
            </div>
            <button 
              onClick={() => setIsCaribbean(!isCaribbean)}
              className={`w-14 h-8 rounded-full transition-colors relative ${isCaribbean ? 'bg-teal-400' : 'bg-slate-300'}`}
            >
              <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${isCaribbean ? 'translate-x-7' : 'translate-x-1'}`} />
            </button>
          </div>
        </div>

        <h1 className="text-3xl font-black mb-8 tracking-tight">
          {isCaribbean ? "Submit Your Sanctuary" : "New Property Listing"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* 🏛️ CONDITIONAL AUDIT SECTION */}
          {isCaribbean && (
            <div className="space-y-4 p-6 bg-white/5 rounded-2xl border border-white/10 animate-in fade-in slide-in-from-top-4">
              <p className="text-[10px] font-black text-teal-400 uppercase tracking-widest mb-4">Mandatory Sanctuary Audit</p>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold mb-1 opacity-60">Energy Redundancy</label>
                  <select className="w-full bg-[#0C364C] border border-white/20 p-3 rounded-xl text-sm" value={energy} onChange={(e) => setEnergy(e.target.value)}>
                    <option value="None">None</option>
                    <option value="Generator">Generator</option>
                    <option value="Full Solar">Full Solar</option>
                    <option value="Solar + Generator">Solar + Generator</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold mb-1 opacity-60">Security Tier</label>
                  <select className="w-full bg-[#0C364C] border border-white/20 p-3 rounded-xl text-sm" value={security} onChange={(e) => setSecurity(e.target.value)}>
                    <option value="Standard">Standard</option>
                    <option value="Gated 24/7">Gated 24/7</option>
                    <option value="Elite Armed Patrol">Elite Armed Patrol</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold mb-1 opacity-60">Legal (CONFOTUR Status)</label>
                <select className="w-full bg-[#0C364C] border border-white/20 p-3 rounded-xl text-sm" value={confotur} onChange={(e) => setConfotur(e.target.value)}>
                  <option value="Not Applicable">Not Applicable</option>
                  <option value="Verified Active">Verified Active (15yr Tax Exempt)</option>
                </select>
              </div>
            </div>
          )}

          {/* Standard Fields with Dynamic Styling */}
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase mb-2">Property Title</label>
              <input
                className={`w-full p-4 rounded-xl border transition-all ${isCaribbean ? 'bg-white/10 border-white/20' : 'bg-slate-50 border-slate-200'}`}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Oceanfront Villa Sanctuary"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div>
                <label className="block text-xs font-bold uppercase mb-2">Price (USD)</label>
                <input
                  type="number"
                  className={`w-full p-4 rounded-xl border transition-all ${isCaribbean ? 'bg-white/10 border-white/20' : 'bg-slate-50 border-slate-200'}`}
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase mb-2">Location</label>
                <input
                  className={`w-full p-4 rounded-xl border transition-all ${isCaribbean ? 'bg-white/10 border-white/20' : 'bg-slate-50 border-slate-200'}`}
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Cap Cana, DR"
                  required
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest transition-all ${
              isCaribbean 
                ? 'bg-teal-400 text-[#034241] shadow-[0_0_30px_rgba(45,212,191,0.3)] hover:scale-[1.02]' 
                : 'bg-teal-600 text-white hover:bg-teal-700'
            }`}
          >
            {loading ? "Authenticating Data..." : isCaribbean ? "Submit to Elite Portfolio" : "Create Listing"}
          </button>

        </form>
      </div>
    </div>
  );
}
