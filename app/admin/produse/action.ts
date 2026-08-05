"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import type { ProductFormState } from "@/app/admin/produse/form-state";
import { prisma } from "@/lib/prisma";
import { productAdminSchema } from "@/lib/validation/product";

function getBoolean(formData: FormData, name: string) {
  return formData.get(name) === "on";
}

function getImagePath(formData: FormData) {
  const imageValue = formData.get("image");

  if (typeof imageValue !== "string") {
    return null;
  }

  const imagePath = imageValue.trim();

  return imagePath.length > 0 ? imagePath : null;
}

function getProductInput(formData: FormData) {
  return {
    name: formData.get("name"),
    slug: formData.get("slug"),
    shortDescription: formData.get("shortDescription"),
    description: formData.get("description"),
    material: formData.get("material"),
    price: formData.get("price"),
    priceLabel: formData.get("priceLabel"),
    stock: formData.get("stock"),
    image: getImagePath(formData) ?? "",
    categoryId: formData.get("categoryId"),
    position: formData.get("position") ?? "0",
    featured: getBoolean(formData, "featured"),
    canBePurchased: getBoolean(
      formData,
      "canBePurchased",
    ),
    isActive: getBoolean(formData, "isActive"),
  };
}

export async function createProduct(
  _previousState: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  const parsed = productAdminSchema.safeParse(
    getProductInput(formData),
  );

  if (!parsed.success) {
    return {
      success: false,
      message: "Verifică informațiile introduse.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const existingProduct =
    await prisma.product.findUnique({
      where: {
        slug: parsed.data.slug,
      },
      select: {
        id: true,
      },
    });

  if (existingProduct) {
    return {
      success: false,
      message: "Există deja un produs cu acest slug.",
      errors: {
        slug: ["Alege un slug diferit."],
      },
    };
  }

  const imagePath = getImagePath(formData);

  await prisma.product.create({
    data: {
      name: parsed.data.name,
      slug: parsed.data.slug,
      shortDescription:
        parsed.data.shortDescription,
      description: parsed.data.description,
      material: parsed.data.material,
      price: parsed.data.price,
      priceLabel:
        parsed.data.priceLabel || null,
      stock: parsed.data.stock,

      /*
       * Folosim direct valoarea din FormData.
       * Aceasta este calea returnată de endpoint-ul de upload.
       */
      image: imagePath,

      categoryId: parsed.data.categoryId,
      position: parsed.data.position,
      featured: parsed.data.featured,
      canBePurchased:
        parsed.data.canBePurchased,
      isActive: parsed.data.isActive,
    },
  });

  revalidatePath("/");
  revalidatePath("/produse");
  revalidatePath(
    `/produse/${parsed.data.slug}`,
  );
  revalidatePath("/admin/produse");

  redirect("/admin/produse");
}

export async function updateProduct(
  productId: number,
  _previousState: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  if (
    !Number.isInteger(productId) ||
    productId <= 0
  ) {
    return {
      success: false,
      message: "Produsul selectat nu este valid.",
      errors: {},
    };
  }

  const parsed = productAdminSchema.safeParse(
    getProductInput(formData),
  );

  if (!parsed.success) {
    return {
      success: false,
      message: "Verifică informațiile introduse.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const currentProduct =
    await prisma.product.findUnique({
      where: {
        id: productId,
      },
      select: {
        id: true,
        slug: true,
      },
    });

  if (!currentProduct) {
    return {
      success: false,
      message: "Produsul nu mai există.",
      errors: {},
    };
  }

  const productWithSameSlug =
    await prisma.product.findFirst({
      where: {
        slug: parsed.data.slug,
        id: {
          not: productId,
        },
      },
      select: {
        id: true,
      },
    });

  if (productWithSameSlug) {
    return {
      success: false,
      message: "Există deja un produs cu acest slug.",
      errors: {
        slug: ["Alege un slug diferit."],
      },
    };
  }

  console.log(
    "IMAGE DIRECT DIN FORMDATA:",
    formData.get("image"),
  );

  const imagePath = getImagePath(formData);

  console.log(
    "IMAGE DUPĂ getImagePath:",
    imagePath,
  );

  const updatedProduct =
    await prisma.product.update({
      where: {
        id: productId,
      },
      data: {
        name: parsed.data.name,
        slug: parsed.data.slug,
        shortDescription:
          parsed.data.shortDescription,
        description: parsed.data.description,
        material: parsed.data.material,
        price: parsed.data.price,
        priceLabel:
          parsed.data.priceLabel || null,
        stock: parsed.data.stock,

        /*
         * Nu mai folosim parsed.data.image aici.
         * Luăm direct valoarea trimisă de uploader.
         */
        image: imagePath,

        categoryId: parsed.data.categoryId,
        position: parsed.data.position,
        featured: parsed.data.featured,
        canBePurchased:
          parsed.data.canBePurchased,
        isActive: parsed.data.isActive,
      },
      select: {
        id: true,
        slug: true,
        image: true,
      },
    });

  console.log(
    "Imagine salvată în Prisma:",
    updatedProduct.image,
  );

  revalidatePath("/");
  revalidatePath("/produse");
  revalidatePath(
    `/produse/${currentProduct.slug}`,
  );
  revalidatePath(
    `/produse/${parsed.data.slug}`,
  );
  revalidatePath("/admin/produse");
  revalidatePath(
    `/admin/produse/${productId}/editare`,
  );

  redirect("/admin/produse");
}

export async function toggleProductActive(
  productId: number,
  isActive: boolean,
) {
  if (
    !Number.isInteger(productId) ||
    productId <= 0
  ) {
    return;
  }

  const product = await prisma.product.update({
    where: {
      id: productId,
    },
    data: {
      isActive,
    },
    select: {
      slug: true,
    },
  });

  revalidatePath("/");
  revalidatePath("/produse");
  revalidatePath(
    `/produse/${product.slug}`,
  );
  revalidatePath("/admin/produse");
}

export async function deleteProduct(
  productId: number,
) {
  if (
    !Number.isInteger(productId) ||
    productId <= 0
  ) {
    return;
  }

  const product =
    await prisma.product.findUnique({
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

  const orderItemCount =
    await prisma.orderItem.count({
      where: {
        productId,
      },
    });

  if (orderItemCount > 0) {
    await prisma.product.update({
      where: {
        id: productId,
      },
      data: {
        isActive: false,
        canBePurchased: false,
      },
    });
  } else {
    await prisma.product.delete({
      where: {
        id: productId,
      },
    });
  }

  revalidatePath("/");
  revalidatePath("/produse");
  revalidatePath(
    `/produse/${product.slug}`,
  );
  revalidatePath("/admin/produse");
}