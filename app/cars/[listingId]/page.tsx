"use client";

import { use } from "react";
import CarDetails from "@/components/listings/categories/cars/CarDetails";

export default function CarListingDetailsPage({ params }: { params: Promise<{ listingId: string }> }) {
  const { listingId } = use(params);

  return <CarDetails listingId={listingId} />;
}
