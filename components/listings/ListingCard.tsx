"use client";

interface ListingCardProps {
  id: string;
  category: string;
  title: string;
  price: number;
  location: string;
  images?: string[];
  year?: string;
  make?: string;
  model?: string;
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
      href={`/listings/${category}/${id}`}
      className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition block"
    >
      {images?.[0] && (
        <img
          src={images[0]}
          className="w-full h-40 object-cover rounded mb-3"
        />
      )}

      <h2 className="text-lg font-medium">{title}</h2>

      <p className="text-gray-600 mt-1">
        ${price?.toLocaleString()}
      </p>

      {(year || make || model) && (
        <p className="text-gray-500 text-sm mt-1">
          {year} {make} {model}
        </p>
      )}

      <p className="text-gray-400 text-xs mt-2">{location}</p>

      <p className="text-gray-400 text-xs mt-1">
        Posted: {postedDate ? postedDate.toLocaleDateString() : "N/A"}
      </p>
    </a>
  );
}
