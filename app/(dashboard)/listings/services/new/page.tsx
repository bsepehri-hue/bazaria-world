"use client";

import { useState } from "react";
import { db } from "@/lib/firebase/client";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function NewServiceListingPage() {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [serviceType, setServiceType] = useState("general");
  const [experience, setExperience] = useState("");
  const [availability, setAvailability] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addDoc(collection(db, "listings"), {
        title,
        price: Number(price),
        serviceType,
        experience: experience || null,
        availability,
        location,
        description,
        category: "services",
        createdAt: serverTimestamp(),
      });

      setLoading(false);
      alert("Listing created!");
    } catch (err) {
      console.error(err);
      setLoading(false);
      alert("Error creating listing.");
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Create Service Listing</h1>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Title */}
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            className="w-full border p-2 rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium mb-1">Price (Hourly or Flat)</label>
          <input
            type="number"
            className="w-full border p-2 rounded"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>

        {/* Service Type */}
        <div>
          <label className="block text-sm font-medium mb-1">Service Type</label>
          <select
            className="w-full border p-2 rounded"
            value={serviceType}
            onChange={(e) => setServiceType(e.target.value)}
          >
            <option value="general">General</option>
            <option value="cleaning">Cleaning</option>
            <option value="moving">Moving</option>
            <option value="repair">Repair</option>
            <option value="tutoring">Tutoring</option>
            <option value="photography">Photography</option>
            <option value="beauty">Beauty</option>
            <option value="landscaping">Landscaping</option>
            <option value="freelance">Freelance</option>
          </select>
        </div>

        {/* Experience (optional) */}
        <div>
          <label className="block text-sm font-medium mb-1">Experience (Optional)</label>
          <input
            className="w-full border p-2 rounded"
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            placeholder="e.g., 5 years"
          />
        </div>

        {/* Availability */}
        <div>
          <label className="block text-sm font-medium mb-1">Availability</label>
          <input
            className="w-full border p-2 rounded"
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
            required
            placeholder="e.g., Weekdays, Weekends, Evenings"
          />
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium mb-1">Location</label>
          <input
            className="w-full border p-2 rounded"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            className="w-full border p-2 rounded h-28"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700"
        >
          {loading ? "Creating..." : "Create Listing"}
        </button>

      </form>
    </div>
  );
}
