export default async function RvsPage() {
  const listings = await getListingsByCategory("rvs");
  return <ListingGrid listings={listings} />;
}
