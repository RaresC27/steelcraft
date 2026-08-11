import { z } from "zod";

import {
  isValidRomaniaCounty,
  isValidRomaniaLocation,
} from "@/lib/romania-locations";

export const customProjectSchema = z
  .object({
    projectType: z
      .string()
      .trim()
      .min(1, "Selectează tipul proiectului.")
      .max(100),

    material: z
      .string()
      .trim()
      .max(100)
      .optional()
      .or(z.literal("")),

    finish: z
      .string()
      .trim()
      .max(100)
      .optional()
      .or(z.literal("")),

    usage: z
      .string()
      .trim()
      .max(100)
      .optional()
      .or(z.literal("")),

    lengthValue: z
      .number()
      .positive()
      .max(100000)
      .nullable(),

    widthValue: z
      .number()
      .positive()
      .max(100000)
      .nullable(),

    heightValue: z
      .number()
      .positive()
      .max(100000)
      .nullable(),

    dimensionUnit: z.enum([
      "mm",
      "cm",
      "m",
    ]),

    quantity: z
      .number()
      .int()
      .positive()
      .max(10000)
      .nullable(),

    needsRecommendation:
      z.boolean(),

    customerName: z
      .string()
      .trim()
      .min(
        2,
        "Introdu numele complet.",
      )
      .max(100),

    email: z
      .string()
      .trim()
      .toLowerCase()
      .email(
        "Adresa de email nu este validă.",
      )
      .max(150),

    phone: z
      .string()
      .trim()
      .min(
        7,
        "Introdu un număr de telefon valid.",
      )
      .max(30),

    company: z
      .string()
      .trim()
      .max(150)
      .optional()
      .or(z.literal("")),

    vatNumber: z
      .string()
      .trim()
      .max(30)
      .optional()
      .or(z.literal("")),

    county: z
      .string()
      .trim()
      .min(
        1,
        "Selectează județul.",
      ),

    city: z
      .string()
      .trim()
      .min(
        1,
        "Selectează localitatea.",
      ),

    notes: z
      .string()
      .trim()
      .min(
        10,
        "Descrie proiectul în cel puțin 10 caractere.",
      )
      .max(
        3000,
        "Descrierea este prea lungă.",
      ),
  })
  .superRefine((data, context) => {
    if (
      data.county &&
      !isValidRomaniaCounty(
        data.county,
      )
    ) {
      context.addIssue({
        code: "custom",
        path: ["county"],
        message:
          "Județul selectat nu este valid.",
      });
    }

    if (
      data.county &&
      data.city &&
      !isValidRomaniaLocation(
        data.county,
        data.city,
      )
    ) {
      context.addIssue({
        code: "custom",
        path: ["city"],
        message:
          "Localitatea nu aparține județului selectat.",
      });
    }
  });

export type CustomProjectInput =
  z.infer<
    typeof customProjectSchema
  >;