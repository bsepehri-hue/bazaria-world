"use client";

export default function SpecsPanel({
  specs = [],
  data = {},
}: {
  specs: any[];
  data: any;
}) {
  if (!specs || specs.length === 0) {
    return null;
  }

  return (
    <div className="p-4 border rounded-lg bg-gray-50 space-y-4">
      <h2 className="text-lg font-semibold">Specs</h2>

      <div className="space-y-3">
        {specs.map((spec) => {
          const value = data[spec.key];

          if (!value) return null;

          const formatted =
            spec.format && typeof spec.format === "function"
              ? spec.format(value)
              : value;

          return (
            <div key={spec.key} className="flex justify-between text-sm">
              <span className="font-medium text-gray-700">{spec.label}</span>
              <span className="text-gray-900 text-right">
                {String(formatted)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
