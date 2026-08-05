import Link from "next/link";
import { notFound } from "next/navigation";

import { CategoryForm } from "@/components/admin/category-form";
import { prisma } from "@/lib/prisma";

type EditCategoryPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditCategoryPage({
  params,
}: EditCategoryPageProps) {
  const { id } = await params;
  const categoryId = Number(id);

  if (!Number.isInteger(categoryId) || categoryId <= 0) {
    notFound();
  }

  const category = await prisma.category.findUnique({
    where: {
      id: categoryId,
    },
    select: {
      id: true,
      name: true,
      slug: true,
      eyebrow: true,
      description: true,
      position: true,
      isActive: true,
    },
  });

  if (!category) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-neutral-100 py-10">
      <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            href="/admin/categorii"
            className="font-condensed text-sm font-bold uppercase tracking-[0.1em] text-neutral-500 transition hover:text-primary"
          >
            ← Înapoi la categorii
          </Link>

          <p className="font-condensed mt-6 text-sm font-bold uppercase tracking-[0.2em] text-primary">
            Administrare categorii
          </p>

          <h1 className="font-display mt-2 text-5xl uppercase text-[#111111]">
            Editează categoria
          </h1>
        </div>

        <CategoryForm category={category} />
      </div>
    </main>
  );
}