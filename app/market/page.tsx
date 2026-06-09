"use client";

import React, { useState, useEffect, useMemo, Suspense, useContext, createContext } from "react";
import { db } from "@/lib/firebase/client";
import { collection, getDocs } from "firebase/firestore";
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, Sun, Globe, ArrowUpDown } from "lucide-react"; 
import CategoryBar from "@/components/marketplace/CategoryBar";
import MarketplaceCardSkeleton from "./MarketplaceCardSkeleton";
import MarketplaceCard from "./MarketplaceCard"; 
import { User } from "lucide-react"; 
import { ItemCard } from "@/components/market/ItemCard";
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

// ⚙️ 2. YOUR ORIGINAL LOGIC + EXTENDED SORT ENGINE
function MarketplacePageCore() {
  const { user } = useAuth(); 
  const searchParams = useSearchParams();
  const router = useRouter();

  // 🎯 SINGLE SOURCE OF TRUTH: Force the active token string to look natively at the real address bar variable
  const activeCategoryToken = searchParams.get("category") || "all";

  // Keep your local states cleanly matched up right below it
  const [activeCategory, setActiveCategory] = useState<string | null>(activeCategoryToken);
  const [isCaribbeanMode, setIsCaribbeanMode] = useState(false);
  const [cards, setCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [isLoginOpen, setIsLoginOpen] = useState(false);
  
  // 🟢 1. MULTI-CURRENCY SORTING CONTROLLER STATE
  const [sortBy, setSortBy] = useState<"newest" | "priceLow" | "priceHigh">("newest");
  
  // 🛡️ Redirect unauthorized users directly to the custom login view instead of opening a modal
  const handleAuthAction = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    router.push('/login');
  };

  // 📡 🔗 GO控制中心 INTERLOCK LINK: Synchronizes incoming GoDaddy URLs with application states
  useEffect(() => {
    const URLCategory = searchParams.get("category");
    if (URLCategory) {
      const cleanUrlCat = URLCategory.toLowerCase().trim();
      if (cleanUrlCat === "caribbean") {
        setIsCaribbeanMode(true);
        setActiveCategory("caribbean");
      } else if (cleanUrlCat === "property" || cleanUrlCat === "homes") {
        setIsCaribbeanMode(false);
        setActiveCategory("homes"); 
      } else {
        setIsCaribbeanMode(false);
        setActiveCategory(cleanUrlCat);
      }
    }
  }, [searchParams]);

  const loadListings = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "listings"));
      
      const allData = querySnapshot.docs.map(doc => {
        const data = doc.data();
        
        const resolvedPrice = Number(data.buyNowPrice) || 
                              Number(data.buyPrice) || 
                              Number(data.currentBid) || 
                              Number(data.currentBid) || 
                              Number(data.startingBid) || 
                              Number(data.reservePrice) || 
                              Number(data.price) || 0;

        // 🎯 THE DIRECT PATCH LINK:
        const derivedCode = data.product_code || data.xid || doc.id.substring(0, 5).toUpperCase();

        return {
          id: doc.id,
          ...data,
          product_code: derivedCode, 
          price: resolvedPrice
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

// 🛠️ Dynamic Prefix-Insensitive Cross-Match Sort Pipeline
  const filteredCards = useMemo(() => {
    if (!cards || cards.length === 0) return [];
    
    // 🚀 LIVE DETECTOR: Bypass Next.js hook query caching layer by pulling current browser text strings directly
    let activeCategoryToken = activeCategory;
    let currentRawQuery = "";
    
    if (typeof window !== "undefined") {
      const liveParams = new URLSearchParams(window.location.search);
      const urlCat = liveParams.get("category");
      if (urlCat) activeCategoryToken = urlCat;
      currentRawQuery = (liveParams.get('q') || "").toLowerCase().trim();
    } else {
      currentRawQuery = (searchParams.get('q') || "").toLowerCase().trim();
    }
    
    let marketQuery = currentRawQuery;
    if (marketQuery.startsWith("xid-")) {
      marketQuery = marketQuery.substring(4);
    }

   let baseList = cards.filter((card) => {
      const title = String(card?.title || "").toLowerCase();
      const dbCat = String(card?.category || "").toLowerCase().trim();
      const dbSub = String(card?.subCategory || card?.subcategory || "").toLowerCase().trim();
      const dbLoc = String(card?.location || "").toLowerCase().trim();
      const make = String(card?.make || "").toLowerCase();
      const model = String(card?.model || "").toLowerCase(); 

      const hasActiveSearch = marketQuery.replace(/[^a-z0-9]/g, "") !== "";
      if (hasActiveSearch) {
        const rawData = [title, dbCat, dbSub, dbLoc, make, model].join(" ");
        return rawData.includes(marketQuery);
      }

      // Read clean category context tokens from search parameters
      const activeLower = (activeCategoryToken || "all").toLowerCase().trim();
      let cleanActive = decodeURIComponent(activeLower);

      // 🔄 PLURALITY & TAXONOMY SYNC ROUTER
      // Converts navbar click signals to match your database field criteria precisely
      if (cleanActive === "other-art" || cleanActive === "art") cleanActive = "art";
      if (cleanActive === "rvs" || cleanActive === "rv") cleanActive = "rv";
      if (cleanActive === "trucks" || cleanActive === "truck") cleanActive = "trucks"; // keeps alignment with marketTaxonomy lookups
      if (cleanActive === "motorcycles" || cleanActive === "motorcycle") cleanActive = "motorcycles";
      if (cleanActive === "homes" || cleanActive === "home") cleanActive = "homes";
      if (cleanActive === "rentals" || cleanActive === "rental") cleanActive = "rentals";
      if (cleanActive === "rooms" || cleanActive === "room") cleanActive = "rooms";
      if (cleanActive === "suvs" || cleanActive === "suv") cleanActive = "suv";

      // 🏎️ Core Mobility / Vehicle Scope Filter Rule Controls
      // Include child sub-tabs here so they don't break sequence and bypass the vehicle isolation shields!
      const isVehicleTabActive = cleanActive === "all" || 
                                 cleanActive === "mobility" || 
                                 cleanActive === "vehicles" || 
                                 cleanActive === "cars" ||
                                 cleanActive === "trucks" ||
                                 cleanActive === "rv" ||
                                 cleanActive === "motorcycles" ||
                                 cleanActive === "suv";

      if (isVehicleTabActive) {
        // Block independent alternative directories (Art, Land, Homes, Services) from flooding mobility feeds
        if (dbCat && dbCat !== "mobility" && dbCat !== "vehicles" && dbCat !== "cars") {
          return false;
        }

        // Handle sub-tab direct returns cleanly within the mobility block
        if (cleanActive === "trucks") return dbCat.includes("truck") || dbSub.includes("truck") || title.includes("truck");
        if (cleanActive === "rv") return title.includes("rv ") || title.includes("rv") || dbCat.includes("rv") || dbSub.includes("rv") || title.includes("trailer");
        if (cleanActive === "motorcycles") return dbCat.includes("moto") || dbSub.includes("moto") || dbCat.includes("bike") || dbCat.includes("scooter");
        if (cleanActive === "suv") return dbSub.includes("suv") || model.includes("suv") || title.includes("suv");

        // Main primary Car View isolation rule checks
        const isPassengerCar = 
          title.includes("suv") || dbCat.includes("suv") || dbSub.includes("suv") ||
          title.includes("ev") || dbCat.includes("ev") || dbSub.includes("ev") ||
          title.includes("electric") ||
          title.includes("luxury") || dbCat.includes("luxury") || dbSub.includes("luxury") ||
          title.includes("coupe") || dbCat.includes("coupe") || dbSub.includes("coupe") ||
          title.includes("van") || dbCat.includes("van") || dbSub.includes("van") ||
          title.includes("minivan") || title.includes("convertible") || title.includes("sedan");

        const isHeavyFleet = 
          title.includes("truck") || dbCat.includes("truck") || dbSub.includes("truck") ||
          title.includes("moto") || dbCat.includes("moto") || dbSub.includes("moto") || 
          title.includes("bike") || title.includes("bicycle") ||
          title.includes("rv ") || title.includes("rv") || dbCat.includes("rv") || dbSub.includes("rv") ||
          title.includes("trailer") || dbCat.includes("trailer");

        if (isHeavyFleet && !isPassengerCar) {
          return false;
        }

        return isListingInRegistry(card, "cars");
      }

      // 🛡️ NATIVE FALLBACK ROUTER: Hand over data evaluation to the taxonomy registry array for alternative verticals
      return isListingInRegistry(card, cleanActive);
    });
    return [...baseList].sort((a, b) => {
      if (sortBy === "priceLow") return a.price - b.price;
      if (sortBy === "priceHigh") return b.price - a.price;
      
      const priceA = typeof a.price === 'number' ? a.price : Number(a.price) || 0;
      const priceB = typeof b.price === 'number' ? b.price : Number(b.price) || 0;
      
      const dateA = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : Number(a.createdAt) || 0;
      const dateB = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : Number(b.createdAt) || 0;
      return dateB - dateA; 
    });

  // 🎯 STABLE DEPENDENCY TREE: Remove raw window tracking to completely eliminate the double-rendering lag loop!
  }, [cards, activeCategory, searchParams, isCaribbeanMode, sortBy]);
  
  // 🛰️ INTERLOCK INTERCEPTOR HOOK: Broadcast active listing query metrics straight to global memory channels
  useEffect(() => {
    if (typeof window !== "undefined" && filteredCards && filteredCards.length > 0) {
      // Intelligently sync either the exact query match or the very top viewable item asset row
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
        {/* 👤 ACCOUNT TRIGGER (Top Right) */}
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
            onClick={() => { setIsCaribbeanMode(!isCaribbeanMode); setActiveCategory(isCaribbeanMode ? null : 'caribbean'); }}
            style={{ 
              height: '64px', padding: '0 32px', borderRadius: '20px', 
              backgroundColor: isCaribbeanMode ? '#0f172a' : '#fff', 
              color: isCaribbeanMode ? '#fff' : '#0f172a', 
              border: isCaribbeanMode ? 'none' : '1px solid #e2e8f0',
              fontWeight: 1000, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.15em', cursor: 'pointer', transition: '0.3s',
              boxShadow: isCaribbeanMode ? '0 20px 40px rgba(0,0,0,0.1)' : 'none'
            }}
          >
            {isCaribbeanMode ? '← View Global Trades' : 'Caribbean Sanctuary'}
          </button>
        </div>
      </header>

      <div style={{ maxWidth: '1400px', margin: '0 auto 60px', padding: '0 5vw' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

{!isCaribbeanMode && (
            <CategoryBar 
              // 🎯 FIXED DIRECTION: Sync the visual active highlight color with the actual URL token
              active={activeCategoryToken} 
              onSelect={(selectedTab) => {
                // Keep local memory states and URL context perfectly synchronized
                setActiveCategory(selectedTab);
                
                const params = new URLSearchParams(window.location.search);
                if (selectedTab && selectedTab !== "all") {
                  params.set('category', selectedTab);
                } else {
                  params.delete('category');
                }
                
                router.push(`/market?${params.toString()}`, { scroll: false });
              }} 
            />
          )}
          
        {/* 🛠️ SEARCH & PREMIUM SORT UTILITY CONTROLS */}
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap', width: '100%' }}>
            
            <div style={{ position: 'relative', flex: '1', minWidth: '280px', maxWidth: '400px' }}>
              <Search size={16} style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: '#cbd5e1' }} />
              <input 
                placeholder="SEARCH REGISTRY PROTOCOL..." 
                // 🔒 STRICT ALIGNMENT: Force it to evaluate ONLY the true alphanumeric search parameter 'q'
                value={typeof window !== "undefined" ? (new URLSearchParams(window.location.search).get('q') || "") : ""} 
                onChange={(e) => {
                  const term = e.target.value;
                  const params = new URLSearchParams(window.location.search);
                  
                  if (term) {
                    params.set('q', term);
                  } else {
                    params.delete('q');
                  }
                  
                  // Run structural state router updates cleanly
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
                  // 🛡️ NATIVE RENDER PATH: Data array filters handle matching, preventing visual layout displacement
                  return (
                    <div key={card.id} style={{ display: 'flex', flexDirection: 'column' }}>
                      <MarketplaceCard 
                        {...card} 
                        listing={card} 
                        id={card.id}
                        stewardID={card.stewardID || card.userId || card.merchantId || card.sellerId}
                        merchantId={card.merchantId || card.stewardID || card.userId}
                        image={card.imageUrl || card.image || "https://via.placeholder.com/400x300"}
                        timeLeft={card.endTime ? getTimeLeft(card.endTime) : "24h"} 
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
