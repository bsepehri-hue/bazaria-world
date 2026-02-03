"use client";

import BaseListingForm from "@/components/listings/BaseListingForm";
import RVsForm from "@/components/listings/categories/RVsForm";

export default function NewRVListingPage() {
  return (
    <BaseListingForm category="rvs">
      <RVsForm />
    </BaseListingForm>
  );
}



export default function RVsForm({ extraFields, setExtraFields }) {
  return (
    <div className="space-y-6">

      <input
        placeholder="Length (ft)"
        type="number"
        className="w-full px-4 py-2 border rounded-lg"
        value={extraFields.length || ""}
        onChange={(e) => setExtraFields({ ...extraFields, length: e.target.value })}
      />

      <input
        placeholder="Sleeps"
        type="number"
        className="w-full px-4 py-2 border rounded-lg"
        value={extraFields.sleeps || ""}
        onChange={(e) => setExtraFields({ ...extraFields, sleeps: e.target.value })}
      />

      <select
        className="w-full px-4 py-2 border rounded-lg"
        value={extraFields.class || ""}
        onChange={(e) => setExtraFields({ ...extraFields, class: e.target.value })}
      >
        <option value="">RV Class</option>
        <option value="A">Class A</option>
        <option value="B">Class B</option>
        <option value="C">Class C</option>
      </select>

      <input
        placeholder="Mileage"
        type="number"
        className="w-full px-4 py-2 border rounded-lg"
        value={extraFields.mileage || ""}
        onChange={(e) => setExtraFields({ ...extraFields, mileage: e.target.value })}
      />

      <input
        placeholder="Hookups (optional)"
        className="w-full px-4 py-2 border rounded-lg"
        value={extraFields.hookups || ""}
        onChange={(e) => setExtraFields({ ...extraFields, hookups: e.target.value })}
      />

    </div>
  );
}