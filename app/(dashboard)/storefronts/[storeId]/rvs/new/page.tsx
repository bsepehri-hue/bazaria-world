"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import UploadListingImages from "@/components/UploadListingImages";

export default function AddRVListingPage() {
 const params = useParams<{ storeId: string }>();

if (!params) {
  return <p className="p-6 text-gray-600">Loading…</p>;
}

const { storeId } = params;

const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  // RV‑specific fields
  const [rvType, setRvType] = useState("travel-trailer");
  const [rvDrive, setRvDrive] = useState("towable");
  const [sleeps, setSleeps] = useState("");
  const [length, setLength] = useState("");
  const [weight, setWeight] = useState("");
  const [slideouts, setSlideouts] = useState("");
  const [fuel, setFuel] = useState("");
  const [year, setYear] = useState("");
  const [mileage, setMileage] = useState("");

  const [imageUrls, setImageUrls] = useState<string[]>([]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (imageUrls.length === 0) {
      alert("Please upload at least one image.");
      return;
    }

    await addDoc(collection(db, "listings"), {
      storeId,
      category: "rvs",
      title,
      description,
      price: Number(price),

      // RV fields
      rvType,
      rvDrive,
      sleeps: Number(sleeps),
      length: Number(length),
      weight: Number(weight),
      slideouts: Number(slideouts),
      fuel,
      year: Number(year),
      mileage: Number(mileage),

      imageUrls,
      status: "active",
      createdAt: serverTimestamp(),
    });

    router.push(`/storefronts/${storeId}/rvs`);
  };

  return (
    <div className="space-y-10">
      <h1 className="text-3xl font-bold text-gray-900">Add RV Listing</h1>

      <form
        onSubmit={handleCreate}
        className="bg-white p-8 rounded-xl shadow border space-y-6"
      >
        {/* Title */}
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

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-2 w-full px-4 py-2 border rounded-lg h-32 resize-none"
          />
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Price (USD)
          </label>
          <input
            type="number"
            required
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="mt-2 w-full px-4 py-2 border rounded-lg"
          />
        </div>

        {/* RV Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            RV Type
          </label>
          <select
            value={rvType}
            onChange={(e) => setRvType(e.target.value)}
            className="mt-2 w-full px-4 py-2 border rounded-lg"
          >
            <option value="travel-trailer">Travel Trailer</option>
            <option value="fifth-wheel">Fifth Wheel</option>
            <option value="toy-hauler">Toy Hauler</option>
            <option value="pop-up">Pop-Up</option>
            <option value="teardrop">Teardrop</option>
            <option value="class-a">Class A</option>
            <option value="class-b">Class B</option>
            <option value="class-c">Class C</option>
            <option value="super-c">Super C</option>
            <option value="truck-camper">Truck Camper</option>
            <option value="overland">Overland Rig</option>
          </select>
        </div>

        {/* Towable vs Motorized */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Towable / Motorized
          </label>
          <select
            value={rvDrive}
            onChange={(e) => setRvDrive(e.target.value)}
            className="mt-2 w-full px-4 py-2 border rounded-lg"
          >
            <option value="towable">Towable</option>
            <option value="motorized">Motorized</option>
          </select>
        </div>

        {/* Sleeps */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Sleeps
          </label>
          <input
            type="number"
            value={sleeps}
            onChange={(e) => setSleeps(e.target.value)}
            className="mt-2 w-full px-4 py-2 border rounded-lg"
          />
        </div>

        {/* Length */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Length (ft)
          </label>
          <input
            type="number"
            value={length}
            onChange={(e) => setLength(e.target.value)}
            className="mt-2 w-full px-4 py-2 border rounded-lg"
          />
        </div>

        {/* Weight */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Weight (lbs)
          </label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="mt-2 w-full px-4 py-2 border rounded-lg"
          />
        </div>

        {/* Slide-outs */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Slide-Outs
          </label>
          <input
            type="number"
            value={slideouts}
            onChange={(e) => setSlideouts(e.target.value)}
            className="mt-2 w-full px-4 py-2 border rounded-lg"
          />
        </div>

        {/* Fuel */}
        {rvDrive === "motorized" && (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Fuel Type
            </label>
            <select
              value={fuel}
              onChange={(e) => setFuel(e.target.value)}
              className="mt-2 w-full px-4 py-2 border rounded-lg"
            >
              <option value="">Select</option>
              <option value="gas">Gas</option>
              <option value="diesel">Diesel</option>
            </select>
          </div>
        )}

        {/* Year */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Year
          </label>
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="mt-2 w-full px-4 py-2 border rounded-lg"
          />
        </div>

        {/* Mileage */}
        {rvDrive === "motorized" && (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Mileage
            </label>
            <input
              type="number"
              value={mileage}
              onChange={(e) => setMileage(e.target.value)}
              className="mt-2 w-full px-4 py-2 border rounded-lg"
            />
          </div>
        )}

        {/* Images */}
        <UploadListingImages images={imageUrls} setImages={setImageUrls} />

        {/* Submit */}
        <button
          type="submit"
          className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
        >
          Create RV Listing
        </button>
      </form>
    </div>
  );
}
