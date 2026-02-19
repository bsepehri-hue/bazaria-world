import ListingGrid from "@/components/listings/ListingGrid";
import { getListingsByCategory } from "@/lib/listings";

export default async function CategoryPage() {
  const listings = await getListingsByCategory("pets");
  return <ListingGrid listings={listings} />;
}


