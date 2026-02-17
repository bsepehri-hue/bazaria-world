"use client";

import ArtDetails from "@/components/listings/categories/art/ArtDetails";

export default function ArtListingDetailsPage({ params }) {
  return <ArtDetails listingId={params.listingId} />;
}
