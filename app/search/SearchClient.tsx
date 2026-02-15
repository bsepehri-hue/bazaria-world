"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { db } from "@/lib/firebase/client";
import { collection, getDocs } from "firebase/firestore";
import Link from "next/link";

export default function GlobalSearchPage() {
  const params = useSearchParams();
  const query = params ? params.get("q")?.toLowerCase() ?? "" : "";

  const [results, setResults] = useState<any[]>([]);

  useEffect(() => {
    const runSearch = async () => {
      if (!query.trim()) return;

      const ref = collection(db, "listings");
      const snap = await getDocs(ref);

      const matches: any[] = [];

      snap.forEach((doc) => {
        const data = doc.data();
        const haystack = JSON.stringify(data).toLowerCase();

        if (haystack.includes(query)) {
          matches.push({ id: doc.id, ...data });
        }
      });

      setResults(matches);
    };

    runSearch();
  }, [query]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold mb-4">
        Search Results for: <span className="text-teal-700">{query}</span>
      </h1>

      {results.length === 0 && (
        <p>No results found. Try a different search.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {results.map((item) => (
          <Link
            key={item.id}
            href={`/${item.category}/${item.id}`}
            className="border p-4 rounded hover:bg-gray-50"
          >
            <h2 className="text-xl font-semibold">{item.title}</h2>

            <p className="text-teal-700 font-medium">
              ${item.price?.toLocaleString()}
            </p>

            <p className="text-gray-600 capitalize">{item.category}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
