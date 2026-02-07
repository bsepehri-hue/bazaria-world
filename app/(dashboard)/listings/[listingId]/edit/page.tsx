"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import Image from "next/image";

export default function EditListingPage() {
  const params = useParams<{ listingId: string }>();
  const { listingId } = params;

  const router = useRouter();

  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [active, setActive] = useState(true);

  useEffect(() => {
    const load = async () => {
      const ref = doc(db, "listings", listingId);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const data = snap.data();

        setTitle(data.title || "");
        setPrice(data.price ?? "");
        setDescription(data.description || "");
        setImages(data.images || []);
        setActive(data.active ?? true);
      }

      setLoading(false);
    };

    load();
  }, [listingId]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    const ref = doc(db, "listings", listingId);

    await updateDoc(ref, {
      title,
      price: price === "" ? null : Number(price),
      description,
      images,
      active,
    });

    router.push(`/dashboard/storefronts/${params.storeId}/inventory`);
  };

  if (loading) {
    return <p className="p-6 text-gray-600">Loading listing…</p>;
  }

  return (
    <div className="space-y-10">
      <h1 className="text-3xl font-bold text-gray-900">Edit Listing</h1>

      <form
        onSubmit={handleSave}
        className="bg-white p-8 rounded-xl shadow border space-y-6"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-2 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-600 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Price
          </label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value === "" ? "" : Number(e.target.value))}
            className="mt-2 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-600 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-2 w-full px-4 py-2 border rounded-lg h-32 resize-none focus:ring-2 focus:ring-teal-600 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Images (comma‑separated URLs)
          </label>
          <textarea
            value={images.join(",")}
            onChange={(e) =>
              setImages(
                e.target.value
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean)
              )
            }
            className="mt-2 w-full px-4 py-2 border rounded-lg h-24 resize-none focus:ring-2 focus:ring-teal-600 focus:outline-none"
          />

          {images.length > 0 && (
            <div className="grid grid-cols-3 gap-3 mt-4">
              {images.map((img, i) => (
                <div key={i} className="relative w-full h-24 rounded overflow-hidden border">
                  <Image src={img} alt="" fill className="object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={active}
            onChange={(e) => setActive(e.target.checked)}
          />
          <label className="text-sm text-gray-700">Active Listing</label>
        </div>

        <button
          type="submit"
          className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition font-medium"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
