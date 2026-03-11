// app/market/page.tsx

import MarketplaceCard from "./MarketplaceCard";
import MarketplaceCardSkeleton from "./MarketplaceCardSkeleton";

export default function MarketplacePage() {

  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const loading = false; // or true while testing


  return (
    <div className="marketplace-page">
      <h1 className="marketplace-title">Marketplace</h1>

      <div className="marketplace-filters">
  <button
    className={activeCategory === null ? "filter-active" : ""}
    onClick={() => setActiveCategory(null)}
  >
    All
  </button>

  <button
    className={activeCategory === "Cars" ? "filter-active" : ""}
    onClick={() => setActiveCategory("Cars")}
  >
    Cars
  </button>

  <button
    className={activeCategory === "Homes" ? "filter-active" : ""}
    onClick={() => setActiveCategory("Homes")}
  >
    Homes
  </button>

  <button
    className={activeCategory === "Electronics" ? "filter-active" : ""}
    onClick={() => setActiveCategory("Electronics")}
  >
    Electronics
  </button>

  <button
    className={activeCategory === "Pets" ? "filter-active" : ""}
    onClick={() => setActiveCategory("Pets")}
  >
    Pets
  </button>

  <button
    className={activeCategory === "Services" ? "filter-active" : ""}
    onClick={() => setActiveCategory("Services")}
  >
    Services
  </button>

  <button
    className={activeCategory === "General" ? "filter-active" : ""}
    onClick={() => setActiveCategory("General")}
  >
    General
  </button>
</div>
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
            <MarketplaceCard
              title="2018 Toyota Corolla"
              price="$8,900"
              location="Santo Domingo Este"
              badge1="Verified"
              badge2="New"
              imageType="image-car"
              emoji="🚗"
              category="Cars"
            />

            <MarketplaceCard
              title="2-Bedroom Apartment"
              price="$450/mo"
              location="Santo Domingo Norte"
              badge1="Furnished"
              badge2="Hot"
              imageType="image-home"
              emoji="🏠"
              category="Homes"
            />

            <MarketplaceCard
              title="iPhone 12 Pro"
              price="$520"
              location="Piantini"
              badge1="Unlocked"
              badge2="Good Condition"
              imageType="image-electronics"
              emoji="📱"
              category="Electronics"
            />

            <MarketplaceCard
              title="Golden Retriever Puppy"
              price="$300"
              location="Bavaro"
              badge1="Vaccinated"
              badge2="Purebred"
              imageType="image-pet"
              emoji="🐶"
              category="Pets"
            />

            <MarketplaceCard
              title="Cleaning Service"
              price="From $25/hr"
              location="Santo Domingo Oeste"
              badge1="Trusted"
              badge2="Top Rated"
              imageType="image-service"
              emoji="🧹"
              category="Services"
            />

            <MarketplaceCard
              title="Office Chair"
              price="$45"
              location="Gazcue"
              badge1="Used"
              badge2="Good Deal"
              imageType="image-general"
              emoji="📦"
              category="General"
            />
          </>
        )}

      </div>
    </div>
  );
}
