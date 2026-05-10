export const ArtDetails = [
  {
    section: "Artwork Information",
    fields: [
      {
        key: "medium",
        label: "Medium",
      },
      {
        key: "materials",
        label: "Materials",
      },
      {
        key: "dimensions",
        label: "Dimensions",
      },
      {
        key: "yearCreated",
        label: "Year Created",
      },
      {
        key: "style",
        label: "Style",
      },
      {
        key: "condition",
        label: "Condition",
      },
    ],
  },

  {
    section: "Artist",
    fields: [
      {
        key: "artist",
        label: "Artist Name",
      },
      {
        key: "provenance",
        label: "Provenance",
        type: "longtext",
      },
    ],
  },

  {
    section: "Description",
    fields: [
      {
        key: "description",
        label: "Description",
        type: "longtext",
      },
    ],
  },
];
