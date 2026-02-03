"use client";

import BaseListingForm from "@/components/listings/BaseListingForm";
import RoomsForm from "@/components/listings/categories/RoomsForm";

export default function NewRoomListingPage() {
  return (
    <BaseListingForm category="rooms">
      <RoomsForm />
    </BaseListingForm>
  );
}



export default function RoomsForm({ extraFields, setExtraFields }) {
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

      <select
        className="w-full px-4 py-2 border rounded-lg"
        value={extraFields.bathType || ""}
        onChange={(e) => setExtraFields({ ...extraFields, bathType: e.target.value })}
      >
        <option value="">Bathroom Type</option>
        <option value="private">Private</option>
        <option value="shared">Shared</option>
      </select>

      <input
        placeholder="House Rules (optional)"
        className="w-full px-4 py-2 border rounded-lg"
        value={extraFields.rules || ""}
        onChange={(e) => setExtraFields({ ...extraFields, rules: e.target.value })}
      />

    </div>
  );
}