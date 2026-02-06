// components/CategoryFields.tsx

export default function CategoryFields({ category, values, onChange }) {
  const fields = generalItemCategories[category]?.fields || [];

  return (
    <div className="space-y-4">
      {fields.map((field) => {
        const v = values[field.key] ?? "";

        if (field.type === "text") {
          return (
            <div key={field.key}>
              <label className="block text-sm font-medium">{field.label}</label>
              <input
                type="text"
                value={v}
                onChange={(e) => onChange(field.key, e.target.value)}
                className="mt-1 w-full border rounded px-3 py-2"
              />
            </div>
          );
        }

        if (field.type === "select") {
          return (
            <div key={field.key}>
              <label className="block text-sm font-medium">{field.label}</label>
              <select
                value={v}
                onChange={(e) => onChange(field.key, e.target.value)}
                className="mt-1 w-full border rounded px-3 py-2"
              >
                <option value="">Select…</option>
                {field.options.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          );
        }

        if (field.type === "date") {
          return (
            <div key={field.key}>
              <label className="block text-sm font-medium">{field.label}</label>
              <input
                type="date"
                value={v}
                onChange={(e) => onChange(field.key, e.target.value)}
                className="mt-1 w-full border rounded px-3 py-2"
              />
            </div>
          );
        }

        if (field.type === "boolean") {
          return (
            <div key={field.key} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={!!v}
                onChange={(e) => onChange(field.key, e.target.checked)}
              />
              <label>{field.label}</label>
            </div>
          );
        }

        if (field.type === "kv") {
          return (
            <div key={field.key}>
              <label className="block text-sm font-medium">{field.label}</label>
              <textarea
                value={JSON.stringify(v || {}, null, 2)}
                onChange={(e) => {
                  try {
                    onChange(field.key, JSON.parse(e.target.value));
                  } catch {}
                }}
                className="mt-1 w-full border rounded px-3 py-2 font-mono text-sm"
                rows={4}
              />
            </div>
          );
        }

        return null;
      })}
    </div>
  );
}
