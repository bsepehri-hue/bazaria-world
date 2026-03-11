// app/market/page.tsx

import { useState, useEffect } from "react";
import MarketplaceCard from "./MarketplaceCard";
import MarketplaceCardSkeleton from "./MarketplaceCardSkeleton";
import { collection, getDocs, query, where, limit, startAfter } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function MarketplacePage() {

  // ============================
  // STATE
  // ============================
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [cards, setCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [hasMore, setHasMore] = useState(true);

  // ============================
  // PAGINATED FIRESTORE LOADER
  // ============================
  const loadListings = async (category?: string) => {
    setLoading(true);

    let baseQuery;

    // First page (no cursor)
    if (!lastDoc) {
      baseQuery = category
        ? query(
            collection(db, "listings"),
            where("category", "==", category),
            limit(12)
          )
        : query(
            collection(db, "listings"),
            limit(12)
          );
    } 
    // Next pages (cursor exists)
    else {
      baseQuery = category
        ? query(
            collection(db, "listings"),
            where("category", "==", category),
            startAfter(lastDoc),
            limit(12)
          )
        : query(
            collection(db, "listings"),
            startAfter(lastDoc),
            limit(12)
          );
    }

    const snapshot = await getDocs(baseQuery);

    // No more results
    if (snapshot.empty) {
      setHasMore(false);
      setLoading(false);
      return;
    }

    const newData = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setCards((prev) => [...prev, ...newData]);
    setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
    setLoading(false);
  };

  // ============================
  // INITIAL LOAD
  // ============================
  useEffect(() => {
    loadListings();
  }, []);

  // ============================
  // RESET + RELOAD ON CATEGORY CHANGE
  // ============================
  useEffect(() => {
    setCards([]);
    setLastDoc(null);
    setHasMore(true);

    loadListings(activeCategory || undefined);
  }, [activeCategory]);

  return (
    <div className="marketplace-page">
      <h1 className="marketplace-title">Marketplace</h1>

      {/* ============================
          CATEGORY FILTER BAR (13)
      ============================ */}
      <div className="marketplace-filters">
        <button className={activeCategory === null ? "filter-active" : ""} onClick={() => setActiveCategory(null)}>All</button>
        <button className={activeCategory === "Cars" ? "filter-active" : ""} onClick={() => setActiveCategory("Cars")}>Cars</button>
        <button className={activeCategory === "Homes" ? "filter-active" : ""} onClick={() => setActiveCategory("Homes")}>Homes</button>
        <button className={activeCategory === "Rentals" ? "filter-active" : ""} onClick={() => setActiveCategory("Rentals")}>Rentals</button>
        <button className={activeCategory === "Rooms" ? "filter-active" : ""} onClick={() => setActiveCategory("Rooms")}>Rooms</button>
        <button className={activeCategory === "Land" ? "filter-active" : ""} onClick={() => setActiveCategory("Land")}>Land</button>
        <button className={activeCategory === "Motorcycles" ? "filter-active" : ""} onClick={() => setActiveCategory("Motorcycles")}>Motorcycles</button>
        <button className={activeCategory === "RVs" ? "filter-active" : ""} onClick={() => setActiveCategory("RVs")}>RVs</button>
        <button className={activeCategory === "Trucks" ? "filter-active" : ""} onClick={() => setActiveCategory("Trucks")}>Trucks</button>
        <button className={activeCategory === "Timeshare" ? "filter-active" : ""} onClick={() => setActiveCategory("Timeshare")}>Timeshare</button>
        <button className={activeCategory === "Services" ? "filter-active" : ""} onClick={() => setActiveCategory("Services")}>Services</button>
        <button className={activeCategory === "General" ? "filter-active" : ""} onClick={() => setActiveCategory("General")}>General</button>
        <button className={activeCategory === "Pets" ? "filter-active" : ""} onClick={() => setActiveCategory("Pets")}>Pets</button>
        <button className={activeCategory === "Art" ? "filter-active" : ""} onClick={() => setActiveCategory("Art")}>Art</button>
      </div>

      {/* ============================
          GRID
      ============================ */}
      <div className="marketplace-grid">

        {/* FIRST LOAD SKELETONS */}
        {loading && cards.length === 0 ? (
          <>
            <MarketplaceCardSkeleton />
            <MarketplaceCardSkeleton />
            <MarketplaceCardSkeleton />
            <MarketplaceCardSkeleton />
          </>
        ) : (
          <>
            {/* REAL CARDS */}
            {cards.map((card) => (
              <MarketplaceCard
                key={card.id}
                title={card.title}
                price={card.price}
                location={card.location}
                badge1={card.badge1}
                badge2={card.badge2}
                imageType={card.imageType}
                emoji={card.emoji}
                category={card.category}
                featured={card.featured}
              />
            ))}

            {/* PAGINATION SKELETONS */}
            {loading && cards.length > 0 && (
              <>
                <MarketplaceCardSkeleton />
                <MarketplaceCardSkeleton />
              </>
            )}
          </>
        )}

      </div>

      {/* ============================
          LOAD MORE BUTTON
      ============================ */}
      {hasMore && !loading && (
        <button
          className="load-more-button"
          onClick={() => loadListings(activeCategory || undefined)}
        >
          Load More
        </button>
      )}

    </div>
  );
}
