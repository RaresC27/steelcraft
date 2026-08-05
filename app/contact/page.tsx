import type { Metadata } from "next";
import Link from "next/link";
import {
  ChevronRight,
  Clock3,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

import { ContactForm } from "@/components/form/contact-form";
import { Container } from "@/components/layout/container";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contactează SteelCraft pentru produse metalice standard, confecții la comandă și solicitări de ofertă.",
};

type ContactPageProps = {
  searchParams: Promise<{
    product?: string | string[];
  }>;
};

const contactDetails = [
  {
    label: "Telefon",
    value: "+40 000 000 000",
    href: "tel:+40000000000",
    icon: Phone,
  },
  {
    label: "Email",
    value: "contact@steelcraft.ro",
    href: "mailto:contact@steelcraft.ro",
    icon: Mail,
  },
  {
    label: "Locație",
    value: "România",
    href: null,
    icon: MapPin,
  },
  {
    label: "Program",
    value: "Luni–Vineri, 08:00–17:00",
    href: null,
    icon: Clock3,
  },
];

export default async function ContactPage({
  searchParams,
}: ContactPageProps) {
  const resolvedSearchParams = await searchParams;

  const productSlug = Array.isArray(
    resolvedSearchParams.product,
  )
    ? resolvedSearchParams.product[0]
    : resolvedSearchParams.product;

  const selectedProduct = productSlug
    ? await prisma.product.findFirst({
        where: {
          slug: productSlug,
          isActive: true,
          category: {
            isActive: true,
          },
        },
        select: {
          name: true,
          slug: true,
        },
      })
    : null;

  return (
    <main>
      <section className="relative overflow-hidden bg-[#0b0b0b] py-20 text-white lg:py-24">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,85,0,0.24),transparent_40%)]"
        />

        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:48px_48px]"
        />

        <Container className="relative z-10">
          <nav
            aria-label="Breadcrumb"
            className="mb-6 flex items-center gap-2 text-sm text-neutral-400"
          >
            <Link
              href="/"
              className="transition hover:text-primary"
            >
              Acasă
            </Link>

            <ChevronRight className="size-4" />

            <span className="text-white">
              Contact
            </span>
          </nav>

          <p className="font-condensed text-sm font-bold uppercase tracking-[0.22em] text-primary">
            Discută cu echipa SteelCraft
          </p>

          <h1 className="font-display mt-4 max-w-4xl text-6xl uppercase leading-[0.9] tracking-[0.025em] sm:text-7xl lg:text-8xl">
            Transformăm ideea ta
            <span className="block text-primary">
              într-un produs metalic
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-neutral-300">
            Trimite-ne detaliile proiectului, dimensiunile și
            cantitatea dorită. Revenim cu întrebări și o ofertă
            adaptată solicitării.
          </p>
        </Container>
      </section>

      <section className="bg-neutral-50 py-16 lg:py-24">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-14">
            <aside>
              <p className="font-condensed text-sm font-bold uppercase tracking-[0.2em] text-primary">
                Date de contact
              </p>

              <h2 className="font-display mt-3 text-5xl uppercase leading-[0.95] text-[#111111]">
                Hai să discutăm
              </h2>

              <p className="mt-5 max-w-md text-sm leading-7 text-neutral-600">
                Pentru o ofertă cât mai exactă, menționează
                dimensiunile, materialul, cantitatea și modul în
                care va fi utilizat produsul.
              </p>

              <div className="mt-8 divide-y divide-neutral-200 border-y border-neutral-200">
                {contactDetails.map((detail) => {
                  const Icon = detail.icon;

                  const content = (
                    <div className="group flex items-center gap-4 py-5">
                      <span className="flex size-12 shrink-0 items-center justify-center rounded-sm bg-[#111111] text-primary transition group-hover:bg-primary group-hover:text-white">
                        <Icon className="size-5" />
                      </span>

                      <span>
                        <span className="font-condensed block text-xs font-bold uppercase tracking-[0.14em] text-neutral-500">
                          {detail.label}
                        </span>

                        <span className="mt-1 block font-semibold text-[#111111] transition group-hover:text-primary">
                          {detail.value}
                        </span>
                      </span>
                    </div>
                  );

                  if (detail.href) {
                    return (
                      <a
                        key={detail.label}
                        href={detail.href}
                      >
                        {content}
                      </a>
                    );
                  }

                  return (
                    <div key={detail.label}>
                      {content}
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 rounded-sm bg-[#111111] p-6 text-white">
                <p className="font-condensed text-xs font-bold uppercase tracking-[0.16em] text-primary">
                  Recomandare
                </p>

                <p className="mt-3 text-sm leading-7 text-neutral-300">
                  Poți include în mesaj un desen, dimensiuni sau o
                  scurtă descriere tehnică. Adăugarea fișierelor va
                  fi implementată după configurarea stocării.
                </p>
              </div>
            </aside>

            <ContactForm
              selectedProduct={
                selectedProduct ?? undefined
              }
            />
          </div>
        </Container>
      </section>
    </main>
  );
}