"use client";

import LandDetails from "@/components/listings/categories/land/LandDetails";

export default function LandListingDetailsPage({
  params,
}: {
  params: { listingId: string };
}) {
  return <LandDetails listingId={params.listingId} />;
}
