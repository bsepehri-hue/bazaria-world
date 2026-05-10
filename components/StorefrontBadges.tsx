export default function StorefrontBadges({ storefront }: { storefront: any }) {
  if (!storefront) return null;

  const badges: string[] = [];

  // Verified Merchant
  if (storefront.verified) {
    badges.push("Verified Merchant");
  }

  // Fast Responder
  if (storefront.responseRate >= 90) {
    badges.push("Fast Responder");
  }

  // New Merchant (30 days)
  const createdAt = storefront.createdAt;
  if (createdAt) {
    const days = (Date.now() - createdAt) / (1000 * 60 * 60 * 24);
    if (days <= 30) {
      badges.push("New Merchant");
    }
  }

  if (badges.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {badges.map((badge) => (
        <span
          key={badge}
          className="px-3 py-1 text-xs font-medium bg-teal-100 text-teal-800 rounded-full border border-teal-300"
        >
          {badge}
        </span>
      ))}
    </div>
  );
}