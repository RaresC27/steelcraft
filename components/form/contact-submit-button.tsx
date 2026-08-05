"use client";

import { LoaderCircle, Send } from "lucide-react";
import { useFormStatus } from "react-dom";

import { Button } from "@/components/ui/button";

export function ContactSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending}
      className="font-condensed h-14 w-full rounded-sm px-8 text-sm font-bold uppercase tracking-[0.12em] sm:w-auto"
    >
      {pending ? (
        <>
          <LoaderCircle className="size-4 animate-spin" />
          Se trimite...
        </>
      ) : (
        <>
          <Send className="size-4" />
          Trimite mesajul
        </>
      )}
    </Button>
  );
}