"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase/client";
import { collection, query, where, getDocs } from "firebase/firestore";
import Link from "next/link";

export default function ServicesIndexPage() {
  const [listings, setListings] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  // Filters
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [availability, setAvailability] = useState("");

  // Sorting
  const [sort, setSort] = useState("");

  useEffect(() => {
    const fetchListings = async () => {
      const ref = collection(db, "listings");
      const q = query(ref, where("category", "==", "services"));
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

      // Text search
      if (!haystack.includes(q)) return false;

      // Price filter
      if (minPrice && item.price < Number(minPrice)) return false;
      if (maxPrice && item.price > Number(maxPrice)) return false;

      // Service type filter
      if (serviceType && item.serviceType?.toLowerCase() !== serviceType.toLowerCase()) {
        return false;
      }

      // Availability filter
      if (availability && item.availability?.toLowerCase() !== availability.toLowerCase()) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      if (sort === "price-low") return a.price - b.price;
      if (sort === "price-high") return b.price - a.price;

      if (sort === "newest") return (b.createdAt || 0) - (a.createdAt || 0);
      if (sort === "oldest") return (a.createdAt || 0) - (b.createdAt || 0);

      return 0;
    });

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold mb-4">Services</h1>

      {/* Search */}
      <input
        className="w-full border p-2 rounded mb-6"
        placeholder="Search within Services..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Filters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <input
          className="border p-2 rounded"
          placeholder="Min Price"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />
        <input
          className="border p-2 rounded"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />

        <input
          className="border p-2 rounded"
          placeholder="Service Type (e.g., Cleaning)"
          value={serviceType}
          onChange={(e) => setServiceType(e.target.value)}
        />

        <input
          className="border p-2 rounded"
          placeholder="Availability (e.g., Weekends)"
          value={availability}
          onChange={(e) => setAvailability(e.target.value)}
        />
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
          <option value="newest">Newest Listings</option>
          <option value="oldest">Oldest Listings</option>
        </select>
      </div>

      {filtered.length === 0 && <p>No matching services found.</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((item) => (
          <Link
            key={item.id}
            href={`/listings/services/${item.id}`}
            className="border p-4 rounded hover:bg-gray-50"
          >
            <h2 className="text-xl font-semibold">{item.title}</h2>

            <p className="text-teal-700 font-medium">
              ${item.price?.toLocaleString()}
            </p>

            <p className="text-gray-600 capitalize">{item.serviceType}</p>

            <p className="text-gray-600">{item.availability}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
