import MarketplaceFeed from "./MarketplaceFeed";

export default function MarketPage({ searchParams }) {
  const search = searchParams?.q || "";

  return (
    <div className="p-8 bg-gray-50 min-h-[calc(100vh-64px)]">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-10">
        Marketplace
      </h1>

      <form className="mb-8">
        <input
          name="q"
          defaultValue={search}
          placeholder="Search listings, auctions, storefronts..."
          className="w-full p-3 border rounded-lg"
        />
      </form>

      <MarketplaceFeed search={search} />
    </div>
  );
}
