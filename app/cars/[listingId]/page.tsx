import { use } from "react";
import ListingDetails from "@/components/listings/ListingDetails";

export default function CarListingDetailsPage({
  params,
}: {
  params: Promise<{ listingId: string }>;
}) {
  const { listingId } = use(params);

  return <ListingDetails category="Cars" listingId={listingId} />;
}
