"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/client";

import UploadListingImages from "@/components/UploadListingImages";

export default function AddRoomListingPage() {
 const params = useParams<{ storeId: string }>();

if (!params) {
  return <p className="p-6 text-gray-600">Loading…</p>;
}

const { storeId } = params;

const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  // Room-specific fields
  const [roomType, setRoomType] = useState("private");
  const [bathType, setBathType] = useState("private");
  const [sqft, setSqft] = useState("");
  const [lease, setLease] = useState("12-month");
  const [pets, setPets] = useState("pets-ok");
  const [parking, setParking] = useState("street");
  const [utilities, setUtilities] = useState("some");
  const [address, setAddress] = useState("");

  const [imageUrls, setImageUrls] = useState<string[]>([]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (imageUrls.length === 0) {
      alert("Please upload at least one image.");
      return;
    }

    await addDoc(collection(db, "listings"), {
      storeId,
      category: "rooms",
      title,
      description,
      price: Number(price),

      // Room fields
      roomType,
      bathType,
      sqft: Number(sqft),
      lease,
      pets,
      parking,
      utilities,
      address,

      imageUrls,
      status: "active",
      createdAt: serverTimestamp(),
    });

    router.push(`/properties/rooms`);
  };

  return (
    <div className="space-y-10">
      <h1 className="text-3xl font-bold text-gray-900">Add Room Listing</h1>

      <form
        onSubmit={handleCreate}
        className="bg-white p-8 rounded-xl shadow border space-y-6"
      >
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-2 w-full px-4 py-2 border rounded-lg"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-2 w-full px-4 py-2 border rounded-lg h-32 resize-none"
          />
        </div>

        {/* Monthly Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Monthly Price (USD)</label>
          <input
            type="number"
            required
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="mt-2 w-full px-4 py-2 border rounded-lg"
          />
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Address</label>
          <input
            type="text"
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="mt-2 w-full px-4 py-2 border rounded-lg"
          />
        </div>

        {/* Room Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Room Type</label>
          <select
            value={roomType}
            onChange={(e) => setRoomType(e.target.value)}
            className="mt-2 w-full px-4 py-2 border rounded-lg"
          >
            <option value="private">Private Room</option>
            <option value="shared">Shared Room</option>
          </select>
        </div>

        {/* Bathroom Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Bathroom Type</label>
          <select
            value={bathType}
            onChange={(e) => setBathType(e.target.value)}
            className="mt-2 w-full px-4 py-2 border rounded-lg"
          >
            <option value="private">Private Bathroom</option>
            <option value="shared">Shared Bathroom</option>
          </select>
        </div>

        {/* Sqft */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Square Feet</label>
          <input
            type="number"
            required
            value={sqft}
            onChange={(e) => setSqft(e.target.value)}
            className="mt-2 w-full px-4 py-2 border rounded-lg"
          />
        </div>

        {/* Lease Length */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Lease Length</label>
          <select
            value={lease}
            onChange={(e) => setLease(e.target.value)}
            className="mt-2 w-full px-4 py-2 border rounded-lg"
          >
            <option value="month-to-month">Month‑to‑Month</option>
            <option value="6-month">6‑Month</option>
            <option value="12-month">12‑Month</option>
            <option value="long-term">Long‑Term</option>
          </select>
        </div>

        {/* Pet Policy */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Pet Policy</label>
          <select
            value={pets}
            onChange={(e) => setPets(e.target.value)}
            className="mt-2 w-full px-4 py-2 border rounded-lg"
          >
            <option value="no-pets">No Pets</option>
            <option value="cats-ok">Cats OK</option>
            <option value="dogs-ok">Dogs OK</option>
            <option value="pets-ok">Pets Allowed</option>
          </select>
        </div>

        {/* Parking */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Parking</label>
          <select
            value={parking}
            onChange={(e) => setParking(e.target.value)}
            className="mt-2 w-full px-4 py-2 border rounded-lg"
          >
            <option value="garage">Garage</option>
            <option value="carport">Carport</option>
            <option value="street">Street Parking</option>
          </select>
        </div>

        {/* Utilities Included */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Utilities Included</label>
          <select
            value={utilities}
            onChange={(e) => setUtilities(e.target.value)}
            className="mt-2 w-full px-4 py-2 border rounded-lg"
          >
            <option value="none">None</option>
            <option value="some">Some Included</option>
            <option value="all">All Included</option>
          </select>
        </div>

        {/* Images */}
        <UploadListingImages images={imageUrls} setImages={setImageUrls} />

        {/* Submit */}
        <button
          type="submit"
          className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
        >
          Create Room Listing
        </button>
      </form>
    </div>
  );
}
