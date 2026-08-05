import Image from "next/image";
import Link from "next/link";
import {
    ArrowRight,
    Check,
    MessageSquareText,
} from "lucide-react";

import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const heroBenefits = [
    "Execuție din tablă și inox",
    "Dimensiuni standard sau personalizate",
    "Livrare disponibilă în toată țara",
];

export function HomeHero() {
    return (
        <section className="relative isolate min-h-[680px] overflow-hidden bg-[#050505] text-white lg:min-h-[720px]">
            <Image
                src="/images/hero/hero-main.jpg"
                alt="Confecție metalică realizată de SteelCraft"
                fill
                priority
                sizes="100vw"
                className="object-cover object-center"
            />

            <div
                aria-hidden="true"
                className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,5,5,0.98)_0%,rgba(5,5,5,0.9)_38%,rgba(5,5,5,0.45)_70%,rgba(5,5,5,0.25)_100%)]"
            />

            <div
                aria-hidden="true"
                className="absolute inset-0 bg-[linear-gradient(to_top,rgba(5,5,5,0.75),transparent_45%)]"
            />

            <div
                aria-hidden="true"
                className="absolute inset-0 bg-[linear-gradient(rgba(255,85,0,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,85,0,0.04)_1px,transparent_1px)] bg-[size:64px_64px]"
            />

            <Container className="relative z-10 flex min-h-[680px] items-center py-20 lg:min-h-[720px] lg:py-24">
                <div className="max-w-3xl">
                    <div className="mb-6 flex items-center gap-3">
                        <span className="h-px w-10 bg-primary" />

                        <p className="font-condensed text-sm font-bold uppercase tracking-[0.22em] text-primary">
                            Confecții metalice realizate în România
                        </p>
                    </div>

                    <h1 className="font-display text-6xl uppercase leading-[0.87] tracking-[0.025em] sm:text-7xl md:text-8xl lg:text-[6.5rem]">
                        Produse metalice
                        <span className="mt-2 block text-primary">
                            construite să reziste
                        </span>
                    </h1>

                    <p className="mt-7 max-w-2xl text-base leading-7 text-neutral-300 sm:text-lg sm:leading-8">
                        Hrănitoare pentru animale și confecții metalice realizate din
                        tablă sau inox, disponibile în dimensiuni standard ori adaptate
                        cerințelor proiectului tău.
                    </p>

                    <ul className="mt-7 grid gap-3 sm:grid-cols-2">
                        {heroBenefits.map((benefit) => (
                            <li
                                key={benefit}
                                className="flex items-center gap-3 text-sm font-medium text-neutral-200"
                            >
                                <span className="flex size-6 shrink-0 items-center justify-center rounded-sm bg-primary text-white">
                                    <Check className="size-3.5" strokeWidth={3} />
                                </span>

                                {benefit}
                            </li>
                        ))}
                    </ul>

                    <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                        <Link
                            href="/produse"
                            className={cn(
                                buttonVariants({ size: "lg" }),
                                "font-condensed h-14 rounded-sm px-8 text-sm font-bold uppercase tracking-[0.14em]",
                            )}
                        >
                            Vezi produsele
                            <ArrowRight className="size-4" />
                        </Link>

                        <Link
                            href="/contact"
                            className={cn(
                                buttonVariants({
                                    variant: "outline",
                                    size: "lg",
                                }),
                                "font-condensed h-14 rounded-sm border-white/25 bg-black/20 px-8 text-sm font-bold uppercase tracking-[0.14em] text-white backdrop-blur-sm hover:border-white hover:bg-white hover:text-black",
                            )}
                        >
                            <MessageSquareText className="size-4" />
                            Solicită ofertă
                        </Link>
                    </div>

                    <div className="mt-10 flex items-center gap-4 border-l-2 border-primary pl-4">
                        <p className="max-w-lg text-sm leading-6 text-neutral-400">
                            Ai nevoie de alte dimensiuni? Putem adapta produsul pentru
                            proiectul și spațiul tău.
                        </p>
                    </div>
                </div>
            </Container>

            <div
                aria-hidden="true"
                className="absolute bottom-0 left-0 z-10 h-1 w-full bg-gradient-to-r from-primary via-primary/40 to-transparent"
            />
        </section>
    );
}