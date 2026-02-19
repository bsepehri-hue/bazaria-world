export default async function CarsPage() {
  const listings = await getListingsByCategory("cars");
  return <ListingGrid listings={listings} />;
}
