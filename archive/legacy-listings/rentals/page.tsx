"use client";

import BaseListingForm from "@/components/listings/BaseListingForm";
import RentalsForm from "@/components/listings/categories/RentalsForm";

export default function NewRentalListingPage() {
  return (
    <BaseListingForm category="rentals">
      <RentalsForm />
    </BaseListingForm>
  );
}



export default function RentalsForm({ extraFields, setExtraFields }) {
  return (
    <div className="space-y-6">

      <input
        placeholder="Monthly Rent"
        type="number"
        className="w-full px-4 py-2 border rounded-lg"
        value={extraFields.rent || ""}
        onChange={(e) => setExtraFields({ ...extraFields, rent: e.target.value })}
      />

      <input
        placeholder="Deposit"
        type="number"
        className="w-full px-4 py-2 border rounded-lg"
        value={extraFields.deposit || ""}
        onChange={(e) => setExtraFields({ ...extraFields, deposit: e.target.value })}
      />

      <input
        placeholder="Lease Term (months)"
        type="number"
        className="w-full px-4 py-2 border rounded-lg"
        value={extraFields.term || ""}
        onChange={(e) => setExtraFields({ ...extraFields, term: e.target.value })}
      />

      <input
        placeholder="Utilities Included (optional)"
        className="w-full px-4 py-2 border rounded-lg"
        value={extraFields.utilities || ""}
        onChange={(e) => setExtraFields({ ...extraFields, utilities: e.target.value })}
      />

      <input
        placeholder="Furnished? (yes/no)"
        className="w-full px-4 py-2 border rounded-lg"
        value={extraFields.furnished || ""}
        onChange={(e) => setExtraFields({ ...extraFields, furnished: e.target.value })}
      />

    </div>
  );
}