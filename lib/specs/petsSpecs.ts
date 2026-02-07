import { FieldSpec } from "@/types/FieldSpec";

export const petsSpecs: Record<string, FieldSpec> = {
  title: {
    label: "Title",
    type: "text",
    required: true,
    placeholder: "e.g., Golden Retriever Puppy",
    filter: "text",
  },

  description: {
    label: "Description",
    type: "textarea",
    required: true,
    placeholder: "Describe the pet clearly...",
  },

  price: {
    label: "Price",
    type: "number",
    required: true,
    min: 0,
    filter: "range",
  },

  petType: {
    label: "Pet Type",
    type: "select",
    required: true,
    options: [
      "Dogs",
      "Cats",
      "Birds",
      "Reptiles",
      "Fish",
      "Small Animals",
      "Farm Animals",
    ],
    filter: "select",
  },

  breed: {
    label: "Breed",
    type: "text",
    required: false,
    placeholder: "Optional breed",
    showIf: { petType: ["Dogs", "Cats"] },
  },

  age: {
    label: "Age",
    type: "number",
    required: false,
    min: 0,
    max: 200,
    filter: "range",
  },

  sex: {
    label: "Sex",
    type: "select",
    required: false,
    options: ["Male", "Female", "Unknown"],
  },

  vaccinated: {
    label: "Vaccinated",
    type: "boolean",
    required: false,
  },

  microchipped: {
    label: "Microchipped",
    type: "boolean",
    required: false,
  },

  healthStatus: {
    label: "Health Status",
    type: "text",
    required: false,
    placeholder: "e.g., Healthy, Special Needs",
  },

  wingspan: {
    label: "Wingspan",
    type: "number",
    required: false,
    min: 0,
    filter: "range",
    showIf: { petType: ["Birds"] },
  },

  talkingAbility: {
    label: "Talking Ability",
    type: "boolean",
    required: false,
    showIf: { petType: ["Birds"] },
  },

  species: {
    label: "Species",
    type: "text",
    required: false,
    placeholder: "Species",
    showIf: { petType: ["Reptiles", "Fish", "Small Animals"] },
  },

  length: {
    label: "Length",
    type: "number",
    required: false,
    min: 0,
    filter: "range",
    showIf: { petType: ["Reptiles"] },
  },

  temperament: {
    label: "Temperament",
    type: "text",
    required: false,
    placeholder: "e.g., Calm, Active",
    showIf: { petType: ["Reptiles", "Small Animals"] },
  },

  waterType: {
    label: "Water Type",
    type: "select",
    required: false,
    options: ["Freshwater", "Saltwater"],
    showIf: { petType: ["Fish"] },
  },

  size: {
    label: "Size",
    type: "number",
    required: false,
    min: 0,
    filter: "range",
    showIf: { petType: ["Fish"] },
  },

  weight: {
    label: "Weight",
    type: "number",
    required: false,
    min: 0,
    filter: "range",
    showIf: { petType: ["Farm Animals"] },
  },

  purpose: {
    label: "Purpose",
    type: "select",
    required: false,
    options: ["Meat", "Dairy", "Companion", "Work"],
    showIf: { petType: ["Farm Animals"] },
  },

  images: {
    label: "Images",
    type: "image-upload",
    required: false,
    max: 20,
  },
};
