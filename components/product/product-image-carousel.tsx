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

    const handleSelect = () => {
      setSelectedIndex(
        emblaApi.selectedScrollSnap(),
      );
    };

    handleSelect();

    emblaApi.on("select", handleSelect);
    emblaApi.on("reInit", handleSelect);

    return () => {
      emblaApi.off("select", handleSelect);
      emblaApi.off("reInit", handleSelect);
    };
  }, [emblaApi]);

  if (images.length === 0) {
    return (
      <div className="flex aspect-[4/3] items-center justify-center rounded-2xl bg-neutral-200 sm:rounded-sm">
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
    <div>
      <div className="relative overflow-hidden rounded-2xl bg-neutral-200 shadow-sm sm:rounded-sm">
        <div
          ref={emblaRef}
          className="overflow-hidden"
        >
          <div className="flex touch-pan-y">
            {images.map((image, index) => (
              <div
                key={image.id}
                className="relative aspect-[4/3] min-w-0 flex-[0_0_100%]"
              >
                <Image
                  src={image.url}
                  alt={image.alt}
                  fill
                  priority={index === 0}
                  className="object-cover"
                  sizes="(min-width: 1024px) 50vw, 100vw"
                />
              </div>
            ))}
          </div>
        </div>

        {images.length > 1 ? (
          <>
            <button
              type="button"
              onClick={scrollPrev}
              aria-label="Imaginea anterioară"
              className="absolute left-3 top-1/2 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/65 text-white backdrop-blur transition hover:bg-primary sm:flex"
            >
              <ChevronLeft className="size-5" />
            </button>

            <button
              type="button"
              onClick={scrollNext}
              aria-label="Imaginea următoare"
              className="absolute right-3 top-1/2 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/65 text-white backdrop-blur transition hover:bg-primary sm:flex"
            >
              <ChevronRight className="size-5" />
            </button>

            <span className="absolute bottom-3 right-3 rounded-full bg-black/65 px-3 py-1.5 font-condensed text-xs font-bold text-white backdrop-blur">
              {selectedIndex + 1}/{images.length}
            </span>
          </>
        ) : null}
      </div>

      {images.length > 1 ? (
        <div className="mobile-scrollbar-hidden mt-3 flex gap-2 overflow-x-auto pb-1">
          {images.map((image, index) => (
            <button
              key={image.id}
              type="button"
              onClick={() => scrollTo(index)}
              aria-label={`Deschide imaginea ${index + 1}`}
              className={[
                "relative aspect-square w-16 shrink-0 overflow-hidden rounded-xl border-2 transition active:scale-95 sm:w-20 sm:rounded-sm",
                selectedIndex === index
                  ? "border-primary"
                  : "border-transparent opacity-60 hover:opacity-100",
              ].join(" ")}
            >
              <Image
                src={image.url}
                alt=""
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}