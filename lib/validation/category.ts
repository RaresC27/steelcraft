import { z } from "zod";

export const categoryAdminSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Numele categoriei este obligatoriu.")
    .max(120, "Numele categoriei este prea lung."),

  slug: z
    .string()
    .trim()
    .min(2, "Slugul este obligatoriu.")
    .max(140, "Slugul este prea lung.")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Folosește doar litere mici, cifre și cratime.",
    ),

  eyebrow: z
    .string()
    .trim()
    .max(100, "Textul scurt este prea lung.")
    .optional()
    .or(z.literal("")),

  description: z
    .string()
    .trim()
    .min(10, "Descrierea trebuie să aibă minimum 10 caractere.")
    .max(1000, "Descrierea este prea lungă."),

  position: z.preprocess(
    (value) => Number(value),
    z.number().int().nonnegative(),
  ),

  isActive: z.boolean(),
});