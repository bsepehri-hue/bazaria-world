export default function ArtLandingPage() {
  return (
    <div className="p-6 space-y-10">
      {/* Hero Section */}
      <section className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Art & Collectibles</h1>
        <p className="text-gray-600 max-w-xl mx-auto">
          Discover original works, curated pieces, and timeless creations from
          artists, makers, and collectors. Paintings, sculpture, ceramics,
          glasswork, antiques, and more — all in one world.
        </p>
      </section>

      {/* Medium Grid */}
      <section className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[
          { label: "Paintings", value: "painting" },
          { label: "Sculpture", value: "sculpture" },
          { label: "Metalwork", value: "metal" },
          { label: "Clay & Ceramics", value: "clay" },
          { label: "Glasswork", value: "glass" },
          { label: "Photography", value: "photography" },
          { label: "Mixed Media", value: "mixed" },
          { label: "Textile Art", value: "textile" },
          { label: "Antiques", value: "antique" },
        ].map((item) => (
          <a
            key={item.value}
            href={`/marketplace?category=art&medium=${item.value}`}
            className="border rounded-lg p-4 text-center bg-white shadow-sm hover:shadow-md transition"
          >
            <div className="font-medium">{item.label}</div>
          </a>
        ))}
      </section>

      {/* Call to Action */}
      <section className="text-center pt-4">
        <a
          href="/create?category=art"
          className="inline-block bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition"
        >
          List an Artwork
        </a>
      </section>
    </div>
  );
}
