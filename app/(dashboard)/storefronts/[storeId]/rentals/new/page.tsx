"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/client";

import UploadListingImages from "@/components/UploadListingImages";

export default function AddRentalListingPage() {
  const params = useParams<{ storeId: string }>();

if (!params) {
  return <p className="p-6 text-gray-600">Loading…</p>;
}

const { storeId } = params;

const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  // Rental-specific fields
  const [beds, setBeds] = useState("");
  const [baths, setBaths] = useState("");
  const [sqft, setSqft] = useState("");
  const [lease, setLease] = useState("12-month");
  const [pets, setPets] = useState("pets-ok");
  const [parking, setParking] = useState("garage");
  const [utilities, setUtilities] = useState("none");
  const [type, setType] = useState("apartment");
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
      category: "rentals",
      title,
      description,
      price: Number(price),

      // Rental fields
      beds: Number(beds),
      baths: Number(baths),
      sqft: Number(sqft),
      lease,
      pets,
      parking,
      utilities,
      type,
      address,

      imageUrls,
      status: "active",
      createdAt: serverTimestamp(),
    });

    router.push(`/properties/rentals`);
  };

  return (
    <div className="space-y-10">
      <h1 className="text-3xl font-bold text-gray-900">Add Rental Listing</h1>

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

        {/* Beds */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Bedrooms</label>
          <input
            type="number"
            required
            value={beds}
            onChange={(e) => setBeds(e.target.value)}
            className="mt-2 w-full px-4 py-2 border rounded-lg"
          />
        </div>

        {/* Baths */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Bathrooms</label>
          <input
            type="number"
            required
            value={baths}
            onChange={(e) => setBaths(e.target.value)}
            className="mt-2 w-full px-4 py-2 border rounded-lg"
          />
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

        {/* Rental Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Rental Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="mt-2 w-full px-4 py-2 border rounded-lg"
          >
            <option value="apartment">Apartment</option>
            <option value="condo">Condo</option>
            <option value="townhouse">Townhouse</option>
            <option value="multi-unit">Multi‑Unit</option>
          </select>
        </div>

        {/* Images */}
        <UploadListingImages images={imageUrls} setImages={setImageUrls} />

        {/* Submit */}
        <button
          type="submit"
          className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
        >
          Create Rental Listing
        </button>
      </form>
    </div>
  );
}
