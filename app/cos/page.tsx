"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
} from "lucide-react";

import { Container } from "@/components/layout/container";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/app/stores/cart-store";


function formatPrice(price: number) {
  return new Intl.NumberFormat("ro-RO", {
    style: "currency",
    currency: "RON",
  }).format(price);
}

export default function CartPage() {
  const [isMounted, setIsMounted] = useState(false);

  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const increaseQuantity = useCartStore(
    (state) => state.increaseQuantity,
  );
  const decreaseQuantity = useCartStore(
    (state) => state.decreaseQuantity,
  );
  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const totalItems = items.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  if (!isMounted) {
    return (
      <main className="min-h-[70vh] bg-neutral-50 py-16">
        <Container>
          <div className="h-96 animate-pulse rounded-sm bg-neutral-200" />
        </Container>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="min-h-[70vh] bg-neutral-50 py-16 md:py-24">
        <Container>
          <div className="mx-auto flex max-w-2xl flex-col items-center border border-neutral-200 bg-white px-6 py-16 text-center shadow-sm md:px-12">
            <span className="flex size-20 items-center justify-center rounded-full bg-primary/10">
              <ShoppingBag className="size-9 text-primary" />
            </span>

            <p className="font-condensed mt-6 text-sm font-bold uppercase tracking-[0.18em] text-primary">
              Coșul tău
            </p>

            <h1 className="font-display mt-2 text-4xl uppercase text-[#111111] md:text-5xl">
              Coșul este gol
            </h1>

            <p className="mt-4 max-w-lg text-base leading-7 text-neutral-600">
              Nu ai adăugat încă niciun produs. Descoperă produsele
              disponibile și adaugă în coș tot ce ai nevoie.
            </p>

            <Link
              href="/produse"
              className={cn(
                buttonVariants(),
                "font-condensed mt-8 h-12 rounded-sm px-7 text-sm font-bold uppercase tracking-[0.12em]",
              )}
            >
              Vezi produsele
            </Link>
          </div>
        </Container>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-50 py-12 md:py-16">
      <Container>
        <div className="mb-10">
          <Link
            href="/produse"
            className="font-condensed inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.1em] text-neutral-500 transition hover:text-primary"
          >
            <ArrowLeft className="size-4" />
            Continuă cumpărăturile
          </Link>

          <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="font-condensed text-sm font-bold uppercase tracking-[0.18em] text-primary">
                Comanda ta
              </p>

              <h1 className="font-display mt-1 text-4xl uppercase text-[#111111] md:text-6xl">
                Coș de cumpărături
              </h1>
            </div>

            <p className="font-condensed text-sm font-semibold uppercase tracking-[0.1em] text-neutral-500">
              {totalItems}{" "}
              {totalItems === 1 ? "produs" : "produse"} în coș
            </p>
          </div>
        </div>

        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
          <section
            aria-label="Produsele din coș"
            className="border border-neutral-200 bg-white"
          >
            <div className="hidden grid-cols-[minmax(0,1fr)_140px_120px] gap-6 border-b border-neutral-200 bg-neutral-100 px-6 py-4 md:grid">
              <span className="font-condensed text-xs font-bold uppercase tracking-[0.14em] text-neutral-500">
                Produs
              </span>

              <span className="font-condensed text-center text-xs font-bold uppercase tracking-[0.14em] text-neutral-500">
                Cantitate
              </span>

              <span className="font-condensed text-right text-xs font-bold uppercase tracking-[0.14em] text-neutral-500">
                Total
              </span>
            </div>

            <div className="divide-y divide-neutral-200">
              {items.map((item) => {
                const itemTotal = item.price * item.quantity;
                const canIncrease = item.quantity < item.stock;

                return (
                  <article
                    key={item.productId}
                    className="grid gap-6 p-5 md:grid-cols-[minmax(0,1fr)_140px_120px] md:items-center md:p-6"
                  >
                    <div className="flex min-w-0 gap-4">
                      <Link
                        href={`/produse/${item.slug}`}
                        className="flex size-24 shrink-0 items-center justify-center overflow-hidden border border-neutral-200 bg-neutral-100"
                      >
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="size-full object-cover transition duration-300 hover:scale-105"
                          />
                        ) : (
                          <ShoppingBag className="size-8 text-neutral-400" />
                        )}
                      </Link>

                      <div className="flex min-w-0 flex-1 flex-col">
                        <Link
                          href={`/produse/${item.slug}`}
                          className="font-condensed text-lg font-bold uppercase tracking-[0.04em] text-[#111111] transition hover:text-primary"
                        >
                          {item.name}
                        </Link>

                        <span className="mt-1 text-sm text-neutral-500">
                          {formatPrice(item.price)} / bucată
                        </span>

                        <span className="mt-1 text-xs text-neutral-400">
                          Stoc disponibil: {item.stock}
                        </span>

                        <button
                          type="button"
                          onClick={() => removeItem(item.productId)}
                          className="font-condensed mt-auto inline-flex w-fit items-center gap-2 pt-4 text-xs font-bold uppercase tracking-[0.1em] text-neutral-500 transition hover:text-red-600"
                        >
                          <Trash2 className="size-3.5" />
                          Elimină
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between md:justify-center">
                      <span className="font-condensed text-xs font-bold uppercase tracking-[0.1em] text-neutral-500 md:hidden">
                        Cantitate
                      </span>

                      <div className="flex h-11 items-center border border-neutral-300">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          aria-label={`Scade cantitatea pentru ${item.name}`}
                          onClick={() =>
                            decreaseQuantity(item.productId)
                          }
                          className="size-10 rounded-none hover:bg-neutral-100"
                        >
                          <Minus className="size-4" />
                        </Button>

                        <span
                          aria-live="polite"
                          className="font-condensed flex w-10 items-center justify-center text-sm font-bold"
                        >
                          {item.quantity}
                        </span>

                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          aria-label={`Mărește cantitatea pentru ${item.name}`}
                          onClick={() =>
                            increaseQuantity(item.productId)
                          }
                          disabled={!canIncrease}
                          className="size-10 rounded-none hover:bg-neutral-100"
                        >
                          <Plus className="size-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between md:block md:text-right">
                      <span className="font-condensed text-xs font-bold uppercase tracking-[0.1em] text-neutral-500 md:hidden">
                        Total
                      </span>

                      <span className="font-condensed text-lg font-bold text-[#111111]">
                        {formatPrice(itemTotal)}
                      </span>
                    </div>
                  </article>
                );
              })}
            </div>

            <div className="flex justify-end border-t border-neutral-200 bg-neutral-50 px-5 py-4 md:px-6">
              <button
                type="button"
                onClick={clearCart}
                className="font-condensed inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-neutral-500 transition hover:text-red-600"
              >
                <Trash2 className="size-4" />
                Golește coșul
              </button>
            </div>
          </section>

          <aside className="sticky top-32 border border-neutral-200 bg-white p-6 shadow-sm">
            <p className="font-condensed text-sm font-bold uppercase tracking-[0.16em] text-primary">
              Sumar comandă
            </p>

            <h2 className="font-display mt-1 text-3xl uppercase text-[#111111]">
              Total
            </h2>

            <div className="mt-6 space-y-4 border-y border-neutral-200 py-5">
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm text-neutral-600">
                  Subtotal
                </span>

                <span className="font-condensed font-bold text-[#111111]">
                  {formatPrice(subtotal)}
                </span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <span className="text-sm text-neutral-600">
                  Livrare
                </span>

                <span className="font-condensed text-sm font-bold text-neutral-500">
                  Se calculează ulterior
                </span>
              </div>
            </div>

            <div className="mt-5 flex items-end justify-between gap-4">
              <span className="font-condensed text-sm font-bold uppercase tracking-[0.1em] text-[#111111]">
                Total produse
              </span>

              <span className="font-display text-3xl text-[#111111]">
                {formatPrice(subtotal)}
              </span>
            </div>

            <Link
              href="/checkout"
              className={cn(
                buttonVariants(),
                "font-condensed mt-7 h-13 w-full rounded-sm text-sm font-bold uppercase tracking-[0.12em]",
              )}
            >
              Continuă spre comandă
            </Link>

            <p className="mt-4 text-center text-xs leading-5 text-neutral-500">
              Costul final al livrării va fi stabilit în funcție de
              produsele și adresa selectată.
            </p>
          </aside>
        </div>
      </Container>
    </main>
  );
}