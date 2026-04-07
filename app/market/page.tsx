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

        {/* 🏝️ THE "CARIBBEAN POP" BUTTON */}
        <button 
          onClick={() => setIsCaribbeanMode(!isCaribbeanMode)}
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
          {isCaribbeanMode ? '← BACK TO MARKET' : 'CARIBBEAN PORTFOLIO 🏝️'}
        </button>
      </div>

      {!isCaribbeanMode ? (
        <>
          {/* 🏙️ STANDARD MARKETPLACE VIEW */}
          <div style={{ position: 'relative', zIndex: 999, marginBottom: '40px' }}>
            <CategoryBar active={activeCategory} onSelect={setActiveCategory} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '32px' }}>
            {loading && cards.length === 0 ? (
              Array(4).fill(0).map((_, i) => <MarketplaceCardSkeleton key={i} />)
            ) : (
              filteredCards.map((card) => (
                <MarketplaceCard 
                  key={card.id} 
                  {...card} 
                  image={card.imageUrl || card.image || "https://via.placeholder.com/400x300"}
                  timeLeft={card.endTime ? getTimeLeft(card.endTime) : "24h"} 
                  onBid={() => handleQuickBid(card.id, card.currentBid || card.price)} 
                />
              ))
            )} 
          </div>
        </>
      ) : (
        /* 🏝️ THE SOVEREIGN CARIBBEAN PORTFOLIO (LEISURE INTAKE) */
        <div style={{ maxWidth: '900px', margin: '0 auto', animation: 'fadeIn 0.5s ease' }}>
          
          {/* BO'S CHIEF BRIEFING */}
          <div style={{ backgroundColor: '#fff', padding: '40px', borderRadius: '32px', border: '1px solid #e2e8f0', marginBottom: '32px', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px' }}>
               <div style={{ width: '60px', height: '60px', backgroundColor: '#f1f5f9', borderRadius: '20px', display: 'flex', alignItems: 'center', justifySelf: 'center', fontSize: '24px' }}>🛡️</div>
               <div>
                 <h3 style={{ margin: 0, fontWeight: '900', fontSize: '20px' }}>The Florida-Caribbean Bridge</h3>
                 <p style={{ margin: 0, color: '#0d9488', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase' }}>Chief Facilitator: Bo Sepehri</p>
               </div>
            </div>
            <p style={{ fontSize: '16px', lineHeight: '1.7', color: '#334155', italic: 'true' as any }}>
              "I am currently on the ground in the Dominican Republic vetting properties personally. We handle the complexity of local regulations, title checks, and luxury concierge services from our Florida headquarters. Your only job is to find your sanctuary."
            </p>
          </div>

          {/* LEISURE INTAKE FORM */}
          <div style={{ backgroundColor: '#fff', padding: '48px', borderRadius: '40px', border: '2px solid #e0f2fe', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.05)' }}>
            <h2 style={{ fontSize: '28px', fontWeight: '900', marginBottom: '8px' }}>Define Your Sanctuary</h2>
            <p style={{ color: '#64748b', marginBottom: '32px', fontSize: '14px' }}>Tell us what safety and comfort mean to you. We'll handle the rest.</p>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
              <div>
                <label style={{ fontSize: '9px', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' }}>Preferred Vibe</label>
                <select style={{ width: '100%', padding: '16px', borderRadius: '16px', border: '1px solid #e2e8f0', marginTop: '8px', fontSize: '14px', appearance: 'none' }}>
                  <option>Beachfront Privacy</option>
                  <option>Elite Golf Community</option>
                  <option>Secluded Jungle Hideaway</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '9px', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' }}>Security Needs</label>
                <select style={{ width: '100%', padding: '16px', borderRadius: '16px', border: '1px solid #e2e8f0', marginTop: '8px', fontSize: '14px', appearance: 'none' }}>
                  <option>24/7 Gated Community</option>
                  <option>Private Security Detail</option>
                  <option>Standard Residential</option>
                </select>
              </div>
            </div>

            <label style={{ fontSize: '9px', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' }}>Your Vision of Leisure & Comfort</label>
            <textarea 
              placeholder="e.g. 'I need a chef's kitchen, high-speed fiber for work, and to be within 20 mins of a private airport...'"
              style={{ width: '100%', padding: '20px', borderRadius: '20px', border: '1px solid #e2e8f0', minHeight: '150px', marginTop: '8px', marginBottom: '32px', fontSize: '15px', fontFamily: 'inherit' }}
            />

            <button style={{ width: '100%', backgroundColor: '#0f172a', color: '#fff', padding: '20px', borderRadius: '20px', fontWeight: '900', fontSize: '13px', letterSpacing: '1px', border: 'none', cursor: 'pointer' }}>
              REQUEST PRIVATE FACILITATION →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
