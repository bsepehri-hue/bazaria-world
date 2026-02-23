"use client";

import ServicesDetails from "@/components/listings/categories/services/ServicesDetails";

export default function ServiceListingDetailsPage({
  params,
}: {
  params: { listingId: string };
}) {
  return <ServicesDetails listingId={params.listingId} />;
}
