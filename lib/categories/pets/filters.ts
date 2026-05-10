export const PETS_FILTERS = {
  petType: {
    label: "Pet Type",
    options: [
      { value: "dog", label: "Dog" },
      { value: "cat", label: "Cat" },
      { value: "bird", label: "Bird" },
      { value: "reptile", label: "Reptile" },
      { value: "small", label: "Small Pet" }, // hamsters, guinea pigs, rabbits
      { value: "fish", label: "Fish" },
      { value: "other", label: "Other" },
    ],
  },

  breed: {
    label: "Breed",
    placeholder: "Search breed...",
    type: "text", // free‑text search
  },

  age: {
    label: "Age",
    options: [
      { value: "baby", label: "Baby" },
      { value: "young", label: "Young" },
      { value: "adult", label: "Adult" },
      { value: "senior", label: "Senior" },
    ],
  },

  sex: {
    label: "Sex",
    options: [
      { value: "male", label: "Male" },
      { value: "female", label: "Female" },
    ],
  },

  vaccinated: {
    label: "Vaccinated",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
    ],
  },

  temperament: {
    label: "Temperament",
    options: [
      { value: "friendly", label: "Friendly" },
      { value: "shy", label: "Shy" },
      { value: "energetic", label: "Energetic" },
      { value: "calm", label: "Calm" },
      { value: "trained", label: "Trained" },
      { value: "protective", label: "Protective" },
    ],
  },
};
