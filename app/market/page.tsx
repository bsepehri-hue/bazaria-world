"use client";

import { useState, useEffect } from "react";
import MarketplaceCard from "./MarketplaceCard";
import MarketplaceCardSkeleton from "./MarketplaceCardSkeleton";
import { db } from "@/lib/firebase/client";
import CategoryBar from "@/components/marketplace/CategoryBar";
import { useSearchParams } from 'next/navigation';
import { ShieldCheck, PalmTree, MapPin, Anchor, ChevronRight } from "lucide-react";
import { Sun, ArrowRight, ArrowLeft } from "lucide-react";
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
  <div style={{ padding: '40px', width: '100%', maxWidth: '1400px', margin: '0 auto', fontFamily: 'sans-serif', backgroundColor: '#f8f8f5', minHeight: '100vh' }}>
    
    {/* 🚀 HEADER & THE NEW CARIBBEAN SUN TOGGLE */}
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px' }}>
      <div>
        <h1 style={{ margin: 0, fontWeight: '900', fontSize: '48px', letterSpacing: '-2px', color: '#0f172a' }}>
          Marketplace
        </h1>
        <p style={{ color: '#64748b', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '2px', marginTop: '4px' }}>
          The Global Trade Protocol
        </p>
      </div>

      {/* 🏝️ THE UPDATED SUN TOGGLE BUTTON */}
      <div style={{ position: 'relative' }}>
        {/* The Amber "Hump" Glow (Only shows when not in Caribbean mode) */}
        {!isCaribbeanMode && (
          <div style={{
            position: 'absolute', top: '-20px', left: '50%', transform: 'translateX(-50%)',
            width: '100px', height: '50px', background: 'radial-gradient(circle, rgba(255,191,0,0.3) 0%, rgba(255,191,0,0) 70%)',
            borderRadius: '100px 100px 0 0', zIndex: 1
          }} />
        )}

       <button 
  onClick={() => {
    setIsCaribbeanMode(!isCaribbeanMode);
    setActiveCategory(isCaribbeanMode ? null : 'Caribbean');
  }}
  style={{
    /* ... all your existing styles ... */
  }}
>
  {isCaribbeanMode ? (
    '← VIEW ALL GLOBAL TRADES'
  ) : (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      CARIBBEAN PORTFOLIO 
      <Sun size={18} style={{ color: '#ffbf00' }} />
    </div>
  )}
</button>
      </div>
    </div>

    {/* 🏙️ FILTER BAR */}
    {!isCaribbeanMode && (
      <div style={{ position: 'relative', zIndex: 999, marginBottom: '40px' }}>
        <CategoryBar active={activeCategory} onSelect={setActiveCategory} />
      </div>
    )}

    {/* 🏝️ THE NEW "SANCTUARY" HERO HEADER (Deep Blue & Amber) */}
    {isCaribbeanMode && (
      <div style={{ 
        background: 'linear-gradient(135deg, #014d4e 0%, #0891b2 100%)', 
        padding: '48px', 
        borderRadius: '32px', 
        marginBottom: '48px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        boxShadow: '0 20px 40px -10px rgba(1, 77, 78, 0.3)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Subtle Sun Watermark in Background */}
        <Sun size={200} style={{ position: 'absolute', right: '-40px', top: '-40px', color: 'rgba(255,191,0,0.05)' }} />

        <div style={{ maxWidth: '700px', position: 'relative', zIndex: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <Sun size={20} style={{ color: '#ffbf00' }} />
            <span style={{ color: '#ffbf00', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.3em' }}>
              Sovereign Collection
            </span>
          </div>
          <h2 style={{ margin: 0, fontSize: '32px', fontWeight: '900', color: '#ffffff', textTransform: 'uppercase' }}>
            The DR Sanctuary Collection
          </h2>
          <p style={{ margin: '16px 0 0', color: 'rgba(255,255,255,0.8)', fontSize: '14px', lineHeight: '1.6', fontWeight: '500' }}>
            Hand-vetted high-ticket estates. Every listing includes optional <span style={{ color: '#ffbf00', fontWeight: '900' }}>Florida-Based Concierge Facilitation</span> to manage your local acquisition complexity.
          </p>
        </div>
        
        <div style={{ textAlign: 'right', position: 'relative', zIndex: 10 }}>
          <div style={{ fontSize: '11px', fontWeight: '900', color: '#ffbf00', textTransform: 'uppercase', letterSpacing: '0.1em', lineHeight: '1.8' }}>
            Florida Registered <br/> 
            <span style={{ color: '#ffffff' }}>Ground Presence Active</span>
          </div>
        </div>
      </div>
    )}

    {/* 🧱 THE GRID */}
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '40px' }}>
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
            {isCaribbeanMode && (
              <div style={{ 
                position: 'absolute', top: '20px', right: '20px', 
                backgroundColor: '#ffbf00', color: '#0f172a', 
                padding: '8px 12px', borderRadius: '10px', 
                fontSize: '9px', fontWeight: '900', 
                boxShadow: '0 4px 12px rgba(255,191,0,0.3)',
                border: '1px solid rgba(255,255,255,0.2)' 
              }}>
                🛡️ CONCIERGE FACILITATION
              </div>
            )}
          </div>
        ))
      )} 
    </div>

    {/* 📩 FOOTER ACTION */}
    {isCaribbeanMode && filteredCards.length > 0 && (
      <div style={{ marginTop: '100px', textAlign: 'center' }}>
         <button 
          onClick={() => router.push('/market/create/properties/caribbean')}
          style={{ 
            backgroundColor: '#014d4e', color: '#fff', 
            padding: '20px 40px', borderRadius: '20px', 
            fontWeight: '900', fontSize: '12px', letterSpacing: '0.1em',
            border: 'none', cursor: 'pointer', boxShadow: '0 15px 30px -10px rgba(1, 77, 78, 0.4)'
          }}
        >
          INITIATE CUSTOM FACILITATION CASE
        </button>
      </div>
    )}
  </div>
);
}
