type ListingDetailsProps = {
  category: string;
  listingId: string;
};

export default function ListingDetails({ category, listingId }: ListingDetailsProps) {
  // TODO: replace with real data fetch later
  const mock = {
    title: "Test Item",
    price: 12000,
    year: 2015,
    make: "Toyota",
    model: "Camry",
    description: "Clean test vehicle for UI testing",
    postedAt: "2/9/2026",
    location: "Los Angeles, CA",
    sellerName: "Bazaria Seller",
    sellerSince: "2024",
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-white">
      {/* Breadcrumb */}
      <div className="text-sm text-zinc-400">
        <span className="uppercase tracking-wide text-xs text-emerald-400">
          {category}
        </span>{" "}
        · Listing #{listingId}
      </div>

      {/* Title + price */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{mock.title}</h1>
          <p className="text-zinc-400 mt-1">
            {mock.year} · {mock.make} · {mock.model}
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-semibold">${mock.price.toLocaleString()}</div>
          <div className="text-xs text-zinc-400 mt-1">Posted {mock.postedAt}</div>
        </div>
      </div>

      {/* Gallery placeholder */}
      <div className="aspect-video w-full rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 text-sm">
        Image gallery coming soon
      </div>

      {/* Meta grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-3">
          <div className="text-xs text-zinc-500">Year</div>
          <div className="font-medium">{mock.year}</div>
        </div>
        <div className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-3">
          <div className="text-xs text-zinc-500">Make</div>
          <div className="font-medium">{mock.make}</div>
        </div>
        <div className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-3">
          <div className="text-xs text-zinc-500">Model</div>
          <div className="font-medium">{mock.model}</div>
        </div>
        <div className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-3">
          <div className="text-xs text-zinc-500">Location</div>
          <div className="font-medium">{mock.location}</div>
        </div>
      </div>

      {/* Description + seller */}
      <div className="grid md:grid-cols-[2fr,1fr] gap-6">
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-zinc-200">Description</h2>
          <p className="text-sm text-zinc-300 leading-relaxed">
            {mock.description}
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-zinc-200">Seller</h2>
          <div className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-4 space-y-2">
            <div className="font-medium">{mock.sellerName}</div>
            <div className="text-xs text-zinc-400">
              Member since {mock.sellerSince}
            </div>
            <button className="mt-2 w-full rounded-md bg-emerald-500/90 hover:bg-emerald-400 text-sm font-medium py-2 text-black">
              Contact seller
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
