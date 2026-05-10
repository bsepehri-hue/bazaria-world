"use client";

import { useEffect, useState } from "react";
import { getArtListings } from "@/lib/categories/art/loader";

export default function ArtListing() {
  const [listings, setListings] = useState([]);

  useEffect(() => {
    getArtListings().then(setListings);
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold">Art</h1>

      <div className="grid grid-cols-2 gap-4 mt-4">
        {listings.map((item) => (
          <div key={item.id} className="border p-4 rounded">
            <h2 className="font-medium">{item.title}</h2>
            {item.imageUrls?.[0] && (
              <img
                src={item.imageUrls[0]}
                alt={item.title}
                className="mt-2 rounded"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
