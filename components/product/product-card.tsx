import Image from "next/image";
import Link from "next/link";

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
    <article className="overflow-hidden rounded-sm border border-neutral-200 bg-white">
      <Link
        href={`/produse/${product.slug}`}

        className="group block"
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-neutral-200">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover transition duration-300 group-hover:scale-105"
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-neutral-500">
              Imagine indisponibilă
            </div>
          )}
        </div>

        <div className="p-5">
          <p className="font-condensed text-xs font-bold uppercase tracking-[0.14em] text-primary">
            {product.category.name}
          </p>

          <h2 className="font-display mt-2 text-3xl uppercase leading-none text-[#111111]">
            {product.name}
          </h2>

          <p className="mt-3 line-clamp-3 text-sm leading-6 text-neutral-600">
            {product.shortDescription}
          </p>

          <div className="mt-5 flex items-end justify-between gap-4 border-t border-neutral-200 pt-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-neutral-500">
                Material
              </p>

              <p className="mt-1 text-sm font-semibold text-[#111111]">
                {product.material}
              </p>
            </div>

            <p className="text-right text-sm font-bold text-primary">
              {product.priceLabel ?? "Preț la cerere"}
            </p>
          </div>
        </div>
      </Link>
    </article>
  );
}