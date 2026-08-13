import {
  ArrowRight,
  Hammer,
  ShieldCheck,
  Sparkles,
  Truck,
} from "lucide-react";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { ProductCard } from "@/components/product/product-card";
import { HomeFaq } from "@/components/sections/home-faq";
import { HomeHero } from "@/components/sections/home-hero";
import { ProductCategoriesSection } from "@/components/sections/product-categories-section";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";
import { prisma } from "@/lib/prisma";

const benefits = [
  {
    title: "Fabricație la comandă",
    description:
      "Produse metalice realizate după dimensiunile și cerințele proiectului tău.",
    icon: Hammer,
  },
  {
    title: "Construcție rezistentă",
    description:
      "Materiale atent alese, suduri solide și finisaje pregătite pentru utilizare îndelungată.",
    icon: ShieldCheck,
  },
  {
    title: "Livrare în toată țara",
    description:
      "Pregătim și expediem comenzile în condiții sigure, indiferent de localitate.",
    icon: Truck,
  },
];

export default async function HomePage() {
  const featuredProducts =
    await prisma.product.findMany({
      where: {
        isActive: true,
        featured: true,

        category: {
          isActive: true,
        },
      },

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
          position: "asc",
        },
        {
          createdAt: "desc",
        },
      ],

      take: 6,
    });

  const [firstFeaturedProduct, ...remainingFeaturedProducts] =
    featuredProducts;

  return (
    <main className="overflow-hidden">
      <HomeHero />

      <ProductCategoriesSection />

      {featuredProducts.length > 0 ? (
        <section className="relative overflow-hidden bg-[#f4f4f2] py-12 sm:py-16 lg:py-24">
          <div className="pointer-events-none absolute -right-28 top-10 size-72 rounded-full bg-primary/[0.04] blur-3xl" />

          <Container className="relative">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 shadow-sm">
                  <Sparkles className="size-3.5 text-primary" />

                  <span className="font-condensed text-[10px] font-bold uppercase tracking-[0.12em] text-neutral-600">
                    Selecția SteelCraft
                  </span>
                </div>

                <h2 className="font-display mt-4 max-w-2xl text-4xl uppercase leading-[0.92] text-[#111111] sm:text-5xl lg:text-6xl">
                  Produse
                  <span className="block text-primary">
                    recomandate
                  </span>
                </h2>

                <p className="mt-4 max-w-xl text-sm leading-6 text-neutral-600 sm:text-base sm:leading-7">
                  O selecție de produse reprezentative,
                  disponibile în variante standard sau adaptate
                  cerințelor proiectului.
                </p>
              </div>

              <Link
                href="/produse"
                className="font-condensed hidden shrink-0 items-center gap-2 text-sm font-bold uppercase tracking-[0.08em] text-[#111111] transition hover:text-primary sm:inline-flex"
              >
                Vezi toate produsele
                <ArrowRight className="size-4" />
              </Link>
            </div>

            <div className="mt-8 lg:mt-10">
              {firstFeaturedProduct ? (
                <div className="sm:hidden">
                  <ProductCard
                    product={{
                      name: firstFeaturedProduct.name,
                      slug: firstFeaturedProduct.slug,
                      shortDescription:
                        firstFeaturedProduct.shortDescription,
                      material:
                        firstFeaturedProduct.material,
                      priceLabel:
                        firstFeaturedProduct.priceLabel,
                      image:
                        firstFeaturedProduct.image,

                      category: {
                        name:
                          firstFeaturedProduct.category
                            .name,
                        slug:
                          firstFeaturedProduct.category
                            .slug,
                      },
                    }}
                  />
                </div>
              ) : null}

              <div
                className={[
                  "mobile-scrollbar-hidden mt-4 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 sm:mt-0 sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:pb-0 lg:grid-cols-3",
                  firstFeaturedProduct
                    ? ""
                    : "mt-0",
                ].join(" ")}
              >
                {(firstFeaturedProduct
                  ? remainingFeaturedProducts
                  : featuredProducts
                ).map((product) => (
                  <div
                    key={product.id}
                    className="w-[82vw] max-w-[340px] shrink-0 snap-start sm:w-auto sm:max-w-none"
                  >
                    <ProductCard
                      product={{
                        name: product.name,
                        slug: product.slug,
                        shortDescription:
                          product.shortDescription,
                        material:
                          product.material,
                        priceLabel:
                          product.priceLabel,
                        image: product.image,

                        category: {
                          name:
                            product.category
                              .name,
                          slug:
                            product.category
                              .slug,
                        },
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>

            <Link
              href="/produse"
              className="font-condensed mt-6 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#111111] px-5 text-sm font-bold uppercase tracking-[0.08em] text-white transition active:scale-[0.98] sm:hidden"
            >
              Vezi toate produsele
              <ArrowRight className="size-4" />
            </Link>
          </Container>
        </section>
      ) : null}

      <Section className="bg-white">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
            <div>
              <SectionHeading
                accent="SteelCraft?"
                description="Punem accent pe materiale potrivite, execuție atentă și soluții adaptate fiecărui client."
                className="mb-0"
              >
                De ce să alegi
              </SectionHeading>

              <p className="mt-5 max-w-md text-sm leading-7 text-neutral-500 sm:text-base">
                De la produse standard până la confecții
                personalizate, încercăm să păstrăm procesul
                simplu și clar de la prima discuție până la
                livrare.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 sm:gap-4">
              {benefits.map((benefit) => {
                const Icon = benefit.icon;

                return (
                  <Card
                    key={benefit.title}
                    className="group overflow-hidden rounded-2xl border-neutral-200 py-0 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-[0_18px_40px_rgba(255,85,0,0.08)] sm:rounded-xl"
                  >
                    <CardContent className="flex h-full flex-row items-start gap-4 p-4 sm:flex-col sm:p-5 lg:p-6">
                      <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-[#111111] text-primary transition duration-300 group-hover:bg-primary group-hover:text-white sm:size-14">
                        <Icon
                          className="size-5 sm:size-6"
                          strokeWidth={1.8}
                        />
                      </div>

                      <div>
                        <h3 className="font-condensed text-sm font-bold uppercase tracking-[0.07em] text-[#111111] sm:text-base">
                          {benefit.title}
                        </h3>

                        <p className="mt-2 text-sm leading-6 text-neutral-600">
                          {benefit.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </Container>
      </Section>

      <HomeFaq />
    </main>
  );
}