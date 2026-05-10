export const PetsSpecs = [
  {
    key: "petType",
    label: "Type",
  },
  {
    key: "breed",
    label: "Breed",
  },
  {
    key: "age",
    label: "Age",
  },
  {
    key: "sex",
    label: "Sex",
  },
  {
    key: "vaccinated",
    label: "Vaccinated",
  },
  {
    key: "temperament",
    label: "Temperament",
    format: (value: string[] | string) =>
      Array.isArray(value) ? value.join(", ") : value,
  },
];
