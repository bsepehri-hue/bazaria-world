"use client";

interface CarsFormProps {
  extraFields?: any;
  setExtraFields?: (fields: any) => void;
}

export default function CarsForm({ extraFields = {}, setExtraFields }: CarsFormProps) {
  const update = (field: string, value: any) => {
    if (!setExtraFields) return;
    setExtraFields({
      ...extraFields,
      [field]: value,
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field
          label="Make"
          value={extraFields.make || ""}
          onChange={(v) => update("make", v)}
        />
        <Field
          label="Model"
          value={extraFields.model || ""}
          onChange={(v) => update("model", v)}
        />
        <Field
          label="Year"
          type="number"
          value={extraFields.year || ""}
          onChange={(v) => update("year", v)}
        />
        <Field
          label="Mileage (km)"
          type="number"
          value={extraFields.mileage || ""}
          onChange={(v) => update("mileage", v)}
        />
        <Field
          label="Transmission"
          placeholder="Automatic / Manual"
          value={extraFields.transmission || ""}
          onChange={(v) => update("transmission", v)}
        />
        <Field
          label="Fuel Type"
          placeholder="Gasoline / Diesel / Electric / Hybrid"
          value={extraFields.fuelType || ""}
          onChange={(v) => update("fuelType", v)}
        />
        <Field
          label="Body Style"
          placeholder="Sedan, SUV, Coupe, etc."
          value={extraFields.bodyStyle || ""}
          onChange={(v) => update("bodyStyle", v)}
        />
        <Field
          label="Color"
          value={extraFields.color || ""}
          onChange={(v) => update("color", v)}
        />
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string | number;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <input
        type={type}
        className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
