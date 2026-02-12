"use client";

import ListingCard from "@/components/ListingCard";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase/client";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function CarsIndexPage() {
  const [listings, setListings] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minYear, setMinYear] = useState("");
  const [maxYear, setMaxYear] = useState("");
  const [make, setMake] = useState("");
  const [sort, setSort] = useState("");
  const [savedIds, setSavedIds] = useState<string[]>([]);

  useEffect(() => {
    const fetchListings = async () => {
      const ref = collection(db, "listings");
      const q = query(ref, where("category", "==", "cars"));
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
      if (minYear && item.year < Number(minYear)) return false;
      if (maxYear && item.year > Number(maxYear)) return false;
      if (make && item.make?.toLowerCase() !== make.toLowerCase()) return false;

      return true;
    })
    .sort((a, b) => {
      if (sort === "price-low") return a.price - b.price;
      if (sort === "price-high") return b.price - a.price;
      if (sort === "year-new") return b.year - a.year;
      if (sort === "year-old") return a.year - b.year;
      return 0;
    });

  return (

      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-semibold mb-4">Cars for Sale</h1>

        <input
          className="w-full border p-2 rounded mb-6"
          placeholder="Search within Cars..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <input className="border p-2 rounded" placeholder="Min Price" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
          <input className="border p-2 rounded" placeholder="Max Price" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
          <input className="border p-2 rounded" placeholder="Min Year" value={minYear} onChange={(e) => setMinYear(e.target.value)} />
          <input className="border p-2 rounded" placeholder="Max Year" value={maxYear} onChange={(e) => setMaxYear(e.target.value)} />
          <input className="border p-2 rounded col-span-2 md:col-span-4" placeholder="Make (e.g., Toyota)" value={make} onChange={(e) => setMake(e.target.value)} />
        </div>

        <div className="mb-6">
          <select className="border p-2 rounded w-full" value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="">Sort By</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="year-new">Newest Year</option>
            <option value="year-old">Oldest Year</option>
          </select>
        </div>

        {filtered.length === 0 && <p>No matching cars found.</p>}

       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {filtered.map((item) => (
  <ListingCard
    key={item.id}
    item={item}
    savedIds={savedIds}
    setSavedIds={setSavedIds}
    category="cars"
  />
))}


</div>
</div>

);
}

