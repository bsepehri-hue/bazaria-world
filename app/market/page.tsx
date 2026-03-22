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
  const currentLastDoc = reset ? null : lastDoc;

  // 1. SIMPLIFIED CONSTRAINTS (Remove orderBy to test)
  const queryConstraints = [
    collection(db, "listings"),
    limit(12)
  ];

  // Only add category filter if one is selected
  if (category) {
    queryConstraints.push(where("category", "==", category.toLowerCase()));
  }
  
  if (currentLastDoc) {
    queryConstraints.push(startAfter(currentLastDoc));
  }

  const baseQuery = query(...queryConstraints);

  try {
    const snapshot = await getDocs(baseQuery);
    console.log("Firebase found:", snapshot.docs.length, "items"); // <--- CHECK THIS LOG

    if (snapshot.empty) {
      if (reset) setCards([]);
      setHasMore(false);
    } else {
      const newData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // 2. Ensure we aren't accidentally deleting cards
      setCards((prev) => (reset ? newData : [...prev, ...newData]));
      setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
      setHasMore(snapshot.docs.length === 12);
    }
  } catch (error) {
    console.error("Firebase Error:", error);
  }
  setLoading(false);
};

  // Handle BOTH Category and Search Changes
  useEffect(() => {
    setCards([]);
    setLastDoc(null);
    setHasMore(true);

    loadListings(activeCategory || undefined, true);
    
    // REMOVE urlQuery from these brackets! 
    // We want the search to filter the cards we ALREADY loaded.
  }, [activeCategory]);

  // 2. UPDATE YOUR FILTER LOGIC (Usually located right before the 'return')
 const filteredCards = cards;
    const query = urlQuery.toLowerCase().trim();

    // STEP A: If the user hasn't typed anything AND hasn't clicked a category,
    // SHOW EVERYTHING. This fixes the "vanish on load" bug.
    if (!query && !activeCategory) return true;

    // STEP B: Handle Category (if one is selected)
    const matchesCategory = !activeCategory || 
      (card.category || "").toLowerCase() === activeCategory.toLowerCase();

    // STEP C: Handle Search (if user is typing)
    const matchesSearch = !query || (
      (card.title || "").toLowerCase().includes(query) || 
      (card.make || "").toLowerCase().includes(query) || 
      (card.model || "").toLowerCase().includes(query)
    );

    return matchesCategory && matchesSearch;
  });

console.log("Current Search Term:", urlQuery);
console.log("Available Cards:", cards.length);

  
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

       <div className="marketplace-grid">
  {/* If we are loading and have NO cards, show 4 skeletons */}
  {loading && cards.length === 0 ? (
    Array(4).fill(0).map((_, i) => <MarketplaceCardSkeleton key={i} />)
  ) : (
    <>
      {/* Show the ACTUAL filtered cards */}
      {filteredCards.map((card, index) => (
        <MarketplaceCard key={card.id + "-" + index} {...card} />
      ))}
      
      {/* ONLY show a skeleton at the end if we are loading more pages */}
      {loading && <MarketplaceCardSkeleton />}
      
      {/* If search found NOTHING, show a message */}
      {!loading && filteredCards.length === 0 && (
        <div className="col-span-full py-10 text-center text-gray-500">
          No items found matching "{urlQuery}"
        </div>
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
    </div>
  );
}
