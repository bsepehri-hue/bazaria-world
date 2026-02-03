
"use client";

import BaseListingForm from "@/components/listings/BaseListingForm";
import CarsForm from "@/components/listings/categories/cars/CarsForm";

export default function NewCarListingPage() {
  return (
    <BaseListingForm category="cars">
      <CarsForm />
    </BaseListingForm>
  );
}



export default function CarsForm({ extraFields, setExtraFields }) {
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
        placeholder="Trim"
        className="w-full px-4 py-2 border rounded-lg"
        value={extraFields.trim || ""}
        onChange={(e) => setExtraFields({ ...extraFields, trim: e.target.value })}
      />

      <input
        placeholder="Mileage"
        type="number"
        className="w-full px-4 py-2 border rounded-lg"
        value={extraFields.mileage || ""}
        onChange={(e) => setExtraFields({ ...extraFields, mileage: e.target.value })}
      />

      <select
        className="w-full px-4 py-2 border rounded-lg"
        value={extraFields.transmission || ""}
        onChange={(e) => setExtraFields({ ...extraFields, transmission: e.target.value })}
      >
        <option value="">Transmission</option>
        <option value="automatic">Automatic</option>
        <option value="manual">Manual</option>
        <option value="cvt">CVT</option>
      </select>

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

      <select
        className="w-full px-4 py-2 border rounded-lg"
        value={extraFields.fuel || ""}
        onChange={(e) => setExtraFields({ ...extraFields, fuel: e.target.value })}
      >
        <option value="">Fuel Type</option>
        <option value="gas">Gasoline</option>
        <option value="diesel">Diesel</option>
        <option value="hybrid">Hybrid</option>
        <option value="electric">Electric</option>
      </select>

      <input
        placeholder="VIN"
        className="w-full px-4 py-2 border rounded-lg"
        value={extraFields.vin || ""}
        onChange={(e) => setExtraFields({ ...extraFields, vin: e.target.value })}
      />

    </div>
  );
}
