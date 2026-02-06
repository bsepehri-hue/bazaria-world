// lib/schemas/generalItems.ts

export const generalItemCategories = {
  electronics: {
    label: "Electronics",
    fields: [
      { key: "brand", type: "text", label: "Brand" },
      { key: "model", type: "text", label: "Model" },
      { key: "condition", type: "select", label: "Condition", options: ["New", "Like New", "Good", "Fair"] },
      { key: "specs", type: "kv", label: "Specifications" }
    ]
  },

  clothing: {
    label: "Clothing & Accessories",
    fields: [
      { key: "size", type: "text", label: "Size" },
      { key: "color", type: "text", label: "Color" },
      { key: "material", type: "text", label: "Material" },
      { key: "gender", type: "select", label: "Gender", options: ["Men", "Women", "Unisex", "Kids"] },
      { key: "condition", type: "select", label: "Condition", options: ["New", "Like New", "Good", "Fair"] }
    ]
  },

  homeFurniture: {
    label: "Home & Furniture",
    fields: [
      { key: "dimensions", type: "text", label: "Dimensions" },
      { key: "material", type: "text", label: "Material" },
      { key: "condition", type: "select", label: "Condition", options: ["New", "Like New", "Good", "Fair"] },
      { key: "weight", type: "text", label: "Weight (optional)" }
    ]
  },

  beauty: {
    label: "Beauty & Personal Care",
    fields: [
      { key: "brand", type: "text", label: "Brand" },
      { key: "condition", type: "select", label: "Condition", options: ["New", "Like New"] },
      { key: "expirationDate", type: "date", label: "Expiration Date (optional)" },
      { key: "sealed", type: "boolean", label: "Sealed" }
    ]
  },

  sports: {
    label: "Sports & Outdoors",
    fields: [
      { key: "brand", type: "text", label: "Brand" },
      { key: "condition", type: "select", label: "Condition", options: ["New", "Like New", "Good", "Fair"] },
      { key: "size", type: "text", label: "Size (optional)" },
      { key: "material", type: "text", label: "Material (optional)" }
    ]
  },

  toys: {
    label: "Toys & Games",
    fields: [
      { key: "ageRange", type: "text", label: "Age Range" },
      { key: "brand", type: "text", label: "Brand" },
      { key: "condition", type: "select", label: "Condition", options: ["New", "Like New", "Good", "Fair"] }
    ]
  },

  books: {
    label: "Books & Media",
    fields: [
      { key: "author", type: "text", label: "Author" },
      { key: "format", type: "select", label: "Format", options: ["Paperback", "Hardcover", "Digital", "Audio"] },
      { key: "condition", type: "select", label: "Condition", options: ["New", "Like New", "Good", "Fair"] }
    ]
  },

  collectibles: {
    label: "Collectibles",
    fields: [
      { key: "rarity", type: "text", label: "Rarity" },
      { key: "certification", type: "text", label: "Certification" },
      { key: "condition", type: "select", label: "Condition", options: ["New", "Like New", "Good", "Fair"] },
      { key: "edition", type: "text", label: "Edition" }
    ]
  },

  misc: {
    label: "Miscellaneous",
    fields: [
      { key: "attributes", type: "kv", label: "Attributes" }
    ]
  }
};
