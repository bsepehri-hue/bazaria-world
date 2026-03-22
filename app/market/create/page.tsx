"use client";

import { useState } from "react";
import { db } from "@/lib/firebase";
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
    <div className="max-w-2xl mx-auto p-8 bg-white shadow-md rounded-lg mt-10">
      <h1 className="text-2xl font-bold mb-6">List a New Item</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input 
          placeholder="Title (e.g. 2022 Toyota Camry)" 
          className="w-full p-2 border rounded"
          onChange={(e) => setFormData({...formData, title: e.target.value})}
          required 
        />
        <div className="grid grid-cols-2 gap-4">
          <input 
            placeholder="Make" 
            className="p-2 border rounded"
            onChange={(e) => setFormData({...formData, make: e.target.value})}
          />
          <input 
            placeholder="Model" 
            className="p-2 border rounded"
            onChange={(e) => setFormData({...formData, model: e.target.value})}
          />
        </div>
        <input 
          type="number" 
          placeholder="Price" 
          className="w-full p-2 border rounded"
          onChange={(e) => setFormData({...formData, price: e.target.value})}
          required 
        />
        <button 
          disabled={loading}
          className="w-full bg-blue-600 text-white p-3 rounded font-bold hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? "Posting..." : "Post Listing"}
        </button>
      </form>
    </div>
  );
}
