"use client";

import {
  ChevronDown,
  HelpCircle,
} from "lucide-react";
import { useState } from "react";

import { Container } from "@/components/layout/container";

const faqItems = [
  {
    question:
      "Realizați produse metalice la comandă?",
    answer:
      "Da. Putem realiza confecții metalice după dimensiunile și cerințele proiectului tău. Ne poți trimite o descriere, dimensiuni, fotografii sau o schiță prin pagina „La comandă”.",
  },
  {
    question:
      "Ce materiale folosiți?",
    answer:
      "Lucrăm în principal cu tablă neagră, tablă zincată, oțel și inox, în funcție de produs și de mediul în care va fi utilizat.",
  },
  {
    question:
      "Pot comanda o hrănitoare sau o adăpătoare în alte dimensiuni?",
    answer:
      "Da. Hrănitoarele, adăpătorile și vălăurile pot fi adaptate în funcție de animale, capacitatea dorită, spațiul disponibil și modul de utilizare.",
  },
  {
    question:
      "Livrați în toată România?",
    answer:
      "Da. Putem expedia produsele în toată țara. Costul și modalitatea de transport depind de dimensiunea, greutatea și destinația produsului.",
  },
  {
    question:
      "Cum primesc o ofertă pentru un proiect personalizat?",
    answer:
      "Completează formularul din pagina „La comandă” cu cât mai multe detalii. După analizarea proiectului, te contactăm pentru clarificări și stabilirea unei oferte.",
  },
  {
    question:
      "Pot trimite fotografii sau o schiță?",
    answer:
      "Da. Fotografiile și schițele ne ajută să înțelegem mai bine proiectul și să îți oferim o soluție cât mai apropiată de ceea ce ai nevoie.",
  },
  {
    question:
      "Produsele sunt disponibile imediat sau se realizează la comandă?",
    answer:
      "Depinde de produs. Unele produse pot fi disponibile, iar altele sunt realizate după primirea comenzii sau adaptate cerințelor clientului.",
  },
  {
    question:
      "Pot discuta direct cu cineva înainte să comand?",
    answer:
      "Sigur. Ne poți contacta telefonic, prin WhatsApp sau prin formularul de contact pentru a discuta detaliile înainte de plasarea unei comenzi.",
  },
];

export function HomeFaq() {
  const [openIndex, setOpenIndex] =
    useState<number | null>(0);

  return (
    <section className="bg-[#0f0f0f] py-14 text-white sm:py-18 lg:py-24">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <span className="flex size-12 items-center justify-center rounded-xl bg-primary/15 text-primary">
              <HelpCircle className="size-5" />
            </span>

            <p className="font-condensed mt-5 text-xs font-bold uppercase tracking-[0.18em] text-primary">
              Întrebări frecvente
            </p>

            <h2 className="font-display mt-2 text-4xl uppercase leading-[0.95] sm:text-5xl lg:text-6xl">
              Ai întrebări?
              <span className="block text-neutral-500">
                Avem răspunsuri.
              </span>
            </h2>

            <p className="mt-5 max-w-md text-sm leading-7 text-neutral-400 sm:text-base">
              Câteva dintre cele mai frecvente întrebări
              despre produse, execuție la comandă și
              livrare.
            </p>
          </div>

          <div>
            {faqItems.map(
              (item, index) => {
                const isOpen =
                  openIndex === index;

                return (
                  <div
                    key={item.question}
                    className="border-b border-white/10"
                  >
                    <button
                      type="button"
                      aria-expanded={
                        isOpen
                      }
                      onClick={() =>
                        setOpenIndex(
                          isOpen
                            ? null
                            : index,
                        )
                      }
                      className="group flex w-full items-center justify-between gap-5 py-5 text-left sm:py-6"
                    >
                      <span className="pr-3 text-[15px] font-semibold leading-6 text-neutral-200 transition group-hover:text-white sm:text-base">
                        {item.question}
                      </span>

                      <span
                        className={[
                          "flex size-9 shrink-0 items-center justify-center rounded-full transition duration-300",
                          isOpen
                            ? "rotate-180 bg-primary text-white"
                            : "bg-white/[0.06] text-neutral-400 group-hover:text-white",
                        ].join(
                          " ",
                        )}
                      >
                        <ChevronDown className="size-4" />
                      </span>
                    </button>

                    <div
                      className={[
                        "grid transition-[grid-template-rows,opacity] duration-300 ease-out",
                        isOpen
                          ? "grid-rows-[1fr] opacity-100"
                          : "grid-rows-[0fr] opacity-0",
                      ].join(
                        " ",
                      )}
                    >
                      <div className="overflow-hidden">
                        <p className="max-w-2xl pb-6 pr-12 text-sm leading-7 text-neutral-400 sm:text-[15px]">
                          {item.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              },
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}