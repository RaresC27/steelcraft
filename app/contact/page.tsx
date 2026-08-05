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
    <main className="bg-neutral-100">
      <section className="relative overflow-hidden bg-[#0b0b0b] text-white">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-1 bg-primary"
        />

        <Container className="relative py-10 sm:py-14 lg:py-20">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-xs text-neutral-400 sm:text-sm"
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

          <div className="mt-8 max-w-3xl sm:mt-10">
            <p className="font-condensed text-xs font-bold uppercase tracking-[0.18em] text-primary sm:text-sm">
              Discută cu echipa SteelCraft
            </p>

            <h1 className="font-display mt-3 text-[3.2rem] uppercase leading-[0.9] text-white sm:text-6xl lg:text-7xl">
              Spune-ne ce ai nevoie
              <span className="block text-primary">
                iar noi revenim cu soluția
              </span>
            </h1>

            <p className="mt-5 max-w-2xl text-[15px] leading-7 text-neutral-300 sm:text-base sm:leading-8">
              Trimite dimensiunile, materialul, cantitatea și
              orice detaliu relevant despre proiect. Revenim cu
              întrebări și o ofertă adaptată solicitării tale.
            </p>
          </div>
        </Container>
      </section>

      <section className="py-8 sm:py-12 lg:py-20">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:gap-14">
            <div className="order-2 space-y-6 lg:order-1">
              <section className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm sm:rounded-sm sm:p-7">
                <p className="font-condensed text-xs font-bold uppercase tracking-[0.18em] text-primary">
                  Date de contact
                </p>

                <h2 className="font-display mt-2 text-4xl uppercase leading-none text-[#111111] sm:text-5xl">
                  Vorbim direct
                </h2>

                <p className="mt-4 text-sm leading-7 text-neutral-600">
                  Pentru o ofertă cât mai exactă, menționează
                  dimensiunile, materialul, cantitatea și modul
                  de utilizare al produsului.
                </p>

                <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                  {contactDetails.map((detail) => {
                    const Icon = detail.icon;

                    const content = (
                      <div className="flex min-h-[84px] items-center gap-4 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 transition hover:border-primary/40 hover:bg-white">
                        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#111111] text-primary">
                          <Icon className="size-5" />
                        </span>

                        <span className="min-w-0">
                          <span className="font-condensed block text-[10px] font-bold uppercase tracking-[0.14em] text-neutral-500">
                            {detail.label}
                          </span>

                          <span className="mt-1 block break-words text-sm font-semibold text-[#111111]">
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
                          className="block"
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
              </section>

              <section className="rounded-2xl bg-[#111111] p-5 text-white sm:rounded-sm sm:p-6">
                <p className="font-condensed text-xs font-bold uppercase tracking-[0.16em] text-primary">
                  Pentru un răspuns mai rapid
                </p>

                <p className="mt-3 text-sm leading-7 text-neutral-300">
                  Include dimensiunile, materialul dorit și
                  cantitatea aproximativă. Poți adăuga și o
                  descriere tehnică scurtă a proiectului.
                </p>
              </section>
            </div>

            <div className="order-1 lg:order-2">
              <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-[0_14px_45px_rgba(0,0,0,0.06)] sm:rounded-sm sm:p-7 lg:p-8">
                <div className="mb-6 border-b border-neutral-200 pb-5">
                  <p className="font-condensed text-xs font-bold uppercase tracking-[0.18em] text-primary">
                    Solicitare ofertă
                  </p>

                  <h2 className="font-display mt-2 text-4xl uppercase leading-none text-[#111111] sm:text-5xl">
                    Detaliile proiectului
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-neutral-600">
                    Completează formularul, iar noi revenim cu
                    informațiile necesare.
                  </p>
                </div>

                <ContactForm
                  selectedProduct={
                    selectedProduct ?? undefined
                  }
                />
              </div>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}