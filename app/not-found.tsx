import {
  ArrowLeft,
  Home,
  SearchX,
} from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[75svh] items-center bg-neutral-100 px-3 py-8 sm:px-6">
      <section className="mx-auto w-full max-w-xl overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-[0_18px_60px_rgba(0,0,0,0.07)] sm:rounded-xl">
        <div className="bg-[#111111] px-5 py-8 text-white sm:px-8 sm:py-10">
          <span className="flex size-14 items-center justify-center rounded-full bg-primary/15 text-primary">
            <SearchX className="size-6" />
          </span>

          <p className="font-condensed mt-6 text-xs font-bold uppercase tracking-[0.18em] text-primary">
            Eroare 404
          </p>

          <h1 className="font-display mt-2 text-4xl uppercase leading-none sm:text-5xl">
            Pagina nu a fost găsită
          </h1>

          <p className="mt-4 max-w-lg text-sm leading-7 text-neutral-300">
            Pagina pe care o cauți nu există,
            a fost mutată sau nu mai este
            disponibilă.
          </p>
        </div>

        <div className="grid gap-3 p-4 sm:grid-cols-2 sm:p-6">
          <Link
            href="/produse"
            className="font-condensed flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-bold uppercase tracking-[0.08em] text-white transition active:scale-[0.98] sm:rounded-sm"
          >
            <ArrowLeft className="size-4" />
            Vezi produsele
          </Link>

          <Link
            href="/"
            className="font-condensed flex min-h-12 items-center justify-center gap-2 rounded-xl border border-neutral-300 bg-white px-5 text-sm font-bold uppercase tracking-[0.08em] text-[#111111] transition active:scale-[0.98] sm:rounded-sm"
          >
            <Home className="size-4" />
            Acasă
          </Link>
        </div>
      </section>
    </main>
  );
}