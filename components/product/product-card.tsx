import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
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
    <article className="group overflow-hidden rounded-[1.6rem] border border-neutral-200 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.05)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_50px_rgba(0,0,0,0.08)] sm:rounded-xl">
      <Link
        href={`/produse/${product.slug}`}
        prefetch
        className="block"
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.025]"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-neutral-400">
              <ImageIcon className="size-7" />
            </div>
          )}

          <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3">
            <span className="max-w-[75%] truncate rounded-full bg-black/70 px-3 py-1.5 font-condensed text-[10px] font-bold uppercase tracking-[0.08em] text-white backdrop-blur-md">
              {product.category.name}
            </span>

            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white/90 text-[#111111] shadow-sm backdrop-blur transition group-hover:bg-primary group-hover:text-white">
              <ArrowRight className="size-4 -rotate-45 transition group-hover:rotate-0" />
            </span>
          </div>
        </div>

        <div className="p-4 sm:p-5">
          <div className="min-w-0">
            <h2 className="font-display line-clamp-2 text-[1.65rem] uppercase leading-[0.95] text-[#111111] sm:text-[2rem]">
              {product.name}
            </h2>

            <p className="mt-2 line-clamp-2 text-sm leading-6 text-neutral-600">
              {product.shortDescription}
            </p>
          </div>

          <div className="mt-5 border-t border-neutral-200 pt-4">
            <div className="flex items-end justify-between gap-4">
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-neutral-400">
                  Material
                </p>

                <p className="mt-1 truncate text-sm font-semibold text-[#111111]">
                  {product.material}
                </p>
              </div>

              <div className="text-right">
                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-neutral-400">
                  Preț
                </p>

                <p className="font-condensed mt-1 text-[1.45rem] font-bold leading-none text-primary sm:text-[1.6rem]">
                  {product.priceLabel ??
                    "Preț la cerere"}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <span className="font-condensed text-[11px] font-bold uppercase tracking-[0.1em] text-neutral-400">
              Detalii produs
            </span>

            <span className="font-condensed inline-flex items-center gap-1 text-xs font-bold uppercase tracking-[0.08em] text-primary">
              Vezi produsul
              <ArrowRight className="size-3.5" />
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}