export default async function HomesPage() {
  const listings = await getListingsByCategory("homes");
  return <ListingGrid listings={listings} />;
}
