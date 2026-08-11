import {
  ArrowRight,
  Hammer,
  ShieldCheck,
  Truck,
} from "lucide-react";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { ProductCard } from "@/components/product/product-card";
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

  return (
    <main>
      <HomeHero />

      <ProductCategoriesSection />

      {featuredProducts.length > 0 ? (
        <section className="border-y border-neutral-200 bg-neutral-100 py-12 sm:py-16 lg:py-20">
          <Container>
            <div className="flex items-end justify-between gap-5">
              <div>
                <p className="font-condensed text-xs font-bold uppercase tracking-[0.16em] text-primary sm:text-sm">
                  Produse recomandate
                </p>

                <h2 className="font-display mt-2 text-4xl uppercase leading-none text-[#111111] sm:text-5xl lg:text-6xl">
                  Descoperă produsele
                </h2>

                <p className="mt-3 max-w-xl text-sm leading-6 text-neutral-600 sm:text-base sm:leading-7">
                  Produse selectate din gama SteelCraft,
                  disponibile în variante standard sau
                  adaptate cerințelor proiectului.
                </p>
              </div>

              <Link
                href="/produse"
                prefetch
                className="font-condensed hidden shrink-0 items-center gap-2 text-sm font-bold uppercase tracking-[0.08em] text-primary transition hover:gap-3 sm:flex"
              >
                Vezi toate
                <ArrowRight className="size-4" />
              </Link>
            </div>

            <div className="mobile-scrollbar-hidden -mx-3 mt-7 flex snap-x snap-mandatory gap-3 overflow-x-auto px-3 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-3">
              {featuredProducts.map(
                (product) => (
                  <div
                    key={product.id}
                    className="w-[86vw] max-w-[360px] shrink-0 snap-start sm:w-auto sm:max-w-none"
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
                ),
              )}
            </div>

            <Link
              href="/produse"
              prefetch
              className="font-condensed mt-6 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#111111] px-5 text-sm font-bold uppercase tracking-[0.08em] text-white transition active:scale-[0.98] sm:hidden"
            >
              Vezi toate produsele
              <ArrowRight className="size-4" />
            </Link>
          </Container>
        </section>
      ) : null}

      <Section>
        <Container>
          <SectionHeading
            accent="SteelCraft?"
            description="Punem accent pe materiale potrivite, execuție atentă și soluții adaptate fiecărui client."
          >
            De ce să alegi
          </SectionHeading>

          <div className="grid gap-4 sm:gap-5 md:grid-cols-3">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;

              return (
                <Card
                  key={benefit.title}
                  className="group rounded-2xl border-neutral-200 py-0 transition duration-300 hover:-translate-y-1 hover:border-primary hover:shadow-[0_18px_40px_rgba(255,85,0,0.08)] sm:rounded-sm"
                >
                  <CardContent className="flex flex-col items-start px-5 py-6 text-left sm:items-center sm:px-7 sm:py-10 sm:text-center">
                    <div className="mb-5 flex size-14 items-center justify-center rounded-xl bg-[#111111] text-primary transition duration-300 group-hover:bg-primary group-hover:text-white sm:mb-6 sm:size-[72px] sm:rounded-sm">
                      <Icon
                        className="size-6 sm:size-8"
                        strokeWidth={1.8}
                      />
                    </div>

                    <h2 className="font-condensed text-base font-bold uppercase tracking-[0.08em] sm:text-lg">
                      {benefit.title}
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-muted-foreground sm:mt-3 sm:leading-7">
                      {benefit.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </Container>
      </Section>
    </main>
  );
}