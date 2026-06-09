// 📁 components/SearchBar.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase/client"; // Ensure this points to your client-side firebase config file
import { doc, getDoc } from "firebase/firestore";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();

 const handleSubmit = async (e: any) => {
    e.preventDefault();
    const cleanQuery = query.trim();
    if (!cleanQuery) return;

    console.log("🚀 Testing query string:", cleanQuery);

    try {
      setIsSearching(true);
      
      // We explicitly check "listings". If your collection name is different, change it here!
      const targetCollection = "listings"; 
      const docRef = doc(db, targetCollection, cleanQuery);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        alert(`🎉 MATCH FOUND! Routing to asset layout.`);
        router.push(`/market/asset/${cleanQuery}`);
        setIsSearching(false);
        setQuery("");
        return;
      } else {
        // 🔴 This alert will tell us exactly what collection path is returning empty
        alert(`❌ Firebase connected, but found 0 documents at path: /${targetCollection}/${cleanQuery}`);
      }
    } catch (err: any) {
      // 💥 This will catch permission blocks, initialization errors, or network cuts
      alert(`💥 Firebase Error: ${err.message}`);
      console.error(err);
    } finally {
      setIsSearching(false);
    }

    // Default fallback page
    router.push(`/search?q=${encodeURIComponent(cleanQuery)}`);
  };

    // --- SELF-CORRECTING CATEGORY REDIRECTS ---
    // If a user types an exact subcategory name, guide them directly to that market view token
    const normalizedSearch = cleanQuery.toLowerCase().replace(/[^a-z0-9]/g, "");
    
    if (["classa", "classc", "traveltrailer", "campervan"].includes(normalizedSearch)) {
      router.push(`/market?tab=${normalizedSearch}`);
      setQuery("");
      return;
    }
    if (["digital", "nft", "digitalnft"].includes(normalizedSearch)) {
      router.push(`/market?tab=digital`);
      setQuery("");
      return;
    }
    if (["centerconsole", "jetski", "yacht"].includes(normalizedSearch)) {
      router.push(`/market?tab=${normalizedSearch}`);
      setQuery("");
      return;
    }

    // 🌐 Default Fallback: Traditional keyword text scanning page
    router.push(`/search?q=${encodeURIComponent(cleanQuery)}`);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full flex gap-2">
      <input
        className="flex-1 border p-2 rounded focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:bg-gray-100"
        placeholder={isSearching ? "Verifying Registry UID..." : "Search listings, UIDs, or categories..."}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        disabled={isSearching}
      />
      <button
        type="submit"
        disabled={isSearching}
        className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 transition-colors disabled:bg-teal-400"
      >
        {isSearching ? "Locating..." : "Search"}
      </button>
    </form>
  );
}
