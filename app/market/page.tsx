"use client";

import React, { useState, useEffect, useMemo, Suspense, useContext, createContext } from "react";
import { db } from "@/lib/firebase/client";
import { collection, getDocs } from "firebase/firestore";
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, Sun, Globe } from "lucide-react";
import CategoryBar from "@/components/marketplace/CategoryBar";
import MarketplaceCardSkeleton from "./MarketplaceCardSkeleton";
import MarketplaceCard from "./MarketplaceCard"; 
import { User } from "lucide-react"; 
import { ItemCard } from "@/components/market/ItemCard";

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

// ⚙️ 2. YOUR ORIGINAL LOGIC
function MarketplacePageCore() {
  const { user } = useAuth(); 
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isCaribbeanMode, setIsCaribbeanMode] = useState(false);
  const [cards, setCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const router = useRouter();

  const [isLoginOpen, setIsLoginOpen] = useState(false);
  
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
        setActiveCategory("homes"); // Syncs with your filtering array targets perfectly
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
                              Number(data.currentBid) || // Adjusted safely
                              Number(data.currentBid) || 
                              Number(data.startingBid) || 
                              Number(data.reservePrice) || 
                              Number(data.price) || 0;

        return {
          id: doc.id,
          ...data,
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

 const filteredCards = useMemo(() => {
    if (!cards || cards.length === 0) return [];
    const marketQuery = (searchParams.get('q') || "").toLowerCase().trim();

    return cards.filter((card) => {
      const title = String(card?.title || "").toLowerCase();
      const dbCat = String(card?.category || "").toLowerCase().trim();
      const dbSub = String(card?.subCategory || card?.subcategory || "").toLowerCase().trim();
      const dbLoc = String(card?.location || "").toLowerCase().trim();
      const make = String(card?.make || "").toLowerCase();
      const model = String(card?.model || "").toLowerCase(); 
      
      if (marketQuery !== "") {
        const rawData = [title, dbCat, dbSub, dbLoc, make, model].join(" ");
        return rawData.includes(marketQuery);
      }

      const activeLower = (activeCategory || "all").toLowerCase().trim();
      const cleanActive = decodeURIComponent(activeLower);
      if (cleanActive === "all") return true;

      const isExplicitGeneralTarget = cleanActive.includes('watch') || 
                                      cleanActive.includes('timepiece') || 
                                      cleanActive.includes('apparel') || 
                                      cleanActive.includes('clothing') ||
                                      cleanActive.includes('jewelry');

      const mobilityIDs = ['cars', 'electric', 'ev', 'trucks', 'motorcycles', 'rvs', 'mobility', 'exotic', 'luxury', 'commercial', 'fleet', 'scooter', 'moped', 'suv'];
      const isMobilityTab = mobilityIDs.some(id => cleanActive.includes(id)) && !isExplicitGeneralTarget;

      if (isMobilityTab) {
        if (dbCat.includes('watch') || dbSub.includes('watch') || dbCat.includes('apparel') || dbSub.includes('apparel')) return false;
        
        const isVehicleCheck = 
          ['cars', 'trucks', 'motorcycle', 'rv', 'ev', 'electric', 'mobility'].some(v => dbCat.includes(v)) || 
          !!card?.make;

        if (!isVehicleCheck) return false;

        if (cleanActive.includes('ev') || cleanActive.includes('electric')) {
          return dbCat.includes('ev') || dbCat.includes('electric') || 
                 dbSub.includes('ev') || dbSub.includes('electric') || 
                 title.toLowerCase().includes('electric');
        }

        if (cleanActive.includes('exotic') || cleanActive.includes('luxury')) {
          return (dbSub.includes('exotic') || dbSub.includes('luxury') || title.toLowerCase().includes('luxury')) && isVehicleCheck;
        }

        if (cleanActive === 'suv') return dbSub.includes('suv');

        if (cleanActive.includes('motorcycle') || cleanActive.includes('scooter') || cleanActive.includes('moped')) {
          if (cleanActive.includes('scooter') || cleanActive.includes('moped')) {
            return dbSub.includes('scooter') || cleanActive.includes('moped') || dbCat.includes('scooter');
          }
          return dbCat.includes('motorcycle') || dbSub.includes('motorcycle') || 
                 dbCat.includes('scooter') || dbSub.includes('scooter') || dbSub.includes('moped');
        }

        if (cleanActive === 'cars' || cleanActive === 'mobility') {
          if (dbCat.includes('truck') || dbCat.includes('rv') || dbCat.includes('motorcycle')) return false;
          return dbCat.includes('cars') || dbCat.includes('ev') || dbCat.includes('electric') || 
                 dbSub.includes('exotic') || dbSub.includes('suv') || !!card?.make;
        }

        if (cleanActive.includes('truck') || cleanActive.includes('fleet') || cleanActive.includes('commer')) {
          const isTruckBase = dbCat.includes('truck') || dbSub.includes('truck');
          if (cleanActive.includes('fleet') || cleanActive.includes('commer')) {
            return isTruckBase && (dbSub.includes('fleet') || dbSub.includes('commer'));
          }
          return isTruckBase;
        }
      }

      if (cleanActive.includes('pet')) {
        if (cleanActive.includes('rare') || cleanActive.includes('other')) return dbSub.includes('rare') || dbSub.includes('other');
        return dbCat.includes('pet') || dbSub.includes('pet');
      }

      const isTimeshareButton = cleanActive.includes('timeshare') || cleanActive.includes('rent') || cleanActive.includes('sell') || cleanActive.includes('sale');
      if (isTimeshareButton) {
        const isTimeshareData = dbCat.includes('timeshare') || dbSub.includes('timeshare') || title.includes('timeshare');
        if (!isTimeshareData) return false;

        if (cleanActive.includes('rent')) return dbSub.includes('rent') || title.includes('rent');
        if (cleanActive.includes('sale') || cleanActive.includes('sell') || cleanActive.includes('purchase')) {
          return !(dbSub.includes('rent') || title.includes('rent'));
        }
        return true;
      }

      // --- 🏠 STRICT REAL ESTATE PROPERTY BUCKETS ---
      const isSanctuary = dbLoc.includes('dominican') || dbLoc.includes('caribbean') || !!card?.isSanctuaryAsset || !!card?.isSanctuary;
      const isTimeshareData = dbCat.includes('timeshare') || dbSub.includes('timeshare');
      const isLandData = dbCat.includes('land') || dbSub.includes('land') || !!card?.isLandAsset;

      // 1. LAND REGISTER
      if (cleanActive === 'land') return isLandData;

      // 2. CARIBBEAN SANCTUARY REGISTER
      if (cleanActive === 'caribbean' || isCaribbeanMode) return isSanctuary && !isTimeshareData && !isLandData;

      // 3. APARTMENTS REGISTER (Strict whole-word sorting)
      if (cleanActive === 'apartment' || cleanActive === 'apartments') {
        if (isSanctuary || isTimeshareData || isLandData) return false;
        return dbSub === 'apartments' || dbSub === 'apartment' || dbCat === 'apartments' || dbCat === 'apartment';
      }

      // 4. VILLAS REGISTER
      if (cleanActive === 'villas' || cleanActive === 'villa') {
        if (isTimeshareData || isLandData) return false;
        return dbSub === 'villas' || dbSub === 'villa' || dbCat === 'villas' || dbCat === 'villa';
      }

      // 5. PRIVATE / SHARED ROOMS REGISTER
      if (cleanActive === 'rooms' || cleanActive === 'room' || cleanActive.includes('share')) {
        return dbCat === 'rooms' || dbSub.includes('room') || dbSub.includes('share');
      }

      // 6. GENERAL RESIDENTIAL HOMES REGISTER (Standalone houses only)
      if (cleanActive === 'homes' || cleanActive === 'property') {
        const isBaseProperty = dbCat === 'property' || dbCat === 'homes' || dbCat === 'residential' || !!card?.isPropertyAsset;
        const isExcludedTier = isSanctuary || isLandData || isTimeshareData || dbCat === 'rooms' || dbSub === 'apartments' || dbSub === 'villas';
        
        return isBaseProperty && !isExcludedTier;
      }

      // 📦 GENERAL MARKET
      if (cleanActive === 'general' || isExplicitGeneralTarget) {
        const belongsElsewhere = 
          dbCat.includes('art') || 
          (dbCat.includes('mobility') && !isExplicitGeneralTarget) || 
          dbCat.includes('property') || 
          dbCat.includes('residential') ||
          dbCat.includes('homes') ||
          dbCat.includes('pet') || 
          dbCat.includes('timeshare') ||
          (!!card?.make && !isExplicitGeneralTarget) ||
          !!card?.isPropertyAsset;

        if (belongsElsewhere) return false;
        
        if (cleanActive.includes('watch') || cleanActive.includes('timepiece')) return dbCat.includes('watch') || dbSub.includes('watch');
        if (cleanActive.includes('apparel') || cleanActive.includes('clothing') || cleanActive.includes('jacket')) {
          return dbCat.includes('apparel') || dbSub.includes('apparel') || dbCat.includes('clothing') || dbSub.includes('jacket');
        }

        const generalKeywords = ['furniture', 'watch', 'jewelry', 'apparel', 'clothing', 'electronic', 'appliance', 'household', 'other', 'misc'];
        return generalKeywords.some(kw => dbCat.includes(kw) || dbSub.includes(kw)) || dbCat === 'general' || dbCat === 'misc';
      }

      // 🎨 ART & COLLECTIBLES
      const artIDs = ['art', 'digital', 'nft', 'paint', 'sculpt', 'print'];
      const isArtTab = artIDs.some(id => cleanActive.includes(id));

      if (isArtTab) {
        if (dbCat.includes('property') || dbCat.includes('home') || dbCat.includes('resident') || !!card?.isPropertyAsset) return false;

        const isStrictArt = dbCat === 'art' || dbSub.includes('art') || dbSub.includes('nft') || dbSub.includes('digital');
        if (!isStrictArt) return false;

        if (cleanActive.includes('digital') || cleanActive.includes('nft')) {
          return dbSub.includes('digital') || dbSub.includes('nft') || title.toLowerCase().includes('nft');
        }

        const artSubs = ['paint', 'sculpt', 'print', 'other'];
        const activeSub = artSubs.find(s => cleanActive.includes(s));
        if (activeSub) return dbSub.includes(activeSub);

        return true;
      }

      return dbCat === cleanActive || dbSub === cleanActive;
    });
  }, [cards, activeCategory, searchParams, isCaribbeanMode]);

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
              height: '64px', padding: '0 32px', borderRadius: '20px', border: 'none', 
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
          {!isCaribbeanMode && <CategoryBar active={activeCategory} onSelect={setActiveCategory} />}
          
          <div style={{ position: 'relative', width: '100%', maxWidth: '400px' }}>
            <Search size={16} style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: '#cbd5e1' }} />
            <input 
              placeholder="SEARCH REGISTRY PROTOCOL..." 
              value={searchParams.get('q') || ""} 
              onChange={(e) => {
                const term = e.target.value;
                const params = new URLSearchParams(searchParams.toString());
                if (term) params.set('q', term);
                else params.delete('q');
                router.push(`/market?${params.toString()}`, { scroll: false });
              }}
              style={{ height: '56px', width: '100%', backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', paddingLeft: '52px', fontSize: '11px', fontWeight: 900, outline: 'none' }} 
            />
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
          ) : filteredCards.map((card) => {
            return (
              <MarketplaceCard 
                key={card.id}
                {...card} 
                id={card.id}
                stewardID={card.stewardID || card.userId || card.merchantId || card.sellerId}
                merchantId={card.merchantId || card.stewardID || card.userId}
                image={card.imageUrl || card.image || "https://via.placeholder.com/400x300"}
                timeLeft={card.endTime ? getTimeLeft(card.endTime) : "24h"} 
                onBid={() => {
                  if (!user) {
                    setIsLoginOpen(true);
                  } else {
                    // ✅ Navigate to the details page for validation and placing the bid
                    router.push(`/market/asset/${card.id}`);
                  }
                }} 
              />
            );
          })}
        </div>
      </main>
    </div>
  );
}

function Left(endTime: any) {
  return getTimeLeft(endTime);
}
