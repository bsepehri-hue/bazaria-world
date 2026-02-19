import ListingGrid from "@/components/listings/ListingGrid";
import { getListingsByCategory } from "@/lib/listings";

export default async function LandPage() {
  const listings = await getListingsByCategory("motorcycles");
  return <ListingGrid listings={listings} />;
}
