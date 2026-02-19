import ListingGrid from "@/components/listings/ListingGrid";
import { getListingsByCategory } from "@/lib/listings";

export default async function CategoryPage() {
  const listings = await getListingsByCategory("rentals");
  return <ListingGrid listings={listings} />;
}
