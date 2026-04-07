"use client";

import { useState, useEffect } from "react";
import MarketplaceCard from "./MarketplaceCard";
import MarketplaceCardSkeleton from "./MarketplaceCardSkeleton";
import { db } from "@/lib/firebase/client";
import CategoryBar from "@/components/marketplace/CategoryBar";
import { useSearchParams } from 'next/navigation';
import { ShieldCheck, PalmTree, MapPin, Anchor, ChevronRight } from "lucide-react";

import { 
  collection, getDocs, query, limit, doc, updateDoc, increment, serverTimestamp 
} from "firebase/firestore";

const getTimeLeft = (endTime: any) => {
  if (!endTime || !endTime.toDate) return "3d 12h left";
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
  const [isCaribbeanMode, setIsCaribbeanMode] = useState(false); // 🏝️ NEW STATE
  const [cards, setCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const searchParams = useSearchParams();
  const urlQuery = (searchParams.get('q') || "").toLowerCase().trim();

  const loadListings = async (category?: string) => {
    setLoading(true);
    try {
      const listingsRef = collection(db, "listings");
      const q = query(listingsRef, limit(100)); 
      const snapshot = await getDocs(q);
      const allData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as any[];

      const isGeneral = !category || category.toLowerCase() === 'general';
      const filteredData = isGeneral 
        ? allData 
        : allData.filter(item => item.category?.toLowerCase() === category.toLowerCase());

      setCards(filteredData);
    } catch (error: any) { 
      console.error("🔥 Query failed:", error.message); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadListings(activeCategory || undefined);
  }, [activeCategory]);

  const filteredCards = cards.filter((card) => {
    const matchesSearch = !urlQuery || (
      (card.title || "").toLowerCase().includes(urlQuery) || 
      (card.make || "").toLowerCase().includes(urlQuery) || 
      (card.model || "").toLowerCase().includes(urlQuery)
    );
    return matchesSearch;
  });

  const handleQuickBid = async (itemId: string, currentBid: number) => {
    const itemRef = doc(db, "listings", itemId);
    try {
      await updateDoc(itemRef, {
        currentBid: (currentBid || 12500) + 100,
        bidCount: increment(1),
        lastBidAt: serverTimestamp()
      });
      setCards(prev => prev.map(card => 
        card.id === itemId 
          ? { ...card, currentBid: (card.currentBid || 12500) + 100, bidCount: (card.bidCount || 0) + 1 } 
          : card
      ));
    } catch (e) { console.error("Bid failed:", e); }
  };

 return (
    <div style={{ padding: '40px', width: '100%', maxWidth: '1400px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      
      {/* 🚀 HEADER & SPECIAL DIVISION TOGGLE */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
        <div>
          <h1 style={{ margin: 0, fontWeight: '900', fontSize: '42px', letterSpacing: '-1.5px', italic: 'true' as any }}>
            Marketplace
          </h1>
          <p style={{ color: '#64748b', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '4px' }}>
            The Global Trade Protocol
          </p>
        </div>

        {/* 🏝️ THE "CARIBBEAN PORTFOLIO" FILTER */}
        <button 
          onClick={() => {
            setIsCaribbeanMode(!isCaribbeanMode);
            setActiveCategory(isCaribbeanMode ? null : 'Caribbean'); // Sets filter automatically
          }}
          style={{
            background: isCaribbeanMode ? '#0f172a' : 'linear-gradient(135deg, #0ea5e9 0%, #2dd4bf 100%)',
            color: '#fff',
            padding: '14px 28px',
            borderRadius: '20px',
            border: 'none',
            fontWeight: '900',
            fontSize: '11px',
            letterSpacing: '1px',
            cursor: 'pointer',
            boxShadow: isCaribbeanMode ? 'none' : '0 10px 20px -5px rgba(14, 165, 233, 0.5)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            transition: 'all 0.3s ease'
          }}
        >
          {isCaribbeanMode ? '← VIEW ALL GLOBAL TRADES' : 'CARIBBEAN PORTFOLIO 🏝️'}
        </button>
      </div>

      {/* 🏙️ FILTER BAR (Hidden in Caribbean mode to keep focus on the portfolio) */}
      {!isCaribbeanMode && (
        <div style={{ position: 'relative', zIndex: 999, marginBottom: '40px' }}>
          <CategoryBar active={activeCategory} onSelect={setActiveCategory} />
        </div>
      )}

      {/* 🏝️ CARIBBEAN DIVISION HEADER (Appears only when filtered) */}
      {isCaribbeanMode && (
        <div style={{ backgroundColor: '#f0f9ff', border: '1px solid #e0f2fe', padding: '32px', borderRadius: '24px', marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ maxWidth: '600px' }}>
            <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '900', color: '#0c4a6e' }}>The DR Sanctuary Collection</h2>
            <p style={{ margin: '8px 0 0', color: '#334155', fontSize: '13px', lineHeight: '1.5' }}>
              Hand-vetted high-ticket estates. Every listing in this portfolio includes optional **Florida-Based Concierge Facilitation** to manage your local acquisition complexity.
            </p>
          </div>
          <div style={{ textAlign: 'right', fontSize: '10px', fontWeight: '900', color: '#0ea5e9', textTransform: 'uppercase' }}>
            Florida Registered <br/> Ground Presence Active
          </div>
        </div>
      )}

      {/* 🧱 THE GRID (Used for both modes) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '32px' }}>
        {loading && cards.length === 0 ? (
          Array(4).fill(0).map((_, i) => <MarketplaceCardSkeleton key={i} />)
        ) : (
          filteredCards.map((card) => (
            <div key={card.id} style={{ position: 'relative' }}>
              <MarketplaceCard 
                {...card} 
                image={card.imageUrl || card.image || "https://via.placeholder.com/400x300"}
                timeLeft={card.endTime ? getTimeLeft(card.endTime) : "24h"} 
                onBid={() => handleQuickBid(card.id, card.currentBid || card.price)} 
              />
              {/* Specialized "Concierge Available" Badge for Caribbean items */}
              {isCaribbeanMode && (
                <div style={{ position: 'absolute', top: '15px', right: '15px', backgroundColor: 'rgba(15, 23, 42, 0.9)', color: '#fff', padding: '6px 10px', borderRadius: '8px', fontSize: '8px', fontWeight: '900', backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.1)' }}>
                  🛡️ CONCIERGE FACILITATION
                </div>
              )}
            </div>
          ))
        )} 
      </div>

      {/* 📩 THE "CATCH-ALL" FACILITATION TRIGGER */}
      {isCaribbeanMode && filteredCards.length > 0 && (
        <div style={{ marginTop: '80px', borderTop: '1px solid #e2e8f0', paddingTop: '40px', textAlign: 'center' }}>
          <p style={{ color: '#64748b', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', marginBottom: '16px' }}>Don't see exactly what you're looking for?</p>
          <button 
            onClick={() => { /* Logic to open the Leisure Intake Form Modal */ }}
            style={{ backgroundColor: '#fff', color: '#0f172a', border: '2px solid #0f172a', padding: '16px 32px', borderRadius: '16px', fontWeight: '900', cursor: 'pointer' }}
          >
            INITIATE CUSTOM FACILITATION CASE
          </button>
        </div>
      )}
    </div>
  );
}
