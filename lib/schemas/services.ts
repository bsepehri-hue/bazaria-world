import { z } from "zod";

export const servicesSchema = z.object({
  // Universal
  title: z.string().min(3).max(120),
  description: z.string().min(10).max(5000),
  price: z.number().min(0).optional(),
  hourlyRate: z.number().min(0).optional(),
  serviceType: z.enum([
    "Home Services",
    "Skilled Trades",
    "Professional Services",
    "Lessons & Coaching",
    "Beauty & Wellness",
    "Event Services",
    "Automotive Services",
    "Tech Services",
    "Pet Services",
    "Misc Services",
  ]),

  location: z.string().min(2),
  mobileService: z.boolean().optional(),
  availability: z.string().optional(),

  // Skilled Trades
  licenseNumber: z.string().optional(),
  insured: z.boolean().optional(),

  // Professional Services
  certification: z.string().optional(),

  // Lessons & Coaching
  skillLevel: z.enum(["Beginner", "Intermediate", "Advanced"]).optional(),

  // Beauty & Wellness
  durationMinutes: z.number().min(0).optional(),

  // Event Services
  eventType: z.string().optional(),

  // Automotive Services
  vehicleSpecialty: z.string().optional(),

  // Tech Services
  platformSpecialty: z.string().optional(),

  // Pet Services
  petSpecialty: z.string().optional(),

  images: z.array(z.string()).optional(),
});
