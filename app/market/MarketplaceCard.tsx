// app/market/MarketplaceCard.tsx

type MarketplaceCardProps = {
  title: string;
  price: string;
  location: string;
  badge1: string;
  badge2: string;
  imageType: string; // NEW
};

export default function MarketplaceCard({
  title,
  price,
  location,
  badge1,
  badge2,
  imageType,
}: MarketplaceCardProps) {
  return (
    <div className="marketplace-card">
      
      <div className={`card-image ${imageType}`} />

      <div className="card-content">
        <div className="card-title">{title}</div>
        <div className="card-price">{price}</div>
        <div className="card-location">{location}</div>

        <div className="card-badges">
          <span className="badge-skeleton">{badge1}</span>
          <span className="badge-skeleton">{badge2}</span>
        </div>
      </div>
    </div>
  );
}
