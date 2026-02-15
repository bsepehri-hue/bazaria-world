"use client";

export default function DetailsSections({
  sections = [],
  data = {},
}: {
  sections: any[];
  data: any;
}) {
  if (!sections || sections.length === 0) {
    return null;
  }

  return (
    <div className="space-y-8">
      {sections.map((section: any, index: number) => (
        <div key={index} className="space-y-3">
          {/* Section Title */}
          <h2 className="text-xl font-semibold">{section.section}</h2>

          {/* Section Fields */}
          <div className="space-y-2">
            {section.fields.map((field: any) => {
              const value = data[field.key];

              if (!value) return null;

              const formatted =
                field.format && typeof field.format === "function"
                  ? field.format(value)
                  : value;

              return (
                <div key={field.key} className="text-gray-700">
                  <div className="font-medium">{field.label}</div>

                  {field.type === "longtext" ? (
                    <p className="whitespace-pre-line text-gray-800">
                      {String(formatted)}
                    </p>
                  ) : (
                    <div className="text-gray-900">{String(formatted)}</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
