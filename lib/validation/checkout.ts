import { z } from "zod";

const romanianPhoneRegex =
  /^(?:\+40|0040|0)7\d{8}$/;

const postalCodeRegex = /^\d{6}$/;

export const checkoutSchema = z.object({
  customerName: z
    .string()
    .trim()
    .min(2, "Numele trebuie să conțină cel puțin 2 caractere.")
    .max(100, "Numele este prea lung."),

  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Adresa de email nu este validă.")
    .max(150, "Adresa de email este prea lungă."),

  phone: z
    .string()
    .trim()
    .transform((value) =>
      value.replace(/[\s()-]/g, ""),
    )
    .refine(
      (value) => romanianPhoneRegex.test(value),
      "Introdu un număr de telefon mobil valid din România.",
    ),

  company: z
    .string()
    .trim()
    .max(150, "Denumirea firmei este prea lungă.")
    .optional()
    .or(z.literal("")),

  vatNumber: z
    .string()
    .trim()
    .max(20, "CUI-ul este prea lung.")
    .optional()
    .or(z.literal("")),

  county: z
    .string()
    .trim()
    .min(2, "Județul este obligatoriu.")
    .max(100, "Județul este prea lung."),

  city: z
    .string()
    .trim()
    .min(2, "Localitatea este obligatorie.")
    .max(100, "Localitatea este prea lungă."),

  address: z
    .string()
    .trim()
    .min(5, "Adresa trebuie să conțină cel puțin 5 caractere.")
    .max(250, "Adresa este prea lungă."),

  postalCode: z
    .string()
    .trim()
    .refine(
      (value) =>
        value.length === 0 || postalCodeRegex.test(value),
      "Codul poștal trebuie să conțină exact 6 cifre.",
    ),

  notes: z
    .string()
    .trim()
    .max(1000, "Observațiile nu pot depăși 1000 de caractere.")
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
          .positive("Produs invalid."),
        quantity: z
          .number()
          .int()
          .positive("Cantitate invalidă.")
          .max(100, "Cantitatea este prea mare."),
      }),
    )
    .min(1, "Coșul de cumpărături este gol."),
});

export type CheckoutInput = z.infer<
  typeof checkoutSchema
>;