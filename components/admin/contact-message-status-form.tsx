"use client";

import {
  ChangeEvent,
  useState,
  useTransition,
} from "react";

import { updateContactMessageStatus } from "@/app/admin/mesaje/action";

type ContactMessageStatus =
  | "NEW"
  | "READ"
  | "ANSWERED"
  | "ARCHIVED";

type ContactMessageStatusFormProps = {
  messageId: number;
  currentStatus: ContactMessageStatus;
};

const statusOptions: Array<{
  value: ContactMessageStatus;
  label: string;
}> = [
  {
    value: "NEW",
    label: "Nou",
  },
  {
    value: "READ",
    label: "Citit",
  },
  {
    value: "ANSWERED",
    label: "Răspuns",
  },
  {
    value: "ARCHIVED",
    label: "Arhivat",
  },
];

export function ContactMessageStatusForm({
  messageId,
  currentStatus,
}: ContactMessageStatusFormProps) {
  const [status, setStatus] =
    useState<ContactMessageStatus>(currentStatus);

  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");
  const [hasError, setHasError] = useState(false);

  function handleChange(
    event: ChangeEvent<HTMLSelectElement>,
  ) {
    const nextStatus =
      event.target.value as ContactMessageStatus;

    setStatus(nextStatus);
    setMessage("");
    setHasError(false);

    startTransition(async () => {
      const result =
        await updateContactMessageStatus(
          messageId,
          nextStatus,
        );

      setMessage(result.message);
      setHasError(!result.success);
    });
  }

  return (
    <div>
      <label
        htmlFor="message-status"
        className="font-condensed block text-sm font-bold uppercase tracking-wider text-[#111111]"
      >
        Status mesaj
      </label>

      <select
        id="message-status"
        value={status}
        onChange={handleChange}
        disabled={isPending}
        className="mt-2 h-12 w-full border border-neutral-300 bg-white px-4 text-sm text-[#111111] outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15 disabled:cursor-not-allowed disabled:opacity-60"
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

      {isPending ? (
        <p className="mt-3 text-sm text-neutral-500">
          Se actualizează...
        </p>
      ) : null}

      {message ? (
        <p
          className={[
            "mt-3 text-sm",
            hasError
              ? "text-red-600"
              : "text-green-700",
          ].join(" ")}
        >
          {message}
        </p>
      ) : null}
    </div>
  );
}