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
    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
  />
</form>
      <div className="flex gap-3 mb-8">
  <a href="?type=listing" className="px-4 py-2 bg-white border rounded-lg shadow-sm hover:bg-gray-50">
    Listings
  </a>
  <a href="?type=auction" className="px-4 py-2 bg-white border rounded-lg shadow-sm hover:bg-gray-50">
    Auctions
  </a>
  <a href="?type=storefront" className="px-4 py-2 bg-white border rounded-lg shadow-sm hover:bg-gray-50">
    Storefronts
  </a>
</div>

      <MarketplaceFeed search={search} />
    </div>
  );
}
