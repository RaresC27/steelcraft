import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { MobileProductPurchaseBar } from "@/components/product/mobile-product-purchase-bar";
import { ProductCard } from "@/components/product/product-card";
import { ProductImageCarousel } from "@/components/product/product-image-carousel";
import { prisma } from "@/lib/prisma";

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;

  const product = await prisma.product.findFirst({
    where: {
      slug,
      isActive: true,
      category: {
        isActive: true,
      },
    },
    select: {
      name: true,
      shortDescription: true,
      image: true,

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
        take: 1,
        select: {
          url: true,
        },
      },
    },
  });

  if (!product) {
    return {
      title: "Produs indisponibil",
      description:
        "Produsul solicitat nu există sau nu mai este disponibil.",
    };
  }

  const metadataImage =
    product.images[0]?.url ??
    product.image;

  return {
    title: product.name,
    description: product.shortDescription,

    openGraph: {
      title: product.name,
      description: product.shortDescription,

      images: metadataImage
        ? [
            {
              url: metadataImage,
              alt: product.name,
            },
          ]
        : undefined,
    },
  };
}

export default async function ProductPage({
  params,
}: ProductPageProps) {
  const { slug } = await params;

  const product =
    await prisma.product.findFirst({
      where: {
        slug,
        isActive: true,
        category: {
          isActive: true,
        },
      },

      include: {
        category: true,

        specifications: {
          orderBy: [
            {
              position: "asc",
            },
            {
              id: "asc",
            },
          ],
        },

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
        },
      },
    });

  if (!product) {
    notFound();
  }

  const numericPrice =
    product.price !== null
      ? Number(product.price)
      : null;

  const numericStock =
    product.stock ?? 0;

  const canAddToCart =
    product.canBePurchased &&
    numericPrice !== null &&
    numericPrice >= 0;

  /*
   * Dacă produsul are imagini în ProductImage,
   * carouselul le folosește în ordinea:
   * principală → position → id.
   *
   * Pentru produsele vechi fără galerie,
   * folosim câmpul Product.image.
   */
  const carouselImages =
    product.images.length > 0
      ? product.images.map((image) => ({
          id: image.id,
          url: image.url,
          alt:
            image.alt?.trim() ||
            product.name,
        }))
      : product.image
        ? [
            {
              id: "legacy-image",
              url: product.image,
              alt: product.name,
            },
          ]
        : [];

  /*
   * Imaginea folosită în coș este cea
   * principală din galerie sau fallback-ul vechi.
   */
  const primaryProductImage =
    carouselImages[0]?.url ?? null;

  const relatedProducts =
    await prisma.product.findMany({
      where: {
        isActive: true,

        category: {
          isActive: true,
        },

        categoryId:
          product.categoryId,

        id: {
          not: product.id,
        },
      },

      include: {
        category: true,
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

      take: 3,
    });

  return (
    <main className="min-h-screen bg-neutral-100 pb-28 lg:pb-0">
      {/* Breadcrumb */}
      <section className="border-b border-neutral-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-5 lg:px-8">
          <nav
            aria-label="Breadcrumb"
            className="mobile-scrollbar-hidden flex items-center gap-2 overflow-x-auto whitespace-nowrap text-xs text-neutral-500 sm:flex-wrap sm:text-sm"
          >
            <Link
              href="/"
              className="shrink-0 transition hover:text-primary"
            >
              Acasă
            </Link>

            <span aria-hidden="true">
              /
            </span>

            <Link
              href="/produse"
              className="shrink-0 transition hover:text-primary"
            >
              Produse
            </Link>

            <span aria-hidden="true">
              /
            </span>

            <Link
              href={`/produse?category=${product.category.slug}`}
              className="shrink-0 transition hover:text-primary"
            >
              {product.category.name}
            </Link>

            <span aria-hidden="true">
              /
            </span>

            <span
              aria-current="page"
              className="max-w-[180px] truncate text-[#111111] sm:max-w-none"
            >
              {product.name}
            </span>
          </nav>
        </div>
      </section>

      {/* Informații principale */}
      <section className="bg-white">
        <div className="mx-auto grid max-w-7xl gap-7 px-3 py-5 sm:px-6 sm:py-10 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-20">
          <ProductImageCarousel
            images={carouselImages}
          />

          <div className="flex flex-col justify-center px-1 sm:px-0">
            <p className="font-condensed text-xs font-bold uppercase tracking-[0.16em] text-primary sm:text-sm">
              {product.category.name}
            </p>

            <h1 className="font-display mt-2 text-4xl uppercase leading-none text-[#111111] sm:mt-3 sm:text-6xl lg:text-7xl">
              {product.name}
            </h1>

            <p className="mt-4 text-[15px] leading-7 text-neutral-600 sm:mt-6 sm:text-base sm:leading-8">
              {product.shortDescription}
            </p>

            <div className="mt-6 grid grid-cols-2 gap-3 border-y border-neutral-200 py-5 sm:mt-8 sm:gap-4 sm:py-6">
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-neutral-500 sm:text-xs">
                  Material
                </p>

                <p className="mt-2 truncate text-sm font-semibold text-[#111111] sm:text-base">
                  {product.material}
                </p>
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-neutral-500 sm:text-xs">
                  Preț
                </p>

                <p className="mt-2 text-sm font-bold text-primary sm:text-base">
                  {product.priceLabel ??
                    "Preț la cerere"}
                </p>
              </div>
            </div>

            {canAddToCart ? (
              <div className="mt-4 flex items-center gap-2 sm:mt-5">
                <span
                  className={[
                    "size-2.5 rounded-full",
                    numericStock > 0
                      ? "bg-green-500"
                      : "bg-red-500",
                  ].join(" ")}
                />

                <p
                  className={[
                    "text-sm font-semibold",
                    numericStock > 0
                      ? "text-green-700"
                      : "text-red-700",
                  ].join(" ")}
                >
                  {numericStock > 0
                    ? `${numericStock} bucăți disponibile`
                    : "Stoc epuizat"}
                </p>
              </div>
            ) : null}

            {/*
             * Butonul normal apare pe desktop.
             * Pe mobil folosim bara sticky.
             */}
            <div className="mt-8 hidden flex-wrap items-center gap-4 lg:flex">
              {canAddToCart &&
              numericPrice !== null ? (
                <AddToCartButton
                  product={{
                    productId:
                      product.id,
                    name: product.name,
                    slug: product.slug,
                    image:
                      primaryProductImage,
                    price:
                      numericPrice,
                    stock:
                      numericStock,
                  }}
                />
              ) : (
                <Link
                  href={`/contact?product=${product.slug}`}
                  className="inline-flex min-h-12 items-center justify-center rounded-sm bg-primary px-6 py-3 text-sm font-bold uppercase tracking-wide text-white transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                  Solicită o ofertă
                </Link>
              )}
            </div>

            {!canAddToCart ? (
              <div className="mt-6 lg:hidden">
                <Link
                  href={`/contact?product=${product.slug}`}
                  className="font-condensed flex min-h-12 w-full items-center justify-center rounded-xl bg-primary px-6 text-sm font-bold uppercase tracking-[0.08em] text-white shadow-lg transition active:scale-[0.98]"
                >
                  Solicită o ofertă
                </Link>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {/* Descriere și specificații */}
      <section className="border-t border-neutral-200">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[1.3fr_0.7fr] lg:gap-12 lg:px-8 lg:py-20">
          <div>
            <p className="font-condensed text-xs font-bold uppercase tracking-[0.16em] text-primary sm:text-sm">
              Despre produs
            </p>

            <h2 className="font-display mt-2 text-4xl uppercase leading-none text-[#111111] sm:mt-3 sm:text-5xl">
              Detalii
            </h2>

            <p className="mt-5 max-w-3xl whitespace-pre-line text-[15px] leading-7 text-neutral-600 sm:mt-6 sm:text-base sm:leading-8">
              {product.description}
            </p>
          </div>

          <div>
            <h2 className="font-display text-3xl uppercase leading-none text-[#111111]">
              Specificații
            </h2>

            {product.specifications.length >
            0 ? (
              <dl className="mt-5 divide-y divide-neutral-200 overflow-hidden rounded-xl border border-neutral-200 bg-white px-4 shadow-sm sm:mt-6 sm:rounded-sm">
                {product.specifications.map(
                  (specification) => (
                    <div
                      key={
                        specification.id
                      }
                      className="grid grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] gap-4 py-4"
                    >
                      <dt className="text-sm text-neutral-500">
                        {
                          specification.label
                        }
                      </dt>

                      <dd className="text-right text-sm font-semibold text-[#111111]">
                        {
                          specification.value
                        }
                      </dd>
                    </div>
                  ),
                )}
              </dl>
            ) : (
              <p className="mt-5 text-sm leading-7 text-neutral-600">
                Specificațiile acestui produs vor
                fi adăugate în curând.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Produse similare */}
      {relatedProducts.length > 0 ? (
        <section className="border-t border-neutral-200 bg-white">
          <div className="mx-auto max-w-7xl px-3 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
            <div className="px-1 sm:px-0">
              <p className="font-condensed text-xs font-bold uppercase tracking-[0.16em] text-primary sm:text-sm">
                Produse similare
              </p>

              <h2 className="font-display mt-2 text-4xl uppercase leading-none text-[#111111] sm:mt-3 sm:text-5xl">
                Din aceeași categorie
              </h2>
            </div>

            <div className="mt-7 grid grid-cols-1 gap-3 sm:mt-10 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
              {relatedProducts.map(
                (relatedProduct) => (
                  <ProductCard
                    key={
                      relatedProduct.id
                    }
                    product={{
                      name:
                        relatedProduct.name,
                      slug:
                        relatedProduct.slug,
                      shortDescription:
                        relatedProduct.shortDescription,
                      material:
                        relatedProduct.material,
                      priceLabel:
                        relatedProduct.priceLabel,
                      image:
                        relatedProduct.image,

                      category: {
                        name:
                          relatedProduct
                            .category.name,
                        slug:
                          relatedProduct
                            .category.slug,
                      },
                    }}
                  />
                ),
              )}
            </div>
          </div>
        </section>
      ) : null}

      {canAddToCart &&
      numericPrice !== null ? (
        <MobileProductPurchaseBar
          product={{
            id: product.id,
            name: product.name,
            slug: product.slug,
            price: numericPrice,
            image:
              primaryProductImage,
            stock: numericStock,
          }}
        />
      ) : null}
    </main>
  );
}