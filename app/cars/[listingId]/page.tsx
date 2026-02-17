import ListingPageClient from "./ListingPageClient";

export default async function ListingPage({ params }) {
  const { listingId } = await params;

  return <ListingPageClient listingId={listingId} />;
}
