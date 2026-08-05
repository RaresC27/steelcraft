import Link from "next/link";

import { productCategories } from "@/data/product-categories";
import { cn } from "@/lib/utils";

type ProductCategoryFilterProps = {
  activeCategory?: string;
};

export function ProductCategoryFilter({
  activeCategory,
}: ProductCategoryFilterProps) {
  return (
    <nav
      aria-label="Filtrare produse după categorie"
      className="flex flex-wrap gap-2"
    >
      <Link
        href="/produse"
        className={cn(
          "font-condensed inline-flex h-11 items-center rounded-sm border px-5 text-sm font-bold uppercase tracking-[0.1em] transition",
          !activeCategory
            ? "border-primary bg-primary text-white"
            : "border-neutral-300 bg-white text-neutral-700 hover:border-primary hover:text-primary",
        )}
      >
        Toate produsele
      </Link>

      {productCategories.map((category) => {
        const isActive = activeCategory === category.slug;

        return (
          <Link
            key={category.slug}
            href={`/produse?categorie=${category.slug}`}
            className={cn(
              "font-condensed inline-flex h-11 items-center rounded-sm border px-5 text-sm font-bold uppercase tracking-[0.1em] transition",
              isActive
                ? "border-primary bg-primary text-white"
                : "border-neutral-300 bg-white text-neutral-700 hover:border-primary hover:text-primary",
            )}
          >
            {category.title}
          </Link>
        );
      })}
    </nav>
  );
}