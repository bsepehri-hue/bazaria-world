"use client";

import MotorcycleDetails from "@/components/listings/categories/motorcycles/MotorcycleDetails";

export default function MotorcycleListingDetailsPage({
  params,
}: {
  params: { listingId: string };
}) {
  return <MotorcycleDetails listingId={params.listingId} />;
}
