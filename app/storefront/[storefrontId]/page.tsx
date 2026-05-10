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

export default function StorefrontPage({ params }: { params: Promise<{ storefrontId: string }> }) {
  const { storefrontId } = use(params);

  // --- 1. STATE ---
  const [items, setItems] = useState<any[]>([]);
  const [storeData, setStoreData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setBy] = useState("newest");

  const luxuryGold = "#C5A059";
  const brandColor = storeData?.themeColor || '#014d4e';
  const isNoir = brandColor === '#1a1a1a' || brandColor === '#000000';

  // --- 2. THE MASTER LOGIC ---
  const filteredAndSortedItems = useMemo(() => {
    const toNum = (val: any) => {
      if (val === null || val === undefined) return 0;
      const cleaned = String(val).replace(/[$,\s]/g, "");
      const parsed = parseFloat(cleaned);
      return isNaN(parsed) ? 0 : parsed;
    };

    // Filter Items
    const filtered = items.filter((item: any) => {
      const s = searchTerm.toLowerCase();
      const title = (item.title || item.name || "").toLowerCase();
      const narrative = (
        item.description ||
        item.narrative ||
        item.story ||
        item.about ||
        ""
      ).toLowerCase();
      return title.includes(s) || narrative.includes(s);
    });

    // Sort Items
    return [...filtered].sort((a, b) => {
      const priceA = toNum(a.buyPrice || a.reservePrice || a.price);
      const priceB = toNum(b.buyPrice || b.reservePrice || b.price);

      if (sortBy === "price-low") return priceA - priceB;
      if (sortBy === "price-high") return priceB - priceA;
      return 0; // Default newest
    });
  }, [items, searchTerm, sortBy]);

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
        const storefrontsRef = collection(db, "storefronts");
        const qSlug = query(storefrontsRef, where("slug", "==", storefrontId));
        const slugSnap = await getDocs(qSlug);

        let finalStoreData = null;
        let finalUserId = null;

        if (!slugSnap.empty) {
          finalStoreData = slugSnap.docs[0].data();
          finalUserId = finalStoreData.userId;
        } else {
          const directDocRef = doc(db, "storefronts", storefrontId);
          const directSnap = await getDoc(directDocRef);
          if (directSnap.exists()) {
            finalStoreData = directSnap.data();
            finalUserId = finalStoreData.userId || storefrontId;
          }
        }

        if (finalStoreData) {
          setStoreData(finalStoreData);
          // Query the central "listings" collection using the store owner's User ID
          const qAssets = query(
            collection(db, "listings"),
            where("userId", "==", finalUserId)
          );
          const assetSnap = await getDocs(qAssets);
          setItems(assetSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        }
      } catch (err) {
        console.error("Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [storefrontId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#052c2c] flex items-center justify-center text-[#C5A059]">
        Opening Boutique...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfdfe]">
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
   justifyContent: 'center',
   overflow: 'hidden', // This MUST be here to clip the banner
   width: '100%', 
   maxWidth: '100vw',  // Force a hard stop at the viewport edge
   boxSizing: 'border-box'
 }}>
   {storeData?.bannerUrl ? (
     <div style={{
       position: 'absolute',
       inset: 0,
       width: '100%',     // Ensure the image container stays inside
       height: '100%',
       backgroundImage: `url("${storeData.bannerUrl}")`,
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

   {/* Overlay - Needs strict width too */}
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
     maxWidth: '1200px', // Matches your gallery's container width
     boxSizing: 'border-box'
   }}>
     {/* Logo Circle */}
     <div style={{
       // Scaled down slightly for mobile portrait
       width: 'clamp(100px, 20vw, 120px)',
       height: 'clamp(100px, 20vw, 120px)',
       borderRadius: '50%',
       border: `3px solid ${luxuryGold}`,
       backgroundColor: '#00251a',
       overflow: 'hidden',
       display: 'flex',
       alignItems: 'center',
       justifyContent: 'center',
       marginBottom: '20px',
       boxShadow: '0 10px 25px rgba(0,0,0,0.4)',
       flexShrink: 0
     }}>
       {storeData?.logoUrl ? (
         <img src={storeData.logoUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Logo" />
       ) : (
         <span style={{ color: luxuryGold, fontSize: 'clamp(32px, 8vw, 42px)', fontWeight: '900' }}>
           {(storeData?.name || storefrontId).charAt(0).toUpperCase()}
         </span>
       )}
     </div>

     <h1 style={{
       color: 'white',
       fontSize: 'clamp(1.5rem, 8vw, 3.5rem)', // Optimized for mobile
       fontWeight: '900',
       fontStyle: 'italic',
       textTransform: 'uppercase',
       textAlign: 'center',
       margin: '0 0 10px 0',
       textShadow: '0 2px 8px rgba(0,0,0,0.5)',
       wordBreak: 'break-word', // Prevents long names from breaking the frame
       maxWidth: '90%'
     }}>
       {storeData?.name || storefrontId.replace(/-/g, ' ')}
     </h1>

     {storeData?.description && (
       <p style={{
         color: '#d1d5db',
         fontSize: '13px', // Slightly smaller for portrait
         textAlign: 'center',
         maxWidth: '400px', // Narrowed for better mobile readability
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
      <div className="max-w-[1400px] mx-auto px-10 mt-12 mb-10">
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #eee', paddingBottom: '20px', flexWrap: 'nowrap' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
            <h2 className="text-2xl font-black text-[#004d40] uppercase italic m-0">Inventory</h2>
            <span className="text-gray-400 text-[10px] font-bold">({filteredAndSortedItems.length})</span>
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
              onChange={(e) => setBy(e.target.value)}
              style={{ width: '160px', borderRadius: '50px', border: '1px solid #ddd', padding: '8px 15px', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', cursor: 'pointer', outline: 'none' }}
            >
              <option value="newest">Latest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* --- 🖼️ THE GRID --- */}
      <main className="max-w-[1400px] mx-auto px-10 pb-20">
        {filteredAndSortedItems.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '3rem' }}>
            {filteredAndSortedItems.map((item) => {
              // 1. Resolve active price
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
                    merchantName={item.merchantName}
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
            <h3 style={{ color: luxuryGold, fontWeight: '900', textTransform: 'uppercase', letterSpacing: '5px', fontSize: '12px' }}>My Story</h3>
            <p style={{ fontSize: '18px', opacity: 0.8, lineHeight: '2', fontStyle: 'italic', marginTop: '25px' }}>
              {storeData?.about || "Behind every asset in this collection is a journey of curation and craftsmanship."}
            </p>
            <div style={{ marginTop: '50px', borderLeft: `3px solid ${luxuryGold}`, paddingLeft: '30px' }}>
              <p style={{ color: luxuryGold, fontSize: '10px', fontWeight: '900', textTransform: 'uppercase' }}>About Merchant</p>
              <p style={{ fontSize: '26px', fontWeight: '900', textTransform: 'uppercase' }}>{storeData?.merchantName || "Modern Art"}</p>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '60px' }}>
            <div>
              <h4 style={{ color: luxuryGold, fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '5px' }}>Concierge</h4>
              <div style={{ opacity: 0.7, fontSize: '14px', marginTop: '20px' }}>
                <p>{storeData?.email || "bsepehri@gmail.com"}</p>
                <p>{storeData?.address || "22 Miami Beach, Miami, Florida 33312"}</p>
              </div>
            </div>
            <div>
              <h4 style={{ color: luxuryGold, fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '5px' }}>Governance</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', fontSize: '13px', marginTop: '20px' }}>
                <Link href="/legal/terms" style={{ color: 'white', opacity: 0.8 }}>Terms of Service</Link>
                <Link href="/legal/privacy" style={{ color: 'white', opacity: 0.8 }}>Privacy Policy</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
