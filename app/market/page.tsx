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
  doc, 
  runTransaction, 
  increment 
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import CategoryBar from "@/components/marketplace/CategoryBar";
import { useSearchParams } from 'next/navigation';

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
    const currentLastDoc = reset ? null : lastDoc;
    const queryConstraints: any[] = [collection(db, "listings"), limit(12)];

    if (category) queryConstraints.push(where("category", "==", category.toLowerCase()));
    if (currentLastDoc) queryConstraints.push(startAfter(currentLastDoc));

    try {
      const snapshot = await getDocs(query(...queryConstraints));
      if (snapshot.empty) {
        if (reset) setCards([]);
        setHasMore(false);
      } else {
        const newData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setCards((prev) => (reset ? newData : [...prev, ...newData]));
        setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
        setHasMore(snapshot.docs.length === 12);
      }
    } catch (error) { console.error("Firebase Error:", error); }
    setLoading(false);
  };

  useEffect(() => {
    loadListings(activeCategory || undefined, true);
  }, [activeCategory]);

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
const handleQuickBid = async (itemId: string) => {
  const itemRef = doc(db, "listings", itemId);

  try {
    await runTransaction(db, async (transaction) => {
      // 1. YOU MUST READ FIRST
      const itemDoc = await transaction.get(itemRef);
      if (!itemDoc.exists()) throw "Document missing!";

      const data = itemDoc.data();
      // 2. CALCULATE
      const currentAmount = data.currentBid || data.price || 0;
      const newBid = currentAmount + 100;
      const newCount = (data.bidCount || 0) + 1;

      // 3. WRITE LAST
      transaction.update(itemRef, {
        currentBid: newBid,
        bidCount: newCount,
        lastBidAt: new Date()
      });
    });

    // Update local UI state
    setCards(prev => prev.map(card => 
      card.id === itemId 
        ? { ...card, currentBid: (card.currentBid || card.price) + 100, bidCount: (card.bidCount || 0) + 1 } 
        : card
    ));

    console.log("🚀 Penthouse Bid Success!");
  } catch (e) {
    console.error("Bid failed:", e);
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
