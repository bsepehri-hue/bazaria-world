"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { db } from "@/lib/firebase/client";
import { collection, getDocs } from "firebase/firestore";
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, Sun, Globe, ArrowUpDown, User } from "lucide-react"; 
import CategoryBar from "@/components/marketplace/CategoryBar";
import MarketplaceCardSkeleton from "./MarketplaceCardSkeleton";
import MarketplaceCard from "./MarketplaceCard"; 
import { isListingInRegistry } from "@/lib/marketTaxonomy";

// 1. Import the original hook module safely
import { useAuth as originalUseAuth } from "@/app/providers/AuthProvider";

// 2. Create a local pass-through hook to prevent Webpack cache artifacts
function useAuth() {
  try {
    return originalUseAuth();
  } catch (e) {
    return { user: { email: "Guest Mode" }, loading: false };
  }
}

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

// 🛡️ 1. THE SOVEREIGN SHIELD (Default export)
export default function MarketplacePage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', backgroundColor: '#fcfdfe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.4em', color: '#94a3b8' }}>
          Syncing Global Trade Protocol...
        </p>
      </div>
    }>
      <MarketplacePageCore />
    </Suspense>
  );
}

// ⚙️ 2. THE STABILIZED SYSTEM DATA LAYER
function MarketplacePageCore() {
  const { user } = useAuth(); 
  const searchParams = useSearchParams();
  const router = useRouter();

  // 🎯 SINGLE SOURCE OF TRUTH: Bind selection parameters natively to the true active URL state
  const activeCategoryToken = searchParams.get("category") || "all";
  
  // Isolate Caribbean layout toggles straight from the master parameter state
  const isCaribbeanMode = activeCategoryToken.toLowerCase().trim() === "caribbean";

  const [cards, setCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  
  // 🟢 MULTI-CURRENCY SORTING CONTROLLER STATE
  const [sortBy, setSortBy] = useState<"newest" | "priceLow" | "priceHigh">("newest");
  
  // 🛡️ Redirect unauthorized users directly to the custom login view instead of opening a modal
  const handleAuthAction = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    router.push('/login');
  };

  const loadListings = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "listings"));
      
      const allData = querySnapshot.docs.map(doc => {
        const data = doc.data();


     
        
        const resolvedPrice = Number(data.buyNowPrice) || 
                              Number(data.buyPrice) || 
                              Number(data.currentBid) || 
                              Number(data.startingBid) || 
                              Number(data.reservePrice) || 
                              Number(data.price) || 0;

   const derivedCode = data.product_code || data.xid || doc.id.substring(0, 5).toUpperCase();

        // 🚨 PRE-CALCULATE THE EXACT TIME: Lock onto the confirmed createdAt field
        let exactTimeMs = Date.now();
        const rawDate = data.createdAt; 

        if (rawDate) {
          if (typeof rawDate.toDate === 'function') exactTimeMs = rawDate.toDate().getTime();
          else if (rawDate.seconds) exactTimeMs = rawDate.seconds * 1000;
          else exactTimeMs = new Date(rawDate).getTime() || Date.now();
        }

        return {
          id: doc.id,
          ...data,
          product_code: derivedCode, 
          price: resolvedPrice,
          exactTimeMs: exactTimeMs 
        };
      });
      
      setCards(allData);
    } catch (error: any) { 
      console.error("Fetch failed:", error.message); 
    }
    setLoading(false);
  };

  useEffect(() => { 
    loadListings(); 
  }, []);    

 // 🛠️ Dynamic Sort & Global Override Pipeline
  const filteredCards = useMemo(() => {
    if (!cards || cards.length === 0) return [];
    
    const currentRawQuery = (searchParams.get('q') || "").toLowerCase().trim();
    let marketQuery = currentRawQuery;
    if (marketQuery.startsWith("xid-")) {
      marketQuery = marketQuery.substring(4);
    }
    const hasActiveSearch = marketQuery.replace(/[^a-z0-9]/g, "") !== "";

    const baseList = cards.filter((card) => {
      // Read clean category context tokens from search parameters
      const activeLower = activeCategoryToken.toLowerCase().trim();
      const cleanActive = decodeURIComponent(activeLower);

      // ✅ FIXED: Let the subcategory token pass through to the taxonomy file intact
let normalizedTab = cleanActive;
if (cleanActive === "truck" || cleanActive === "trucks") normalizedTab = "trucks";
if (cleanActive === "rv" || cleanActive === "rvs") normalizedTab = "rvs";
if (cleanActive === "motorcycle" || cleanActive === "motorcycles") normalizedTab = "motorcycles";
if (cleanActive === "home" || cleanActive === "homes") normalizedTab = "homes";
if (cleanActive === "service" || cleanActive === "services") normalizedTab = "services";
if (cleanActive === "suv" || cleanActive === "suvs") normalizedTab = "suvs";

      // 🛡️ PRIORITY OVERRIDE: If the concierge targets a specific unique asset ID, bypass category constraints entirely
      if (hasActiveSearch) {
        const docId = String(card?.id || "").toLowerCase();
        const xidToken = String(card?.xid || "").toLowerCase();
        const productCode = String(card?.product_code || "").toLowerCase();
        
        if (docId === marketQuery || xidToken === marketQuery || productCode === marketQuery) {
          return true; // Instant match across global registries
        }
      }

      // 🛡️ STEP 1: MECHANICAL CATEGORY ISOLATION (Only applies if no global ID token matched)
      const matchesCategory = isListingInRegistry(card, normalizedTab);
      if (!matchesCategory) return false;

      // 🔍 STEP 2: STANDARD FIELD ATTRIBUTE QUERY FILTERING
      if (hasActiveSearch) {
        const title = String(card?.title || "").toLowerCase();
        const dbCat = String(card?.category || "").toLowerCase().trim();
        const dbSub = String(card?.subCategory || card?.subcategory || "").toLowerCase().trim();
        const make = String(card?.make || "").toLowerCase();
        const model = String(card?.model || "").toLowerCase();

        // Strict whole-word matching inside the active category to prevent "art" from catching "heart"
        const regex = new RegExp(`\\b${marketQuery}\\b`, 'i');
        return regex.test(title) || regex.test(dbCat) || regex.test(dbSub) || regex.test(make) || regex.test(model);
      }

      // Keep item if it matches the selected category and there's no active query search
      return true;
    });

    // Sort the matched elements cleanly
    return [...baseList].sort((a, b) => {
      if (sortBy === "priceLow") return a.price - b.price;
      if (sortBy === "priceHigh") return b.price - a.price;
      
      const priceA = typeof a.price === 'number' ? a.price : Number(a.price) || 0;
      const priceB = typeof b.price === 'number' ? b.price : Number(b.price) || 0;
      
      const dateA = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : Number(a.createdAt) || 0;
      const dateB = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : Number(b.createdAt) || 0;
      return dateB - dateA; 
    });

  }, [cards, activeCategoryToken, searchParams, sortBy]);
  
  // 🛰️ INTERLOCK INTERCEPTOR HOOK: Broadcast active listing query metrics straight to global memory channels
  useEffect(() => {
    if (typeof window !== "undefined" && filteredCards && filteredCards.length > 0) {
      const focusedAsset = filteredCards[0];
      if (focusedAsset) {
        (window as any).__ACTIVE_VIEWPORT_XID__ = focusedAsset.product_code || focusedAsset.id || "";
        (window as any).__ACTIVE_VIEWPORT_OBJ__ = focusedAsset || null;
      }
    }
  }, [filteredCards]);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fcfdfe', fontFamily: 'sans-serif', color: '#0f172a' }}>
      <header style={{ padding: '40px 5vw 40px', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#fff', padding: '8px 16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '10px', fontWeight: 900, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                {user.email?.split('@')[0]}
              </span>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <User size={16} color="#0f172a" />
              </div>
            </div>
          ) : (
            <button 
              onClick={handleAuthAction}
              style={{ 
                background: 'none', 
                border: 'none', 
                fontSize: '10px', 
                fontWeight: 900, 
                color: '#94a3b8', 
                textTransform: 'uppercase', 
                letterSpacing: '0.2em', 
                cursor: 'pointer', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px' 
              }}
              onMouseOver={(e) => { e.currentTarget.style.color = '#05292E'; }}
              onMouseOut={(e) => { e.currentTarget.style.color = '#94a3b8'; }}
            >
              <User size={14} /> Account Login
            </button>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '32px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
               {isCaribbeanMode ? <Sun size={18} style={{ color: '#ffbf00' }} /> : <Globe size={18} style={{ color: '#14b8a6' }} />}
               <p style={{ fontSize: '10px', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.4em', margin: 0 }}>
                 {isCaribbeanMode ? 'Sovereign Collection' : 'The Global Trade Protocol'}
               </p>
            </div>
            <h1 style={{ fontSize: 'clamp(40px, 5vw, 64px)', fontWeight: 1000, textTransform: 'uppercase', letterSpacing: '-0.04em', lineHeight: '1', margin: 0 }}>
              Market <span style={{ color: isCaribbeanMode ? '#0891b2' : '#cbd5e1' }}>Registry</span>
            </h1>
          </div>

<button 
  onClick={() => router.push('/market?category=digital', { scroll: false })}
  style={{ 
    height: '64px', 
    padding: '0 32px', 
    borderRadius: '32px', // The classic "pill" shape
    backgroundColor: '#0f172a', // Matches your registry's existing deep navy
    color: '#ffffff', // Clean white text
    fontWeight: 700, 
    fontSize: '11px', 
    textTransform: 'uppercase', 
    letterSpacing: '0.15em', 
    cursor: 'pointer', 
    transition: '0.3s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: 'none',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
  }}
  onMouseOver={(e) => { 
    e.currentTarget.style.backgroundColor = '#1e293b'; // Lighter navy on hover
    e.currentTarget.style.transform = 'translateY(-2px)';
  }}
  onMouseOut={(e) => { 
    e.currentTarget.style.backgroundColor = '#0f172a';
    e.currentTarget.style.transform = 'translateY(0)';
  }}
>
  Digital Marketplace
</button>
        </div>
      </header>

      <div style={{ maxWidth: '1400px', margin: '0 auto 60px', padding: '0 5vw' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

        {/* Always show CategoryBar, but let the component handle its own 
              active state based on the current URL category */}
          <CategoryBar 
            active={activeCategoryToken} 
            onSelect={(selectedTab) => {
              const params = new URLSearchParams(window.location.search);
              
              // 🧹 CLEAN PARAMS LEAK
              params.delete('q');

              if (selectedTab && selectedTab !== "all") {
                params.set('category', selectedTab);
              } else {
                params.delete('category');
              }
              router.push(`/market?${params.toString()}`, { scroll: false });
            }} 
          />
          
          
          {/* 🛠️ SEARCH & UTILITY CONTROLS */}
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap', width: '100%' }}>
            
            <div style={{ position: 'relative', flex: '1', minWidth: '280px', maxWidth: '400px' }}>
              <Search size={16} style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: '#cbd5e1' }} />
              <input 
                placeholder="SEARCH REGISTRY PROTOCOL..." 
                value={searchParams.get('q') || ""} 
                onChange={(e) => {
                  const term = e.target.value;
                  const params = new URLSearchParams(window.location.search);
                  if (term) {
                    params.set('q', term);
                  } else {
                    params.delete('q');
                  }
                  router.push(`/market?${params.toString()}`, { scroll: false });
                }}
                style={{ height: '56px', width: '100%', backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', paddingLeft: '52px', fontSize: '11px', fontWeight: 900, outline: 'none' }} 
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', height: '56px', backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '0 20px' }}>
              <ArrowUpDown size={14} style={{ color: '#94a3b8' }} />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                style={{
                  border: 'none',
                  backgroundColor: 'transparent',
                  color: '#0f172a',
                  fontSize: '11px',
                  fontWeight: 900,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  outline: 'none',
                  cursor: 'pointer',
                  fontFamily: 'sans-serif'
                }}
              >
                <option value="newest">Fresh Lists (Newest)</option>
                <option value="priceLow">Value: Low to High</option>
                <option value="priceHigh">Value: High to Low</option>
              </select>
            </div>

          </div>
        </div>
      </div>

      <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 32px 100px', width: '100%', boxSizing: 'border-box' }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
          gap: '24px',
          width: '100%',
          justifyContent: 'center'
        }}>
          {loading ? (
            Array(4).fill(0).map((_, i) => <MarketplaceCardSkeleton key={i} />)
          ) : (
            filteredCards.map((card) => {
              return (
                <div key={card.id} style={{ display: 'flex', flexDirection: 'column' }}>
               <MarketplaceCard 
                    {...card} 
                    listing={card} 
                    id={card.id}
                    exactTimeMs={card.exactTimeMs}
                    stewardID={card.stewardID || card.userId || card.merchantId || card.sellerId}
                    merchantId={card.merchantId || card.stewardID || card.userId}
                    image={card.imageUrl || card.image || "https://via.placeholder.com/400x300"}
                    // We removed the old 'timeLeft' override and explicitly pass the raw dates 
                    // so the bulletproof timer inside MarketplaceCard can run perfectly.
                    endTime={card.endTime || card.endsAt || null}
                    createdAt={card.createdAt || card.timestamp || null}
                    category={card.category || card.type || "general"}
                    onClick={() => {
                      if (typeof window !== "undefined") {
                        (window as any).__ACTIVE_VIEWPORT_XID__ = card.product_code || "";
                        (window as any).__ACTIVE_VIEWPORT_OBJ__ = card || null;
                      }
                    }}
                    onBid={() => {
                      if (!user) {
                        setIsLoginOpen(true);
                      } else {
                        router.push(`/market/asset/${card.id}`);
                      }
                    }} 
                  />
                </div>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
}
