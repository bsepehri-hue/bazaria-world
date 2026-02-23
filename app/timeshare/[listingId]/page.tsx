"use client";

import TimeshareDetails from "@/components/listings/categories/timeshare/TimeshareDetails";

export default function TimeshareListingDetailsPage({
  params,
}: {
  params: { listingId: string };
}) {
  return <TimeshareDetails listingId={params.listingId} />;
}
