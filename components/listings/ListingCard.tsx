"use client";

interface ListingCardProps {
  id: string;
  category: string;
  title: string;
  price: number;
  location: string;
  images?: string[];
  year?: string | number;
  make?: string;
  model?: string;
  mileage?: number;
  description?: string;
  createdAt?: any; // Firestore Timestamp or Date
}

export default function ListingCard({
  id,
  category,
  title,
  price,
  location,
  images,
  year,
  make,
  model,
  mileage,
  description,
  createdAt,
}: ListingCardProps) {
  // Convert Firestore Timestamp → JS Date
  const postedDate =
    createdAt?.toDate
      ? createdAt.toDate()
      : createdAt
      ? new Date(createdAt)
      : null;

  return (
    <a
      href={`/${category}/${id}`}
      className="border rounded-xl p-4 bg-white shadow-sm hover:shadow-md transition block overflow-hidden"
    >
      {/* Image */}
      {images?.[0] && (
        <img
          src={images[0]}
          className="w-full h-48 object-cover rounded mb-3"
        />
      )}

      {/* Title */}
      <h2 className="text-lg font-semibold text-gray-900 line-clamp-1">
        {title}
      </h2>

      {/* Price */}
      <p className="text-indigo-600 font-bold mt-1">
        ${price?.toLocaleString()}
      </p>

      {/* Vehicle fields */}
      {(year || make || model || mileage) && (
        <div className="text-sm text-gray-600 space-y-1 mt-2">
          {year && <p><span className="font-medium">Year:</span> {year}</p>}
          {make && <p><span className="font-medium">Make:</span> {make}</p>}
          {model && <p><span className="font-medium">Model:</span> {model}</p>}
          {mileage !== undefined && (
            <p>
              <span className="font-medium">Mileage:</span>{" "}
              {mileage.toLocaleString()} km
            </p>
          )}
        </div>
      )}

      {/* Description preview */}
      {description && (
        <p className="text-sm text-gray-500 mt-2 line-clamp-2">
          {description}
        </p>
      )}

      {/* Location */}
      <p className="text-gray-400 text-xs mt-2">{location}</p>

      {/* Posted date */}
      <p className="text-gray-400 text-xs mt-1">
        Posted: {postedDate ? postedDate.toLocaleDateString() : "N/A"}
      </p>
    </a>
  );
}
