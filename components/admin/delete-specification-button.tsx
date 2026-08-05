"use client";

import { useTransition } from "react";

import { deleteSpecification } from "@/app/admin/produse/[id]/specificatii/actions";

type DeleteSpecificationButtonProps = {
  productId: number;
  specificationId: number;
  specificationLabel: string;
};

export function DeleteSpecificationButton({
  productId,
  specificationId,
  specificationLabel,
}: DeleteSpecificationButtonProps) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    const confirmed = window.confirm(
      `Sigur dorești să ștergi specificația „${specificationLabel}”?`,
    );

    if (!confirmed) {
      return;
    }

    startTransition(async () => {
      await deleteSpecification(
        productId,
        specificationId,
      );
    });
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isPending}
      className="font-condensed inline-flex min-h-10 items-center justify-center rounded-sm border border-red-300 px-4 text-xs font-bold uppercase tracking-wider text-red-700 transition hover:bg-red-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
    >
      {isPending ? "Se șterge..." : "Șterge"}
    </button>
  );
}