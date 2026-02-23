"use client";

import { useState } from "react";
import { db, storage } from "@/lib/firebase/client";
import {
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

export default function ArtForm() {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [medium, setMedium] = useState("");
  const [dimensions, setDimensions] = useState("");
  const [yearCreated, setYearCreated] = useState("");
  const [condition, setCondition] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Upload images
      const imageUrls: string[] = [];

      for (const file of images) {
        const storageRef = ref(storage, `art/${Date.now()}-${file.name}`);
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        imageUrls.push(url);
      }

      // Save listing
      await addDoc(collection(db, "listings"), {
        category: "art",
        title,
        artist,
        medium,
        dimensions,
        yearCreated,
        condition,
        description,
        price: Number(price),
        imageUrls,
        createdAt: serverTimestamp(),
        status: "active",
      });

      alert("Art listing created successfully!");
      setTitle("");
      setArtist("");
      setMedium("");
      setDimensions("");
      setYearCreated("");
      setCondition("");
      setDescription("");
      setPrice("");
      setImages([]);
    } catch (error) {
      console.error("Error creating art listing:", error);
      alert("Failed to create listing.");
    }

    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 p-6 border rounded-lg shadow-sm bg-white"
    >
      <h2 className="text-xl font-semibold">Create Art Listing</h2>

      <div>
        <label className="block text-sm font-medium mb-1">Title</label>
        <input
          type="text"
          className="w-full p-2 border rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Artist</label>
        <input
          type="text"
          className="w-full p-2 border rounded"
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Medium</label>
        <input
          type="text"
          placeholder="Oil on canvas, watercolor, acrylic..."
          className="w-full p-2 border rounded"
          value={medium}
          onChange={(e) => setMedium(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Dimensions</label>
        <input
          type="text"
          placeholder="24 x 36 inches"
          className="w-full p-2 border rounded"
          value={dimensions}
          onChange={(e) => setDimensions(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Year Created</label>
        <input
          type="number"
          className="w-full p-2 border rounded"
          value={yearCreated}
          onChange={(e) => setYearCreated(e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Condition</label>
        <input
          type="text"
          placeholder="Excellent, Good, Fair..."
          className="w-full p-2 border rounded"
          value={condition}
          onChange={(e) => setCondition(e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          className="w-full p-2 border rounded"
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Price (USD)</label>
        <input
          type="number"
          className="w-full p-2 border rounded"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Images</label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageUpload}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-teal-600 text-white py-2 rounded-lg font-medium hover:bg-teal-700 transition"
      >
        {loading ? "Creating..." : "Create Listing"}
      </button>
    </form>
  );
}
