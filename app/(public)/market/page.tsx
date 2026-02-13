export default function MarketPage() {
  return (
    <div className="p-6 max-w-6xl mx-auto">

      {/* ⭐ Hero */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-2">Where joy becomes treasure.</h1>
        <input
          type="text"
          placeholder="Search listings..."
          className="w-full p-3 border rounded-lg"
        />
      </div>

      {/* ⭐ Categories */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Browse Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {["Electronics", "Home", "Fashion", "Sports", "Toys", "Vehicles"].map(
            (cat) => (
              <div
                key={cat}
                className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
              >
                {cat}
              </div>
            )
          )}
        </div>
      </section>

      {/* ⭐ Featured Listings */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Featured Listings</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="border rounded-lg p-3 h-40 bg-gray-100" />
          ))}
        </div>
      </section>

      {/* ⭐ Recently Added */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Recently Added</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="border rounded-lg p-3 h-40 bg-gray-100" />
          ))}
        </div>
      </section>
    </div>
  );
}
