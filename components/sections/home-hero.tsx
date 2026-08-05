"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { Container } from "@/components/layout/container";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const slides = [
  {
    image: "/images/hero/hero-main.jpg",
    eyebrow: "SteelCraft",
    title: "Produse metalice",
    accent: "construite să reziste",
    description:
      "Confecții metalice realizate din tablă și inox, în dimensiuni standard sau adaptate proiectului tău.",
    primaryHref: "/produse",
    primaryLabel: "Vezi produsele",
    secondaryHref: "/contact",
    secondaryLabel: "Solicită ofertă",
  },
  {
    image: "/images/hero/hero-gates.jpg",
    eyebrow: "Execuție la comandă",
    title: "Porți și garduri",
    accent: "pentru proiecte durabile",
    description:
      "Soluții metalice pentru proprietăți rezidențiale și comerciale, realizate după dimensiunile tale.",
    primaryHref: "/produse?category=porti-metalice",
    primaryLabel: "Vezi porțile",
    secondaryHref: "/contact",
    secondaryLabel: "Discută proiectul",
  },
  {
    image: "/images/hero/hero-structures.jpg",
    eyebrow: "Construcții metalice",
    title: "Structuri solide",
    accent: "finisaje atent executate",
    description:
      "Copertine, balustrade și structuri metalice fabricate pentru rezistență și utilizare îndelungată.",
    primaryHref: "/produse",
    primaryLabel: "Descoperă gama",
    secondaryHref: "/contact",
    secondaryLabel: "Cere o ofertă",
  },
];

export function HomeHero() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
  });

  const [selectedIndex, setSelectedIndex] =
    useState(0);

  const scrollPrev = useCallback(() => {
    emblaApi?.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    emblaApi?.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback(
    (index: number) => {
      emblaApi?.scrollTo(index);
    },
    [emblaApi],
  );

  useEffect(() => {
    if (!emblaApi) {
      return;
    }

    const onSelect = () => {
      setSelectedIndex(
        emblaApi.selectedScrollSnap(),
      );
    };

    onSelect();
    emblaApi.on("select", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) {
      return;
    }

    const interval = window.setInterval(() => {
      emblaApi.scrollNext();
    }, 6500);

    return () => {
      window.clearInterval(interval);
    };
  }, [emblaApi]);

  return (
    <section className="relative overflow-hidden bg-black text-white">
      <div
        ref={emblaRef}
        className="overflow-hidden"
      >
        <div className="flex">
          {slides.map((slide, index) => (
            <article
              key={slide.image}
              className="relative min-w-0 flex-[0_0_100%]"
            >
              <div className="relative min-h-[calc(100svh-4rem)] lg:min-h-[760px]">
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  priority={index === 0}
                  sizes="100vw"
                  className="object-cover object-center"
                />

                <div className="absolute inset-0 bg-black/35" />

                <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(5,5,5,0.98)_0%,rgba(5,5,5,0.8)_28%,rgba(5,5,5,0.18)_72%,rgba(5,5,5,0.06)_100%)] lg:bg-[linear-gradient(90deg,rgba(5,5,5,0.98)_0%,rgba(5,5,5,0.9)_40%,rgba(5,5,5,0.35)_72%,rgba(5,5,5,0.08)_100%)]" />

                <Container className="relative z-10 flex min-h-[calc(100svh-4rem)] items-end pb-24 pt-24 lg:min-h-[760px] lg:items-center lg:pb-24">
                  <div className="max-w-3xl">
                    <p className="font-condensed text-xs font-bold uppercase tracking-[0.2em] text-primary sm:text-sm">
                      {slide.eyebrow}
                    </p>

                    <h1 className="font-display mt-4 text-[3.15rem] uppercase leading-[0.9] sm:text-7xl md:text-8xl lg:text-[6.4rem]">
                      {slide.title}
                      <span className="block text-primary">
                        {slide.accent}
                      </span>
                    </h1>

                    <p className="mt-5 max-w-xl text-[15px] leading-7 text-neutral-200 sm:text-lg sm:leading-8">
                      {slide.description}
                    </p>

                    <div className="mt-7 grid gap-3 sm:flex sm:flex-wrap">
                      <Link
                        href={slide.primaryHref}
                        className={cn(
                          buttonVariants({
                            size: "lg",
                          }),
                          "font-condensed min-h-14 w-full rounded-sm px-7 text-sm font-bold uppercase tracking-[0.1em] active:scale-[0.98] sm:w-auto",
                        )}
                      >
                        {slide.primaryLabel}
                        <ArrowRight className="size-4" />
                      </Link>

                      <Link
                        href={slide.secondaryHref}
                        className={cn(
                          buttonVariants({
                            variant: "outline",
                            size: "lg",
                          }),
                          "font-condensed min-h-14 w-full rounded-sm border-white/30 bg-transparent px-7 text-sm font-bold uppercase tracking-[0.1em] text-white hover:bg-white hover:text-black sm:w-auto",
                        )}
                      >
                        {slide.secondaryLabel}
                      </Link>
                    </div>
                  </div>
                </Container>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-5 z-20">
        <Container className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {slides.map((slide, index) => (
              <button
                key={slide.image}
                type="button"
                onClick={() => scrollTo(index)}
                aria-label={`Mergi la slide-ul ${index + 1}`}
                className={[
                  "h-1.5 rounded-full transition-all duration-300",
                  selectedIndex === index
                    ? "w-10 bg-primary"
                    : "w-5 bg-white/35",
                ].join(" ")}
              />
            ))}
          </div>

          <div className="hidden items-center gap-2 sm:flex">
            <button
              type="button"
              onClick={scrollPrev}
              aria-label="Slide anterior"
              className="flex size-11 items-center justify-center border border-white/20 bg-black/25 text-white backdrop-blur transition hover:border-white hover:bg-white hover:text-black"
            >
              <ArrowLeft className="size-4" />
            </button>

            <button
              type="button"
              onClick={scrollNext}
              aria-label="Slide următor"
              className="flex size-11 items-center justify-center border border-white/20 bg-black/25 text-white backdrop-blur transition hover:border-white hover:bg-white hover:text-black"
            >
              <ArrowRight className="size-4" />
            </button>
          </div>
        </Container>
      </div>
    </section>
  );
}