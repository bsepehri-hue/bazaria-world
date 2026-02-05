"use client";

import { useState } from "react";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function UploadBox({ onUpload }: { onUpload: (urls: string[]) => void }) {
  const [uploading, setUploading] = useState(false);

  const handleFiles = async (e: any) => {
    const files = Array.from(e.target.files ?? []) as File[];
    if (!files.length) return;

    setUploading(true);

    const storage = getStorage();
    const urls: string[] = [];

    for (const file of files) {
      const fileRef = ref(storage, `listing-images/${Date.now()}-${file.name}`);
      await uploadBytes(fileRef, file);
      const url = await getDownloadURL(fileRef);
      urls.push(url);
    }

    setUploading(false);
    onUpload(urls);
  };

  return (
    <div className="border p-4 rounded">
      <input type="file" multiple onChange={handleFiles} />
      {uploading && <p className="text-sm text-gray-600 mt-2">Uploading...</p>}
    </div>
  );
}
