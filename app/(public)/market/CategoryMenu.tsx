import Link from "next/link";

const CATEGORIES = [
  "art",
  "cars",
  "pets",
  "rentals",
  "homes",
  "land",
  "motorcycles",
  "rooms",
  "rvs",
  "services",
  "timeshare",
  "trucks",
  "general",
];

export default function CategoryMenu() {
  return (
    <div className="flex flex-wrap gap-3 mb-6">
      {CATEGORIES.map((cat) => (
        <Link
          key={cat}
          href={`/market/${cat}`}
          className="px-4 py-2 rounded-lg text-sm font-medium border bg-gray-100 text-gray-800 hover:bg-gray-200"
        >
          {cat.charAt(0).toUpperCase() + cat.slice(1)}
        </Link>
      ))}
    </div>
  );
}
