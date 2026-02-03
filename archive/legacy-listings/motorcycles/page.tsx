"use client";

import BaseListingForm from "@/components/listings/BaseListingForm";
import MotorcyclesForm from "@/components/listings/categories/MotorcyclesForm";

export default function NewMotorcycleListingPage() {
  return (
    <BaseListingForm category="motorcycles">
      <MotorcyclesForm />
    </BaseListingForm>
  );
}


export default function MotorcyclesForm({ extraFields, setExtraFields }) {
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
        placeholder="Engine Size (cc)"
        type="number"
        className="w-full px-4 py-2 border rounded-lg"
        value={extraFields.engineSize || ""}
        onChange={(e) => setExtraFields({ ...extraFields, engineSize: e.target.value })}
      />

      <input
        placeholder="Mileage"
        type="number"
        className="w-full px-4 py-2 border rounded-lg"
        value={extraFields.mileage || ""}
        onChange={(e) => setExtraFields({ ...extraFields, mileage: e.target.value })}
      />

    </div>
  );
}