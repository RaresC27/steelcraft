"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/app/stores/cart-store";

type CartLinkProps = {
  mobile?: boolean;
};

export function CartLink({ mobile = false }: CartLinkProps) {
  const totalItems = useCartStore((state) =>
    state.items.reduce((total, item) => total + item.quantity, 0),
  );

  if (mobile) {
    return (
      <Link
        href="/cos"
        className={cn(
          buttonVariants(),
          "font-condensed mt-6 h-12 w-full rounded-sm text-sm font-bold uppercase tracking-[0.12em]",
        )}
      >
        <ShoppingBag className="size-4" />
        Coșul meu

        {totalItems > 0 && (
          <span className="ml-1 flex min-w-5 items-center justify-center rounded-full bg-white px-1.5 py-0.5 text-xs font-bold text-black">
            {totalItems}
          </span>
        )}
      </Link>
    );
  }

  return (
    <Link
      href="/cos"
      className={cn(
        buttonVariants(),
        "font-condensed relative h-11 rounded-sm px-5 text-sm font-bold uppercase tracking-[0.1em]",
      )}
    >
      <ShoppingBag className="size-4" />
      Coș

      {totalItems > 0 && (
        <span className="flex min-w-5 items-center justify-center rounded-full bg-white px-1.5 py-0.5 text-xs font-bold text-black">
          {totalItems}
        </span>
      )}
    </Link>
  );
}