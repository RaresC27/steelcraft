import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  Home,
  PackageCheck,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Comandă înregistrată | SteelCraft",
  description:
    "Comanda SteelCraft a fost înregistrată cu succes.",
  robots: {
    index: false,
    follow: false,
  },
};

type OrderConfirmationPageProps = {
  searchParams: Promise<{
    orderNumber?: string | string[];
  }>;
};

export default async function OrderConfirmationPage({
  searchParams,
}: OrderConfirmationPageProps) {
  const params = await searchParams;

  const orderNumber = Array.isArray(
    params.orderNumber,
  )
    ? params.orderNumber[0]
    : params.orderNumber;

  return (
    <main className="min-h-screen bg-neutral-100 px-3 py-6 sm:px-6 sm:py-10 lg:px-8">
      <div className="mx-auto w-full max-w-3xl">
        <section className="overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-[0_18px_60px_rgba(0,0,0,0.08)] sm:rounded-sm">
          <div className="relative overflow-hidden bg-[#111111] px-5 py-8 text-white sm:px-8 sm:py-10">
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,85,0,0.2),transparent_45%)]"
            />

            <div className="relative z-10">
              <div className="success-pop flex size-16 items-center justify-center rounded-full bg-primary text-white shadow-[0_14px_35px_rgba(255,85,0,0.28)]">
                <Check
                  className="size-8"
                  strokeWidth={3}
                />
              </div>

              <p className="font-condensed mt-6 text-xs font-bold uppercase tracking-[0.18em] text-primary sm:text-sm">
                Comandă înregistrată
              </p>

              <h1 className="font-display mt-2 text-4xl uppercase leading-none sm:text-5xl">
                Mulțumim!
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-neutral-300 sm:text-base">
                Comanda ta a fost înregistrată cu succes.
                Echipa SteelCraft o va verifica și te va
                contacta dacă este nevoie de confirmări
                suplimentare.
              </p>
            </div>
          </div>

          <div className="p-4 sm:p-8">
            {orderNumber ? (
              <div className="rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-5 sm:rounded-sm sm:px-6">
                <p className="font-condensed text-xs font-bold uppercase tracking-[0.12em] text-neutral-500">
                  Numărul comenzii
                </p>

                <p className="mt-2 break-words font-condensed text-2xl font-bold uppercase tracking-[0.08em] text-[#111111] sm:text-3xl">
                  {orderNumber}
                </p>

                <p className="mt-2 text-xs leading-5 text-neutral-500">
                  Păstrează acest număr pentru orice
                  discuție legată de comandă.
                </p>
              </div>
            ) : null}

            <div className="mt-6">
              <p className="font-condensed text-xs font-bold uppercase tracking-[0.16em] text-primary">
                Ce urmează
              </p>

              <div className="mt-4 space-y-3">
                <StepItem
                  step="01"
                  title="Verificăm comanda"
                  description="Confirmăm produsele, stocul și detaliile trimise."
                />

                <StepItem
                  step="02"
                  title="Te contactăm dacă este nevoie"
                  description="Dacă avem nevoie de clarificări, revenim telefonic sau pe email."
                />

                <StepItem
                  step="03"
                  title="Pregătim livrarea"
                  description="După confirmare, comanda intră în procesare și pregătire."
                />
              </div>
            </div>

            <div className="mt-7 rounded-2xl border border-neutral-200 bg-white p-4 sm:rounded-sm sm:p-5">
              <div className="flex items-start gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <PackageCheck className="size-5" />
                </span>

                <div>
                  <p className="font-condensed text-sm font-bold uppercase tracking-[0.06em] text-[#111111]">
                    Comanda este înregistrată
                  </p>

                  <p className="mt-1 text-sm leading-6 text-neutral-600">
                    Nu este nevoie să mai trimiți încă o dată
                    formularul. Dacă ai uitat ceva, ne poți
                    contacta și menționa numărul comenzii.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              <Link
                href="/produse"
                className="font-condensed flex min-h-13 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-bold uppercase tracking-[0.08em] text-white shadow-lg transition active:scale-[0.98] hover:opacity-90 sm:rounded-sm"
              >
                Continuă cumpărăturile
                <ArrowRight className="size-4" />
              </Link>

              <Link
                href="/"
                className="font-condensed flex min-h-13 items-center justify-center gap-2 rounded-xl border border-neutral-300 bg-white px-6 text-sm font-bold uppercase tracking-[0.08em] text-[#111111] transition active:scale-[0.98] hover:border-[#111111] sm:rounded-sm"
              >
                <Home className="size-4" />
                Înapoi acasă
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

type StepItemProps = {
  step: string;
  title: string;
  description: string;
};

function StepItem({
  step,
  title,
  description,
}: StepItemProps) {
  return (
    <div className="flex gap-3 rounded-2xl border border-neutral-200 bg-neutral-50 p-4 sm:rounded-sm">
      <span className="font-condensed flex size-9 shrink-0 items-center justify-center rounded-full bg-[#111111] text-xs font-bold text-primary">
        {step}
      </span>

      <div>
        <p className="font-condensed text-sm font-bold uppercase tracking-[0.06em] text-[#111111]">
          {title}
        </p>

        <p className="mt-1 text-sm leading-6 text-neutral-600">
          {description}
        </p>
      </div>
    </div>
  );
}