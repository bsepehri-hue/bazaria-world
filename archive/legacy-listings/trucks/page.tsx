"use client";

import BaseListingForm from "@/components/listings/BaseListingForm";
import TrucksForm from "@/components/listings/categories/TrucksForm";

export default function NewTruckListingPage() {
  return (
    <BaseListingForm category="trucks">
      <TrucksForm />
    </BaseListingForm>
  );
}



export default function TrucksForm({ extraFields, setExtraFields }) {
  return (
    <div className="space-y-6">

      <input
        placeholder="Year"
        type="number"
        className="w-full px-4 py-2 border rounded-lg"
        value={extraFields.year || ""}
        onChange={(e) => setExtraFields({ ...extraFields, year: e.target.value })}
      />

      <input
        placeholder="Make"
        className="w-full px-4 py-2 border rounded-lg"
        value={extraFields.make || ""}
        onChange={(e) => setExtraFields({ ...extraFields, make: e.target.value })}
      />

      <input
        placeholder="Model"
        className="w-full px-4 py-2 border rounded-lg"
        value={extraFields.model || ""}
        onChange={(e) => setExtraFields({ ...extraFields, model: e.target.value })}
      />

      <input
        placeholder="Towing Capacity (lbs)"
        type="number"
        className="w-full px-4 py-2 border rounded-lg"
        value={extraFields.towing || ""}
        onChange={(e) => setExtraFields({ ...extraFields, towing: e.target.value })}
      />

      <input
        placeholder="Bed Length (ft)"
        type="number"
        className="w-full px-4 py-2 border rounded-lg"
        value={extraFields.bedLength || ""}
        onChange={(e) => setExtraFields({ ...extraFields, bedLength: e.target.value })}
      />

      <select
        className="w-full px-4 py-2 border rounded-lg"
        value={extraFields.drivetrain || ""}
        onChange={(e) => setExtraFields({ ...extraFields, drivetrain: e.target.value })}
      >
        <option value="">Drivetrain</option>
        <option value="fwd">FWD</option>
        <option value="rwd">RWD</option>
        <option value="awd">AWD</option>
        <option value="4wd">4WD</option>
      </select>

    </div>
  );
}