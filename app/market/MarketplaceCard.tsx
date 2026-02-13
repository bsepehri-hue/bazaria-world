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
      <div className="bg-white rounded-xl shadow-sm border hover:shadow-md transition p-5">
        {item.thumbnail && (
          <img
            src={item.thumbnail}
            alt={item.title}
            className="rounded-lg mb-4 w-full h-40 object-cover"
          />
        )}

        <h2 className="text-lg font-semibold text-gray-900 mb-1">
          {item.title}
        </h2>

        <p className="text-sm text-gray-500 capitalize">
          {item.type}
        </p>
      </div>
    </Link>
  );
}
