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
  /* We use min-h-screen and overflow-x-hidden to lock the page width */
  <div className="marketplace-page" style={{ 
    padding: '24px 32px', 
    minHeight: '100vh', 
    width: '100%', 
    maxWidth: '100vw', 
    overflowX: 'hidden', 
    position: 'relative',
    boxSizing: 'border-box'
  }}>
    <h1 className="marketplace-title" style={{ marginBottom: '16px' }}>Marketplace</h1>

    {/* MENU ZONE: We force this to be visible and on top of everything */}
    <div style={{ position: 'relative', zIndex: 9999, overflow: 'visible', marginBottom: '24px' }}>
      <CategoryBar active={activeCategory} onSelect={setActiveCategory} />
    </div>

    {/* GRID ZONE: We keep the grid below the menu's "layer" */}
    <div className="marketplace-grid" style={{ position: 'relative', zIndex: 1 }}>
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
            <MarketplaceCard key={card.id + "-" + index} {...card} />
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

    {hasMore && !loading && (
      <div className="mt-8 flex justify-start"> 
        <button className="load-more-button" onClick={() => loadListings(activeCategory || undefined)}>
          Load More
        </button>
      </div>
    )}
  </div>
);
}
