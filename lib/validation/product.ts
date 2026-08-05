import { z } from "zod";

const optionalNumber = z.preprocess(
  (value) => {
    if (value === "" || value === null || value === undefined) {
      return null;
    }

    return Number(value);
  },
  z.number().nonnegative().nullable(),
);

const optionalInteger = z.preprocess(
  (value) => {
    if (value === "" || value === null || value === undefined) {
      return null;
    }

    return Number(value);
  },
  z.number().int().nonnegative().nullable(),
);

export const productAdminSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Numele este obligatoriu.")
      .max(150, "Numele este prea lung."),

    slug: z
      .string()
      .trim()
      .min(2, "Slugul este obligatoriu.")
      .max(160, "Slugul este prea lung.")
      .regex(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        "Folosește doar litere mici, cifre și cratime.",
      ),

    shortDescription: z
      .string()
      .trim()
      .min(10, "Descrierea scurtă este prea scurtă.")
      .max(300, "Descrierea scurtă este prea lungă."),

    description: z
      .string()
      .trim()
      .min(20, "Descrierea este prea scurtă."),

    material: z
      .string()
      .trim()
      .min(2, "Materialul este obligatoriu.")
      .max(150, "Materialul este prea lung."),

    price: optionalNumber,

    priceLabel: z
      .string()
      .trim()
      .max(100, "Eticheta de preț este prea lungă.")
      .optional()
      .or(z.literal("")),

    stock: optionalInteger,

    image: z
      .string()
      .trim()
      .max(500, "Calea imaginii este prea lungă.")
      .optional()
      .or(z.literal("")),

    categoryId: z.preprocess(
      (value) => Number(value),
      z.number().int().positive("Selectează categoria."),
    ),

    position: z.preprocess(
      (value) => Number(value),
      z.number().int().nonnegative(),
    ),

    featured: z.boolean(),
    canBePurchased: z.boolean(),
    isActive: z.boolean(),
  })
  .superRefine((data, context) => {
    if (data.canBePurchased && data.price === null) {
      context.addIssue({
        code: "custom",
        path: ["price"],
        message:
          "Un produs cumpărabil trebuie să aibă un preț.",
      });
    }

    if (data.canBePurchased && data.stock === null) {
      context.addIssue({
        code: "custom",
        path: ["stock"],
        message:
          "Un produs cumpărabil trebuie să aibă stoc.",
      });
    }
  });