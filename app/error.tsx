"use client";

import {
  AlertTriangle,
  RefreshCcw,
} from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

type ErrorPageProps = {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
};

export default function ErrorPage({
  error,
  reset,
}: ErrorPageProps) {
  useEffect(() => {
    console.error(
      "Eroare aplicație:",
      error,
    );
  }, [error]);

  return (
    <main className="flex min-h-[75svh] items-center bg-neutral-100 px-3 py-8 sm:px-6">
      <section className="mx-auto w-full max-w-xl rounded-3xl border border-neutral-200 bg-white p-5 shadow-[0_18px_60px_rgba(0,0,0,0.07)] sm:rounded-xl sm:p-8">
        <span className="flex size-14 items-center justify-center rounded-full bg-red-50 text-red-600">
          <AlertTriangle className="size-6" />
        </span>

        <p className="font-condensed mt-6 text-xs font-bold uppercase tracking-[0.18em] text-primary">
          SteelCraft
        </p>

        <h1 className="font-display mt-2 text-4xl uppercase leading-none text-[#111111] sm:text-5xl">
          Ceva nu a funcționat
        </h1>

        <p className="mt-4 text-sm leading-7 text-neutral-600">
          A apărut o problemă neașteptată.
          Poți încerca din nou fără să
          reîncarci întreaga aplicație.
        </p>

        <div className="mt-7 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={reset}
            className="font-condensed flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-bold uppercase tracking-[0.08em] text-white transition active:scale-[0.98] sm:rounded-sm"
          >
            <RefreshCcw className="size-4" />
            Încearcă din nou
          </button>

          <Link
            href="/"
            className="font-condensed flex min-h-12 items-center justify-center rounded-xl border border-neutral-300 px-5 text-sm font-bold uppercase tracking-[0.08em] text-[#111111] sm:rounded-sm"
          >
            Înapoi acasă
          </Link>
        </div>
      </section>
    </main>
  );
}