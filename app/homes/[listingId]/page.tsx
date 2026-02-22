"use client";

import HomesDetails from "@/components/listings/categories/homes/HomesDetails";

export default function HomesListingDetailsPage({
  params,
}: {
  params: { listingId: string };
}) {
  return <HomesDetails listingId={params.listingId} />;
}
