"use client";

import { useState } from "react";

export default function ImageGallery({ images = [] }: { images: string[] }) {
  const [selected, setSelected] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
        No images available
      </div>
    );
  }

  return (
    <div className="space-y-4">

      {/* ⭐ Main Image */}
      <div className="w-full">
        <img
          src={images[selected]}
          alt="Listing image"
          className="w-full h-80 object-cover rounded-lg border"
        />
      </div>

      {/* ⭐ Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {images.map((img, index) => (
            <img
              key={index}
              src={img}
              onClick={() => setSelected(index)}
              className={`h-20 w-20 object-cover rounded-lg cursor-pointer border
                ${selected === index ? "border-teal-600" : "border-gray-300"}
              `}
            />
          ))}
        </div>
      )}
    </div>
  );
}
