import { db } from "@/lib/firebase/client";
import { doc, getDoc } from "firebase/firestore";
import { loadCategoryConfig } from "@/lib/categories/loader";
import SpecsPanel from "@/components/detail/SpecsPanel";
import DetailsSections from "@/components/detail/DetailsSections";

export default async function ListingDetailPage({ params }: any) {
  const { category, listingId } = params;

  // Load category-specific config
  const config = loadCategoryConfig(category);

  if (!config) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold">Unknown category</h1>
        <p>This category is not supported yet.</p>
      </div>
    );
  }

  const { specs, details } = config;

  // Fetch listing data
  const ref = doc(db, "listings", listingId);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold">Listing not found</h1>
        <p>This listing may have been removed.</p>
      </div>
    );
  }

  const listing = snap.data();

  return (
    <div className="p-6 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">

      {/* ⭐ Left: Main Content */}
      <div className="md:col-span-2 space-y-6">

        {/* Title */}
        <h1 className="text-3xl font-bold">{listing.title}</h1>

        {/* Price */}
        {listing.price && (
          <div className="text-2xl font-semibold text-teal-700">
            ${listing.price.toLocaleString()}
          </div>
        )}

        {/* Description */}
        {listing.description && (
          <p className="text-gray-700 leading-relaxed">{listing.description}</p>
        )}

        {/* Details Sections */}
        <DetailsSections sections={details} data={listing} />
      </div>

      {/* ⭐ Right: Specs Panel */}
      <div>
        <SpecsPanel specs={specs} data={listing} />
      </div>
    </div>
  );
}
