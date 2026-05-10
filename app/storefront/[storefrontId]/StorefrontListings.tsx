import Link from "next/link";

type Listing = {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
  condition: string;
  endsSoon?: boolean;
};

export function StorefrontListings({ listings }: { listings: Listing[] }) {
  if (!listings || listings.length === 0) {
    return (
      <div className="text-center text-gray-500 py-10">
        No active listings
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
      {listings.map((item) => (
        <Link
          key={item.id}
          href={`/listing/${item.id}`}
          className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
        >
          <div className="relative w-full h-40 bg-gray-100">
            <img
              src={item.imageUrl}
              alt={item.title}
              className="object-cover w-full h-full"
            />

            {item.endsSoon && (
              <span className="absolute top-2 left-2 bg-amber-600 text-white text-xs px-2 py-1 rounded">
                Ends Soon
              </span>
            )}
          </div>

          <div className="p-3">
            <h3 className="font-medium text-gray-900 truncate">{item.title}</h3>
            <p className="text-teal-700 font-semibold mt-1">
              ${item.price.toLocaleString()}
            </p>
            <p className="text-gray-500 text-sm">{item.condition}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
