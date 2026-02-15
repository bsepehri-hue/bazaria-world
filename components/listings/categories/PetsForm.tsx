"use client";

import React from "react";

interface PetsFormProps {
  extraFields: any;
  setExtraFields: (fields: any) => void;
}

export default function PetsForm({ extraFields, setExtraFields }: PetsFormProps) {
  const update = (key: string, value: any) => {
    setExtraFields({
      ...extraFields,
      [key]: value,
    });
  };

  return (
    <div className="space-y-6">
      {/* Pet Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Pet Type</label>
        <select
          value={extraFields.petType || ""}
          onChange={(e) => update("petType", e.target.value)}
          className="mt-2 w-full px-4 py-2 border rounded-lg"
        >
          <option value="">Select type</option>
          <option value="dog">Dog</option>
          <option value="cat">Cat</option>
          <option value="bird">Bird</option>
          <option value="reptile">Reptile</option>
          <option value="small-animal">Small Animal</option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* Breed */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Breed</label>
        <input
          value={extraFields.breed || ""}
          onChange={(e) => update("breed", e.target.value)}
          className="mt-2 w-full px-4 py-2 border rounded-lg"
        />
      </div>

      {/* Age */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Age</label>
        <input
          value={extraFields.age || ""}
          onChange={(e) => update("age", e.target.value)}
          className="mt-2 w-full px-4 py-2 border rounded-lg"
          placeholder="e.g. 6 months, 2 years"
        />
      </div>

      {/* Sex */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Sex</label>
        <select
          value={extraFields.sex || ""}
          onChange={(e) => update("sex", e.target.value)}
          className="mt-2 w-full px-4 py-2 border rounded-lg"
        >
          <option value="">Select</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="unknown">Unknown</option>
        </select>
      </div>

      {/* Vaccination Status */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Vaccination Status</label>
        <input
          value={extraFields.vaccinationStatus || ""}
          onChange={(e) => update("vaccinationStatus", e.target.value)}
          className="mt-2 w-full px-4 py-2 border rounded-lg"
          placeholder="e.g. Fully vaccinated, first shots only"
        />
      </div>

      {/* Rehoming Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Rehoming Notes</label>
        <textarea
          value={extraFields.rehomingNotes || ""}
          onChange={(e) => update("rehomingNotes", e.target.value)}
          className="mt-2 w-full px-4 py-2 border rounded-lg h-24 resize-none"
          placeholder="Temperament, special needs, good with kids/other pets, etc."
        />
      </div>
    </div>
  );
}
