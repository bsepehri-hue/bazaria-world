import MarketplaceCard from "./MarketplaceCard";

const mockItems = [
  { id: "1", title: "Sample Listing", type: "listing" },
  { id: "2", title: "Sample Auction", type: "auction" },
  { id: "3", title: "Sample Storefront", type: "storefront" },
];

export default function MarketplaceFeed() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {mockItems.map((item) => (
        <MarketplaceCard key={item.id} item={item} />
      ))}
    </div>
  );
}
