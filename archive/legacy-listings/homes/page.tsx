"use client";

import BaseListingForm from "@/components/listings/BaseListingForm";
import HomesForm from "@/components/listings/categories/HomesForm";

export default function NewHomeListingPage() {
  return (
    <BaseListingForm category="homes">
      <HomesForm />
    </BaseListingForm>
  );
}

export default function HomesForm({ extraFields, setExtraFields }) {
  return (
    <div className="space-y-6">

      <input
        placeholder="Bedrooms"
        type="number"
        className="w-full px-4 py-2 border rounded-lg"
        value={extraFields.beds || ""}
        onChange={(e) => setExtraFields({ ...extraFields, beds: e.target.value })}
      />

      <input
        placeholder="Bathrooms"
        type="number"
        className="w-full px-4 py-2 border rounded-lg"
        value={extraFields.baths || ""}
        onChange={(e) => setExtraFields({ ...extraFields, baths: e.target.value })}
      />

      <input
        placeholder="Square Feet"
        type="number"
        className="w-full px-4 py-2 border rounded-lg"
        value={extraFields.sqft || ""}
        onChange={(e) => setExtraFields({ ...extraFields, sqft: e.target.value })}
      />

      <input
        placeholder="Lot Size (sqft)"
        type="number"
        className="w-full px-4 py-2 border rounded-lg"
        value={extraFields.lotSize || ""}
        onChange={(e) => setExtraFields({ ...extraFields, lotSize: e.target.value })}
      />

      <select
        className="w-full px-4 py-2 border rounded-lg"
        value={extraFields.propertyType || ""}
        onChange={(e) => setExtraFields({ ...extraFields, propertyType: e.target.value })}
      >
        <option value="">Property Type</option>
        <option value="house">House</option>
        <option value="condo">Condo</option>
        <option value="townhome">Townhome</option>
        <option value="manufactured">Manufactured</option>
      </select>

      <input
        placeholder="Year Built"
        type="number"
        className="w-full px-4 py-2 border rounded-lg"
        value={extraFields.yearBuilt || ""}
        onChange={(e) => setExtraFields({ ...extraFields, yearBuilt: e.target.value })}
      />

      <input
        placeholder="HOA Fees (optional)"
        type="number"
        className="w-full px-4 py-2 border rounded-lg"
        value={extraFields.hoa || ""}
        onChange={(e) => setExtraFields({ ...extraFields, hoa: e.target.value })}
      />

    </div>
  );
}