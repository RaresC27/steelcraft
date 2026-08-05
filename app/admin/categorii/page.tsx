import Link from "next/link";

import { CategoryActions } from "@/components/admin/category-actions"
import { prisma } from "@/lib/prisma";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: {
          products: true,
        },
      },
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
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-condensed text-sm font-bold uppercase tracking-[0.2em] text-primary">
              Administrare
            </p>

            <h1 className="font-display mt-2 text-5xl uppercase text-[#111111]">
              Categorii
            </h1>

            <p className="mt-2 text-neutral-600">
              Gestionează structura catalogului de produse.
            </p>
          </div>

          <Link
            href="/admin/categorii/nou"
            className="font-condensed inline-flex min-h-12 items-center justify-center rounded-sm bg-primary px-6 text-sm font-bold uppercase tracking-[0.12em] text-white transition hover:opacity-90"
          >
            Adaugă categorie
          </Link>
        </div>

        <div className="mb-6 flex flex-wrap gap-3">
          <Link
            href="/admin/comenzi"
            className="font-condensed rounded-sm border border-neutral-300 bg-white px-4 py-2 text-sm font-bold uppercase tracking-[0.08em] text-neutral-700"
          >
            Comenzi
          </Link>

          <Link
            href="/admin/produse"
            className="font-condensed rounded-sm border border-neutral-300 bg-white px-4 py-2 text-sm font-bold uppercase tracking-[0.08em] text-neutral-700"
          >
            Produse
          </Link>

          <Link
            href="/admin/categorii"
            className="font-condensed rounded-sm border border-primary bg-primary px-4 py-2 text-sm font-bold uppercase tracking-[0.08em] text-white"
          >
            Categorii
          </Link>
        </div>

        <section className="overflow-hidden border border-neutral-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] border-collapse">
              <thead className="bg-[#111111] text-white">
                <tr>
                  <th className="px-5 py-4 text-left font-condensed text-sm uppercase tracking-wider">
                    Categorie
                  </th>

                  <th className="px-5 py-4 text-left font-condensed text-sm uppercase tracking-wider">
                    Produse
                  </th>

                  <th className="px-5 py-4 text-left font-condensed text-sm uppercase tracking-wider">
                    Poziție
                  </th>

                  <th className="px-5 py-4 text-left font-condensed text-sm uppercase tracking-wider">
                    Status
                  </th>

                  <th className="px-5 py-4 text-right font-condensed text-sm uppercase tracking-wider">
                    Acțiuni
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-neutral-200">
                {categories.map((category) => (
                  <tr
                    key={category.id}
                    className="transition hover:bg-neutral-50"
                  >
                    <td className="px-5 py-4">
                      <p className="font-condensed font-bold uppercase text-[#111111]">
                        {category.name}
                      </p>

                      <p className="mt-1 text-xs text-neutral-500">
                        {category.slug}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-sm text-neutral-700">
                      {category._count.products}
                    </td>

                    <td className="px-5 py-4 text-sm text-neutral-700">
                      {category.position}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={[
                          "inline-flex px-3 py-1 font-condensed text-xs font-bold uppercase tracking-wider",
                          category.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-neutral-100 text-neutral-600",
                        ].join(" ")}
                      >
                        {category.isActive
                          ? "Activă"
                          : "Inactivă"}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-right">
                      <div className="flex flex-col items-end gap-2">
                        <Link
                          href={`/admin/categorii/${category.id}/editare`}
                          className="font-condensed inline-flex min-h-10 items-center justify-center border border-[#111111] px-4 text-xs font-bold uppercase tracking-wider text-[#111111] transition hover:bg-[#111111] hover:text-white"
                        >
                          Editează
                        </Link>

                        <CategoryActions
                          categoryId={category.id}
                          categoryName={category.name}
                          isActive={category.isActive}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}