import Link from "next/link";

import { ProductCard } from "@/components/product/product-card";
import { prisma } from "@/lib/prisma";

type ProductsPageProps = {
  searchParams: Promise<{
    category?: string | string[];
  }>;
};

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const resolvedSearchParams = await searchParams;

  const selectedCategory = Array.isArray(
    resolvedSearchParams.category,
  )
    ? resolvedSearchParams.category[0]
    : resolvedSearchParams.category;

  /*
   * Executăm ambele query-uri simultan.
   * Înainte, al doilea începea doar după terminarea primului.
   */
  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where: {
        isActive: true,

        category: selectedCategory
          ? {
              slug: selectedCategory,
              isActive: true,
            }
          : {
              isActive: true,
            },
      },

      /*
       * Selectăm doar câmpurile folosite de ProductCard.
       * Nu mai încărcăm descrierea completă, stocul,
       * specificațiile și alte date inutile în catalog.
       */
      select: {
        id: true,
        name: true,
        slug: true,
        shortDescription: true,
        material: true,
        priceLabel: true,
        image: true,

        category: {
          select: {
            name: true,
            slug: true,
          },
        },
      },

      orderBy: [
        {
          featured: "desc",
        },
        {
          position: "asc",
        },
        {
          createdAt: "desc",
        },
      ],
    }),

    prisma.category.findMany({
      where: {
        isActive: true,
      },

      select: {
        id: true,
        name: true,
        slug: true,
      },

      orderBy: [
        {
          position: "asc",
        },
        {
          name: "asc",
        },
      ],
    }),
  ]);

  return (
    <main className="min-h-screen bg-neutral-100">
      <section className="border-b border-neutral-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
          <p className="font-condensed text-xs font-bold uppercase tracking-[0.16em] text-primary sm:text-sm">
            Produsele noastre
          </p>

          <h1 className="font-display mt-2 text-4xl uppercase leading-none text-[#111111] sm:mt-3 sm:text-6xl">
            Produse metalice
          </h1>

          <p className="mt-4 max-w-2xl text-[15px] leading-7 text-neutral-600 sm:mt-5 sm:text-base">
            Descoperă produse metalice realizate pentru
            proiecte rezidențiale, comerciale și
            industriale.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-3 py-7 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
        {/*
         * Folosim Link, nu <a>.
         * Astfel Next.js face navigare client-side și prefetch.
         */}
        <nav
          aria-label="Filtrare după categorie"
          className="mobile-scrollbar-hidden -mx-3 flex snap-x gap-2 overflow-x-auto px-3 pb-2 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0"
        >
          <Link
            href="/produse"
            prefetch
            aria-current={
              !selectedCategory
                ? "page"
                : undefined
            }
            className={[
              "font-condensed flex min-h-10 shrink-0 snap-start items-center justify-center rounded-full border px-4 text-xs font-bold uppercase tracking-[0.07em] transition active:scale-95 sm:rounded-sm sm:text-sm",
              !selectedCategory
                ? "border-primary bg-primary text-white"
                : "border-neutral-300 bg-white text-[#111111] hover:border-primary hover:text-primary",
            ].join(" ")}
          >
            Toate
          </Link>

          {categories.map((category) => {
            const isActive =
              selectedCategory === category.slug;

            return (
              <Link
                key={category.id}
                href={{
                  pathname: "/produse",
                  query: {
                    category: category.slug,
                  },
                }}
                prefetch
                aria-current={
                  isActive ? "page" : undefined
                }
                className={[
                  "font-condensed flex min-h-10 shrink-0 snap-start items-center justify-center rounded-full border px-4 text-xs font-bold uppercase tracking-[0.07em] transition active:scale-95 sm:rounded-sm sm:text-sm",
                  isActive
                    ? "border-primary bg-primary text-white"
                    : "border-neutral-300 bg-white text-[#111111] hover:border-primary hover:text-primary",
                ].join(" ")}
              >
                {category.name}
              </Link>
            );
          })}
        </nav>

        <div className="mt-6 flex items-center justify-between px-1 sm:mt-8 sm:px-0">
          <p className="text-sm text-neutral-500">
            <span className="font-semibold text-[#111111]">
              {products.length}
            </span>{" "}
            {products.length === 1
              ? "produs"
              : "produse"}
          </p>

          {selectedCategory ? (
            <Link
              href="/produse"
              className="font-condensed text-xs font-bold uppercase tracking-[0.08em] text-primary transition hover:opacity-70"
            >
              Resetează filtrul
            </Link>
          ) : null}
        </div>

        {products.length > 0 ? (
          <div className="mt-4 grid grid-cols-1 gap-3 sm:mt-6 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={{
                  name: product.name,
                  slug: product.slug,
                  shortDescription:
                    product.shortDescription,
                  material: product.material,
                  priceLabel: product.priceLabel,
                  image: product.image,

                  category: {
                    name: product.category.name,
                    slug: product.category.slug,
                  },
                }}
              />
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-2xl border border-neutral-200 bg-white px-5 py-12 text-center shadow-sm sm:mt-8 sm:rounded-sm sm:p-12">
            <h2 className="font-display text-3xl uppercase text-[#111111] sm:text-4xl">
              Nu există produse
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-neutral-600">
              Nu am găsit produse active pentru categoria
              selectată.
            </p>

            <Link
              href="/produse"
              className="font-condensed mt-6 inline-flex min-h-11 items-center justify-center rounded-xl bg-primary px-6 text-xs font-bold uppercase tracking-[0.09em] text-white transition active:scale-[0.98] sm:rounded-sm"
            >
              Vezi toate produsele
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}