"use client";

import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  ImageIcon,
} from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import {
  useCallback,
  useEffect,
  useState,
} from "react";

type ProductCarouselImage = {
  id: number | string;
  url: string;
  alt: string;
};

type ProductImageCarouselProps = {
  images: ProductCarouselImage[];
};

export function ProductImageCarousel({
  images,
}: ProductImageCarouselProps) {
  const [emblaRef, emblaApi] =
    useEmblaCarousel({
      loop: images.length > 1,
      align: "start",
      skipSnaps: false,
      dragFree: false,
    });

  const [selectedIndex, setSelectedIndex] =
    useState(0);

  const updateCarouselState =
    useCallback(() => {
      if (!emblaApi) {
        return;
      }

      setSelectedIndex(
        emblaApi.selectedScrollSnap(),
      );
    }, [emblaApi]);

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

    updateCarouselState();

    emblaApi.on(
      "select",
      updateCarouselState,
    );

    emblaApi.on(
      "reInit",
      updateCarouselState,
    );

    return () => {
      emblaApi.off(
        "select",
        updateCarouselState,
      );

      emblaApi.off(
        "reInit",
        updateCarouselState,
      );
    };
  }, [
    emblaApi,
    updateCarouselState,
  ]);

  if (images.length === 0) {
    return (
      <div className="flex aspect-[4/3] items-center justify-center overflow-hidden rounded-2xl bg-neutral-200 sm:rounded-sm">
        <div className="text-center text-neutral-500">
          <ImageIcon className="mx-auto size-7" />

          <p className="mt-3 text-sm">
            Imagine indisponibilă
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-w-0">
      <div className="relative -mx-3 overflow-hidden bg-neutral-100 sm:mx-0 sm:rounded-sm">
        <div
          ref={emblaRef}
          className="overflow-hidden"
        >
          <div className="flex touch-pan-y">
            {images.map(
              (image, index) => (
                <div
                  key={image.id}
                  className="relative aspect-[4/3] min-w-0 flex-[0_0_100%] bg-neutral-100 sm:aspect-[5/4] lg:aspect-[4/3]"
                >
                  <Image
                    src={image.url}
                    alt={image.alt}
                    fill
                    preload={index === 0}
                    sizes="(max-width: 639px) 100vw, (max-width: 1023px) 100vw, 50vw"
                    className="select-none object-cover"
                    draggable={false}
                  />
                </div>
              ),
            )}
          </div>
        </div>

        {images.length > 1 ? (
          <>
            <span className="pointer-events-none absolute bottom-3 right-3 rounded-full bg-black/70 px-2.5 py-1 font-condensed text-[11px] font-bold text-white backdrop-blur-md sm:bottom-4 sm:right-4 sm:px-3 sm:py-1.5 sm:text-xs">
              {selectedIndex + 1}
              <span className="mx-1 text-white/50">
                /
              </span>
              {images.length}
            </span>

            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/20 to-transparent sm:hidden"
            />

            <button
              type="button"
              onClick={scrollPrev}
              aria-label="Imaginea anterioară"
              className="absolute left-4 top-1/2 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/65 text-white shadow-lg backdrop-blur-md transition hover:bg-primary sm:flex"
            >
              <ChevronLeft className="size-5" />
            </button>

            <button
              type="button"
              onClick={scrollNext}
              aria-label="Imaginea următoare"
              className="absolute right-4 top-1/2 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/65 text-white shadow-lg backdrop-blur-md transition hover:bg-primary sm:flex"
            >
              <ChevronRight className="size-5" />
            </button>
          </>
        ) : null}
      </div>

      {images.length > 1 ? (
        <div className="mobile-scrollbar-hidden -mx-3 mt-3 flex snap-x snap-mandatory gap-2 overflow-x-auto px-3 pb-1 sm:mx-0 sm:px-0">
          {images.map(
            (image, index) => {
              const isActive =
                selectedIndex === index;

              return (
                <button
                  key={image.id}
                  type="button"
                  onClick={() =>
                    scrollTo(index)
                  }
                  aria-label={`Deschide imaginea ${index + 1}`}
                  aria-current={
                    isActive
                      ? "true"
                      : undefined
                  }
                  className={[
                    "relative aspect-square w-14 shrink-0 snap-start overflow-hidden rounded-xl border-2 bg-neutral-100 transition active:scale-95 sm:w-20 sm:rounded-sm",
                    isActive
                      ? "border-primary opacity-100"
                      : "border-transparent opacity-55 hover:opacity-100",
                  ].join(" ")}
                >
                  <Image
                    src={image.url}
                    alt=""
                    fill
                    sizes="80px"
                    className="object-cover"
                    draggable={false}
                  />
                </button>
              );
            },
          )}
        </div>
      ) : null}

      {images.length > 1 ? (
        <div className="mt-3 flex justify-center gap-1.5 sm:hidden">
          {images.map(
            (image, index) => (
              <button
                key={image.id}
                type="button"
                onClick={() =>
                  scrollTo(index)
                }
                aria-label={`Mergi la imaginea ${index + 1}`}
                className={[
                  "h-1.5 rounded-full transition-all duration-300",
                  selectedIndex === index
                    ? "w-7 bg-primary"
                    : "w-1.5 bg-neutral-300",
                ].join(" ")}
              />
            ),
          )}
        </div>
      ) : null}
    </div>
  );
}