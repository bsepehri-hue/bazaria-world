"use client";

import { useState, useEffect } from "react";
import MarketplaceCard from "./MarketplaceCard";
import MarketplaceCardSkeleton from "./MarketplaceCardSkeleton";
import { db } from "@/lib/firebase/client";
import CategoryBar from "@/components/marketplace/CategoryBar";
import { useSearchParams } from 'next/navigation';

// THE ONLY FIRESTORE IMPORT YOU NEED:
import { 
  collection, 
  getDocs, 
  query, 
  where, 
  limit, 
  startAfter, 
  doc, 
  updateDoc, 
  runTransaction, 
  increment, 
  serverTimestamp 
} from "firebase/firestore";

// --- HELPER FUNCTION (Outside the component) ---
const getTimeLeft = (endTime: any) => {
  if (!endTime || !endTime.toDate) return "3d 12h left"; // Fallback for demo
  const end = endTime.toDate(); 
  const now = new Date();
  const diff = end.getTime() - now.getTime();
  if (diff <= 0) return "Auction Ended";
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  return `${days}d ${hours}h left`;
};

export default function MarketplacePage() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [cards, setCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [hasMore, setHasMore] = useState(true);

  const searchParams = useSearchParams();
  const urlQuery = (searchParams.get('q') || "").toLowerCase().trim();

  const loadListings = async (category?: string, reset = false) => {
  setLoading(true);
  try {
    const listingsRef = collection(db, "listings");
    
    // 1. PULL EVERYTHING (Broad search to avoid Index errors)
    const q = query(listingsRef, limit(100)); 
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      if (reset) setCards([]);
      setHasMore(false);
    } else {
      const allData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as any[];

      // 2. SMART FILTER (Fixes the "Shadow" problem)
      // We check if category is "General" or undefined first
      const isGeneral = !category || category.toLowerCase() === 'general';
      
      const filteredData = isGeneral 
        ? allData 
        : allData.filter(item => 
            item.category?.toLowerCase() === category.toLowerCase()
          );

      // 3. SORT BY NEWEST (In JavaScript)
      filteredData.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));

      setCards(filteredData); // Using the filtered data directly for now
      setFilteredCards(filteredData);
      setHasMore(snapshot.docs.length === 100);
    }
  } catch (error: any) { 
    console.error("🔥 Firebase Error in loadListings:", error.message); 
  } finally {
    setLoading(false); // This MUST run to remove the shadows!
  }
};

      // 4. SORT BY NEWEST (In JS)
      filteredData.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));

      setCards((prev) => (reset ? filteredData : [...prev, ...filteredData]));
      setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
      setHasMore(snapshot.docs.length === 50);
    }
  } catch (error) { 
    console.error("Firebase Error in loadListings:", error); 
  } finally {
    setLoading(false);
  }
};
  // --- FILTER LOGIC ---
  const filteredCards = cards.filter((card) => {
    const matchesSearch = !urlQuery || (
      (card.title || "").toLowerCase().includes(urlQuery) || 
      (card.make || "").toLowerCase().includes(urlQuery) || 
      (card.model || "").toLowerCase().includes(urlQuery)
    );
    const matchesCategory = !activeCategory || (card.category || "").toLowerCase() === activeCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });
const handleQuickBid = async (itemId: string, currentBid: number) => {
  const itemRef = doc(db, "listings", itemId);

 try {
    // 1. DIRECT UPDATE (Works better for unauthenticated local sessions)
    await updateDoc(itemRef, {
      currentBid: (currentBid || 12500) + 100,
      bidCount: increment(1),
      lastBidAt: serverTimestamp()
    });

    // 2. FORCE UI UPDATE
    setCards(prev => prev.map(card => 
      card.id === itemId 
        ? { ...card, currentBid: (card.currentBid || 12500) + 100, bidCount: (card.bidCount || 0) + 1 } 
        : card
    ));

    console.log("🚀 $12,600! Penthouse bid confirmed via direct update.");
  } catch (e) {
    console.error("The ocean is calm, but the direct bid failed:", e);
  }
};

  
  return (
    <div style={{ padding: '24px', width: '100%' }}>
      <h1 style={{ marginBottom: '16px', fontWeight: 'bold', fontSize: '24px' }}>Marketplace</h1>
      <div style={{ position: 'relative', zIndex: 999, marginBottom: '24px' }}>
        <CategoryBar active={activeCategory} onSelect={setActiveCategory} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
  {loading && cards.length === 0 ? (
    Array(4).fill(0).map((_, i) => <MarketplaceCardSkeleton key={i} />)
  ) : (
    filteredCards.map((card) => (
      <MarketplaceCard 
        key={card.id} 
        {...card} 
        timeLeft={getTimeLeft(card.endTime)} 
        // THIS IS THE KEY:
        onBid={() => handleQuickBid(card.id, card.currentBid || card.price)} 
      />
    )) // Closes the .map
  )} 
</div>
    </div>
  );
}
