import Link from "next/link";
import { notFound } from "next/navigation";

import { ProductForm } from "@/components/admin/product-form";
import { ProductActions } from "@/components/admin/product-actions";
import { prisma } from "@/lib/prisma";

type EditProductPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditProductPage({
  params,
}: EditProductPageProps) {
  const { id } = await params;
  const productId = Number(id);

  if (!Number.isInteger(productId) || productId <= 0) {
    notFound();
  }

  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: {
        id: productId,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        shortDescription: true,
        description: true,
        material: true,
        price: true,
        priceLabel: true,
        stock: true,
        image: true,
        categoryId: true,
        position: true,
        featured: true,
        canBePurchased: true,
        isActive: true,
      },
    }),

    prisma.category.findMany({
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
    }),
  ]);

  if (!product) {
    notFound();
  }

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
            Editează produsul
          </h1>
          <ProductActions
  productId={product.id}
  productName={product.name}
  isActive={product.isActive}
/>
          <p className="mt-2 max-w-2xl leading-7 text-neutral-600">
            Modifică informațiile pentru {product.name}.
          </p>
        </div>

        <ProductForm
          categories={categories}
          product={{
            ...product,
            price:
              product.price === null
                ? null
                : Number(product.price),
          }}
        />
      </div>
    </main>
  );
}