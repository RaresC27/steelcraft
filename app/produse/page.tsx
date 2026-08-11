import Link from "next/link";
import { Suspense } from "react";
import { unstable_cache } from "next/cache";

import { ProductCard } from "@/components/product/product-card";
import { prisma } from "@/lib/prisma";

// ISR: pagina e servită din cache și regenerată în fundal la fiecare 5 min,
// în loc să facă query DB la fiecare vizită.
export const revalidate = 300;

type ProductsPageProps = {
  searchParams: Promise<{
    category?: string | string[];
  }>;
};

// --- Data fetching, cache-uit separat ---

// Categoriile se schimbă rar -> cache 1h, invalidabil manual prin tag "categories"
const getCategories = unstable_cache(
  async () =>
    prisma.category.findMany({
      where: { isActive: true },
      select: { id: true, name: true, slug: true },
      orderBy: [{ position: "asc" }, { name: "asc" }],
    }),
  ["categories-list"],
  { revalidate: 3600, tags: ["categories"] },
);

async function getProducts(selectedCategory?: string) {
  return prisma.product.findMany({
    where: {
      isActive: true,
      category: selectedCategory
        ? { slug: selectedCategory, isActive: true }
        : { isActive: true },
    },
    select: {
      id: true,
      name: true,
      slug: true,
      shortDescription: true,
      material: true,
      priceLabel: true,
      image: true,
      category: { select: { name: true, slug: true } },
    },
    orderBy: [
      { featured: "desc" },
      { position: "asc" },
      { createdAt: "desc" },
    ],
  });
}

// --- Page shell: randat instant, fără să aștepte DB-ul ---

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const resolvedSearchParams = await searchParams;

  const selectedCategory = Array.isArray(resolvedSearchParams.category)
    ? resolvedSearchParams.category[0]
    : resolvedSearchParams.category;

  return (
    <main className="min-h-screen bg-neutral-100">
      <section className="border-b border-neutral-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-9 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
          <p className="font-condensed text-xs font-bold uppercase tracking-[0.16em] text-primary sm:text-sm">
            Produsele noastre
          </p>

          <h1 className="font-display mt-2 text-4xl uppercase leading-none text-[#111111] sm:mt-3 sm:text-6xl">
            Produse metalice
          </h1>

          <p className="mt-4 max-w-2xl text-[15px] leading-7 text-neutral-600 sm:mt-5 sm:text-base">
            Descoperă produse metalice realizate pentru proiecte
            rezidențiale, comerciale și industriale.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-3 py-6 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
        <Suspense fallback={<CategoryNavSkeleton />}>
          <CategoryNav selectedCategory={selectedCategory} />
        </Suspense>

        {/* key={selectedCategory} forțează un nou Suspense boundary la schimbarea filtrului,
            astfel încât skeleton-ul de produse apare instant, fără să aștepte navigarea */}
        <Suspense
          key={selectedCategory ?? "all"}
          fallback={<ProductGridSkeleton />}
        >
          <ProductGrid selectedCategory={selectedCategory} />
        </Suspense>
      </section>
    </main>
  );
}

// --- Sub-componente async: fiecare face streaming independent ---

async function CategoryNav({
  selectedCategory,
}: {
  selectedCategory?: string;
}) {
  const categories = await getCategories();

  return (
    <nav
      aria-label="Filtrare după categorie"
      className="mobile-scrollbar-hidden -mx-3 flex snap-x gap-2 overflow-x-auto px-3 pb-2 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0"
    >
      <Link
        href="/produse"
        prefetch
        aria-current={!selectedCategory ? "page" : undefined}
        className={[
          "font-condensed flex min-h-10 shrink-0 snap-start items-center justify-center rounded-full border px-4 text-xs font-bold uppercase tracking-[0.07em] transition duration-200 active:scale-95 sm:rounded-sm sm:text-sm",
          !selectedCategory
            ? "border-primary bg-primary text-white"
            : "border-neutral-300 bg-white text-[#111111] hover:border-primary hover:text-primary",
        ].join(" ")}
      >
        Toate
      </Link>

      {categories.map((category) => {
        const isActive = selectedCategory === category.slug;

        return (
          <Link
            key={category.id}
            href={{ pathname: "/produse", query: { category: category.slug } }}
            prefetch
            aria-current={isActive ? "page" : undefined}
            className={[
              "font-condensed flex min-h-10 shrink-0 snap-start items-center justify-center rounded-full border px-4 text-xs font-bold uppercase tracking-[0.07em] transition duration-200 active:scale-95 sm:rounded-sm sm:text-sm",
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
  );
}

async function ProductGrid({
  selectedCategory,
}: {
  selectedCategory?: string;
}) {
  const products = await getProducts(selectedCategory);

  return (
    <>
      <div className="mt-5 flex items-center justify-between px-1 sm:mt-8 sm:px-0">
        <p className="text-sm text-neutral-500">
          <span className="font-semibold text-[#111111]">
            {products.length}
          </span>{" "}
          {products.length === 1 ? "produs" : "produse"}
        </p>

        {selectedCategory ? (
          <Link
            href="/produse"
            prefetch
            className="font-condensed text-xs font-bold uppercase tracking-[0.08em] text-primary transition hover:opacity-70"
          >
            Resetează filtrul
          </Link>
        ) : null}
      </div>

      {products.length > 0 ? (
        <div className="mt-4 grid grid-cols-1 gap-3 sm:mt-6 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {products.map((product, index) => (
            <ProductCard
              key={product.id}
              // primele carduri (above the fold) se pot marca ca prioritare
              // în ProductCard, dacă acesta suportă un prop `priority`
              product={{
                name: product.name,
                slug: product.slug,
                shortDescription: product.shortDescription,
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
            Nu am găsit produse active pentru categoria selectată.
          </p>

          <Link
            href="/produse"
            prefetch
            className="font-condensed mt-6 inline-flex min-h-11 items-center justify-center rounded-xl bg-primary px-6 text-xs font-bold uppercase tracking-[0.09em] text-white transition active:scale-[0.98] sm:rounded-sm"
          >
            Vezi toate produsele
          </Link>
        </div>
      )}
    </>
  );
}

// --- Skeletons pentru Suspense fallback ---

function CategoryNavSkeleton() {
  return (
    <div
      aria-hidden
      className="mobile-scrollbar-hidden -mx-3 flex snap-x gap-2 overflow-x-auto px-3 pb-2 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0"
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="h-10 w-24 shrink-0 animate-pulse rounded-full bg-neutral-200 sm:rounded-sm"
        />
      ))}
    </div>
  );
}

function ProductGridSkeleton() {
  return (
    <>
      <div className="mt-5 flex items-center justify-between px-1 sm:mt-8 sm:px-0">
        <div className="h-4 w-20 animate-pulse rounded bg-neutral-200" />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:mt-6 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-72 animate-pulse rounded-2xl bg-white shadow-sm sm:rounded-sm"
          />
        ))}
      </div>
    </>
  );
}