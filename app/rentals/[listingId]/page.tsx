"use client";

import RentalsDetails from "@/components/listings/categories/rentals/RentalsDetails";

export default function RentalListingDetailsPage({
  params,
}: {
  params: { listingId: string };
}) {
  return <RentalsDetails listingId={params.listingId} />;
}
