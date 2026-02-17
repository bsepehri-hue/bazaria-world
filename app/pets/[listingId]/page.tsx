"use client";

import PetsDetails from "@/components/listings/categories/pets/PetsDetails";

export default function PetsListingDetailsPage({ params }) {
  return <PetsDetails listingId={params.listingId} />;
}
