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
    const target = category?.toLowerCase().trim() || 'all';

    try {
      const listingsRef = collection(db, "listings");
      const q = query(listingsRef, limit(100)); 
      const snapshot = await getDocs(q);
      const allData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as any[];

      // 1️⃣ THE MASTER MAP
      const categoryMap: Record<string, string[]> = {
        homes: ['for sale', 'for rent', 'apartment', 'townhouse', 'single family', 'real estate', 'villas', 'residential'],
        land: ['commercial land', 'residential land', 'lots', 'acreage'],
        art: ['paintings', 'prints', 'sculptures'],
        cars: ['sedan', 'coupe', 'suvs', 'vehicles'],
        trucks: ['pickup', 'commercial'],
        rvs: ['class a'],
        pets: ['cats', 'dogs', 'birds', 'reptiles', 'exotics', 'other', 'animals'],
        rentals: ['short term', 'long term', 'apartments'],
        homes: ['for sale', 'for rent', 'apartment', 'townhouse', 'single family', 'real estate', 'villas'],
        land: ['residential', 'commercial', 'lots'],
        motorcycles: ['sport', 'cruiser'],
        rooms: ['private rooms', 'shared rooms'],
        services: ['auto services', 'home services'],
        timeshare: ['rent', 'sale'],
        general: ['electronics', 'appliances', 'furniture', 'misc']
      };

      // 2️⃣ Update the filter logic inside loadListings
const filteredData = (target === 'all')
  ? allData 
  : allData.filter((item: any) => {
      const itemCat = (item.category || "").toLowerCase().trim();
      const itemSub = (item.subcategory || "").toLowerCase().trim();
      const itemTitle = (item.title || "").toLowerCase();

      if (target === 'homes') {
        // If it's explicitly real estate OR the title suggests a building
        const isHomeCategory = ['homes', 'real estate', 'villas', 'residential'].includes(itemCat) || 
                               ['apartment', 'townhouse', 'single family'].includes(itemSub);
        
        const hasHomeKeywords = itemTitle.includes("home") || 
                                itemTitle.includes("villa") || 
                                itemTitle.includes("house");

        // 🎯 If it has a house keyword, it's a HOME, even if categorized as land
        return isHomeCategory || hasHomeKeywords;
      }

      if (target === 'land') {
        // Only show Land if it DOESN'T have home keywords (to keep it clean)
        const isLandCategory = itemCat === 'land' || itemSub === 'land' || itemSub === 'lots';
        const isNotActuallyAHome = !itemTitle.includes("villa") && !itemTitle.includes("house");
        
        return isLandCategory && isNotActuallyAHome;
      }

      // Default logic for Art, Cars, etc.
      const mappedSubs = categoryMap[target];
      return itemCat === target || itemSub === target || (mappedSubs && mappedSubs.includes(itemCat));
    });

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
      <div className="fixed top-[-10%] right-[-10%] w-[500px] h-[500px] bg-teal-500/10 blur-[120px] rounded-full z-0" />
      <div className="fixed bottom-[10%] left-[-5%] w-[400px] h-[400px] bg-blue-500/5 blur-[100px] rounded-full z-0" />

      {/* 🚀 HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px' }}>
        <div>
          <h1 style={{ margin: 0, fontWeight: '900', fontSize: '48px', letterSpacing: '-2px', color: '#0f172a' }}>
            Marketplace
          </h1>
          <p style={{ color: '#64748b', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '2px', marginTop: '4px' }}>
            The Global Trade Protocol
          </p>
        </div>

        <div style={{ position: 'relative' }}>
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
              setActiveCategory(isCaribbeanMode ? null : 'caribbean');
            }}
            style={{
              position: 'relative', zIndex: 10,
              background: isCaribbeanMode ? '#0f172a' : 'linear-gradient(135deg, #0891b2 0%, #0e7490 100%)',
              color: '#fff', padding: '16px 32px', borderRadius: '24px', border: 'none',
              fontWeight: '900', fontSize: '11px', letterSpacing: '1.5px', cursor: 'pointer',
              boxShadow: isCaribbeanMode ? 'none' : '0 10px 25px -5px rgba(8, 145, 178, 0.4)',
              display: 'flex', alignItems: 'center', gap: '12px', transition: 'all 0.4s ease'
            }}
          >
            {isCaribbeanMode ? '← VIEW ALL GLOBAL TRADES' : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                CARIBBEAN PORTFOLIO <Sun size={18} style={{ color: '#ffbf00' }} />
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

      {/* 🏝️ HERO HEADER */}
      {isCaribbeanMode && (
        <div style={{ 
          background: 'linear-gradient(135deg, #014d4e 0%, #0891b2 100%)', 
          padding: '48px', borderRadius: '32px', marginBottom: '48px', 
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          boxShadow: '0 20px 40px -10px rgba(1, 77, 78, 0.3)', position: 'relative', overflow: 'hidden'
        }}>
          <div style={{ maxWidth: '700px', position: 'relative', zIndex: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <Sun size={20} style={{ color: '#ffbf00' }} />
              <span style={{ color: '#ffbf00', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.3em' }}>
                Sovereign Collection
              </span>
            </div>
            <h2 style={{ margin: 0, fontSize: '32px', fontWeight: '900', color: '#ffffff', textTransform: 'uppercase' }}>
              The Caribbean Sanctuary Collection
            </h2>
            <p style={{ margin: '16px 0 0', color: 'rgba(255,255,255,0.8)', fontSize: '14px', lineHeight: '1.6', fontWeight: '500' }}>
              Hand-vetted high-ticket estates. Every listing includes optional <span style={{ color: '#ffbf00', fontWeight: '900' }}>Florida-Based Concierge Facilitation</span>.
            </p>
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
            </div>
          ))
        )} 
      </div>
    </div>
  );
}
