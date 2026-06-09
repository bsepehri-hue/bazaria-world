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

    // 🕵️ Check if the search input matches a Firestore UID pattern (typically 20 alphanumeric characters)
    const isLikelyUID = /^[a-zA-Z0-9]{20,25}$/.test(cleanQuery);
    
    // ⛓️ Check if it's a crypto wallet or transaction hash (starts with 0x)
    const isCryptoAddress = /^0x[a-fA-F0-9]{40,64}$/.test(cleanQuery);

    if (isLikelyUID && !isCryptoAddress) {
      try {
        setIsSearching(true);
        // Direct pointer lookup to check if this exists instantly in the listings registry
        const docRef = doc(db, "listings", cleanQuery);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          // Systemic bypass: Route straight to the premium asset's specific detail sheet
          router.push(`/market/asset/${cleanQuery}`);
          setIsSearching(false);
          setQuery("");
          return;
        }
      } catch (err) {
        console.error("UID direct lookup bypass failed, falling back to text search:", err);
      } finally {
        setIsSearching(false);
      }
    }

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
