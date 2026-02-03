"use client";

import React from "react";

interface CarsFormProps {
  extraFields: any;
  setExtraFields: (fields: any) => void;
}

export default function CarsForm({
  extraFields,
  setExtraFields,
}: CarsFormProps) {


  return (
    <div className="space-y-6">
      {/* Example fields — you can expand later */}
      <div>
        <label className="block text-sm font-medium">Make</label>
        <input
          type="text"
          className="input"
          value={extraFields.make || ""}
          onChange={(e) =>
            setExtraFields({ ...extraFields, make: e.target.value })
          }
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Model</label>
        <input
          type="text"
          className="input"
          value={extraFields.model || ""}
          onChange={(e) =>
            setExtraFields({ ...extraFields, model: e.target.value })
          }
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Year</label>
        <input
          type="number"
          className="input"
          value={extraFields.year || ""}
          onChange={(e) =>
            setExtraFields({ ...extraFields, year: e.target.value })
          }
        />
      </div>
    </div>
  );
}
