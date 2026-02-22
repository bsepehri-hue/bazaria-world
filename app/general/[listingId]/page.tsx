"use client";

import GeneralDetails from "@/components/listings/categories/general/GeneralDetails";

export default function GeneralListingDetailsPage({
  params,
}: {
  params: { listingId: string };
}) {
  return <GeneralDetails listingId={params.listingId} />;
}
