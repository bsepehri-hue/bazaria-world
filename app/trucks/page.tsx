export default async function TrucksPage() {
  const listings = await getListingsByCategory("trucks");
  return <ListingGrid listings={listings} />;
}
