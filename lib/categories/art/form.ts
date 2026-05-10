export const ArtForm = {
  category: "art",

  fields: [
    {
      name: "medium",
      label: "Medium",
      type: "select",
      required: true,
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
      name: "title",
      label: "Title of the Piece",
      type: "text",
      required: true,
      placeholder: "e.g., Sunset Over Laguna",
    },

    {
      name: "artist",
      label: "Artist Name",
      type: "text",
      required: false,
      placeholder: "Optional — leave blank for anonymous works",
    },

    {
      name: "yearCreated",
      label: "Year Created",
      type: "number",
      required: false,
      placeholder: "e.g., 2021",
    },

    {
      name: "materials",
      label: "Materials",
      type: "text",
      required: false,
      placeholder: "e.g., Oil on canvas, Bronze, Blown glass",
    },

    {
      name: "dimensions",
      label: "Dimensions",
      type: "text",
      required: false,
      placeholder: "e.g., 24in x 36in, or 12in tall",
    },

    {
      name: "style",
      label: "Style",
      type: "select",
      required: false,
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
      name: "condition",
      label: "Condition",
      type: "select",
      required: false,
      options: [
        { value: "new", label: "New" },
        { value: "excellent", label: "Excellent" },
        { value: "good", label: "Good" },
        { value: "fair", label: "Fair" },
        { value: "aged", label: "Aged / Antique" },
      ],
    },

    {
      name: "provenance",
      label: "Provenance",
      type: "textarea",
      required: false,
      placeholder: "Optional — history of ownership, gallery exhibitions, certificates",
    },

    {
      name: "description",
      label: "Description",
      type: "textarea",
      required: true,
      placeholder: "Describe the piece, its story, and what makes it special.",
    },
  ],
};
