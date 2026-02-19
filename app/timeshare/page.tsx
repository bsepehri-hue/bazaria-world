export default async function TimesharePage() {
  const listings = await getListingsByCategory("timeshare");
  return <ListingGrid listings={listings} />;
}
