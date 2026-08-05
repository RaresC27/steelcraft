"use client";

import { useState, useTransition } from "react";

import {
  deleteCategory,
  toggleCategoryActive,
} from "@/app/admin/categorii/action";

type CategoryActionsProps = {
  categoryId: number;
  categoryName: string;
  isActive: boolean;
};

export function CategoryActions({
  categoryId,
  categoryName,
  isActive,
}: CategoryActionsProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  function handleToggle() {
    setError("");

    startTransition(async () => {
      try {
        await toggleCategoryActive(
          categoryId,
          !isActive,
        );
      } catch {
        setError(
          "Statusul categoriei nu a putut fi schimbat.",
        );
      }
    });
  }

  function handleDelete() {
    const confirmed = window.confirm(
      `Sigur dorești să ștergi categoria „${categoryName}”?`,
    );

    if (!confirmed) {
      return;
    }

    setError("");

    startTransition(async () => {
      const result = await deleteCategory(categoryId);

      if (!result.success) {
        setError(result.message);
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
          className="font-condensed inline-flex min-h-10 items-center justify-center border border-neutral-300 px-4 text-xs font-bold uppercase tracking-wider text-neutral-700 transition hover:border-primary hover:text-primary disabled:opacity-50"
        >
          {isActive ? "Dezactivează" : "Activează"}
        </button>

        <button
          type="button"
          onClick={handleDelete}
          disabled={isPending}
          className="font-condensed inline-flex min-h-10 items-center justify-center border border-red-300 px-4 text-xs font-bold uppercase tracking-wider text-red-700 transition hover:bg-red-600 hover:text-white disabled:opacity-50"
        >
          Șterge
        </button>
      </div>

      {error ? (
        <p className="mt-2 max-w-xs text-right text-xs text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}