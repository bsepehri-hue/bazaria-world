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
      <div className="bg-white rounded-xl shadow-sm border hover:shadow-md transition p-5 overflow-hidden">
        
        {/* Image */}
        {item.thumbnail || item.imageUrls?.[0] ? (
          <img
            src={item.thumbnail || item.imageUrls[0]}
            alt={item.title}
            className="rounded-lg mb-4 w-full h-40 object-cover"
          />
        ) : null}

        {/* Title */}
        <h2 className="text-lg font-semibold text-gray-900 mb-1">
          {item.title}
        </h2>

        {/* Price */}
        {item.price !== undefined && (
          <p className="text-indigo-600 font-bold mb-2">
            ${item.price.toLocaleString()}
          </p>
        )}

        {/* Vehicle fields */}
        {(item.year || item.make || item.model || item.mileage) && (
          <div className="text-sm text-gray-600 space-y-1 mb-2">
            {item.year && <p><strong>Year:</strong> {item.year}</p>}
            {item.make && <p><strong>Make:</strong> {item.make}</p>}
            {item.model && <p><strong>Model:</strong> {item.model}</p>}
            {item.mileage !== undefined && (
              <p>
                <strong>Mileage:</strong> {item.mileage.toLocaleString()} km
              </p>
            )}
          </div>
        )}

        {/* Description preview */}
        {item.description && (
          <p className="text-sm text-gray-500 line-clamp-2 mb-2">
            {item.description}
          </p>
        )}

        {/* Location */}
        {item.location && (
          <p className="text-gray-400 text-xs">{item.location}</p>
        )}

        {/* Posted date */}
        {item.createdAt && (
          <p className="text-gray-400 text-xs mt-1">
            Posted:{" "}
            {item.createdAt.toDate
              ? item.createdAt.toDate().toLocaleDateString()
              : "N/A"}
          </p>
        )}
      </div>
    </Link>
  );
}
