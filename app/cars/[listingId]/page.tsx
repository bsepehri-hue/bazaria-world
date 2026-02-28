"use client";

import { use } from "react";
import ListingDetails from "@/components/listings/ListingDetails";
import { getListing } from "@/lib/listings/getListing";

export default function CarListingDetailsPage({ params }: { params: Promise<{ listingId: string }> }) {
  const { listingId } = use(params);
  const listing = use(getListing(listingId));

  return <ListingDetails listing={listing} />;
}
