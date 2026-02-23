"use client";

import TrucksDetails from "@/components/listings/categories/trucks/TrucksDetails";

export default function TruckListingDetailsPage({
  params,
}: {
  params: { listingId: string };
}) {
  return <TrucksDetails listingId={params.listingId} />;
}
