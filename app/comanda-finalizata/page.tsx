import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Comandă înregistrată | SteelCraft",
  description: "Comanda SteelCraft a fost înregistrată cu succes.",
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

  const orderNumber = Array.isArray(params.orderNumber)
    ? params.orderNumber[0]
    : params.orderNumber;

  return (
    <main className="flex min-h-[70vh] items-center bg-neutral-50 px-4 py-12">
      <section className="mx-auto w-full max-w-3xl border border-neutral-200 bg-white px-6 py-12 text-center shadow-sm sm:px-12">
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-[#ff5500] text-3xl font-bold text-white">
          ✓
        </div>

        <p className="mt-7 font-barlow-condensed text-sm font-semibold uppercase tracking-[0.2em] text-[#ff5500]">
          Comandă înregistrată
        </p>

        <h1 className="mt-2 font-bebas-neue text-4xl uppercase tracking-wide text-[#111111] sm:text-5xl">
          Îți mulțumim!
        </h1>

        <p className="mx-auto mt-4 max-w-xl font-barlow leading-relaxed text-neutral-600">
          Comanda ta a fost înregistrată cu succes. Echipa SteelCraft
          te va contacta pentru confirmare și pentru stabilirea
          detaliilor de livrare.
        </p>

        {orderNumber ? (
          <div className="mx-auto mt-7 max-w-md border border-neutral-200 bg-neutral-50 px-5 py-4">
            <p className="font-barlow text-sm text-neutral-500">
              Numărul comenzii
            </p>

            <p className="mt-1 break-words font-barlow-condensed text-2xl font-bold uppercase tracking-wider text-[#111111]">
              {orderNumber}
            </p>
          </div>
        ) : null}

        <Link
          href="/produse"
          className="mt-8 inline-flex min-h-12 items-center justify-center bg-[#111111] px-7 font-barlow-condensed text-base font-bold uppercase tracking-wider text-white transition hover:bg-[#ff5500]"
        >
          Continuă cumpărăturile
        </Link>
      </section>
    </main>
  );
}