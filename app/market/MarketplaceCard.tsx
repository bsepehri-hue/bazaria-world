// app/market/MarketplaceCard.tsx

import { CategoryIcons } from "@/lib/categories";

type MarketplaceCardProps = {
  title: string;
  price: string;
  location: string;
  badge1: string;
  badge2: string;
  imageType: string;
  emoji: string;
  category: string;
  featured?: boolean; // NEW (optional)
};

export default function MarketplaceCard({
  title,
  price,
  location,
  badge1,
  badge2,
  imageType,
  emoji,
  category,
}: MarketplaceCardProps) {

  const Icon = CategoryIcons[category]?.default;

  return (
    <div className="marketplace-card">
      
      <div className={`card-image ${imageType}`}>
  <div className="card-image-gradient" />
  <span className="card-emoji">{emoji}</span>
</div>

      <div className="card-content">

        {Icon && (
          <div className="card-category-icon">
            <Icon className="w-4 h-4 text-gray-600" />
          </div>
        )}

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
