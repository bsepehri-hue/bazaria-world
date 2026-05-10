type RatingStarsProps = {
  rating: number;
  reviewCount?: number | null;
};

export function RatingStars({ rating, reviewCount }: RatingStarsProps) {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;

  return (
    <div className="flex items-center gap-1">
      {/* Full stars */}
      {Array.from({ length: fullStars }).map((_, i) => (
        <span key={i} className="text-amber-400 text-lg">★</span>
      ))}

      {/* Half star */}
      {halfStar && <span className="text-amber-400 text-lg">☆</span>}

      {/* Review count */}
      {reviewCount !== null && reviewCount !== undefined && (
        <span className="text-white/80 text-sm ml-1">
          ({reviewCount})
        </span>
      )}
    </div>
  );
}
