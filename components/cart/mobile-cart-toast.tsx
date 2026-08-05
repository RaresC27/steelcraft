"use client";

import {
  Check,
  ShoppingBag,
  X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import {
  CART_ITEM_ADDED_EVENT,
  type CartItemAddedDetail,
} from "@/lib/cart-events";

type ToastState = {
  productName: string;
  quantity: number;
};

export function MobileCartToast() {
  const [toast, setToast] =
    useState<ToastState | null>(null);

  const timeoutRef =
    useRef<ReturnType<typeof setTimeout> | null>(
      null,
    );

  useEffect(() => {
    function handleItemAdded(
      event: Event,
    ) {
      const customEvent =
        event as CustomEvent<CartItemAddedDetail>;

      const detail = customEvent.detail;

      if (!detail?.productName) {
        return;
      }

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      setToast({
        productName: detail.productName,
        quantity: detail.quantity ?? 1,
      });

      navigator.vibrate?.(35);

      timeoutRef.current = setTimeout(() => {
        setToast(null);
      }, 3500);
    }

    window.addEventListener(
      CART_ITEM_ADDED_EVENT,
      handleItemAdded,
    );

    return () => {
      window.removeEventListener(
        CART_ITEM_ADDED_EVENT,
        handleItemAdded,
      );

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className={[
        "pointer-events-none fixed inset-x-3 z-[60] lg:hidden",
        "bottom-[calc(5.75rem+env(safe-area-inset-bottom))]",
      ].join(" ")}
    >
      <div
        className={[
          "pointer-events-auto mx-auto max-w-md overflow-hidden rounded-2xl border border-white/10 bg-[#111111]/95 text-white shadow-[0_20px_60px_rgba(0,0,0,0.38)] backdrop-blur-xl",
          "transition-all duration-300 ease-out",
          toast
            ? "translate-y-0 scale-100 opacity-100"
            : "pointer-events-none translate-y-5 scale-95 opacity-0",
        ].join(" ")}
      >
        {toast ? (
          <div className="flex items-center gap-3 p-3">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-green-500/15 text-green-400">
              <Check className="size-5 stroke-[3]" />
            </span>

            <div className="min-w-0 flex-1">
              <p className="font-condensed text-xs font-bold uppercase tracking-[0.12em] text-primary">
                Adăugat în coș
              </p>

              <p className="mt-1 truncate text-sm font-semibold text-white">
                {toast.productName}
              </p>

              {toast.quantity > 1 ? (
                <p className="mt-0.5 text-xs text-neutral-400">
                  Cantitate: {toast.quantity}
                </p>
              ) : null}
            </div>

            <Link
              href="/cos"
              className="font-condensed inline-flex min-h-10 shrink-0 items-center gap-2 rounded-xl bg-primary px-3 text-xs font-bold uppercase tracking-[0.08em] text-white transition active:scale-95"
            >
              <ShoppingBag className="size-4" />
              Coș
            </Link>

            <button
              type="button"
              onClick={() => setToast(null)}
              aria-label="Închide notificarea"
              className="flex size-9 shrink-0 items-center justify-center rounded-full text-neutral-400 transition active:scale-95 active:bg-white/10 active:text-white"
            >
              <X className="size-4" />
            </button>
          </div>
        ) : null}

        {toast ? (
          <div className="h-0.5 bg-white/10">
            <div className="animate-toast-progress h-full origin-left bg-primary" />
          </div>
        ) : null}
      </div>
    </div>
  );
}