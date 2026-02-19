export default async function ServicesPage() {
  const listings = await getListingsByCategory("services");
  return <ListingGrid listings={listings} />;
}
