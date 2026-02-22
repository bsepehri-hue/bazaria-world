"use client";

import PetsDetails from "@/components/listings/categories/pets/PetsDetails";

export default function PetListingDetailsPage({
  params,
}: {
  params: { listingId: string };
}) {
  return <PetsDetails listingId={params.listingId} />;
}
