export const ArtFilters = [
  {
    key: "medium",
    label: "Medium",
    type: "select",
    options: [
      { value: "painting", label: "Painting" },
      { value: "sculpture", label: "Sculpture" },
      { value: "metal", label: "Metalwork" },
      { value: "clay", label: "Clay / Ceramics" },
      { value: "glass", label: "Glasswork" },
      { value: "photography", label: "Photography" },
      { value: "mixed", label: "Mixed Media" },
      { value: "textile", label: "Textile Art" },
      { value: "wood", label: "Woodwork" },
      { value: "antique", label: "Antique / Collectible" },
      { value: "other", label: "Other" },
    ],
  },

  {
    key: "style",
    label: "Style",
    type: "select",
    options: [
      { value: "abstract", label: "Abstract" },
      { value: "modern", label: "Modern" },
      { value: "contemporary", label: "Contemporary" },
      { value: "realism", label: "Realism" },
      { value: "impressionism", label: "Impressionism" },
      { value: "minimalist", label: "Minimalist" },
      { value: "traditional", label: "Traditional" },
      { value: "other", label: "Other" },
    ],
  },

  {
    key: "materials",
    label: "Materials",
    type: "text",
    placeholder: "e.g., Oil, Bronze, Glass, Clay",
  },

  {
    key: "dimensions",
    label: "Dimensions",
    type: "text",
    placeholder: "e.g., 24x36, 12in tall",
  },

  {
    key: "yearCreated",
    label: "Year Created",
    type: "number",
  },

  {
    key: "price",
    label: "Price Range",
    type: "range",
  },
];
