import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
} from "lucide-react";

import type { ProductCategory } from "@/data/product-categories";

type CategoryCardProps = {
  category: ProductCategory;
  index: number;
};

export function CategoryCard({
  category,
  index,
}: CategoryCardProps) {
  const Icon = category.icon;

  return (
    <Link
      href={`/produse?categorie=${category.slug}`}
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#111111] p-4 text-white shadow-[0_10px_30px_rgba(0,0,0,0.16)] transition-all duration-300 active:scale-[0.985] sm:rounded-sm sm:p-6 lg:hover:-translate-y-1 lg:hover:border-primary/60 lg:hover:shadow-[0_18px_50px_rgba(255,85,0,0.12)]"
    >
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-1 bg-primary"
      />

      <div className="flex items-start gap-4">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary text-white shadow-[0_8px_24px_rgba(255,85,0,0.28)] transition duration-300 group-hover:scale-105 sm:size-14 sm:rounded-sm">
          <Icon
            className="size-5 sm:size-6"
            strokeWidth={1.8}
          />
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="font-condensed text-[10px] font-bold uppercase tracking-[0.16em] text-primary sm:text-xs">
                {category.eyebrow}
              </p>

              <h3 className="font-display mt-1 text-[1.75rem] uppercase leading-[0.95] text-white sm:text-3xl">
                {category.title}
              </h3>
            </div>

            <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition duration-300 group-hover:border-primary group-hover:bg-primary">
              <ArrowUpRight className="size-4" />
            </span>
          </div>

          <p className="mt-3 line-clamp-2 text-sm leading-6 text-neutral-400 transition group-hover:text-neutral-300 sm:line-clamp-3">
            {category.description}
          </p>

          <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3">
            <span className="font-condensed inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.09em] text-white">
              Vezi produsele

              <ArrowRight className="size-4 text-primary transition-transform duration-300 group-hover:translate-x-1" />
            </span>

            <span className="font-condensed text-xs font-bold text-neutral-600">
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}