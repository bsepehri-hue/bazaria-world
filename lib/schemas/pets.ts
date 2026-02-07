import { z } from "zod";

export const petsSchema = z.object({
  // Universal
  title: z.string().min(3).max(120),
  description: z.string().min(10).max(5000),
  price: z.number().min(0),
  petType: z.enum([
    "Dogs",
    "Cats",
    "Birds",
    "Reptiles",
    "Fish",
    "Small Animals",
    "Farm Animals",
  ]),
  breed: z.string().optional(),
  age: z.number().min(0).max(200).optional(),
  sex: z.enum(["Male", "Female", "Unknown"]).optional(),
  vaccinated: z.boolean().optional(),
  microchipped: z.boolean().optional(),
  healthStatus: z.string().optional(),
  images: z.array(z.string()).optional(),

  // Birds
  wingspan: z.number().min(0).optional(),
  talkingAbility: z.boolean().optional(),

  // Reptiles
  species: z.string().optional(),
  length: z.number().min(0).optional(),
  temperament: z.string().optional(),

  // Fish
  waterType: z.enum(["Freshwater", "Saltwater"]).optional(),
  size: z.number().min(0).optional(),

  // Small Animals
  smallAnimalSpecies: z.string().optional(),

  // Farm Animals
  weight: z.number().min(0).optional(),
  purpose: z.enum(["Meat", "Dairy", "Companion", "Work"]).optional(),
});
