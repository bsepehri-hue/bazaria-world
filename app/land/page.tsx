import ListingGrid from "@/components/listings/ListingGrid";
import { getListingsByCategory } from "@/lib/listings";

export default async function LandPage() {
  const listings = await getListingsByCategory("land");
  return <ListingGrid listings={listings} />;
}
