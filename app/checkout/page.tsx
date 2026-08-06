import type { Metadata } from "next";

import { CheckoutForm } from "@/app/checkout/checkout-form";

export const metadata: Metadata = {
  title: "Finalizare comandă | SteelCraft",
  description: "Completează datele pentru finalizarea comenzii SteelCraft.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CheckoutPage() {
  return (
    <main className="min-h-screen bg-neutral-100 pb-28 pt-6 sm:pb-10 sm:pt-10">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="font-barlow-condensed text-sm font-semibold uppercase tracking-[0.18em] text-[#ff5500]">
            SteelCraft
          </p>

          <h1 className="mt-2 font-bebas-neue text-[2.75rem] uppercase leading-none tracking-wide text-[#111111] sm:text-5xl">
            Finalizare comandă
          </h1>

          <p className="mt-2 max-w-2xl font-barlow text-neutral-600">
            Completează datele de contact și adresa de livrare.
          </p>
        </div>

        <CheckoutForm />
      </div>
    </main>
  );
}