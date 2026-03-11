// app/market/page.tsx

import { useState, useEffect } from "react";
import MarketplaceCard from "./MarketplaceCard";
import MarketplaceCardSkeleton from "./MarketplaceCardSkeleton";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function MarketplacePage() {

  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [cards, setCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch listings from Firestore
  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);

      const snapshot = await getDocs(collection(db, "listings"));

      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setCards(data);
      setLoading(false);
    };

    fetchListings();
  }, []);

  // Filter by category
  const filteredCards = activeCategory
    ? cards.filter((c) => c.category === activeCategory)
    : cards;

  return (
    <div className="marketplace-page">
      <h1 className="marketplace-title">Marketplace</h1>

      {/* FILTER BAR */}
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

      {/* GRID */}
      <div className="marketplace-grid">
        {loading ? (
          <>
            <MarketplaceCardSkeleton />
            <MarketplaceCardSkeleton />
            <MarketplaceCardSkeleton />
            <MarketplaceCardSkeleton />
          </>
        ) : (
          <>
            {filteredCards.map((card) => (
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
          </>
        )}
      </div>
    </div>
  );
}
