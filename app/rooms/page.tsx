import ListingGrid from "@/components/listings/ListingGrid";
import { getListingsByCategory } from "@/lib/listings";

export default async function RoomsPage() {
  const listings = await getListingsByCategory("rooms");
  return <ListingGrid listings={listings} />;
}
