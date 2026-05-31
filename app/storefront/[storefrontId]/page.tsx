"use client";

import React, { useState, useEffect, use, useMemo } from "react";
import { ItemCard } from "@/components/market/ItemCard";
import { auth, db } from "@/lib/firebase/client"; 
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import MarketplaceCard from "@/app/market/MarketplaceCard";
import Link from "next/link";
import { onAuthStateChanged } from "firebase/auth";
import TopNav from "@/app/components/ui/TopNav"; 
import { Gem } from "lucide-react";
import AIConciergeDrawer from "@/components/ui/AIConciergeDrawer"; // 👈 Verify import string matches your directory

export default function StorefrontPage({ params }: { params: Promise<{ storefrontId: string }> }) {
  const { storefrontId } = use(params);

// --- 1. STATE ---
  const [items, setItems] = useState<any[]>([]);
  const [storeData, setStoreData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest"); // Handles reactive criteria state strings

  const luxuryGold = "#C5A059";
  const brandColor = storeData?.themeColor || '#014d4e';
  const isNoir = brandColor === '#1a1a1a' || brandColor === '#000000';

  // --- 2. DYNAMIC CRASH-PROOF FILTER & SORT ENGINE ---
  const cleanToNumber = (val: any): number => {
    if (val === null || val === undefined) return 0;
    
    // If it's already a clean number, return it instantly
    if (typeof val === 'number') return val;
    
    // If it's an array or object accidentally passed, try to grab the first entry or stringify it
    if (typeof val === 'object') {
      const stringified = Array.isArray(val) ? String(val[0]) : String(Object.values(val)[0]);
      const parsed = parseFloat(stringified.replace(/[$,\s]/g, ""));
      return isNaN(parsed) ? 0 : parsed;
    }

    // Force string manipulation to rip out formatting artifacts ($ symbols, commas, or spaces)
    const cleaned = String(val).replace(/[$,\s]/g, "");
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
  };

  const filteredItems = items.filter((item: any) => {
    const s = searchTerm.toLowerCase().trim();
    if (!s) return true;
    
    const title = (item.title || item.name || "").toLowerCase();
    const narrative = (item.description || item.narrative || item.story || item.about || "").toLowerCase();
    return title.includes(s) || narrative.includes(s);
  });

 // Execute high-precision array sort iteration
  const sortedItems = [...filteredItems].sort((a, b) => {
    
    // 🎯 FIX THE SORT SKIP: Explicitly resolve price based on active item listing type
    const resolveTruePrice = (item: any): number => {
      const isAuction = item.isLiveAuction || 
                        Number(item.currentBid) > 0 || 
                        Number(item.startingBid) > 0 || 
                        item.category === "AUCTION"; // Safety flag context check

      if (isAuction) {
        // For auctions, prioritize current active bids, fall back to starting reserve limits
        return cleanToNumber(item.currentBid || item.startingBid || item.buyNowPrice || item.buyPrice || item.price || 0);
      } else {
        // For fixed-price retail items, prioritize clear retail tags, completely ignoring empty bid nodes
        return cleanToNumber(item.buyNowPrice || item.price || item.buyPrice || item.currentBid || 0);
      }
    };

    const priceA = resolveTruePrice(a);
    const priceB = resolveTruePrice(b);

    // 🕵️‍♂️ DEV TOOLS PERFORMANCE INSIGHT LOGGER
    console.log(`[Storefront Final Sort] Sorting: ${sortBy} | "${a.title || a.name}" ($${priceA}) vs "${b.title || b.name}" ($${priceB})`);

    if (sortBy === "price-low") {
      if (priceA === priceB) return 0;
      return priceA - priceB;
    }
    if (sortBy === "price-high") {
      if (priceA === priceB) return 0;
      return priceB - priceA;
    }
    
    // BULLETPROOF TIME INTERPRETATION
    const parseDate = (item: any) => {
      const rawDate = item.createdAt || item.timestamp || item.endsAt || item.endTime || 0;
      if (!rawDate) return 0;
      
      if (rawDate && typeof rawDate === 'object' && 'seconds' in rawDate) {
        return (rawDate.seconds * 1000);
      }
      const parsed = new Date(rawDate).getTime();
      return isNaN(parsed) ? 0 : parsed;
    };

    const timeA = parseDate(a);
    const timeB = parseDate(b);
    
    if (timeA === timeB) return 0;
    return timeB - timeA;
  });
  // --- 3. FETCHING DATA ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    async function fetchData() {
      if (!storefrontId) return;
      try {
        setLoading(true);
        
        let finalStoreData = null;
        let finalUserId = null;

        // 🔎 Pass A: Check our primary unique global handle index registry collection
        const handleIndexRef = doc(db, "handles", storefrontId.toLowerCase().trim());
        const handleIndexSnap = await getDoc(handleIndexRef);

        if (handleIndexSnap.exists()) {
          // Dynamic Match Discovered! Extract the authentic underlying merchant userId
          finalUserId = handleIndexSnap.data().userId;
          
          const storeProfileRef = doc(db, "storefronts", finalUserId);
          const storeProfileSnap = await getDoc(storeProfileRef);
          if (storeProfileSnap.exists()) {
            finalStoreData = storeProfileSnap.data();
          }
        } else {
          // 🔎 Pass B: Fallback query search against the 'handle' parameter field directly
          const storefrontsRef = collection(db, "storefronts");
          const qHandle = query(storefrontsRef, where("handle", "==", storefrontId.toLowerCase().trim()));
          const handleSnap = await getDocs(qHandle);

          if (!handleSnap.empty) {
            finalStoreData = handleSnap.docs[0].data();
            finalUserId = finalStoreData.ownerId || finalStoreData.userId;
          } else {
            // 🔎 Pass C: Direct primary-key check in case it's a legacy document UID string
            const directDocRef = doc(db, "storefronts", storefrontId);
            const directSnap = await getDoc(directDocRef);
            if (directSnap.exists()) {
              finalStoreData = directSnap.data();
              finalUserId = finalStoreData.ownerId || finalStoreData.userId || storefrontId;
            }
          }
        }

        if (finalStoreData) {
          setStoreData(finalStoreData);
          
          // Query the central listing collection using the owner's true verified user ID node context
          const qAssets = query(
            collection(db, "listings"),
            where("userId", "==", finalUserId)
          );
          const assetSnap = await getDocs(qAssets);
          setItems(assetSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        }
      } catch (err) {
        console.error("Storefront Routing Resolution Error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [storefrontId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#052c2c] flex items-center justify-center text-[#C5A059] font-bold tracking-wider uppercase text-xs">
        Opening Boutique...
      </div>
    );
  }

 return (
    <div className="min-h-screen bg-[#fcfdfe] relative">
      <TopNav />

      {/* 🏛️ HERO SECTION */}
      <section style={{
        minHeight: '300px', 
        height: 'auto', 
        padding: '60px 0', 
        backgroundColor: brandColor,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center', // ✨ FIXED: Changed from 'justify' to standard React 'justifyContent'
        overflow: 'hidden',
        width: '100%', 
        maxWidth: '100vw', 
        boxSizing: 'border-box'
      }}>
        {storeData?.bannerUrl || storeData?.banner ? (
          <div style={{
            position: 'absolute',
            inset: 0,
            width: '100%', 
            height: '100%',
            backgroundImage: `url("${storeData.bannerUrl || storeData.banner}")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: isNoir ? 'grayscale(100%) contrast(1.1)' : 'none',
            zIndex: 1
          }} />
        ) : (
          <div style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, #00251a 0%, #014d4e 100%)',
            zIndex: 1
          }} />
        )}
      </section>

      {/* Existing storefront collection loops, inventories, and description cards go here */}

      {/* ========================================== */}
      {/* 🤖 AUTOMATED AI CONCIERGE DRAWER HUD WRAPPER */}
      {/* ========================================== */}
      <AIConciergeDrawer />

    </div>
  );

        {/* Overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          background: isNoir
            ? 'linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.7))'
            : 'linear-gradient(to bottom, rgba(0, 77, 64, 0.4), rgba(0, 37, 26, 0.7))',
          zIndex: 2
        }} />

        <div style={{
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative',
          padding: '0 20px',
          width: '100%',
          maxWidth: '1200px',
          boxSizing: 'border-box'
        }}>
          {/* Logo Circle */}
          <div style={{
            width: 'clamp(100px, 20vw, 120px)',
            height: 'clamp(100px, 20vw, 120px)',
            borderRadius: '50%',
            border: `3px solid ${luxuryGold}`,
            backgroundColor: '#00251a',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justify: 'center',
            marginBottom: '20px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.4)',
            flexShrink: 0
          }}>
            {storeData?.logoUrl || storeData?.logo ? (
              <img src={storeData.logoUrl || storeData.logo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Logo" />
            ) : (
              <span style={{ color: luxuryGold, fontSize: 'clamp(32px, 8vw, 42px)', fontWeight: '900' }}>
                {(storeData?.storeName || storeData?.name || storefrontId).charAt(0).toUpperCase()}
              </span>
            )}
          </div>

          <h1 style={{
            color: 'white',
            fontSize: 'clamp(1.5rem, 8vw, 3.5rem)', 
            fontWeight: '900',
            fontStyle: 'italic',
            textTransform: 'uppercase',
            textAlign: 'center',
            margin: '0 0 10px 0',
            textShadow: '0 2px 8px rgba(0,0,0,0.5)',
            wordBreak: 'break-word', 
            maxWidth: '90%'
          }}>
            {/* 🎯 FIXED: Prioritizes brand new onboarding form field layout configurations */}
            {storeData?.storeName || storeData?.name || storefrontId.replace(/-/g, ' ')}
          </h1>

          {storeData?.description && (
            <p style={{
              color: '#d1d5db',
              fontSize: '13px', 
              textAlign: 'center',
              maxWidth: '400px', 
              marginTop: '0',
              textShadow: '0 1px 4px rgba(0,0,0,0.5)',
              lineHeight: '1.4'
            }}>
              {storeData.description}
            </p>
          )}
        </div>
      </section>
        
      {/* 🛠️ TOOLBAR */}
      <div className="max-w-[1400px] mx-auto px-10 mt-12 mb-6">
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #eee', paddingBottom: '20px', flexWrap: 'nowrap' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
  <h2 className="text-2xl font-black text-[#004d40] uppercase italic m-0">Inventory</h2>
  {/* 🎯 FIXED: Reads sortedItems length directly */}
  <span className="text-gray-400 text-[10px] font-bold">({sortedItems.length})</span>
</div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <input
              type="text"
              placeholder="Search Storefront..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '280px', borderRadius: '50px', border: '1px solid #ddd', padding: '8px 20px', fontSize: '12px', outline: 'none' }}
            />
           <select
  value={sortBy}
  onChange={(e) => setSortBy(e.target.value)} // 🎯 UPDATED to use setSortBy
  style={{ width: '160px', borderRadius: '50px', border: '1px solid #ddd', padding: '8px 15px', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', cursor: 'pointer', outline: 'none' }}
>
  <option value="newest">Latest</option>
  <option value="price-low">Price: Low to High</option>
  <option value="price-high">Price: High to Low</option>
</select>
          </div>
        </div>
      </div>

    {/* --- 🎯 THE SCROLL WINDOW ENGINE --- */}
      <main className="max-w-[1400px] mx-auto px-10 pb-16">
        {/* 🎯 REPLACING THIS EXACT LINE HERE FROM THE OLD NAME TO sortedItems */}
        {sortedItems.length > 0 ? (
          <div style={{ 
            maxHeight: '620px', 
            overflowY: 'auto', 
            paddingRight: '12px',
            scrollbarWidth: 'thin',
            WebkitOverflowScrolling: 'touch'
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '3rem' }}>
              {/* 🎯 AND MAKING SURE THIS MAPS OVER sortedItems TOO */}
              {sortedItems.map((item) => {
                const resolvedPrice = Number(item.buyNowPrice) || 
                                      Number(item.buyPrice) || 
                                      Number(item.currentBid) || 
                                      Number(item.startingBid) || 
                                      Number(item.price) || 0;

                return (
                  <MarketplaceCard
                      key={item.id}
                      id={item.id}
                      title={item.title}
                        name={item.name || item.title}
                        category={item.category}
                        price={resolvedPrice}
                        startingBid={item.startingBid}
                        currentBid={item.currentBid}
                        buyNowPrice={item.buyNowPrice || item.buyPrice}
                        description={item.description || item.narrative || ""}
                        image={item.imageUrl || item.image || ""}
                        sellerAddress={item.userId || item.sellerAddress || ""}
                        merchantId={item.merchantId || item.stewardID || item.userId}
                        merchantName={item.merchantName || storeData?.storeName}
                        location={item.location}
                        
                        // Property Attributes
                        beds={item.beds}
                        baths={item.baths}
                        bedrooms={item.bedrooms || item.beds}
                        bathrooms={item.bathrooms || item.baths}

                        // Mobility Attributes
                        mileage={item.mileage}
                        mileageUnit={item.mileageUnit}
                        condition={item.condition}
                        make={item.make}
                        model={item.model}

                        // Unified timestamp
                        endsAt={item.endsAt || item.endTime || item.timestamp}
                        timeLeft={item.timeLeft}

                        isLiveAuction={
                          item.isLiveAuction || 
                          Number(item.currentBid) > 0 || 
                          Number(item.startingBid) > 0 || 
                          false
                        }
                        isOwner={true} 
                      />
                  );
                })}
            </div>
          </div>
        ) : (
          <p style={{ color: "#6b7280", textAlign: "center", padding: "48px 0" }}>
            No items found that match your search.
          </p>
        )}
      </main>

      {/* ⭐ EXOTIC VERIFIED ACQUISITIONS */}
      <section style={{ backgroundColor: '#fff', padding: '80px 40px', borderTop: '1px solid #f8f8f8' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ marginBottom: '50px', textAlign: 'center' }}>
            <h3 style={{ color: luxuryGold, fontSize: '24px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '12px', marginBottom: '15px' }}>Verified Acquisitions</h3>
            <div style={{ height: '2px', width: '60px', backgroundColor: luxuryGold, margin: '20px auto 0' }}></div>
          </div>
          <div style={{ display: 'flex', gap: '30px', overflowX: 'auto', paddingBottom: '20px' }}>
            {[
              { t: "Flawless", n: "Sarah K.", d: "APR 2026", x: "Flawless provenance verification. A true digital asset." },
              { t: "Exceptional", n: "Marcus V.", d: "APR 2026", x: "The merchant experience is exceptional. Quality at every step." },
              { t: "Future", n: "Julian R.", d: "MAR 2026", x: "The future of the Bazaria economy is here." }
            ].map((r, i) => (
              <div key={i} style={{ minWidth: '400px', border: '1px solid #eee', padding: '45px', borderRadius: '2px' }}>
                <h4 style={{ fontFamily: 'serif', fontSize: '24px', color: luxuryGold, marginBottom: '20px', fontStyle: 'italic' }}>{r.t}</h4>
                <p style={{ fontFamily: 'serif', fontSize: '19px', lineHeight: '1.7', color: '#334155', fontStyle: 'italic', marginBottom: '30px' }}>"{r.x}"</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #f8f8f8', paddingTop: '20px' }}>
                  <span style={{ fontSize: '11px', fontWeight: '900', textTransform: 'uppercase' }}>{r.n}</span>
                  <span style={{ fontSize: '10px', color: '#94a3b8' }}>{r.d}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 🏁 LUXURY NOIR FOOTER */}
      <footer style={{ backgroundColor: '#000000', padding: '100px 40px', color: 'white' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '80px' }}>
          <div style={{ gridColumn: 'span 2' }}>
            <h3 style={{ color: luxuryGold, fontWeight: '700', textTransform: 'uppercase', letterSpacing: '5px', fontSize: '12px' }}>My Story</h3>
            <p style={{ fontSize: '18px', opacity: 0.8, lineHeight: '2', fontStyle: 'italic', marginTop: '25px' }}>
              {storeData?.story || storeData?.about || "Behind every asset in this collection is a journey of curation and craftsmanship."}
            </p>
            <div style={{ marginTop: '50px', borderLeft: `3px solid ${luxuryGold}`, paddingLeft: '30px' }}>
              <p style={{ color: luxuryGold, fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '2px' }}>About Merchant</p>
              <p style={{ fontSize: '22px', fontWeight: '700', margin: '6px 0 0 0', lineHeight: '1.3' }}>
                {storeData?.storeName || storeData?.merchantName || storeData?.name || "Modern Art"}
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '60px' }}>
            <div>
              <h4 style={{ color: luxuryGold, fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '5px' }}>Concierge</h4>
              <div style={{ opacity: 0.7, fontSize: '14px', marginTop: '20px', lineHeight: '1.6' }}>
                <p style={{ margin: '0 0 8px 0' }}>{storeData?.email || "bsepehri@gmail.com"}</p>
                <p style={{ margin: 0 }}>{storeData?.address || "22 Miami Beach, Miami, Florida 33312"}</p>
              </div>
            </div>
            <div>
              <h4 style={{ color: luxuryGold, fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '5px' }}>Governance</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', fontSize: '13px', marginTop: '20px' }}>
                <Link href={storeData?.termsUrl || "/legal/terms"} style={{ color: 'white', opacity: 0.8, textDecoration: 'none' }}>Terms of Service</Link>
                <Link href={storeData?.privacyUrl || "/legal/privacy"} style={{ color: 'white', opacity: 0.8, textDecoration: 'none' }}>Privacy Policy</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
