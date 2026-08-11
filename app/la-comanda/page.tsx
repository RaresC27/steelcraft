import type { Metadata } from "next";

import { CustomProjectForm } from "@/app/la-comanda/custom-project-form";

export const metadata: Metadata = {
  title: "Confecții metalice la comandă | SteelCraft",
  description:
    "Trimite detaliile proiectului tău pentru o confecție metalică realizată la comandă de SteelCraft.",
};

export default function CustomOrderPage() {
  return (
    <main className="min-h-screen bg-neutral-100">
      <section className="border-b border-neutral-200 bg-[#111111] text-white">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
          <p className="font-condensed text-xs font-bold uppercase tracking-[0.18em] text-primary sm:text-sm">
            Proiect personalizat
          </p>

          <h1 className="font-display mt-3 max-w-4xl text-5xl uppercase leading-[0.92] sm:text-6xl lg:text-7xl">
            Construim produsul
            <span className="block text-primary">
              după cerințele tale
            </span>
          </h1>

          <p className="mt-5 max-w-2xl text-sm leading-7 text-neutral-300 sm:text-base">
            Spune-ne ce ai nevoie, materialul,
            dimensiunile și modul de utilizare.
            Trimite cererea, iar noi analizăm
            proiectul și revenim cu o soluție.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-3 py-6 sm:px-6 sm:py-10 lg:px-8 lg:py-14">
        <CustomProjectForm />
      </section>
    </main>
  );
}