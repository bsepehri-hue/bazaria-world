import Link from "next/link";

export default function MarketplaceCard({ item }) {
  const href =
    item.type === "listing"
      ? `/listing/${item.id}`
      : item.type === "auction"
      ? `/auction/${item.id}`
      : `/storefront/${item.id}`;

  return (
    <Link href={href}>
      <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition">
        <h2 className="text-xl font-semibold mb-2">{item.title}</h2>
        <p className="text-gray-500 capitalize">{item.type}</p>
      </div>
    </Link>
  );
}
