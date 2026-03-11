// app/market/page.tsx

import { useState } from "react";
import MarketplaceCard from "./MarketplaceCard";
import MarketplaceCardSkeleton from "./MarketplaceCardSkeleton";

export default function MarketplacePage() {

  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const loading = false;

  // ============================
  // CARD DATA (13 categories)
  // ============================
  const cards = [
    { title: "2018 Toyota Corolla", price: "$8,900", location: "Santo Domingo Este", badge1: "Verified", badge2: "New", imageType: "image-car", emoji: "🚗", category: "Cars" },
    { title: "2-Bedroom Apartment", price: "$450/mo", location: "Santo Domingo Norte", badge1: "Furnished", badge2: "Hot", imageType: "image-home", emoji: "🏠", category: "Homes" },
    { title: "Beachfront Condo Rental", price: "$120/night", location: "Punta Cana", badge1: "Ocean View", badge2: "Superhost", imageType: "image-rental", emoji: "🏖️", category: "Rentals" },
    { title: "Room for Rent", price: "$180/mo", location: "Santiago", badge1: "Private", badge2: "Safe Area", imageType: "image-room", emoji: "🛏️", category: "Rooms" },
    { title: "1,200 m² Lot", price: "$35,000", location: "La Vega", badge1: "Titled", badge2: "Great Location", imageType: "image-land", emoji: "🌄", category: "Land" },
    { title: "Yamaha MT-07", price: "$4,800", location: "Santo Domingo", badge1: "Low Mileage", badge2: "Sport", imageType: "image-moto", emoji: "🏍️", category: "Motorcycles" },
    { title: "Travel Camper", price: "$12,500", location: "Cabarete", badge1: "Sleeps 4", badge2: "Clean", imageType: "image-rv", emoji: "🚐", category: "RVs" },
    { title: "Ford F-150", price: "$15,900", location: "Santo Domingo Oeste", badge1: "4x4", badge2: "Strong", imageType: "image-truck", emoji: "🚚", category: "Trucks" },
    { title: "Punta Cana Timeshare", price: "$1,200/yr", location: "Punta Cana", badge1: "Resort", badge2: "VIP Access", imageType: "image-timeshare", emoji: "🏝️", category: "Timeshare" },
    { title: "Cleaning Service", price: "From $25/hr", location: "Santo Domingo Oeste", badge1: "Trusted", badge2: "Top Rated", imageType: "image-service", emoji: "🧹", category: "Services" },
    { title: "Office Chair", price: "$45", location: "Gazcue", badge1: "Used", badge2: "Good Deal", imageType: "image-general", emoji: "📦", category: "General" },
    { title: "Golden Retriever Puppy", price: "$300", location: "Bavaro", badge1: "Vaccinated", badge2: "Purebred", imageType: "image-pet", emoji: "🐶", category: "Pets" },
    { title: "Handmade Painting", price: "$120", location: "Zona Colonial", badge1: "Original", badge2: "Local Artist", imageType: "image-art", emoji: "🎨", category: "Art" },
  ];

  // ============================
  // FILTERED CARDS
  // ============================
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
            {filteredCards.map((card, index) => (
              <MarketplaceCard
                key={index}
                title={card.title}
                price={card.price}
                location={card.location}
                badge1={card.badge1}
                badge2={card.badge2}
                imageType={card.imageType}
                emoji={card.emoji}
                category={card.category}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
}
