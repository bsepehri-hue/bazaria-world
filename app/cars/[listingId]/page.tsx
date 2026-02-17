import ListingPageClient from "./ListingPageClient";

export default function ListingPage({ params }) {
  return <ListingPageClient listingId={params.listingId} />;
}
