This is the "Full Stack" version of your Create Listing page. It integrates the Firebase Storage upload, the dynamic Sub-Category mapping, and the Mixed Marketplace logic (New, Used, Auction).

app/market/create/page.tsx
TypeScript
"use client";

import { useState } from "react";
import { db, storage } from "@/lib/firebase/client";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useRouter } from "next/navigation";

// Dynamic Sub-Category Mapping
const SUB_CATEGORIES: Record<string, string[]> = {
  cars: ["Sedan", "SUV", "Truck", "Coupe", "Luxury", "Electric"],
  rentals: ["Apartment", "Villa", "Studio", "Commercial"],
  art: ["Digital", "Painting", "Sculpture", "Photography"],
  services: ["Development", "Design", "Legal", "Marketing"],
  general: ["Electronics", "Furniture", "Books", "Other"]
};

export default function CreateListingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    make: "",
    model: "",
    category: "cars",
    subCategory: "",
    condition: "Used", // Hybrid Logic: New, Used, or Auction
    price: "",
    description: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = "https://via.placeholder.com/400x300?text=No+Image";

      // 1. UPLOAD IMAGE TO FIREBASE STORAGE
      if (imageFile) {
        const fileRef = ref(storage, `listings/${Date.now()}-${imageFile.name}`);
        const uploadTask = await uploadBytes(fileRef, imageFile);
        imageUrl = await getDownloadURL(uploadTask.ref);
      }

      // 2. SAVE TO FIRESTORE
      await addDoc(collection(db, "listings"), {
        ...formData,
        price: Number(formData.price),
        currentBid: Number(formData.price), // Initial bid starts at price
        bidCount: 0,
        imageUrl: imageUrl,
        createdAt: serverTimestamp(),
        status: "active",
      });
      
      router.push("/market"); 
    } catch (error) {
      console.error("Error adding listing:", error);
      alert("Failed to create listing. Check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
        
        {/* Header Section */}
        <div className="bg-[#004d40] p-8 text-white">
          <h1 className="text-3xl font-bold">List a New Item</h1>
          <p className="opacity-80 mt-2 font-medium">Create a listing for the Bazaria Living Economy.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          
          {/* Title & Image */}
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Listing Title</label>
              <input 
                placeholder="e.g. 2022 Toyota Camry" 
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-black outline-none focus:ring-2 focus:ring-[#004d40]"
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Item Image</label>
              <input 
                type="file" 
                accept="image/*"
                className="w-full p-2 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#004d40] file:text-white hover:file:bg-[#003d33] cursor-pointer"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              />
            </div>
          </div>

          {/* Category & Sub-Category Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
              <select 
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-black outline-none"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value, subCategory: ""})}
              >
                {Object.keys(SUB_CATEGORIES).map(cat => (
                  <option key={cat} value={cat}>{cat.toUpperCase()}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Sub-Category</label>
              <select 
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-black outline-none"
                value={formData.subCategory}
                onChange={(e) => setFormData({...formData, subCategory: e.target.value})}
                required
              >
                <option value="">Select Option</option>
                {SUB_CATEGORIES[formData.category]?.map(sub => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Condition / Listing Type (Hybrid Logic) */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Listing Type</label>
            <div className="flex gap-6 p-3 bg-gray-50 rounded-lg border border-gray-200">
              {["New", "Used", "Auction"].map((type) => (
                <label key={type} className="flex items-center gap-2 cursor-pointer text-black font-medium">
                  <input 
                    type="radio" 
                    name="condition" 
                    checked={formData.condition === type}
                    onChange={() => setFormData({...formData, condition: type})}
                    className="accent-[#004d40]"
                  /> {type}
                </label>
              ))}
            </div>
          </div>

          {/* Price & Specs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Price ($)</label>
              <input 
                type="number" 
                placeholder="0.00" 
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-black outline-none focus:ring-2 focus:ring-[#004d40]"
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Make (Optional)</label>
              <input 
                placeholder="Toyota" 
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-black outline-none"
                onChange={(e) => setFormData({...formData, make: e.target.value})}
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
            <textarea 
              rows={3}
              placeholder="Tell buyers about the condition, features, or history..."
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-black outline-none focus:ring-2 focus:ring-[#004d40]"
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          {/* Submit Button */}
          <button 
            disabled={loading}
            className="w-full bg-[#004d40] text-white p-4 rounded-xl font-bold text-lg hover:bg-[#003d33] transform transition-all active:scale-[0.98] shadow-lg disabled:bg-gray-400"
          >
            {loading ? "Uploading to Cloud..." : "Post to Marketplace"}
          </button>
        </form>
      </div>
    </div>
  );
}
