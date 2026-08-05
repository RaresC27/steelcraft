"use client";

import { useState } from "react";

import { useCartStore } from "@/app/stores/cart-store";


type AddToCartButtonProps = {
  product: {
    productId: number;
    name: string;
    slug: string;
    image: string | null;
    price: number;
    stock: number;
  };
};

export function AddToCartButton({
  product,
}: AddToCartButtonProps) {
  const [wasAdded, setWasAdded] = useState(false);

  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    addItem(product);
    setWasAdded(true);

    window.setTimeout(() => {
      setWasAdded(false);
    }, 2000);
  };

  const isOutOfStock = product.stock <= 0;

  return (
    <button
      type="button"
      onClick={handleAddToCart}
      disabled={isOutOfStock}
      className="inline-flex min-h-12 items-center justify-center rounded-sm bg-primary px-6 py-3 text-sm font-bold uppercase tracking-wide text-white transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-neutral-300 disabled:text-neutral-600 disabled:opacity-100"
    >
      {isOutOfStock
        ? "Stoc epuizat"
        : wasAdded
          ? "Adăugat în coș"
          : "Adaugă în coș"}
    </button>
  );
}