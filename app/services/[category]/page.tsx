"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";

export default function ServicesCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const category = params?.category as string;



  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState<any[]>([]);

  useEffect(() => {
    const loadListings = async () => {
      const ref = collection(db, "services");

      const q = query(
        ref,
        where("category", "==", category),
        where("status", "==", "active"),
        orderBy("createdAt", "desc")
      );

      const snap = await getDocs(q);
      const items: any[] = [];

      snap.forEach((doc) => items.push({ id: doc.id, ...doc.data() }));

      setListings(items);
      setLoading(false);
    };

    loadListings();
  }, [category]);

  if (loading) return <p className="text-gray-600">Loading services…</p>;

  const title = String(category)
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

 return (
  <div className="space-y-10">
    {/* Header */}
    <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
    <p className="text-gray-700">Browse service providers in {title}.</p>

    {/* Listings */}
    {listings.length === 0 ? (
      <p className="text-gray-600">No services available.</p>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {listings.map((service) => (
          <div
            key={service.id}
            className="bg-white border rounded-xl shadow p-4 space-y-4 cursor-pointer"
            onClick={() =>
              router.push(`/services/${category}/${service.id}`)
            }
          >
            {/* Thumbnail */}
            {service.imageUrls?.length > 0 ? (
              <img
                src={service.imageUrls[0]}
                className="w-full h-40 object-cover rounded-lg border"
              />
            ) : (
              <div className="w-full h-40 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
                No Image
              </div>
            )}

            {/* Title */}
            <h3 className="text-lg font-semibold text-gray-900">
              {service.title}
            </h3>

            {/* Pricing Model */}
            <p className="text-gray-800 font-medium capitalize">
              {service.pricingType === "hourly"
                ? `$${service.rate}/hr`
                : service.pricingType === "flat"
                ? `$${service.rate} flat`
                : "Contact for quote"}
            </p>
          </div>
        ))}
      </div>
    )}
  </div>
);
}
