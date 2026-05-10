// app/market/MarketplaceCardSkeleton.tsx

export default function MarketplaceCardSkeleton() {
  return (
    <div className="marketplace-card skeleton-card">

      <div className="card-image skeleton-block" />

      <div className="card-content">
        <div className="card-category-icon skeleton-block small" />
        <div className="card-title skeleton-block" />
        <div className="card-price skeleton-block" />
        <div className="card-location skeleton-block" />

        <div className="card-badges">
          <span className="badge-skeleton skeleton-block small" />
          <span className="badge-skeleton skeleton-block small" />
        </div>
      </div>

    </div>
  );
}

