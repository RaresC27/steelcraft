"use client";
import type { OrderStatus } from "@/generated/prisma/client";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

const statusOptions: Array<{
  value: OrderStatus;
  label: string;
}> = [
  {
    value: "PENDING",
    label: "În așteptare",
  },
  {
    value: "CONFIRMED",
    label: "Confirmată",
  },
  {
    value: "PROCESSING",
    label: "În procesare",
  },
  {
    value: "SHIPPED",
    label: "Expediată",
  },
  {
    value: "COMPLETED",
    label: "Finalizată",
  },
  {
    value: "CANCELLED",
    label: "Anulată",
  },
];

type OrderStatusFormProps = {
  orderId: number;
  currentStatus: OrderStatus;
};

export function OrderStatusForm({
  orderId,
  currentStatus,
}: OrderStatusFormProps) {
  const router = useRouter();

  const [status, setStatus] =
    useState<OrderStatus>(currentStatus);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError("");
    setSuccessMessage("");
    setIsSubmitting(true);

    try {
      const response = await fetch(
        `/api/admin/orders/${orderId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status,
          }),
        },
      );

      const data = (await response.json()) as {
        error?: string;
        message?: string;
      };

      if (!response.ok) {
        throw new Error(
          data.error ?? "Statusul nu a putut fi actualizat.",
        );
      }

      setSuccessMessage(
        data.message ?? "Statusul a fost actualizat.",
      );

      router.refresh();
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "A apărut o eroare neașteptată.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="border border-neutral-200 bg-white p-6 shadow-sm">
      <h2 className="border-b border-neutral-200 pb-4 font-bebas-neue text-3xl uppercase tracking-wide text-[#111111]">
        Actualizare status
      </h2>

      <form
        onSubmit={handleSubmit}
        className="mt-5"
      >
        <label
          htmlFor="orderStatus"
          className="block font-barlow-condensed text-sm font-bold uppercase tracking-wider text-[#111111]"
        >
          Status comandă
        </label>

        <select
          id="orderStatus"
          value={status}
          onChange={(event) =>
            setStatus(event.target.value as OrderStatus)
          }
          className="mt-2 h-12 w-full border border-neutral-300 bg-white px-4 font-barlow text-[#111111] outline-none transition focus:border-[#ff5500] focus:ring-2 focus:ring-[#ff5500]/15"
        >
          {statusOptions.map((option) => (
            <option
              key={option.value}
              value={option.value}
            >
              {option.label}
            </option>
          ))}
        </select>

        {error ? (
          <div
            role="alert"
            className="mt-4 border border-red-200 bg-red-50 px-4 py-3 font-barlow text-sm text-red-700"
          >
            {error}
          </div>
        ) : null}

        {successMessage ? (
          <div
            role="status"
            className="mt-4 border border-green-200 bg-green-50 px-4 py-3 font-barlow text-sm text-green-700"
          >
            {successMessage}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={
            isSubmitting || status === currentStatus
          }
          className="mt-5 inline-flex min-h-12 w-full items-center justify-center bg-[#ff5500] px-5 font-barlow-condensed text-base font-bold uppercase tracking-wider text-white transition hover:bg-[#e64d00] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting
            ? "Se actualizează..."
            : "Salvează statusul"}
        </button>
      </form>
    </section>
  );
}