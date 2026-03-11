// app/market/page.tsx

import MarketplaceCard from "./MarketplaceCard";

export default function MarketplacePage() {
  return (
    <div className="marketplace-page">
      <h1 className="marketplace-title">Marketplace</h1>

      <div className="marketplace-grid">

        <MarketplaceCard
          title="2018 Toyota Corolla"
          price="$8,900"
          location="Santo Domingo Este"
          badge1="Verified"
          badge2="New"
        />

        <MarketplaceCard
          title="2-Bedroom Apartment"
          price="$450/mo"
          location="Santo Domingo Norte"
          badge1="Furnished"
          badge2="Hot"
        />

        <MarketplaceCard
          title="iPhone 12 Pro"
          price="$520"
          location="Piantini"
          badge1="Unlocked"
          badge2="Good Condition"
        />

        <MarketplaceCard
          title="Golden Retriever Puppy"
          price="$300"
          location="Bavaro"
          badge1="Vaccinated"
          badge2="Purebred"
        />

        <MarketplaceCard
          title="Cleaning Service"
          price="From $25/hr"
          location="Santo Domingo Oeste"
          badge1="Trusted"
          badge2="Top Rated"
        />

        <MarketplaceCard
          title="Office Chair"
          price="$45"
          location="Gazcue"
          badge1="Used"
          badge2="Good Deal"
        />

      </div>
    </div>
  );
}
