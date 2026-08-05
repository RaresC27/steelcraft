import Link from "next/link";

import { prisma } from "@/lib/prisma";

function formatPrice(value: number | null) {
  if (value === null) {
    return "La cerere";
  }

  return new Intl.NumberFormat("ro-RO", {
    style: "currency",
    currency: "RON",
  }).format(value);
}

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: {
      category: {
        select: {
          name: true,
        },
      },
      _count: {
        select: {
          specifications: true,
        },
      },
    },
    orderBy: [
      {
        position: "asc",
      },
      {
        createdAt: "desc",
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
              Produse
            </h1>

            <p className="mt-2 text-neutral-600">
              Adaugă și gestionează produsele magazinului.
            </p>
          </div>

          <Link
            href="/admin/produse/nou"
            className="font-condensed inline-flex min-h-12 items-center justify-center rounded-sm bg-primary px-6 text-sm font-bold uppercase tracking-[0.12em] text-white transition hover:opacity-90"
          >
            Adaugă produs
          </Link>
        </div>

        <div className="mb-6 flex flex-wrap gap-3">
          <Link
            href="/admin/comenzi"
            className="font-condensed rounded-sm border border-neutral-300 bg-white px-4 py-2 text-sm font-bold uppercase tracking-[0.08em] text-neutral-700 transition hover:border-primary hover:text-primary"
          >
            Comenzi
          </Link>

          <Link
            href="/admin/produse"
            className="font-condensed rounded-sm border border-primary bg-primary px-4 py-2 text-sm font-bold uppercase tracking-[0.08em] text-white"
          >
            Produse
          </Link>
        </div>

        {products.length === 0 ? (
          <section className="border border-neutral-200 bg-white px-6 py-16 text-center shadow-sm">
            <h2 className="font-display text-3xl uppercase text-[#111111]">
              Nu există produse
            </h2>

            <p className="mt-2 text-neutral-600">
              Adaugă primul produs din panoul de administrare.
            </p>
          </section>
        ) : (
          <section className="overflow-hidden border border-neutral-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1050px] border-collapse">
                <thead className="bg-[#111111] text-white">
                  <tr>
                    <th className="px-5 py-4 text-left font-condensed text-sm uppercase tracking-wider">
                      Produs
                    </th>

                    <th className="px-5 py-4 text-left font-condensed text-sm uppercase tracking-wider">
                      Categorie
                    </th>

                    <th className="px-5 py-4 text-left font-condensed text-sm uppercase tracking-wider">
                      Preț
                    </th>

                    <th className="px-5 py-4 text-left font-condensed text-sm uppercase tracking-wider">
                      Stoc
                    </th>

                    <th className="px-5 py-4 text-left font-condensed text-sm uppercase tracking-wider">
                      Vânzare online
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
                  {products.map((product) => (
                    <tr
                      key={product.id}
                      className="transition hover:bg-neutral-50"
                    >
                      <td className="px-5 py-4">
                        <p className="font-condensed font-bold uppercase text-[#111111]">
                          {product.name}
                        </p>

                        <p className="mt-1 text-xs text-neutral-500">
                          /produse/{product.slug}
                        </p>

                        <p className="mt-1 text-xs text-neutral-400">
                          {product._count.specifications} specificații
                        </p>
                      </td>

                      <td className="px-5 py-4 text-sm text-neutral-700">
                        {product.category.name}
                      </td>

                      <td className="px-5 py-4 font-condensed text-base font-bold text-[#111111]">
                        {formatPrice(
                          product.price === null
                            ? null
                            : Number(product.price),
                        )}
                      </td>

                      <td className="px-5 py-4 text-sm text-neutral-700">
                        {product.stock ?? "—"}
                      </td>

                      <td className="px-5 py-4">
                        <StatusBadge
                          active={product.canBePurchased}
                          activeLabel="Activă"
                          inactiveLabel="Doar ofertă"
                        />
                      </td>

                      <td className="px-5 py-4">
                        <StatusBadge
                          active={product.isActive}
                          activeLabel="Activ"
                          inactiveLabel="Inactiv"
                        />
                      </td>

                      <td className="px-5 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Link
                            href={`/produse/${product.slug}`}
                            className="font-condensed inline-flex min-h-10 items-center justify-center border border-neutral-300 px-4 text-xs font-bold uppercase tracking-wider text-neutral-700 transition hover:border-primary hover:text-primary"
                          >
                            Vezi
                          </Link>

                          <Link
                            href={`/admin/produse/${product.id}/specificatii`}
                            className="font-condensed inline-flex min-h-10 items-center justify-center border border-neutral-300 px-4 text-xs font-bold uppercase tracking-wider text-neutral-700 transition hover:border-primary hover:text-primary"
                          >
                            Specificații
                          </Link>

                          <Link
                            href={`/admin/produse/${product.id}/editare`}
                            className="font-condensed inline-flex min-h-10 items-center justify-center border border-[#111111] px-4 text-xs font-bold uppercase tracking-wider text-[#111111] transition hover:bg-[#111111] hover:text-white"
                          >
                            Editează
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

type StatusBadgeProps = {
  active: boolean;
  activeLabel: string;
  inactiveLabel: string;
};

function StatusBadge({
  active,
  activeLabel,
  inactiveLabel,
}: StatusBadgeProps) {
  return (
    <span
      className={[
        "inline-flex px-3 py-1 font-condensed text-xs font-bold uppercase tracking-wider",
        active
          ? "bg-green-100 text-green-800"
          : "bg-neutral-100 text-neutral-600",
      ].join(" ")}
    >
      {active ? activeLabel : inactiveLabel}
    </span>
  );
}