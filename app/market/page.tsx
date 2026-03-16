"use client";

import { useState, useEffect } from "react";
import MarketplaceCard from "./MarketplaceCard";
import MarketplaceCardSkeleton from "./MarketplaceCardSkeleton";
import {
  collection,
  getDocs,
  query,
  where,
  limit,
  startAfter,
  orderBy,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import CategoryBar from "@/components/marketplace/CategoryBar";

export default function MarketplacePage() {
  // ============================
  // STATE
  // ============================
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [cards, setCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [hasMore, setHasMore] = useState(true);

  // ============================
  // PAGINATED FIRESTORE LOADER
  // ============================
  const loadListings = async (category?: string) => {
    setLoading(true);

    let baseQuery;

    // First page (no cursor)
    if (!lastDoc) {
      baseQuery = category
        ? query(
            collection(db, "listings"),
            where("category", "==", category),
            orderBy("createdAt", "desc"),
            limit(12)
          )
        : query(
            collection(db, "listings"),
            orderBy("createdAt", "desc"),
            limit(12)
          );
    }
    // Next pages (cursor exists)
    else {
      baseQuery = category
        ? query(
            collection(db, "listings"),
            where("category", "==", category),
            orderBy("createdAt", "desc"),
            startAfter(lastDoc),
            limit(12)
          )
        : query(
            collection(db, "listings"),
            orderBy("createdAt", "desc"),
            startAfter(lastDoc),
            limit(12)
          );
    }

    const snapshot = await getDocs(baseQuery);

    // No more results
    if (snapshot.empty) {
      setHasMore(false);
      setLoading(false);
      return;
    }

    const newData = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Append new data
    setCards((prev) => [...prev, ...newData]);

    // Update cursor
    setLastDoc(snapshot.docs[snapshot.docs.length - 1]);

    setLoading(false);
  };

  // ============================
  // INITIAL LOAD
  // ============================
  useEffect(() => {
    loadListings();
  }, []);

  // ============================
  // RESET + RELOAD ON CATEGORY CHANGE
  // ============================
  useEffect(() => {
    setCards([]);
    setLastDoc(null);
    setHasMore(true);

    loadListings(activeCategory || undefined);
  }, [activeCategory]);

    return (
    <div className="marketplace-page">
      <h1 className="marketplace-title">Marketplace</h1>

      {/* CATEGORY BAR */}
     

      {/* GRID */}
      <div className="marketplace-grid">
        {/* ... your loading and mapping logic remains the same ... */}
        {loading && cards.length === 0 ? (
          <>
            <MarketplaceCardSkeleton />
            <MarketplaceCardSkeleton />
            <MarketplaceCardSkeleton />
            <MarketplaceCardSkeleton />
          </>
        ) : (
          <>
           {cards.map((card, index) => (
              <MarketplaceCard
                key={card.id + "-" + index}
                {...card} // Shortcut if props match keys
              />
            ))}

            {loading && cards.length > 0 && (
              <>
                <MarketplaceCardSkeleton />
                <MarketplaceCardSkeleton />
              </>
            )}
          </>
        )}
      </div>

      {/* LOAD MORE - Wrapped in a container to prevent stretching */}
      {hasMore && !loading && (
        <div className="mt-8 flex justify-start"> 
          <button
            className="load-more-button"
            onClick={() => loadListings(activeCategory || undefined)}
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
}
