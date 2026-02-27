"use client";

import { useState } from "react";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { app, auth } from "@/lib/firebase/client";

export default function UploadListingImages({
  images,
  setImages,
  max = 5,
}) {
  const [progress, setProgress] = useState<number | null>(null);

  const handleFile = async (e) => {
    alert("UPLOAD FIRED");
    console.log("AUTH:", auth.currentUser);

    if (!auth.currentUser) {
      alert("Auth not ready — try again");
      return;
    }

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
        setImages((prev) => [...prev, url]);
        setProgress(null);
      }
    );
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
            <img
              key={i}
              src={url}
              className="w-32 h-32 object-cover rounded-lg border"
            />
          ))}
        </div>
      )}
    </div>
  );
}
