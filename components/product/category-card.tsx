import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

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
      className="group relative flex min-h-[280px] min-w-0 overflow-hidden rounded-sm border border-neutral-800 bg-[#111111] p-5 text-white transition duration-300 hover:border-primary sm:min-h-[330px] sm:p-6 lg:min-h-[360px] lg:p-7 lg:hover:-translate-y-2 lg:hover:shadow-[0_24px_60px_rgba(255,85,0,0.14)]"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,85,0,0.2),transparent_46%)] opacity-70 transition duration-500 group-hover:opacity-100"
      />

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:30px_30px] sm:bg-[size:38px_38px]"
      />

      <span className="font-display absolute right-4 top-3 text-5xl leading-none text-white/[0.04] transition duration-500 group-hover:text-primary/10 sm:right-5 sm:top-4 sm:text-7xl">
        {String(index + 1).padStart(2, "0")}
      </span>

      <div className="relative z-10 flex min-w-0 w-full flex-col">
        <div className="flex items-start justify-between gap-4">
          <span className="font-condensed min-w-0 text-[11px] font-bold uppercase tracking-[0.16em] text-primary sm:text-xs sm:tracking-[0.2em]">
            {category.eyebrow}
          </span>

          <span className="flex size-10 shrink-0 items-center justify-center rounded-sm border border-white/10 bg-white/5 transition duration-300 group-hover:border-primary group-hover:bg-primary sm:size-11">
            <ArrowUpRight className="size-4 transition duration-300 group-hover:rotate-45 sm:size-5" />
          </span>
        </div>

        <div className="mt-8 flex size-16 items-center justify-center rounded-sm bg-primary text-white shadow-[0_14px_35px_rgba(255,85,0,0.25)] transition duration-300 group-hover:scale-105 sm:mt-12 sm:size-20 lg:mt-14">
          <Icon
            className="size-7 sm:size-9"
            strokeWidth={1.7}
          />
        </div>

        <div className="mt-auto pt-8 sm:pt-10">
          <h3 className="font-display max-w-xs break-words text-3xl uppercase leading-[0.95] tracking-[0.025em] sm:text-4xl">
            {category.title}
          </h3>

          <p className="mt-3 line-clamp-3 max-w-sm text-sm leading-6 text-neutral-400 transition group-hover:text-neutral-300 sm:mt-4 sm:leading-7">
            {category.description}
          </p>

          <div className="mt-5 h-px w-full overflow-hidden bg-white/10 sm:mt-7">
            <div className="h-full w-0 bg-primary transition-all duration-500 group-hover:w-full" />
          </div>
        </div>
      </div>
    </Link>
  );
}