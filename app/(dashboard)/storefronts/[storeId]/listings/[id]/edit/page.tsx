"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import UploadListingImages from "@/components/UploadListingImages";
import { db } from "@/lib/firebase/client";



export default function EditListingPage() {
 const params = useParams<{ storeId: string; id: string }>();

if (!params) {
  return <p className="p-6 text-gray-600">Loading…</p>;
}

const { storeId, id } = params;

const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("");

  // Universal fields
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  // Dynamic fields
  const [fields, setFields] = useState<any>({});

  const handleFieldChange = (key: string, value: any) => {
    setFields((prev: any) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    const load = async () => {
      const ref = doc(db, "listings", id as string);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const data = snap.data();

        setCategory(data.category);
        setTitle(data.title || "");
        setPrice(data.price || "");
        setDescription(data.description || "");
        setImageUrls(data.imageUrls || []);

        // Load dynamic fields
        const dynamic = { ...data };
        delete dynamic.title;
        delete dynamic.price;
        delete dynamic.description;
        delete dynamic.imageUrls;
        delete dynamic.thumbnail;
        delete dynamic.storeId;
        delete dynamic.category;
        delete dynamic.createdAt;

        setFields(dynamic);
      }

      setLoading(false);
    };

    load();
  }, [id]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const ref = doc(db, "listings", id as string);

    await updateDoc(ref, {
      title,
      price,
      description,
      imageUrls,
      thumbnail: imageUrls[0] || "",
      ...fields,
      updatedAt: Date.now(),
    });

    router.push(`/listing/${category}/${id}`);
  };

  if (loading) {
    return <p className="text-gray-600">Loading…</p>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">Edit Listing</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Category (locked) */}
        <div>
          <label className="font-medium text-gray-700">Category</label>
          <input
            value={category}
            disabled
            className="w-full mt-1 px-4 py-2 border rounded-lg bg-gray-100"
          />
        </div>

        {/* Dynamic Fields */}
        {renderCategoryFields(category, fields, handleFieldChange)}

        {/* Title */}
        <Input label="Title" value={title} onChange={setTitle} />

        {/* Price */}
        <Input label="Price" value={price} onChange={setPrice} type="number" />

        {/* Description */}
        <div>
          <label className="font-medium text-gray-700">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            className="w-full mt-1 px-4 py-2 border rounded-lg"
          />
        </div>

        {/* Images */}
        <UploadListingImages images={imageUrls} setImages={setImageUrls} />

        {imageUrls.length > 0 && (
          <div className="grid grid-cols-3 gap-4 mt-4">
            {imageUrls.map((url, i) => (
              <img
                key={i}
                src={url}
                className="w-full h-24 object-cover rounded-lg border"
              />
            ))}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition font-medium"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}

// Dynamic field renderer
function renderCategoryFields(category: string, fields: any, onChange: any) {
  const InputField = (label: string, key: string) => (
    <Input
      label={label}
      value={fields[key] || ""}
      onChange={(v) => onChange(key, v)}
    />
  );

  switch (category) {
    case "cars":
    case "trucks":
    case "motorcycles":
    case "rvs":
      return (
        <div className="grid grid-cols-2 gap-4">
          {InputField("Year", "year")}
          {InputField("Make", "make")}
          {InputField("Model", "model")}
          {InputField("VIN", "vin")}
          {InputField("Odometer", "odometer")}

          {category === "trucks" && InputField("Drivetrain", "drivetrain")}
          {category === "motorcycles" && InputField("Engine Size", "engineSize")}

          {category === "rvs" && (
            <>
              {InputField("Length", "length")}
              {InputField("Sleeps", "sleeps")}
              {InputField("RV Type", "rvType")}
            </>
          )}
        </div>
      );

    case "general":
      return (
        <div className="grid grid-cols-2 gap-4">
          {InputField("Condition", "condition")}
          {InputField("Brand", "brand")}
        </div>
      );

    case "properties":
      return (
        <div className="grid grid-cols-2 gap-4">
          {InputField("Bedrooms", "bedrooms")}
          {InputField("Bathrooms", "bathrooms")}
          {InputField("Square Feet", "sqft")}
          {InputField("Lot Size (acres)", "lotSize")}
          {InputField("Property Type", "propertyType")}
          {InputField("Address", "address")}
        </div>
      );

    case "services":
      return (
        <div className="grid grid-cols-2 gap-4">
          {InputField("Service Type", "serviceType")}
          {InputField("Rate Type", "rateType")}
          {InputField("Experience", "experience")}
          {InputField("Location", "location")}
        </div>
      );

    default:
      return null;
  }
}

// Reusable input component
function Input({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value?: any;
  onChange: (v: any) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="font-medium text-gray-700">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full mt-1 px-4 py-2 border rounded-lg"
      />
    </div>
  );
}
