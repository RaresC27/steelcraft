"use server";

import { prisma } from "@/lib/prisma";
import type { ContactFormState } from "./form-state";

export async function submitContactForm(
  previousState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const subject = String(formData.get("subject") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  const productSlug = String(
    formData.get("productSlug") ?? "",
  ).trim();

  if (!name || !email || !subject || !message) {
    return {
      success: false,
      message: "Completează toate câmpurile obligatorii.",
    };
  }

  try {
    const product = productSlug
      ? await prisma.product.findUnique({
          where: {
            slug: productSlug,
          },
          select: {
            id: true,
          },
        })
      : null;

    await prisma.contactMessage.create({
      data: {
        name,
        email,
        phone: phone || null,
        subject,
        message,
        status: "NEW",
        productId: product?.id ?? null,
      },
    });

    return {
      success: true,
      message: "Mesajul a fost trimis cu succes.",
    };
  } catch (error) {
    console.error("Contact form error:", error);

    return {
      success: false,
      message:
        "A apărut o eroare. Te rugăm să încerci din nou.",
    };
  }
}