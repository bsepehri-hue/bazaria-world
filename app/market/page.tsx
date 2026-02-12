import MarketplaceFeed from "./MarketplaceFeed";

export default function MarketPage() {
  return (
    <div className="p-8 bg-gray-50 min-h-[calc(100vh-64px)]">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-10">
        Marketplace
      </h1>

      <MarketplaceFeed />
    </div>
  );
}
