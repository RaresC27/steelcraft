"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";

function normalizeText(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeInteger(
  value: FormDataEntryValue | null,
  fallback = 0,
) {
  const number = Number(value);

  return Number.isInteger(number) && number >= 0
    ? number
    : fallback;
}

export async function createSpecification(
  productId: number,
  formData: FormData,
) {
  if (!Number.isInteger(productId) || productId <= 0) {
    return;
  }

  const label = normalizeText(formData.get("label"));
  const value = normalizeText(formData.get("value"));
  const position = normalizeInteger(
    formData.get("position"),
  );

  if (label.length < 2 || value.length < 1) {
    return;
  }

  const product = await prisma.product.findUnique({
    where: {
      id: productId,
    },
    select: {
      id: true,
      slug: true,
    },
  });

  if (!product) {
    return;
  }

  await prisma.productSpecification.create({
    data: {
      label,
      value,
      position,
      productId,
    },
  });

  revalidatePath(
    `/admin/produse/${productId}/specificatii`,
  );
  revalidatePath(`/produse/${product.slug}`);
}

export async function updateSpecification(
  productId: number,
  specificationId: number,
  formData: FormData,
) {
  if (
    !Number.isInteger(productId) ||
    productId <= 0 ||
    !Number.isInteger(specificationId) ||
    specificationId <= 0
  ) {
    return;
  }

  const label = normalizeText(formData.get("label"));
  const value = normalizeText(formData.get("value"));
  const position = normalizeInteger(
    formData.get("position"),
  );

  if (label.length < 2 || value.length < 1) {
    return;
  }

  const specification =
    await prisma.productSpecification.findFirst({
      where: {
        id: specificationId,
        productId,
      },
      select: {
        id: true,
        product: {
          select: {
            slug: true,
          },
        },
      },
    });

  if (!specification) {
    return;
  }

  await prisma.productSpecification.update({
    where: {
      id: specificationId,
    },
    data: {
      label,
      value,
      position,
    },
  });

  revalidatePath(
    `/admin/produse/${productId}/specificatii`,
  );
  revalidatePath(
    `/produse/${specification.product.slug}`,
  );
}

export async function deleteSpecification(
  productId: number,
  specificationId: number,
) {
  if (
    !Number.isInteger(productId) ||
    productId <= 0 ||
    !Number.isInteger(specificationId) ||
    specificationId <= 0
  ) {
    return;
  }

  const specification =
    await prisma.productSpecification.findFirst({
      where: {
        id: specificationId,
        productId,
      },
      select: {
        id: true,
        product: {
          select: {
            slug: true,
          },
        },
      },
    });

  if (!specification) {
    return;
  }

  await prisma.productSpecification.delete({
    where: {
      id: specificationId,
    },
  });

  revalidatePath(
    `/admin/produse/${productId}/specificatii`,
  );
  revalidatePath(
    `/produse/${specification.product.slug}`,
  );
}