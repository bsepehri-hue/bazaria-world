"use client";

import BaseListingForm from "@/components/listings/BaseListingForm";
import GeneralForm from "@/components/listings/categories/GeneralForm";

export default function NewGeneralListingPage() {
  return (
    <BaseListingForm category="general">
      <GeneralForm />
    </BaseListingForm>
  );
}



export default function GeneralForm({ extraFields, setExtraFields }) {
  return (
    <div className="space-y-6">

      <input
        placeholder="Brand"
        className="w-full px-4 py-2 border rounded-lg"
        value={extraFields.brand || ""}
        onChange={(e) => setExtraFields({ ...extraFields, brand: e.target.value })}
      />

      <input
        placeholder="Model"