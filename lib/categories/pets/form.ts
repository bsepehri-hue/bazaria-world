export const PetsForm = {
  category: "pets",

  fields: [
    {
      name: "petType",
      label: "Pet Type",
      type: "select",
      required: true,
      options: [
        { value: "dog", label: "Dog" },
        { value: "cat", label: "Cat" },
        { value: "bird", label: "Bird" },
        { value: "reptile", label: "Reptile" },
        { value: "small", label: "Small Pet" }, // hamsters, rabbits, guinea pigs
        { value: "fish", label: "Fish" },
        { value: "other", label: "Other" },
      ],
    },

    {
      name: "breed",
      label: "Breed",
      type: "text",
      placeholder: "e.g., Golden Retriever, Siamese, Macaw",
      required: false,
    },

    {
      name: "age",
      label: "Age",
      type: "select",
      required: false,
      options: [
        { value: "baby", label: "Baby" },
        { value: "young", label: "Young" },
        { value: "adult", label: "Adult" },
        { value: "senior", label: "Senior" },
      ],
    },

    {
      name: "sex",
      label: "Sex",
      type: "select",
      required: false,
      options: [
        { value: "male", label: "Male" },
        { value: "female", label: "Female" },
      ],
    },

    {
      name: "vaccinated",
      label: "Vaccinated",
      type: "select",
      required: false,
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" },
      ],
    },

    {
      name: "temperament",
      label: "Temperament",
      type: "multiselect",
      required: false,
      options: [
        { value: "friendly", label: "Friendly" },
        { value: "shy", label: "Shy" },
        { value: "energetic", label: "Energetic" },
        { value: "calm", label: "Calm" },
        { value: "trained", label: "Trained" },
        { value: "protective", label: "Protective" },
      ],
    },

    {
      name: "description",
      label: "Description",
      type: "textarea",
      required: true,
      placeholder: "Tell buyers about the pet’s personality, needs, and background.",
    },
  ],
};
