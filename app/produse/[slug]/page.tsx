import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ProductCard } from "@/components/product/product-card";
import { prisma } from "@/lib/prisma";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";

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
        },
    });

    if (!product) {
        return {
            title: "Produs indisponibil",
            description:
                "Produsul solicitat nu există sau nu mai este disponibil.",
        };
    }

    return {
        title: product.name,
        description: product.shortDescription,
        openGraph: {
            title: product.name,
            description: product.shortDescription,
            images: product.image
                ? [
                    {
                        url: product.image,
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

    const product = await prisma.product.findFirst({
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
                orderBy: {
                    position: "asc",
                },
            },
        },
    });

    if (!product) {
        notFound();
    }

    const numericPrice =
        product.price !== null ? Number(product.price) : null;

    const numericStock = product.stock ?? 0;

    const canAddToCart =
        product.canBePurchased &&
        numericPrice !== null &&
        numericPrice >= 0;

    const relatedProducts = await prisma.product.findMany({
        where: {
            isActive: true,
            category: {
                isActive: true,
            },
            categoryId: product.categoryId,
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
        <main className="min-h-screen bg-neutral-100">
            <section className="border-b border-neutral-200 bg-white">
                <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
                    <nav
                        aria-label="Breadcrumb"
                        className="flex flex-wrap items-center gap-2 text-sm text-neutral-500"
                    >
                        <Link
                            href="/"
                            className="transition hover:text-primary"
                        >
                            Acasă
                        </Link>

                        <span aria-hidden="true">/</span>

                        <Link
                            href="/produse"
                            className="transition hover:text-primary"
                        >
                            Produse
                        </Link>

                        <span aria-hidden="true">/</span>

                        <Link
                            href={`/products?category=${product.category.slug}`}

                            className="transition hover:text-primary"
                        >
                            {product.category.name}
                        </Link>

                        <span aria-hidden="true">/</span>

                        <span
                            aria-current="page"
                            className="text-[#111111]"
                        >
                            {product.name}
                        </span>
                    </nav>
                </div>
            </section>

            <section className="bg-white">
                <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-20">
                    <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-neutral-200">
                        {product.image ? (
                            <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                priority
                                className="object-cover"
                                sizes="(min-width: 1024px) 50vw, 100vw"
                            />
                        ) : (
                            <div className="flex h-full items-center justify-center px-6 text-center text-sm text-neutral-500">
                                Imagine indisponibilă
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col justify-center">
                        <p className="font-condensed text-sm font-bold uppercase tracking-[0.16em] text-primary">
                            {product.category.name}
                        </p>

                        <h1 className="font-display mt-3 text-5xl uppercase leading-none text-[#111111] sm:text-6xl lg:text-7xl">
                            {product.name}
                        </h1>

                        <p className="mt-6 text-base leading-8 text-neutral-600">
                            {product.shortDescription}
                        </p>

                        <div className="mt-8 grid gap-4 border-y border-neutral-200 py-6 sm:grid-cols-2">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-[0.12em] text-neutral-500">
                                    Material
                                </p>

                                <p className="mt-2 text-base font-semibold text-[#111111]">
                                    {product.material}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs font-bold uppercase tracking-[0.12em] text-neutral-500">
                                    Preț
                                </p>

                                <p className="mt-2 text-base font-bold text-primary">
                                    {product.priceLabel ?? "Preț la cerere"}
                                </p>
                            </div>
                        </div>

                        <div className="mt-8 flex flex-wrap items-center gap-4">
                            {canAddToCart && numericPrice !== null ? (
                                <AddToCartButton
                                    product={{
                                        productId: product.id,
                                        name: product.name,
                                        slug: product.slug,
                                        image: product.image,
                                        price: numericPrice,
                                        stock: numericStock,
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
                    </div>
                </div>
            </section>

            <section className="border-t border-neutral-200">
                <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.3fr_0.7fr] lg:px-8 lg:py-20">
                    <div>
                        <p className="font-condensed text-sm font-bold uppercase tracking-[0.16em] text-primary">
                            Despre produs
                        </p>

                        <h2 className="font-display mt-3 text-4xl uppercase leading-none text-[#111111] sm:text-5xl">
                            Detalii
                        </h2>

                        <p className="mt-6 max-w-3xl whitespace-pre-line text-base leading-8 text-neutral-600">
                            {product.description}
                        </p>
                    </div>

                    <div>
                        <h2 className="font-display text-3xl uppercase leading-none text-[#111111]">
                            Specificații
                        </h2>

                        {product.specifications.length > 0 ? (
                            <dl className="mt-6 divide-y divide-neutral-200 border-y border-neutral-200">
                                {product.specifications.map((specification) => (
                                    <div
                                        key={specification.id}
                                        className="grid grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] gap-4 py-4"
                                    >
                                        <dt className="text-sm text-neutral-500">
                                            {specification.label}
                                        </dt>

                                        <dd className="text-right text-sm font-semibold text-[#111111]">
                                            {specification.value}
                                        </dd>
                                    </div>
                                ))}
                            </dl>
                        ) : (
                            <p className="mt-5 text-sm leading-7 text-neutral-600">
                                Specificațiile acestui produs vor fi adăugate în
                                curând.
                            </p>
                        )}
                    </div>
                </div>
            </section>

            {relatedProducts.length > 0 && (
                <section className="border-t border-neutral-200 bg-white">
                    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
                        <div>
                            <p className="font-condensed text-sm font-bold uppercase tracking-[0.16em] text-primary">
                                Produse similare
                            </p>

                            <h2 className="font-display mt-3 text-4xl uppercase leading-none text-[#111111] sm:text-5xl">
                                Din aceeași categorie
                            </h2>
                        </div>

                        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {relatedProducts.map((relatedProduct) => (
                                <ProductCard
                                    key={relatedProduct.id}
                                    product={{
                                        name: relatedProduct.name,
                                        slug: relatedProduct.slug,
                                        shortDescription:
                                            relatedProduct.shortDescription,
                                        material: relatedProduct.material,
                                        priceLabel: relatedProduct.priceLabel,
                                        image: relatedProduct.image,
                                        category: {
                                            name: relatedProduct.category.name,
                                            slug: relatedProduct.category.slug,
                                        },
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </main>
    );
}   