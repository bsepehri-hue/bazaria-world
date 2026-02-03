"use client";

import BaseListingForm from "@/components/listings/BaseListingForm";
import LandForm from "@/components/listings/categories/LandForm";

export default function NewLandListingPage() {
  return (
    <BaseListingForm category="land">
      <LandForm />
    </BaseListingForm>
  );
}



export default function LandForm({ extraFields, setExtraFields }) {
  return (
    <div className="space-y-6">

      <input
        placeholder="Acreage"
        type="number"
        className="w-full px-4 py-2 border rounded-lg"
        value={extraFields.acreage || ""}
        onChange={(e) => setExtraFields({ ...extraFields, acreage: e.target.value })}
      />

      <input
        placeholder="Zoning"
        className="w-full px-4 py-2 border rounded-lg"
        value={extraFields.zoning || ""}
        onChange={(e) => setExtraFields({ ...extraFields, zoning: e.target.value })}
      />

      <input
        placeholder="Utilities Available"
        className="w-full px-4 py-2 border rounded-lg"
        value={extraFields.utilities || ""}
        onChange={(e) => setExtraFields({ ...extraFields, utilities: e.target.value })}
      />

      <input
        placeholder="Road Access"
        className="w-full px-4 py-2 border rounded-lg"
        value={extraFields.roadAccess || ""}
        onChange={(e) => setExtraFields({ ...extraFields, roadAccess: e.target.value })}
      />

    </div>
  );
}