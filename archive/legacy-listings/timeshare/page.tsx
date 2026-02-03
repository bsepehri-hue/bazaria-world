"use client";

import BaseListingForm from "@/components/listings/BaseListingForm";
import TimeshareForm from "@/components/listings/categories/TimeshareForm";

export default function NewTimeshareListingPage() {
  return (
    <BaseListingForm category="timeshare">
      <TimeshareForm />
    </BaseListingForm>
  );
}



export default function TimeshareForm({ extraFields, setExtraFields }) {
  return (
    <div className="space-y-6">

      <input
        placeholder="Resort Name"
        className="w-full px-4 py-2 border rounded-lg"
        value={extraFields.resort || ""}
        onChange={(e) => setExtraFields({ ...extraFields, resort: e.target.value })}
      />

      <input
        placeholder="Week Number"
        type="number"
        className="w-full px-4 py-2 border rounded-lg"
        value={extraFields.week || ""}
        onChange={(e) => setExtraFields({ ...extraFields, week: e.target.value })}
      />

      <input
        placeholder="Unit Type"
        className="w-full px-4 py-2 border rounded-lg"
        value={extraFields.unitType || ""}
        onChange={(e) => setExtraFields({ ...extraFields, unitType: e.target.value })}
      />

      <input
        placeholder="Maintenance Fees (optional)"
        type="number"
        className="w-full px-4 py-2 border rounded-lg"
        value={extraFields.fees || ""}
        onChange={(e) => setExtraFields({ ...extraFields, fees: e.target.value })}
      />

    </div>
  );
}