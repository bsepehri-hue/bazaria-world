"use client";

import { useState, useEffect, useRef } from "react";
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
import { useSearchParams } from 'next/navigation'; // Add this import


export default function MarketplacePage() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [cards, setCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [hasMore, setHasMore] = useState(true);

  // 1. READ SEARCH FROM URL
  const searchParams = useSearchParams();
  const urlQuery = searchParams.get('q') || "";

  const isInitialMount = useRef(true);

  const loadListings = async (category?: string, reset = false) => {
    setLoading(true);
    // Use local variable for lastDoc to handle resets immediately
    const currentLastDoc = reset ? null : lastDoc;

    let baseQuery;
    
    // Simplification: logic for first page vs next page
    const queryConstraints = [
      collection(db, "listings"),
      orderBy("createdAt", "desc"),
      limit(12)
    ];

    if (category) queryConstraints.push(where("category", "==", category));
    if (currentLastDoc) queryConstraints.push(startAfter(currentLastDoc));

    baseQuery = query(...queryConstraints);

    try {
      const snapshot = await getDocs(baseQuery);

      if (snapshot.empty) {
        if (reset) setCards([]); // Clear cards if category has no items
        setHasMore(false);
      } else {
        const newData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setCards((prev) => (reset ? newData : [...prev, ...newData]));
        setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
        setHasMore(snapshot.docs.length === 12);
      }
    } catch (error) {
      console.error("Error loading listings:", error);
    }
    setLoading(false);
  };

  // Handle Category Changes (Resetting everything)
  useEffect(() => {
    setLastDoc(null);
    setHasMore(true);
    loadListings(activeCategory || undefined, true);
  }, [activeCategory]);

  // 2. UPDATE YOUR FILTER LOGIC (Usually located right before the 'return')
  const filteredCards = cards.filter((card) => {
  const query = urlQuery.toLowerCase();
    // 1. Search across multiple fields
  const matchesSearch = 
    card.title?.toLowerCase().includes(query) || 
    card.make?.toLowerCase().includes(query) || 
    card.model?.toLowerCase().includes(query) ||
    card.description?.toLowerCase().includes(query);

  // 2. Keep the category filter active as well
  const matchesCategory = !activeCategory || card.category === activeCategory;

  return matchesSearch && matchesCategory;
});

  return (
    <div className="marketplace-page-container" style={{ display: 'flex', width: '100%' }}>
     

      <div className="marketplace-content" style={{ 
        flex: 1, 
        maxWidth: 'calc(100vw - 250px)', 
        overflowX: 'hidden', 
        position: 'relative',
        padding: '24px'
      }}>
        <h1 className="marketplace-title" style={{ marginBottom: '16px' }}>Marketplace</h1>

        <div style={{ position: 'relative', zIndex: 9999, marginBottom: '24px' }}>
          <CategoryBar active={activeCategory} onSelect={setActiveCategory} />
        </div>

        <div className="marketplace-grid" style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
          gap: '24px', 
          zIndex: 1 
        }}>
          {loading && cards.length === 0 ? (
            Array(4).fill(0).map((_, i) => <MarketplaceCardSkeleton key={i} />)
          ) : (
            <>
              {filteredCards.map((card, index) => (
                <MarketplaceCard key={card.id + "-" + index} {...card} />
              ))}
              {loading && <MarketplaceCardSkeleton />}
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
    </div>
  );
}
