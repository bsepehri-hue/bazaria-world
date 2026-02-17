import ListingPageClient from "./ListingPageClient";

export default async function ListingPage({ params }) {
  const { listingId } = await params;

 return (
  <div className="p-6 space-y-6">

    <div>
      <h1 className="text-2xl font-bold">{listing.title}</h1>

      {listing.createdAt && (
        <p className="text-gray-500 text-sm mt-1">
          Created: {listing.createdAt.toLocaleString()}
        </p>
      )}
    </div>

    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <p><strong>Make:</strong> {listing.make}</p>
        <p><strong>Model:</strong> {listing.model}</p>
        <p><strong>Year:</strong> {listing.year}</p>
        <p><strong>Odometer:</strong> {listing.odometer}</p>
        <p><strong>VIN:</strong> {listing.vin}</p>
      </div>

      <div className="space-y-2">
        <p><strong>Price:</strong> ${listing.price}</p>
        <p><strong>Status:</strong> {listing.status}</p>
        <p><strong>Category:</strong> {listing.category}</p>
      </div>
    </div>

    <div>
      <h2 className="text-lg font-semibold">Description</h2>
      <p className="mt-2 text-gray-700">{listing.description}</p>
    </div>

  </div>
);
