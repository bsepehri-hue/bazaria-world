"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";


export default function StorefrontSettingsPage() {
 const params = useParams<{ storeId: string }>();

if (!params) {
  return <p className="p-6 text-gray-600">Loading…</p>;
}

const { storeId } = params;

const router = useRouter();

  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [instagram, setInstagram] = useState("");
  const [tiktok, setTikTok] = useState("");

  useEffect(() => {
    const loadStorefront = async () => {
      const ref = doc(db, "storefronts", storeId as string);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const data = snap.data();

        setName(data.name || "");
        setDescription(data.description || "");
        setEmail(data.email || "");
        setPhone(data.phone || "");
        setInstagram(data.instagram || "");
        setTikTok(data.tiktok || "");
      }

      setLoading(false);
    };

    loadStorefront();
  }, [storeId]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    const ref = doc(db, "storefronts", storeId as string);

    await updateDoc(ref, {
      name,
      description,
      email,
      phone,
      instagram,
      tiktok,
    });

    router.push(`/dashboard/storefronts/${storeId}`);
  };

  if (loading) {
    return <p className="text-gray-600">Loading settings…</p>;
  }

  return (
    <div className="space-y-10">
      <h1 className="text-3xl font-bold text-gray-900">Storefront Settings</h1>

      <form
        onSubmit={handleSave}
        className="bg-white p-8 rounded-xl shadow border space-y-6"
      >
        {/* Store Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Store Name
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-2 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-600 focus:outline-none"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Store Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-2 w-full px-4 py-2 border rounded-lg h-32 resize-none focus:ring-2 focus:ring-teal-600 focus:outline-none"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Contact Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-600 focus:outline-none"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mt-2 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-600 focus:outline-none"
          />
        </div>

        {/* Instagram */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Instagram Handle
          </label>
          <input
            type="text"
            value={instagram}
            onChange={(e) => setInstagram(e.target.value)}
            className="mt-2 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-600 focus:outline-none"
          />
        </div>

        {/* TikTok */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            TikTok Username
          </label>
          <input
            type="text"
            value={tiktok}
            onChange={(e) => setTikTok(e.target.value)}
            className="mt-2 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-600 focus:outline-none"
          />
        </div>

        {/* Save */}
        <button
          type="submit"
          className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition font-medium"
        >
          Save Settings
        </button>
      </form>
    </div>
  );
}
