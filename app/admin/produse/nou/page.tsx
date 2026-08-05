import Link from "next/link";

import { ProductForm } from "@/components/admin/product-form";
import { prisma } from "@/lib/prisma";

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({
    where: {
      isActive: true,
    },
    select: {
      id: true,
      name: true,
    },
    orderBy: [
      {
        position: "asc",
      },
      {
        name: "asc",
      },
    ],
  });

  return (
    <main className="min-h-screen bg-neutral-100 py-10">
      <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            href="/admin/produse"
            className="font-condensed text-sm font-bold uppercase tracking-[0.1em] text-neutral-500 transition hover:text-primary"
          >
            ← Înapoi la produse
          </Link>

          <p className="font-condensed mt-6 text-sm font-bold uppercase tracking-[0.2em] text-primary">
            Administrare produse
          </p>

          <h1 className="font-display mt-2 text-5xl uppercase text-[#111111]">
            Produs nou
          </h1>

          <p className="mt-2 max-w-2xl leading-7 text-neutral-600">
            Completează informațiile produsului. Specificațiile
            tehnice și încărcarea imaginilor vor putea fi gestionate
            separat după salvare.
          </p>
        </div>

        {categories.length > 0 ? (
          <ProductForm categories={categories} />
        ) : (
          <section className="border border-yellow-200 bg-yellow-50 p-6 text-yellow-900">
            <h2 className="font-condensed text-lg font-bold uppercase">
              Nu există categorii active
            </h2>

            <p className="mt-2 text-sm leading-6">
              Creează sau activează cel puțin o categorie înainte de
              a adăuga produse.
            </p>
          </section>
        )}
      </div>
    </main>
  );
}