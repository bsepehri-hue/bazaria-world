"use client";

import CarDetails from "@/components/listings/categories/cars/CarDetails";

export default function CarListingDetailsPage({
  params,
}: {
  params: { listingId: string };
}) {
  return <CarDetails listingId={params.listingId} />;
}

