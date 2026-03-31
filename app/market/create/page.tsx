"use client";

import { useState } from "react";
import { db } from "@/lib/firebase/client";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function CreateListingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    make: "",
    model: "",
    category: "cars",
    price: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addDoc(collection(db, "listings"), {
        ...formData,
        price: Number(formData.price),
        createdAt: serverTimestamp(), // This fixes the 'vanishing' bug!
        status: "active",
      });
      
      router.push("/market"); // Send user back to see their new listing
    } catch (error) {
      console.error("Error adding listing:", error);
      alert("Failed to create listing.");
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
        <p className="opacity-80 mt-2 font-medium">Create a new listing for the Bazaria Marketplace.</p>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-6">
        {/* Title Input */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Listing Title</label>
          <input 
            placeholder="e.g. 2022 Toyota Camry" 
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#004d40] focus:border-transparent outline-none transition-all text-black"
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            required 
          />
        </div>

        {/* Make & Model Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Make</label>
            <input 
              placeholder="Toyota" 
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#004d40] outline-none transition-all text-black"
              onChange={(e) => setFormData({...formData, make: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Model</label>
            <input 
              placeholder="Camry" 
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#004d40] outline-none transition-all text-black"
              onChange={(e) => setFormData({...formData, model: e.target.value})}
            />
          </div>
        </div>

        {/* Price Input */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Price ($)</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">$</span>
            <input 
              type="number" 
              placeholder="0.00" 
              className="w-full p-3 pl-8 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#004d40] outline-none transition-all text-black"
              onChange={(e) => setFormData({...formData, price: e.target.value})}
              required 
            />
          </div>
        </div>

        {/* Action Button */}
        <button 
          disabled={loading}
          className="w-full bg-[#004d40] text-white p-4 rounded-xl font-bold text-lg hover:bg-[#003d33] transform transition-all active:scale-[0.98] shadow-lg disabled:bg-gray-400 mt-4"
        >
          {loading ? "Posting to Marketplace..." : "Post Listing"}
        </button>
      </form>
    </div>
  </div>
);
}
