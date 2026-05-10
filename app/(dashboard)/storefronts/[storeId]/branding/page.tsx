"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import UploadListingImages from "@/components/UploadListingImages";

export default function StorefrontBrandingPage() {
  const params = useParams<{ storeId: string }>();

if (!params) {
  return <p className="p-6 text-gray-600">Loading…</p>;
}

const { storeId } = params;

const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [logo, setLogo] = useState<string[]>([]);
  const [banner, setBanner] = useState<string[]>([]);

  useEffect(() => {
    const loadStorefront = async () => {
      const ref = doc(db, "storefronts", storeId as string);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const data = snap.data();
        setLogo(data.logo ? [data.logo] : []);
        setBanner(data.banner ? [data.banner] : []);
      }

      setLoading(false);
    };

    loadStorefront();
  }, [storeId]);

  const handleSave = async () => {
    const ref = doc(db, "storefronts", storeId as string);

    await updateDoc(ref, {
      logo: logo[0] || null,
      banner: banner[0] || null,
    });

    router.push(`/dashboard/storefronts/${storeId}`);
  };

  if (loading) {
    return <p className="text-gray-600">Loading branding…</p>;
  }

  return (
    <div className="space-y-10">
      <h1 className="text-3xl font-bold text-gray-900">Storefront Branding</h1>

      {/* Logo Upload */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Logo</h2>

        <UploadListingImages
          images={logo}
          setImages={setLogo}
          max={1}
        />

        {logo.length > 0 && (
          <img
            src={logo[0]}
            className="w-32 h-32 object-cover rounded-lg border"
          />
        )}
      </div>

      {/* Banner Upload */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Banner</h2>

        <UploadListingImages
          images={banner}
          setImages={setBanner}
          max={1}
        />

        {banner.length > 0 && (
          <img
            src={banner[0]}
            className="w-full max-w-2xl h-40 object-cover rounded-lg border"
          />
        )}
      </div>

      {/* Save */}
      <button
        onClick={handleSave}
        className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition font-medium"
      >
        Save Branding
      </button>
    </div>
  );
}
