"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import UploadListingImages from "@/components/UploadListingImages";

export default function CreateListingPage() {
  const params = useParams<{ storeId: string }>();

if (!params) {
  return <p className="p-6 text-gray-600">Loading…</p>;
}

const { storeId } = params;

const router = useRouter();

  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  // Dynamic fields
  const [fields, setFields] = useState<any>({});

  const handleFieldChange = (key: string, value: any) => {
    setFields((prev: any) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    await addDoc(collection(db, "listings"), {
      storeId,
      category,
      title,
      price,
      description,
      imageUrls,
      thumbnail: imageUrls[0] || "",
      ...fields,
      createdAt: Date.now(),
    });

    router.push(`/storefronts/${storeId}/listings`);
  };

  // Category-specific dynamic fields
  const renderCategoryFields = () => {
    switch (category) {
      case "cars":
      case "trucks":
      case "motorcycles":
      case "rvs":
        return (
          <div className="grid grid-cols-2 gap-4">
            <Input label="Year" onChange={(v) => handleFieldChange("year", v)} />
            <Input label="Make" onChange={(v) => handleFieldChange("make", v)} />
            <Input label="Model" onChange={(v) => handleFieldChange("model", v)} />
            <Input label="VIN" onChange={(v) => handleFieldChange("vin", v)} />
            <Input
              label="Odometer"
              onChange={(v) => handleFieldChange("odometer", v)}
            />

            {category === "trucks" && (
              <Input
                label="Drivetrain"
                onChange={(v) => handleFieldChange("drivetrain", v)}
              />
            )}

            {category === "motorcycles" && (
              <Input
                label="Engine Size"
                onChange={(v) => handleFieldChange("engineSize", v)}
              />
            )}

            {category === "rvs" && (
              <>
                <Input
                  label="Length"
                  onChange={(v) => handleFieldChange("length", v)}
                />
                <Input
                  label="Sleeps"
                  onChange={(v) => handleFieldChange("sleeps", v)}
                />
                <Input
                  label="RV Type"
                  onChange={(v) => handleFieldChange("rvType", v)}
                />
              </>
            )}
          </div>
        );

      case "general":
        return (
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Condition"
              onChange={(v) => handleFieldChange("condition", v)}
            />
            <Input
              label="Brand"
              onChange={(v) => handleFieldChange("brand", v)}
            />
          </div>
        );

      case "properties":
        return (
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Bedrooms"
              onChange={(v) => handleFieldChange("bedrooms", v)}
            />
            <Input
              label="Bathrooms"
              onChange={(v) => handleFieldChange("bathrooms", v)}
            />
            <Input
              label="Square Feet"
              onChange={(v) => handleFieldChange("sqft", v)}
            />
            <Input
              label="Lot Size (acres)"
              onChange={(v) => handleFieldChange("lotSize", v)}
            />
            <Input
              label="Property Type"
              onChange={(v) => handleFieldChange("propertyType", v)}
            />
            <Input
              label="Address"
              onChange={(v) => handleFieldChange("address", v)}
            />
          </div>
        );

      case "services":
        return (
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Service Type"
              onChange={(v) => handleFieldChange("serviceType", v)}
            />
            <Input
              label="Rate Type (hourly, flat, etc.)"
              onChange={(v) => handleFieldChange("rateType", v)}
            />
            <Input
              label="Experience"
              onChange={(v) => handleFieldChange("experience", v)}
            />
            <Input
              label="Location"
              onChange={(v) => handleFieldChange("location", v)}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">Create Listing</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Category */}
        <div>
          <label className="font-medium text-gray-700">Category</label>
          <select
            className="w-full mt-1 px-4 py-2 border rounded-lg"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Select category</option>
            <option value="cars">Cars</option>
            <option value="trucks">Trucks</option>
            <option value="motorcycles">Motorcycles</option>
            <option value="rvs">RVs</option>
            <option value="general">General Goods</option>
            <option value="properties">Properties</option>
            <option value="services">Services</option>
          </select>
        </div>

        {/* Dynamic Fields */}
        {category && renderCategoryFields()}

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
          Create Listing
        </button>
      </form>
    </div>
  );
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
