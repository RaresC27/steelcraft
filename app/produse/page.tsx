import { prisma } from "@/lib/prisma";
import {ProductCard} from "@/components/product/product-card";  
type ProductsPageProps = {
  searchParams: Promise<{
    category?: string;
  }>;
};

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const { category } = await searchParams;

  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      category: {
        isActive: true,
      },
      ...(category
        ? {
            category: {
              slug: category,
              isActive: true,
            },
          }
        : {}),
    },
    include: {
      category: true,
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

  const categories = await prisma.category.findMany({
    where: {
      isActive: true,
    },
    orderBy: {
      position: "asc",
    },
  });

  return (
    <main className="min-h-screen bg-neutral-100">
      <section className="border-b border-neutral-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <p className="font-condensed text-sm font-bold uppercase tracking-[0.16em] text-primary">
            Produsele noastre
          </p>

          <h1 className="font-display mt-3 text-5xl uppercase leading-none text-[#111111] sm:text-6xl">
            Produse metalice
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-7 text-neutral-600">
            Descoperă produse metalice realizate pentru proiecte
            rezidențiale, comerciale și industriale.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-wrap gap-3">
          <a
            href="/produse"
            className={`rounded-sm border px-4 py-2 text-sm font-bold uppercase tracking-wide transition ${
              !category
                ? "border-primary bg-primary text-white"
                : "border-neutral-300 bg-white text-[#111111] hover:border-primary hover:text-primary"
            }`}
          >
            Toate
          </a>

          {categories.map((item) => (
            <a
              key={item.id}
              href={`/produse?category=${item.slug}`}
              className={`rounded-sm border px-4 py-2 text-sm font-bold uppercase tracking-wide transition ${
                category === item.slug
                  ? "border-primary bg-primary text-white"
                  : "border-neutral-300 bg-white text-[#111111] hover:border-primary hover:text-primary"
              }`}
            >
              {item.name}
            </a>
          ))}
        </div>

        {products.length > 0 ? (
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard
                key={product.id}
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
          <div className="mt-10 border border-neutral-200 bg-white p-8">
            <h2 className="font-display text-3xl uppercase text-[#111111]">
              Nu există produse
            </h2>

            <p className="mt-3 text-sm leading-7 text-neutral-600">
              Nu am găsit produse active pentru categoria selectată.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}