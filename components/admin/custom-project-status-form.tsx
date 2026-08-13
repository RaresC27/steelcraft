"use client";

import {
  LoaderCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const statuses = [
  {
    value: "NEW",
    label: "Nouă",
  },
  {
    value: "REVIEWING",
    label: "În analiză",
  },
  {
    value: "QUOTED",
    label: "Ofertată",
  },
  {
    value: "ACCEPTED",
    label: "Acceptată",
  },
  {
    value: "REJECTED",
    label: "Respinsă",
  },
  {
    value: "ARCHIVED",
    label: "Arhivată",
  },
] as const;

type Props = {
  requestId: number;
  currentStatus: string;
};

export function CustomProjectStatusForm({
  requestId,
  currentStatus,
}: Props) {
  const router = useRouter();

  const [status, setStatus] =
    useState(currentStatus);

  const [
    isUpdating,
    setIsUpdating,
  ] = useState(false);

  async function updateStatus(
    nextStatus: string,
  ) {
    if (
      isUpdating ||
      nextStatus === status
    ) {
      return;
    }

    const previousStatus = status;

    setStatus(nextStatus);
    setIsUpdating(true);

    try {
      const response = await fetch(
        `/api/admin/custom-projects/${requestId}`,
        {
          method: "PATCH",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            status: nextStatus,
          }),
        },
      );

      if (!response.ok) {
        throw new Error();
      }

      router.refresh();
    } catch {
      setStatus(previousStatus);
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <select
        value={status}
        disabled={isUpdating}
        onChange={(event) =>
          updateStatus(
            event.target.value,
          )
        }
        className="h-11 rounded-xl border border-neutral-300 bg-white px-4 text-sm font-semibold text-[#111111] outline-none focus:border-primary"
      >
        {statuses.map((item) => (
          <option
            key={item.value}
            value={item.value}
          >
            {item.label}
          </option>
        ))}
      </select>

      {isUpdating ? (
        <LoaderCircle className="size-5 animate-spin text-primary" />
      ) : null}
    </div>
  );
}