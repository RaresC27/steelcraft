"use client";

import {
  MessageCircle,
} from "lucide-react";

type ProductWhatsAppButtonProps = {
  productName: string;
  productSlug: string;
  className?: string;
};

const WHATSAPP_NUMBER =
  "40752315475";

export function ProductWhatsAppButton({
  productName,
  productSlug,
  className = "",
}: ProductWhatsAppButtonProps) {
  function handleWhatsApp() {
    const productUrl =
      `${window.location.origin}/produse/${productSlug}`;

    const message = [
      "Bună ziua!",
      "",
      `Mă interesează produsul: ${productName}`,
      "",
      productUrl,
      "",
      "Aș dori mai multe informații despre acest produs.",
    ].join("\n");

    const url =
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
        message,
      )}`;

    window.open(
      url,
      "_blank",
      "noopener,noreferrer",
    );
  }

  return (
    <button
      type="button"
      onClick={handleWhatsApp}
      className={[
        "font-condensed",
        "flex min-h-13 w-full items-center justify-center gap-2.5",
        "rounded-xl bg-[#25D366] px-5",
        "text-sm font-bold uppercase tracking-[0.07em] text-white",
        "shadow-[0_8px_24px_rgba(37,211,102,0.18)]",
        "transition",
        "hover:brightness-95",
        "active:scale-[0.98]",
        "sm:w-auto sm:rounded-sm",
        className,
      ].join(" ")}
    >
      <MessageCircle
        className="size-5"
        strokeWidth={2.2}
      />

      Întreabă pe WhatsApp
    </button>
  );
}