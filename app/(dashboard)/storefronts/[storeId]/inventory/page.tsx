"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { collection, query, where, getDocs, doc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import Image from "next/image";

export default function StorefrontInventoryPage() {
  const params = useParams<{ storeId: string }>();
  const { storeId } = params;

  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const ref = collection(db, "listings");
      const q = query(ref, where("storeId", "==", storeId));
      const snap = await getDocs(q);

      const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setListings(items);
      setLoading(false);
    };

    load();
  }, [storeId]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this listing?")) return;

    await deleteDoc(doc(db, "listings", id));
    setListings((prev) => prev.filter((l) => l.id !== id));
  };

  if (loading) {
    return <p className="p-6 text-gray-600">Loading inventory…</p>;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Inventory</h1>

        <button
          onClick={() => router.push(`/dashboard/listings/new?storeId=${storeId}`)}
          className="px-5 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
        >
          Add New Listing
        </button>
      </div>

      {listings.length === 0 && (
        <p className="text-gray-500">No listings yet. Create your first one.</p>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {listings.map((item) => (
          <div
            key={item.id}
            className="border rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition"
          >
            {item.images?.[0] && (
              <div className="relative w-full h-40">
                <Image
                  src={item.images[0]}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            <div className="p-4 space-y-2">
              <p className="font-medium truncate">{item.title}</p>

              {item.price !== undefined && (
                <p className="text-gray-700 text-sm">${item.price}</p>
              )}

              <p
                className={`text-xs font-medium ${
                  item.active ? "text-green-600" : "text-gray-500"
                }`}
              >
                {item.active ? "Active" : "Inactive"}
              </p>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() =>
                    router.push(`/dashboard/listings/${item.id}/edit`)
                  }
                  className="text-sm text-blue-600 hover:underline"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-sm text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
