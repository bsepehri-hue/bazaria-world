"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase/client";
import { collection, query, where, getDocs } from "firebase/firestore";
import Link from "next/link";
import ListingCard from "@/components/ListingCard";

export default function PropertiesIndexPage() {
  const [listings, setListings] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  // Filters
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [type, setType] = useState("");
  const [minBeds, setMinBeds] = useState("");
  const [maxBeds, setMaxBeds] = useState("");
  const [minBaths, setMinBaths] = useState("");
  const [maxBaths, setMaxBaths] = useState("");
  const [minSqft, setMinSqft] = useState("");
  const [maxSqft, setMaxSqft] = useState("");

  // Sorting
  const [sort, setSort] = useState("");

  // Saved listings
  const [savedIds, setSavedIds] = useState<string[]>([]);

  useEffect(() => {
    const fetchListings = async () => {
      const ref = collection(db, "listings");
      const q = query(ref, where("category", "==", "properties"));
      const snap = await getDocs(q);

      const items: any[] = [];
      snap.forEach((doc) => items.push({ id: doc.id, ...doc.data() }));
      setListings(items);
    };

    fetchListings();
  }, []);

  const filtered = listings
    .filter((item) => {
      const haystack = JSON.stringify(item).toLowerCase();
      const q = search.toLowerCase();

      if (!haystack.includes(q)) return false;

      if (minPrice && item.price < Number(minPrice)) return false;
      if (maxPrice && item.price > Number(maxPrice)) return false;

      if (type && item.type?.toLowerCase() !== type.toLowerCase()) return false;

      if (minBeds && item.bedrooms < Number(minBeds)) return false;
      if (maxBeds && item.bedrooms > Number(maxBeds)) return false;

      if (minBaths && item.bathrooms < Number(minBaths)) return false;
      if (maxBaths && item.bathrooms > Number(maxBaths)) return false;

      if (minSqft && item.sqft < Number(minSqft)) return false;
      if (maxSqft && item.sqft > Number(maxSqft)) return false;

      return true;
    })
    .sort((a, b) => {
      if (sort === "price-low") return a.price - b.price;
      if (sort === "price-high") return b.price - a.price;

      if (sort === "sqft-high") return (b.sqft || 0) - (a.sqft || 0);
      if (sort === "sqft-low") return (a.sqft || 0) - (b.sqft || 0);

      if (sort === "beds-high") return (b.bedrooms || 0) - (a.bedrooms || 0);
      if (sort === "baths-high") return (b.bathrooms || 0) - (a.bathrooms || 0);

      if (sort === "newest") return (b.createdAt || 0) - (a.createdAt || 0);
      if (sort === "oldest") return (a.createdAt || 0) - (b.createdAt || 0);

      return 0;
    });

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold mb-4">Properties for Sale</h1>

      <input
        className="w-full border p-2 rounded mb-6"
        placeholder="Search within Properties..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Filters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <input className="border p-2 rounded" placeholder="Min Price" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
        <input className="border p-2 rounded" placeholder="Max Price" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />

        <select className="border p-2 rounded" value={type} onChange={(e) => setType(e.target.value)}>
          <option value="">Any Type</option>
          <option value="house">House</option>
          <option value="apartment">Apartment</option>
          <option value="condo">Condo</option>
          <option value="land">Land</option>
        </select>

        <input className="border p-2 rounded" placeholder="Min Beds" value={minBeds} onChange={(e) => setMinBeds(e.target.value)} />
        <input className="border p-2 rounded" placeholder="Max Beds" value={maxBeds} onChange={(e) => setMaxBeds(e.target.value)} />

        <input className="border p-2 rounded" placeholder="Min Baths" value={minBaths} onChange={(e) => setMinBaths(e.target.value)} />
        <input className="border p-2 rounded" placeholder="Max Baths" value={maxBaths} onChange={(e) => setMaxBaths(e.target.value)} />

        <input className="border p-2 rounded" placeholder="Min Sqft" value={minSqft} onChange={(e) => setMinSqft(e.target.value)} />
        <input className="border p-2 rounded" placeholder="Max Sqft" value={maxSqft} onChange={(e) => setMaxSqft(e.target.value)} />
      </div>

      {/* Sorting */}
      <div className="mb-6">
        <select
          className="border p-2 rounded w-full"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="">Sort By</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="sqft-high">Sqft: High to Low</option>
          <option value="sqft-low">Sqft: Low to High</option>
          <option value="beds-high">Bedrooms: Most</option>
          <option value="baths-high">Bathrooms: Most</option>
          <option value="newest">Newest Listings</option>
          <option value="oldest">Oldest Listings</option>
        </select>
      </div>

      {filtered.length === 0 && <p>No matching properties found.</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((item) => (
          <ListingCard
            key={item.id}
            item={item}
            savedIds={savedIds}
            setSavedIds={setSavedIds}
            category="properties"
          />
        ))}
      </div>
    </div>
  );
}
