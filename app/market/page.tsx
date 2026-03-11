// app/market/page.tsx

import MarketplaceCard from "./MarketplaceCard";

export default function MarketplacePage() {
  return (
    <div className="marketplace-page">
      <h1 className="marketplace-title">Marketplace</h1>

      <div className="marketplace-grid">
        <MarketplaceCard />
        <MarketplaceCard />
        <MarketplaceCard />
        <MarketplaceCard />
        <MarketplaceCard />
        <MarketplaceCard />
      </div>
    </div>
  );
}

