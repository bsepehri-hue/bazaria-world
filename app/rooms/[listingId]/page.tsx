"use client";

import RoomsDetails from "@/components/listings/categories/rooms/RoomsDetails";

export default function RoomListingDetailsPage({
  params,
}: {
  params: { listingId: string };
}) {
  return <RoomsDetails listingId={params.listingId} />;
}
