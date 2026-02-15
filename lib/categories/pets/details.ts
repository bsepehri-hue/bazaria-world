export const PetsDetails = [
  {
    section: "Pet Information",
    fields: [
      { key: "petType", label: "Type" },
      { key: "breed", label: "Breed" },
      { key: "age", label: "Age" },
      { key: "sex", label: "Sex" },
    ],
  },

  {
    section: "Health & Care",
    fields: [
      { key: "vaccinated", label: "Vaccinated" },
      {
        key: "temperament",
        label: "Temperament",
        format: (value: string[] | string) =>
          Array.isArray(value) ? value.join(", ") : value,
      },
    ],
  },

  {
    section: "Description",
    fields: [
      {
        key: "description",
        label: "About This Pet",
        type: "longtext",
      },
    ],
  },
];
