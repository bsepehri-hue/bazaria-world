import { db } from "@/app/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export default async function ListingDetailPage({ params }) {
  const { id } = params;

  const snap = await getDoc(doc(db, "listings", id));

  if (!snap.exists()) {
    return <div className="p-8">Listing not found.</div>;
  }

  const listing = snap.data();

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{listing.title}</h1>

      <p className="text-xl font-semibold text-teal-700 mb-6">
        ${listing.price}
      </p>

      {listing.images?.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
          {listing.images.map((url) => (
            <img
              key={url}
              src={url}
              className="rounded-lg object-cover w-full h-40"
            />
          ))}
        </div>
      )}

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Description</h2>
        <p className="text-gray-700 whitespace-pre-line">
          {listing.description}
        </p>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Category</h2>
        <p className="capitalize text-gray-700">{listing.category}</p>
      </div>

      {listing.details && (
        <div className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold">Details</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Object.entries(listing.details).map(([key, value]) => (
              <div key={key} className="p-4 bg-gray-50 rounded border">
                <p className="text-sm text-gray-500 capitalize">{key}</p>
                <p className="text-lg font-medium">{value}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
