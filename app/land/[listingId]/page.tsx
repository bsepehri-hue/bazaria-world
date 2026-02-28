"use client";

import { use } from "react";
import ListingDetails from "@/components/listings/ListingDetails";

export default function LandListingDetailsPage({
  params,
}: {
  params: Promise<{ listingId: string }>;
}) {
  const { listingId } = use(params);

  return <ListingDetails category="Land" listingId={listingId} />;
}
