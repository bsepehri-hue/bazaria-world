// app/market/MarketplaceCard.tsx

export default function MarketplaceCard() {
  return (
    <div className="marketplace-card">
      
      {/* Image */}
      <div className="card-image" />

      {/* Content */}
      <div className="card-content">

        {/* Title */}
        <div className="card-title">2018 Toyota Corolla</div>

        {/* Price */}
        <div className="card-price">$8,900</div>

        {/* Location */}
        <div className="card-location">Santo Domingo Este</div>

        {/* Badges */}
        <div className="card-badges">
          <span className="badge-skeleton">Verified</span>
          <span className="badge-skeleton">New</span>
        </div>

      </div>
    </div>
  );
}

