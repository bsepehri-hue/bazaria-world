import { db } from "@/lib/firebase/client";
import { doc, getDoc } from "firebase/firestore";
import { loadCategoryConfig } from "@/lib/categories/loader";

import ImageGallery from "@/components/detail/ImageGallery";
import SpecsPanel from "@/components/detail/SpecsPanel";
import DetailsSections from "@/components/detail/DetailsSections";
import SellerBlock from "@/components/detail/SellerBlock";

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

  // Fetch listing
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
    <div className="p-6 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">

      {/* ⭐ LEFT COLUMN — Gallery + Title + Description + Details */}
      <div className="md:col-span-2 space-y-8">

        {/* Image Gallery */}
        <ImageGallery images={listing.imageUrls || []} />

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
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
            {listing.description}
          </p>
        )}

        {/* Category-Specific Details */}
        <DetailsSections sections={details} data={listing} />
      </div>

      {/* ⭐ RIGHT COLUMN — Specs + Seller Block */}
      <div className="space-y-6">

        {/* Specs Panel */}
        <SpecsPanel specs={specs} data={listing} />

        {/* Seller Block */}
        <SellerBlock sellerId={listing.storeId} />
      </div>
    </div>
  );
}
