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
      const allData = snapshot.docs.map((doc) => ({ 
        id: doc.id, 
        ...doc.data() 
      })) as any[];

      const target = category?.toLowerCase() || 'all';

      const categoryMap: Record<string, string[]> = {
        art: ['paintings', 'prints', 'sculptures'],
        cars: ['sedan', 'coupe', 'suvs'],
        trucks: ['pickup', 'commercial'],
        rvs: ['class a'],
        pets: ['cats', 'dogs', 'birds', 'reptiles', 'exotics', 'other'],
        rentals: ['short term', 'long term'],
        homes: ['for sale', 'for rent', 'apartment', 'townhouse', 'single family', 'real estate'],
        land: ['residential', 'commercial'],
        motorcycles: ['sport', 'cruiser'],
        rooms: ['private rooms', 'shared rooms'],
        services: ['auto services', 'home services'],
        timeshare: ['rent', 'sale'],
        general: ['electronics', 'appliances', 'furniture', 'misc']
      };

      const filteredData = (target === 'all')
        ? allData 
        : allData.filter((item: any) => {
            const itemCat = (item.category || "").toLowerCase().trim();
            const itemSubCat = (item.subcategory || "").toLowerCase().trim();
            const itemTitle = (item.title || "").toLowerCase();

            // 1. Direct Match
            if (itemCat === target || itemSubCat === target) return true;

            // 2. Map Match
            const mappedSubs = categoryMap[target];
            if (mappedSubs && (mappedSubs.includes(itemCat) || mappedSubs.includes(itemSubCat))) {
              return true;
            }

            // 3. Caribbean Portfolio Override
            if (target === 'caribbean' || target === 'caribbean portfolio') {
              return (
                itemCat === 'caribbean' || 
                (item.location || "").toLowerCase() === 'caribbean' ||
                (item.propertyTier || "").toLowerCase() === 'caribbean' ||
                itemTitle.includes("dolio")
              );
            }
            return false;
          });

      setCards(filteredData);
    } catch (error: any) {
      console.error("🔥 Query failed:", error.message);
    } finally {
      setLoading(false);
    }
  };

// 2️⃣ THE UPGRADED FILTER
const filteredData = (!target || target === 'all')
  ? allData 
  : allData.filter((item: any) => {
      const itemCat = (item.category || "").toLowerCase().trim();
      const itemSubCat = (item.subcategory || "").toLowerCase().trim();
      const itemTitle = (item.title || "").toLowerCase();
      const currentTarget = target.toLowerCase();

      // 🎯 CHECK 1: Direct Match (Category or Subcategory)
      if (itemCat === currentTarget || itemSubCat === currentTarget) return true;

      // 🎯 CHECK 2: Mapping Match (The "Sovereign" Logic)
      const mappedSubs = categoryMap[currentTarget];
      if (mappedSubs && (mappedSubs.includes(itemCat) || mappedSubs.includes(itemSubCat))) {
        return true;
      }

      // 🎯 CHECK 3: Caribbean Portfolio Override
      if (currentTarget === 'caribbean' || currentTarget === 'caribbean portfolio') {
        return (
          itemCat === 'caribbean' || 
          (item.location || "").toLowerCase() === 'caribbean' ||
          (item.propertyTier || "").toLowerCase() === 'caribbean' ||
          itemTitle.includes("dolio")
        );
      }

      return false;
    });

     // 🏝️ THE BLUE TAB: CARIBBEAN PORTFOLIO
      if (target === 'caribbean' || target === 'caribbean portfolio') {
        return (
          itemCat === 'caribbean' || 
          item.isCaribbean === true || 
          (item.location || "").toLowerCase() === 'caribbean' || // 🎯 Matches our new payload
          (item.propertyTier || "").toLowerCase() === 'caribbean' || // 🎯 Matches our propertyTier
          itemTitle.includes("dolio")
        );
      }

      // 🐈 THE PETS BUTTON
      if (target === 'pets') {
        return itemCat === 'pets' || itemCat === 'animals' || itemCat === 'cat' || itemCat === 'dog';
      }

      // 🏠 THE HOMES / RENTALS / LAND BUTTONS
      if (target === 'homes') return itemCat === 'homes' || itemCat === 'villas' || itemCat === 'real estate';
      if (target === 'rentals') return itemCat === 'rentals' || itemCat === 'apartments';
      if (target === 'land') return itemCat === 'land' || itemCat === 'lots';

      // 🏎️ THE MOBILITY BUTTONS
      if (target === 'cars') return itemCat === 'cars' || itemCat === 'vehicles';
      if (target === 'trucks') return itemCat === 'trucks';
      if (target === 'motorcycles') return itemCat === 'motorcycles';

      // 🎨 THE GENERAL / ART / SERVICES BUTTONS
      if (target === 'general') return itemCat === 'general';
      if (target === 'art') return itemCat === 'art';
      if (target === 'services') return itemCat === 'services';


      setCards(filteredData);
    } catch (error: any) { 
      console.error("🔥 Query failed:", error.message); 
    } finally {
      setLoading(false);
    }
  }; // 👈 Ensure this closing brace exists!
     

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
    position: 'relative', 
    zIndex: 10,
    /* 🎯 THE BLUE OVERRIDE: 
       We change the 'false' state from Teal to our Caribbean Blue Gradient 
    */
    background: isCaribbeanMode 
      ? '#0f172a' // Dark Slate when active (View All)
      : 'linear-gradient(135deg, #0891b2 0%, #0e7490 100%)', // 🔵 CARIBBEAN BLUE
    
    color: '#fff',
    padding: '16px 32px',
    borderRadius: '24px',
    border: 'none',
    fontWeight: '900',
    fontSize: '11px',
    letterSpacing: '1.5px',
    cursor: 'pointer',
    
    /* 🎯 THE BLUE GLOW: Matches the new color */
    boxShadow: isCaribbeanMode 
      ? 'none' 
      : '0 10px 25px -5px rgba(8, 145, 178, 0.4)',
      
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
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
            The Caribbean Sanctuary Collection
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
