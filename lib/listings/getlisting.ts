export default function ListingDetails({ listing }: { listing: any }) {
  if (!listing) {
    return (
      <div className="text-center text-zinc-400 py-20">
        Listing not found.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-white">
      <div className="text-sm text-zinc-400">
        <span className="uppercase tracking-wide text-xs text-emerald-400">
          {listing.category}
        </span>{" "}
        · Listing #{listing.id}
      </div>

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{listing.title}</h1>
          {listing.year && listing.make && listing.model && (
            <p className="text-zinc-400 mt-1">
              {listing.year} · {listing.make} · {listing.model}
            </p>
          )}
        </div>

        <div className="text-right">
          <div className="text-2xl font-semibold">
            ${listing.price?.toLocaleString()}
          </div>
          <div className="text-xs text-zinc-400 mt-1">
            Posted {listing.createdAt}
          </div>
        </div>
      </div>

      <div className="aspect-video w-full rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 text-sm">
        {listing.images?.length ? "Gallery coming soon" : "No images"}
      </div>

      <div className="grid md:grid-cols-[2fr,1fr] gap-6">
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-zinc-200">Description</h2>
          <p className="text-sm text-zinc-300 leading-relaxed">
            {listing.description}
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-zinc-200">Seller</h2>
          <div className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-4 space-y-2">
            <div className="font-medium">{listing.sellerName}</div>
            <div className="text-xs text-zinc-400">
              Member since {listing.sellerSince}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
