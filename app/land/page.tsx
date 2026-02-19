export default async function LandPage() {
  const listings = await getListingsByCategory("land");
  return <ListingGrid listings={listings} />;
}
