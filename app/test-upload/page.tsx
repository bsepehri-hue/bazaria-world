"use client";

import { useState } from "react";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { app } from "@/lib/firebase/client";

export default function TestUploadPage() {
  const [url, setUrl] = useState<string | null>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const storage = getStorage(app);
    const fileRef = ref(storage, `test/${Date.now()}-${file.name}`);

    const snapshot = await uploadBytes(fileRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);

    setUrl(downloadURL);
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Test Image Upload</h1>

      <input type="file" accept="image/*" onChange={handleFile} />

      {url && (
        <div style={{ marginTop: 20 }}>
          <p>Uploaded:</p>
          <img src={url} width={200} />
          <p>{url}</p>
        </div>
      )}
    </div>
  );
}
