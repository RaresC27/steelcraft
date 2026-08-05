import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  ImageIcon,
} from "lucide-react";

type ProductCardProps = {
  product: {
    name: string;
    slug: string;
    shortDescription: string;
    material: string;
    priceLabel: string | null;
    image: string | null;
    category: {
      name: string;
      slug: string;
    };
  };
};

export function ProductCard({
  product,
}: ProductCardProps) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:rounded-sm">
      <Link
        href={`/produse/${product.slug}`}
        className="grid min-h-[158px] grid-cols-[118px_minmax(0,1fr)] sm:block"
      >
        <div className="relative overflow-hidden bg-neutral-100 sm:aspect-[4/3]">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 639px) 118px, (min-width: 1024px) 33vw, 50vw"
            />
          ) : (
            <div className="flex h-full min-h-[158px] flex-col items-center justify-center gap-2 text-neutral-400 sm:min-h-0">
              <ImageIcon className="size-6" />

              <span className="hidden text-xs sm:block">
                Imagine indisponibilă
              </span>
            </div>
          )}

          <span className="absolute left-2 top-2 max-w-[102px] truncate rounded-full bg-black/75 px-2.5 py-1 font-condensed text-[9px] font-bold uppercase tracking-[0.06em] text-white backdrop-blur-md sm:hidden">
            {product.category.name}
          </span>
        </div>

        <div className="flex min-w-0 flex-col p-3.5 sm:p-5">
          <p className="font-condensed hidden text-xs font-bold uppercase tracking-[0.14em] text-primary sm:block">
            {product.category.name}
          </p>

          <div className="flex items-start justify-between gap-2">
            <h2 className="font-display line-clamp-2 text-[22px] uppercase leading-[0.98] text-[#111111] sm:mt-2 sm:text-3xl">
              {product.name}
            </h2>

            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-[#111111] transition-all duration-200 group-active:scale-90 sm:hidden">
              <ArrowUpRight className="size-4" />
            </span>
          </div>

          <p className="mt-2 line-clamp-2 text-xs leading-5 text-neutral-600 sm:mt-3 sm:line-clamp-3 sm:text-sm sm:leading-6">
            {product.shortDescription}
          </p>

          <div className="mt-auto pt-3">
            <p className="font-condensed text-base font-bold leading-none text-primary sm:text-right sm:text-sm">
              {product.priceLabel ??
                "Preț la cerere"}
            </p>

            <div className="mt-3 flex items-end justify-between border-t border-neutral-200 pt-2.5 sm:mt-5 sm:pt-4">
              <div className="min-w-0">
                <p className="text-[9px] uppercase tracking-wide text-neutral-400 sm:text-xs">
                  Material
                </p>

                <p className="mt-0.5 truncate text-[11px] font-semibold text-[#111111] sm:mt-1 sm:text-sm">
                  {product.material}
                </p>
              </div>

              <span className="font-condensed hidden text-xs font-bold uppercase tracking-[0.08em] text-primary sm:inline">
                Vezi produsul →
              </span>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}