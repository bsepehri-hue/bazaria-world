"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/client";

export default function NewTimeshareListingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const storeId = searchParams.get("storeId");

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [active, setActive] = useState(true);

  const [intervalType, setIntervalType] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [sleeps, setSleeps] = useState("");
  const [season, setSeason] = useState("");
  const [maintenanceFees, setMaintenanceFees] = useState<number | "">("");
  const [resortRating, setResortRating] = useState("");
  const [address, setAddress] = useState("");

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!storeId) {
      alert("Missing storeId");
      return;
    }

    const ref = collection(db, "listings");

    await addDoc(ref, {
      storeId,
      category: "timeshare",
      title,
      price: price === "" ? null : Number(price),
      description,
      images,
      active,
      intervalType,
      bedrooms,
      sleeps,
      season,
      maintenanceFees:
        maintenanceFees === "" ? null : Number(maintenanceFees),
      resortRating,
      address,
      createdAt: serverTimestamp(),
    });

    router.push(`/dashboard/storefronts/${storeId}/inventory`);
  };

  return (
    <div className="space-y-10">
      <h1 className="text-3xl font-bold text-gray-900">New Timeshare Listing</h1>

      <form
        onSubmit={handleCreate}
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
            className="mt-2 w-full px-4 py-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Price
          </label>
          <input
            type="number"
            value={price}
            onChange={(e) =>
              setPrice(e.target.value === "" ? "" : Number(e.target.value))
            }
            className="mt-2 w-full px-4 py-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-2 w-full px-4 py-2 border rounded-lg h-32 resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Images (comma-separated URLs)
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
            className="mt-2 w-full px-4 py-2 border rounded-lg h-24 resize-none"
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium">Interval Type</label>
            <input
              value={intervalType}
              onChange={(e) => setIntervalType(e.target.value)}
              className="mt-2 w-full px-4 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Bedrooms</label>
            <input
              value={bedrooms}
              onChange={(e) => setBedrooms(e.target.value)}
              className="mt-2 w-full px-4 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Sleeps</label>
            <input
              value={sleeps}
              onChange={(e) => setSleeps(e.target.value)}
              className="mt-2 w-full px-4 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Season</label>
            <input
              value={season}
              onChange={(e) => setSeason(e.target.value)}
              className="mt-2 w-full px-4 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">
              Maintenance Fees
            </label>
            <input
              type="number"
              value={maintenanceFees}
              onChange={(e) =>
                setMaintenanceFees(
                  e.target.value === "" ? "" : Number(e.target.value)
                )
              }
              className="mt-2 w-full px-4 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Resort Rating</label>
            <input
              value={resortRating}
              onChange={(e) => setResortRating(e.target.value)}
              className="mt-2 w-full px-4 py-2 border rounded-lg"
            />
          </div>

          <div className="col-span-full">
            <label className="block text-sm font-medium">Address</label>
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="mt-2 w-full px-4 py-2 border rounded-lg"
            />
          </div>
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
          Create Listing
        </button>
      </form>
    </div>
  );
}
