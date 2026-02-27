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
}: {
  images: string[];
  setImages: (urls: string[]) => void;
  max?: number;
}) {
  const [progress, setProgress] = useState<number | null>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("AUTH:", auth.currentUser);

    if (!auth.currentUser) {
      alert("Auth not ready yet — try again in 1 second");
      return;
   
