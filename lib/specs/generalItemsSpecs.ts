import { FieldSpec } from "@/types/FieldSpec";

export const generalItemsSpecs: Record<string, FieldSpec> = {
  title: {
    label: "Title",
    type: "text",
    required: true,
    placeholder: "e.g., iPhone 12, Wooden Desk, Running Shoes",
    filter: "text",
  },

  description: {
    label: "Description",
    type: "textarea",
    required: true,
    placeholder: "Describe the item clearly...",
  },

  price: {
    label: "Price",
    type: "number",
    required: true,
    min: 0,
    filter: "range",
  },

  condition: {
    label: "Condition",
    type: "select",
    required: true,
    options: [
      "New",
      "Like New",
      "Good",
      "Fair",
      "Poor",
    ],
    filter: "select",
  },

  brand: {
    label: "Brand",
    type: "text",
    required: false,
    placeholder: "Optional brand name",
    filter: "text",
  },

  category: {
    label: "Category",
    type: "select",
    required: true,
    options: [
      "Electronics",
      "Clothing & Accessories",
      "Home & Furniture",
      "Beauty & Personal Care",
      "Sports & Outdoors",
      "Toys & Games",
      "Books & Media",
      "Collectibles",
      "Misc",
    ],
    filter: "select",
  },

  images: {
    label: "Images",
    type: "image-upload",
    required: false,
    max: 10,
  },
};
