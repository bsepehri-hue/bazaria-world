import { DetailConfig } from "@/types/DetailConfig";

export const petsDetails: DetailConfig = {
  layout: [
    {
      title: "Overview",
      fields: ["title", "price", "petType", "breed", "age", "sex"],
    },
    {
      title: "Description",
      fields: ["description"],
    },
    {
      title: "Health & Safety",
      fields: ["vaccinated", "microchipped", "healthStatus"],
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
      title: "Photos",
      fields: ["images"],
    },
  ],

  display: {
    title: {
      variant: "heading",
    },
    price: {
      variant: "price",
      prefix: "$",
    },
    petType: {
      variant: "badge",
      colorMap: {
        Dogs: "teal",
        Cats: "emerald",
        Birds: "amber",
        Reptiles: "burgundy",
        Fish: "teal",
        "Small Animals": "amber",
        "Farm Animals": "emerald",
      },
    },
    breed: {
      variant: "text",
      emptyState: "—",
    },
    age: {
      variant: "text",
      suffix: " yrs",
      emptyState: "—",
    },
    sex: {
      variant: "text",
      emptyState: "—",
    },
    description: {
      variant: "paragraph",
    },
    vaccinated: {
      variant: "boolean",
      trueLabel: "Yes",
      falseLabel: "No",
      emptyState: "—",
    },
    microchipped: {
      variant: "boolean",
      trueLabel: "Yes",
      falseLabel: "No",
      emptyState: "—",
    },
    healthStatus: {
      variant: "text",
      emptyState: "—",
    },
    wingspan: {
      variant: "text",
      suffix: " cm",
      emptyState: "—",
    },
    talkingAbility: {
      variant: "boolean",
      trueLabel: "Yes",
      falseLabel: "No",
      emptyState: "—",
    },
    species: {
      variant: "text",
      emptyState: "—",
    },
    length: {
      variant: "text",
      suffix: " cm",
      emptyState: "—",
    },
    temperament: {
      variant: "text",
      emptyState: "—",
    },
    waterType: {
      variant: "text",
      emptyState: "—",
    },
    size: {
      variant: "text",
      suffix: " cm",
      emptyState: "—",
    },
    weight: {
      variant: "text",
      suffix: " lbs",
      emptyState: "—",
    },
    purpose: {
      variant: "text",
      emptyState: "—",
    },
    images: {
      variant: "gallery",
    },
  },
};
