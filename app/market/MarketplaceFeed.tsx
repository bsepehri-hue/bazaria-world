import { Skeleton } from "@/app/components/ui/Skeleton";
import MarketplaceCard from "./MarketplaceCard";
import { getMarketplaceItems } from "./getMarketplaceItems";

export default async function MarketplaceFeed({ search, type }) {
  const items = await getMarketplaceItems(search, type);

  if (!items) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-64 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return <p className="text-gray-500">No items found.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {items.map((item) => (
        <MarketplaceCard key={item.id} item={item} />
      ))}
    </div>
  );
}
