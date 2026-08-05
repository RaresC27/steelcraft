import Link from "next/link";
import { notFound } from "next/navigation";

import { ProductActions } from "@/components/admin/product-actions";
import { ProductForm } from "@/components/admin/product-form";
import { ProductGalleryUpload } from "@/components/admin/product-gallery-upload";
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

  if (
    !Number.isInteger(productId) ||
    productId <= 0
  ) {
    notFound();
  }

  const [product, categories] =
    await Promise.all([
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

          images: {
            orderBy: [
              {
                isPrimary: "desc",
              },
              {
                position: "asc",
              },
              {
                id: "asc",
              },
            ],
            select: {
              id: true,
              url: true,
              pathname: true,
              alt: true,
              position: true,
              isPrimary: true,
            },
          },
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

  const {
    images,
    ...editableProduct
  } = product;

  return (
    <main className="min-h-screen bg-neutral-100 py-6 sm:py-10">
      <div className="mx-auto w-full max-w-5xl px-3 sm:px-6 lg:px-8">
        <header className="mb-6 sm:mb-8">
          <Link
            href="/admin/produse"
            className="font-condensed text-xs font-bold uppercase tracking-[0.1em] text-neutral-500 transition hover:text-primary sm:text-sm"
          >
            ← Înapoi la produse
          </Link>

          <p className="font-condensed mt-5 text-xs font-bold uppercase tracking-[0.2em] text-primary sm:mt-6 sm:text-sm">
            Administrare produse
          </p>

          <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
              <h1 className="font-display text-4xl uppercase leading-none text-[#111111] sm:text-5xl">
                Editează produsul
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-600 sm:text-base sm:leading-7">
                Modifică informațiile pentru{" "}
                <span className="font-semibold text-[#111111]">
                  {product.name}
                </span>
                .
              </p>
            </div>

            <div className="shrink-0">
              <ProductActions
                productId={product.id}
                productName={product.name}
                isActive={product.isActive}
              />
            </div>
          </div>
        </header>

        <div className="space-y-6 sm:space-y-8">
          <ProductForm
            categories={categories}
            product={{
              ...editableProduct,
              price:
                editableProduct.price === null
                  ? null
                  : Number(
                      editableProduct.price,
                    ),
            }}
          />

          <ProductGalleryUpload
            productId={product.id}
            initialImages={images.map(
              (image) => ({
                id: image.id,
                url: image.url,
                pathname:
                  image.pathname,
                alt: image.alt,
                position:
                  image.position,
                isPrimary:
                  image.isPrimary,
              }),
            )}
          />
        </div>
      </div>
    </main>
  );
}