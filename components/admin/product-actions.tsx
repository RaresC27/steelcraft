"use client";

import { useState, useTransition } from "react";

import {
  deleteProduct,
  toggleProductActive,
} from "@/app/admin/produse/action"

type ProductActionsProps = {
  productId: number;
  productName: string;
  isActive: boolean;
};

export function ProductActions({
  productId,
  productName,
  isActive,
}: ProductActionsProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  function handleToggle() {
    setError("");

    startTransition(async () => {
      try {
        await toggleProductActive(
          productId,
          !isActive,
        );
      } catch {
        setError(
          "Statusul produsului nu a putut fi schimbat.",
        );
      }
    });
  }

  function handleDelete() {
    const confirmed = window.confirm(
      `Sigur dorești să ștergi produsul „${productName}”? Dacă produsul apare în comenzi, va fi doar dezactivat.`,
    );

    if (!confirmed) {
      return;
    }

    setError("");

    startTransition(async () => {
      try {
        await deleteProduct(productId);
      } catch {
        setError(
          "Produsul nu a putut fi șters.",
        );
      }
    });
  }

  return (
    <div>
      <div className="flex flex-wrap justify-end gap-2">
        <button
          type="button"
          onClick={handleToggle}
          disabled={isPending}
          className="font-condensed inline-flex min-h-10 items-center justify-center border border-neutral-300 px-4 text-xs font-bold uppercase tracking-wider text-neutral-700 transition hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isActive ? "Dezactivează" : "Activează"}
        </button>

        <button
          type="button"
          onClick={handleDelete}
          disabled={isPending}
          className="font-condensed inline-flex min-h-10 items-center justify-center border border-red-300 px-4 text-xs font-bold uppercase tracking-wider text-red-700 transition hover:bg-red-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          Șterge
        </button>
      </div>

      {error ? (
        <p className="mt-2 text-right text-xs text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}