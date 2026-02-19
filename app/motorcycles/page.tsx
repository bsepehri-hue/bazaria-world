export default async function MotorcyclesPage() {
  const listings = await getListingsByCategory("motorcycles");
  return <ListingGrid listings={listings} />;
}
