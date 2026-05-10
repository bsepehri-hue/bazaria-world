import { FormConfig } from "@/types/FormConfig";

export const petsForm: FormConfig = {
  order: [
    "title",
    "description",
    "price",
    "petType",
    "breed",
    "age",
    "sex",
    "vaccinated",
    "microchipped",
    "healthStatus",
    "wingspan",
    "talkingAbility",
    "species",
    "length",
    "temperament",
    "waterType",
    "size",
    "weight",
    "purpose",
    "images",
  ],

  sections: [
    {
      title: "Basic Information",
      fields: ["title", "description", "petType"],
    },
    {
      title: "General Details",
      fields: ["breed", "age", "sex", "healthStatus"],
    },
    {
      title: "Health & Safety",
      fields: ["vaccinated", "microchipped"],
    },
    {
      title: "Bird Details",
      fields: ["wingspan", "talkingAbility"],
    },
    {
      title: "Reptile Details",
      fields: ["species", "length", "temperament"],
    },
    {
      title: "Fish Details",
      fields: ["species", "waterType", "size"],
    },
    {
      title: "Small Animal Details",
      fields: ["species", "temperament"],
    },
    {
      title: "Farm Animal Details",
      fields: ["weight", "purpose"],
    },
    {
      title: "Pricing",
      fields: ["price"],
    },
    {
      title: "Photos",
      fields: ["images"],
    },
  ],

  defaults: {
    sex: "Unknown",
    vaccinated: false,
    microchipped: false,
  },

  validation: {
    title: {
      minLength: 3,
      maxLength: 120,
    },
    description: {
      minLength: 10,
      maxLength: 5000,
    },
    price: {
      min: 0,
      max: 999999,
    },
    age: {
      min: 0,
      max: 200,
    },
    wingspan: {
      min: 0,
      max: 500,
    },
    length: {
      min: 0,
      max: 1000,
    },
    size: {
      min: 0,
      max: 500,
    },
    weight: {
      min: 0,
      max: 5000,
    },
  },
};
