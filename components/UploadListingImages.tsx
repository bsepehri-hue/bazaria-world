"use client";

import { useState } from "react";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { app } from "../lib/firebase";

export default function UploadListingImages({
  images,
  setImages,
  max = 5,
}: {
  images: string[];
  setImages: (urls: string[]) => void;
  max?: number;
}) {
  const [progress, setProgress] = useState<number | null>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || images.length >= max) return;

    const storage = getStorage(app);
    const fileRef = ref(storage, `listing-images/${Date.now()}-${file.name}`);

    const uploadTask = uploadBytesResumable(fileRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const pct =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(Math.round(pct));
      },
      (error) => {
        console.error("Upload failed", error);
      },
      async () => {
        const url = await getDownloadURL(uploadTask.snapshot.ref);
        setImages([...images, url]);
        setProgress(null);
      }
    );
  };

  const removeImage = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    setImages(updated);
  };

  const moveImage = (from: number, to: number) => {
    const updated = [...images];
    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);
    setImages(updated);
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        Listing Images (up to {max})
      </label>

      <input
        type="file"
        accept="image/*"
        onChange={handleFile}
        className="w-full text-sm"
      />

      {progress !== null && (
        <p className="text-sm text-gray-500">Uploading… {progress}%</p>
      )}

      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          {images.map((url, i) => (
            <div key={i} className="relative group">
              <img
                src={url}
                className="w-32 h-32 object-cover rounded-lg border"
              />

              {/* Delete */}
              <button
                onClick={() => removeImage(i)}
                className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition"
              >
                ✕
              </button>

              {/* Move Left */}
              {i > 0 && (
                <button
                  onClick={() => moveImage(i, i - 1)}
                  className="absolute bottom-1 left-1 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition"
                >
                  ←
                </button>
              )}

              {/* Move Right */}
              {i < images.length - 1 && (
                <button
                  onClick={() => moveImage(i, i + 1)}
                  className="absolute bottom-1 right-1 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition"
                >
                  →
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
