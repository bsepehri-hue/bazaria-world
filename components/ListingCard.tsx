"use client";

import Link from "next/link";
import { toggleFavorite } from "@/lib/favorites";
import { useState } from "react";

// ⭐ Props interface goes here
interface ListingCardProps {
  item: any; // or your real item type
  savedIds: string[];
  setSavedIds: (ids: string[]) => void;
  category: string;
}

export default function ListingCard({
  item,
  savedIds,
  setSavedIds,
  category,
}: ListingCardProps) {



  const handleToggle = async (e: any) => {
    e.preventDefault();

    // Optimistic UI
    if (isSaved) {
      setSavedIds((prev: string[]) => prev.filter((id) => id !== item.id));
    } else {
      setSavedIds((prev: string[]) => [...prev, item.id]);
    }

    await toggleFavorite(null, item.id);
  };

  return (
    <div className="relative border p-4 rounded hover:bg-gray-50">
      {/* Heart */}
      <button
        onClick={handleToggle}
        className="absolute top-2 right-2 z-10"
      >
        {isSaved ? "❤️" : "🤍"}
      </button>

      <Link href={`/listings/${category}/${item.id}`} className="block">
        <h2 className="text-xl font-semibold">{item.title}</h2>
        <p className="text-teal-700 font-medium">
          ${item.price?.toLocaleString()}
        </p>
        <p className="text-gray-600">
          {item.year} {item.make} {item.model}
        </p>
      </Link>
    </div>
  );
}
