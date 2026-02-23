"use client";

import RvsDetails from "@/components/listings/categories/rvs/RvsDetails";

export default function RvListingDetailsPage({
  params,
}: {
  params: { listingId: string };
}) {
  return <RvsDetails listingId={params.listingId} />;
}
