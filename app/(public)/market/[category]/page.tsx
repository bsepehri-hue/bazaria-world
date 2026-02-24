import MarketplaceFeed from "@/app/market/MarketplaceFeed";

export default function CategoryPage({ params }) {
  return <MarketplaceFeed category={params.category} />;
}
