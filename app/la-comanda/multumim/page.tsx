import type { Metadata } from "next";
import {
  ArrowRight,
  Check,
  FileCheck2,
} from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title:
    "Cerere înregistrată | SteelCraft",

  description:
    "Cererea pentru proiectul personalizat a fost înregistrată.",

  robots: {
    index: false,
    follow: false,
  },
};

type PageProps = {
  searchParams: Promise<{
    requestNumber?:
      | string
      | string[];
  }>;
};

export default async function CustomProjectSuccessPage({
  searchParams,
}: PageProps) {
  const params =
    await searchParams;

  const requestNumber =
    Array.isArray(
      params.requestNumber,
    )
      ? params.requestNumber[0]
      : params.requestNumber;

  return (
    <main className="flex min-h-[80svh] items-center bg-neutral-100 px-3 py-8 sm:px-6">
      <section className="mx-auto w-full max-w-2xl overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-[0_18px_60px_rgba(0,0,0,0.08)] sm:rounded-xl">
        <div className="bg-[#111111] px-5 py-8 text-white sm:px-8 sm:py-10">
          <span className="flex size-16 items-center justify-center rounded-full bg-primary text-white shadow-lg">
            <Check
              className="size-8"
              strokeWidth={3}
            />
          </span>

          <p className="font-condensed mt-6 text-xs font-bold uppercase tracking-[0.18em] text-primary">
            Cerere înregistrată
          </p>

          <h1 className="font-display mt-2 text-4xl uppercase leading-none sm:text-5xl">
            Am primit proiectul tău
          </h1>

          <p className="mt-4 max-w-xl text-sm leading-7 text-neutral-300">
            Vom analiza informațiile
            trimise și te vom contacta
            pentru clarificări sau pentru
            pregătirea unei oferte.
          </p>
        </div>

        <div className="p-4 sm:p-7">
          {requestNumber ? (
            <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.1em] text-neutral-500">
                Număr cerere
              </p>

              <p className="font-condensed mt-2 break-all text-xl font-bold uppercase text-[#111111]">
                {requestNumber}
              </p>
            </div>
          ) : null}

          <div className="mt-6 flex items-start gap-3 rounded-2xl border border-neutral-200 p-4">
            <FileCheck2 className="mt-0.5 size-5 shrink-0 text-primary" />

            <div>
              <p className="text-sm font-semibold text-[#111111]">
                Ce urmează?
              </p>

              <p className="mt-1 text-sm leading-6 text-neutral-600">
                Verificăm cererea,
                stabilim soluția tehnică
                și revenim pentru detalii
                dacă este necesar.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <Link
              href="/"
              className="font-condensed flex min-h-12 items-center justify-center rounded-xl border border-neutral-300 px-5 text-sm font-bold uppercase tracking-[0.08em] text-[#111111]"
            >
              Înapoi acasă
            </Link>

            <Link
              href="/produse"
              className="font-condensed flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-bold uppercase tracking-[0.08em] text-white"
            >
              Vezi produsele
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}