    "use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import type { CategoryFormState } from "@/app/admin/categorii/form-state";
import { prisma } from "@/lib/prisma";
import { categoryAdminSchema } from "@/lib/validation/category";

function getBoolean(formData: FormData, name: string) {
  return formData.get(name) === "on";
}

function getCategoryInput(formData: FormData) {
  return {
    name: formData.get("name"),
    slug: formData.get("slug"),
    eyebrow: formData.get("eyebrow"),
    description: formData.get("description"),
    position: formData.get("position") ?? "0",
    isActive: getBoolean(formData, "isActive"),
  };
}

export async function createCategory(
  _previousState: CategoryFormState,
  formData: FormData,
): Promise<CategoryFormState> {
  const parsed = categoryAdminSchema.safeParse(
    getCategoryInput(formData),
  );

  if (!parsed.success) {
    return {
      success: false,
      message: "Verifică informațiile introduse.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const existingCategory =
    await prisma.category.findUnique({
      where: {
        slug: parsed.data.slug,
      },
      select: {
        id: true,
      },
    });

  if (existingCategory) {
    return {
      success: false,
      message: "Există deja o categorie cu acest slug.",
      errors: {
        slug: ["Alege un slug diferit."],
      },
    };
  }

  await prisma.category.create({
    data: {
      name: parsed.data.name,
      slug: parsed.data.slug,
      eyebrow: parsed.data.eyebrow || null,
      description: parsed.data.description,
      position: parsed.data.position,
      isActive: parsed.data.isActive,
    },
  });

  revalidatePath("/");
  revalidatePath("/produse");
  revalidatePath("/admin/categorii");
  revalidatePath("/admin/produse");

  redirect("/admin/categorii");
}

export async function updateCategory(
  categoryId: number,
  _previousState: CategoryFormState,
  formData: FormData,
): Promise<CategoryFormState> {
  if (!Number.isInteger(categoryId) || categoryId <= 0) {
    return {
      success: false,
      message: "Categoria selectată nu este validă.",
      errors: {},
    };
  }

  const parsed = categoryAdminSchema.safeParse(
    getCategoryInput(formData),
  );

  if (!parsed.success) {
    return {
      success: false,
      message: "Verifică informațiile introduse.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const currentCategory =
    await prisma.category.findUnique({
      where: {
        id: categoryId,
      },
      select: {
        id: true,
        slug: true,
      },
    });

  if (!currentCategory) {
    return {
      success: false,
      message: "Categoria nu mai există.",
      errors: {},
    };
  }

  const categoryWithSameSlug =
    await prisma.category.findFirst({
      where: {
        slug: parsed.data.slug,
        id: {
          not: categoryId,
        },
      },
      select: {
        id: true,
      },
    });

  if (categoryWithSameSlug) {
    return {
      success: false,
      message: "Există deja o categorie cu acest slug.",
      errors: {
        slug: ["Alege un slug diferit."],
      },
    };
  }

  await prisma.category.update({
    where: {
      id: categoryId,
    },
    data: {
      name: parsed.data.name,
      slug: parsed.data.slug,
      eyebrow: parsed.data.eyebrow || null,
      description: parsed.data.description,
      position: parsed.data.position,
      isActive: parsed.data.isActive,
    },
  });

  revalidatePath("/");
  revalidatePath("/produse");
  revalidatePath("/admin/categorii");
  revalidatePath("/admin/produse");

  redirect("/admin/categorii");
}

export async function toggleCategoryActive(
  categoryId: number,
  isActive: boolean,
) {
  if (!Number.isInteger(categoryId) || categoryId <= 0) {
    return;
  }

  await prisma.category.update({
    where: {
      id: categoryId,
    },
    data: {
      isActive,
    },
  });

  revalidatePath("/");
  revalidatePath("/produse");
  revalidatePath("/admin/categorii");
}

export async function deleteCategory(categoryId: number) {
  if (!Number.isInteger(categoryId) || categoryId <= 0) {
    return {
      success: false,
      message: "Categoria nu este validă.",
    };
  }

  const category = await prisma.category.findUnique({
    where: {
      id: categoryId,
    },
    select: {
      id: true,
      _count: {
        select: {
          products: true,
        },
      },
    },
  });

  if (!category) {
    return {
      success: false,
      message: "Categoria nu mai există.",
    };
  }

  if (category._count.products > 0) {
    return {
      success: false,
      message:
        "Categoria nu poate fi ștearsă deoarece conține produse.",
    };
  }

  await prisma.category.delete({
    where: {
      id: categoryId,
    },
  });

  revalidatePath("/");
  revalidatePath("/produse");
  revalidatePath("/admin/categorii");

  return {
    success: true,
    message: "Categoria a fost ștearsă.",
  };
}