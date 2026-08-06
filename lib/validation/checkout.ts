import { z } from "zod";

import {
  isValidRomaniaCounty,
  isValidRomaniaLocation,
} from "@/lib/romania-locations";

const romanianPhoneRegex =
  /^(?:\+40|0040|0)7\d{8}$/;

const postalCodeRegex = /^\d{6}$/;

export const checkoutSchema = z
  .object({
    customerName: z
      .string()
      .trim()
      .min(
        2,
        "Numele trebuie să conțină cel puțin 2 caractere.",
      )
      .max(
        100,
        "Numele este prea lung.",
      ),

    email: z
      .string()
      .trim()
      .toLowerCase()
      .email(
        "Adresa de email nu este validă.",
      )
      .max(
        150,
        "Adresa de email este prea lungă.",
      ),

    phone: z
      .string()
      .trim()
      .transform((value) =>
        value.replace(/[\s()-]/g, ""),
      )
      .refine(
        (value) =>
          romanianPhoneRegex.test(value),
        "Introdu un număr de telefon mobil valid din România.",
      ),

    company: z
      .string()
      .trim()
      .max(
        150,
        "Denumirea firmei este prea lungă.",
      )
      .optional()
      .or(z.literal("")),

    vatNumber: z
      .string()
      .trim()
      .toUpperCase()
      .max(
        20,
        "CUI-ul este prea lung.",
      )
      .optional()
      .or(z.literal("")),

    county: z
      .string()
      .trim()
      .min(
        1,
        "Selectează județul.",
      )
      .max(
        100,
        "Județul este prea lung.",
      ),

    city: z
      .string()
      .trim()
      .min(
        1,
        "Selectează localitatea.",
      )
      .max(
        150,
        "Localitatea este prea lungă.",
      ),

    address: z
      .string()
      .trim()
      .min(
        5,
        "Adresa trebuie să conțină cel puțin 5 caractere.",
      )
      .max(
        250,
        "Adresa este prea lungă.",
      ),

    postalCode: z
      .string()
      .trim()
      .refine(
        (value) =>
          value.length === 0 ||
          postalCodeRegex.test(value),
        "Codul poștal trebuie să conțină exact 6 cifre.",
      ),

    notes: z
      .string()
      .trim()
      .max(
        1000,
        "Observațiile nu pot depăși 1000 de caractere.",
      )
      .optional()
      .or(z.literal("")),

    paymentMethod: z.enum([
      "CASH_ON_DELIVERY",
      "CARD",
    ]),

    items: z
      .array(
        z.object({
          productId: z
            .number()
            .int()
            .positive(
              "Produs invalid.",
            ),

          quantity: z
            .number()
            .int()
            .positive(
              "Cantitate invalidă.",
            )
            .max(
              100,
              "Cantitatea este prea mare.",
            ),
        }),
      )
      .min(
        1,
        "Coșul de cumpărături este gol.",
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

    if (
      data.paymentMethod === "CARD"
    ) {
      context.addIssue({
        code: "custom",
        path: ["paymentMethod"],
        message:
          "Plata cu cardul nu este disponibilă momentan.",
      });
    }
  });

export type CheckoutInput =
  z.infer<typeof checkoutSchema>;