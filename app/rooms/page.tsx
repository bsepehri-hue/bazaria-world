export default async function RoomsPage() {
  const listings = await getListingsByCategory("rooms");
  return <ListingGrid listings={listings} />;
}
