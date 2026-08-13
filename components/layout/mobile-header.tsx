"use client";

import {
  ArrowRight,
  Menu,
  Phone,
  ShoppingBag,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { useCartStore } from "@/app/stores/cart-store";

const navigationItems = [
  {
    href: "/",
    label: "Acasă",
  },
  {
    href: "/produse",
    label: "Produse",
  },
  {
    href: "/la-comanda",
    label: "La comandă",
  },
  {
    href: "/despre",
    label: "Despre",
  },
  {
    href: "/blog",
    label: "Blog",
  },
  {
    href: "/contact",
    label: "Contact",
  },
];

export function MobileHeader() {
  const pathname = usePathname();

  const items = useCartStore(
    (state) => state.items,
  );

  const cartItemsCount = items.reduce(
    (total, item) =>
      total + item.quantity,
    0,
  );

  const [isMenuOpen, setIsMenuOpen] =
    useState(false);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isMenuOpen) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow =
      "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#0a0a0a]/96 text-white shadow-[0_8px_30px_rgba(0,0,0,0.16)] backdrop-blur-xl lg:hidden">
        <div className="flex h-16 items-center justify-between px-3">
          <button
            type="button"
            onClick={() =>
              setIsMenuOpen(true)
            }
            aria-label="Deschide meniul"
            aria-expanded={isMenuOpen}
            className="flex size-11 items-center justify-center rounded-full text-white transition active:scale-95 active:bg-white/[0.08]"
          >
            <Menu className="size-6" />
          </button>

          <Link
            href="/"
            className="font-display text-[1.65rem] uppercase leading-none tracking-[0.07em] text-white"
          >
            Steel
            <span className="text-primary">
              Craft
            </span>
          </Link>

          <Link
            href="/cos"
            aria-label={`Deschide coșul. ${cartItemsCount} produse`}
            className="relative flex size-11 items-center justify-center rounded-full text-white transition active:scale-95 active:bg-white/[0.08]"
          >
            <ShoppingBag className="size-5" />

            {cartItemsCount > 0 ? (
              <span
                key={cartItemsCount}
                className="animate-cart-badge absolute -right-0.5 -top-0.5 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[9px] font-black text-white shadow-[0_4px_12px_rgba(255,85,0,0.35)]"
              >
                {cartItemsCount > 99
                  ? "99+"
                  : cartItemsCount}
              </span>
            ) : null}
          </Link>
        </div>
      </header>

      <div
        className={[
          "fixed inset-0 z-50 lg:hidden",
          isMenuOpen
            ? "pointer-events-auto"
            : "pointer-events-none",
        ].join(" ")}
        aria-hidden={!isMenuOpen}
      >
        <button
          type="button"
          aria-label="Închide meniul"
          onClick={() =>
            setIsMenuOpen(false)
          }
          className={[
            "absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300",
            isMenuOpen
              ? "opacity-100"
              : "opacity-0",
          ].join(" ")}
        />

        <aside
          role="dialog"
          aria-modal="true"
          aria-label="Meniu principal"
          className={[
            "absolute inset-y-0 left-0 flex w-[88%] max-w-sm flex-col bg-[#0a0a0a] text-white shadow-[20px_0_60px_rgba(0,0,0,0.35)] transition-transform duration-300 ease-out",
            isMenuOpen
              ? "translate-x-0"
              : "-translate-x-full",
          ].join(" ")}
        >
          <div className="flex h-16 items-center justify-between px-5">
            <Link
              href="/"
              className="font-display text-2xl uppercase tracking-[0.07em] text-white"
            >
              Steel
              <span className="text-primary">
                Craft
              </span>
            </Link>

            <button
              type="button"
              onClick={() =>
                setIsMenuOpen(false)
              }
              aria-label="Închide meniul"
              className="flex size-11 items-center justify-center rounded-full bg-white/[0.05] text-white transition active:scale-95 active:bg-white/[0.1]"
            >
              <X className="size-5" />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-5 py-6">
            <p className="font-condensed text-[10px] font-bold uppercase tracking-[0.16em] text-neutral-500">
              Navigație
            </p>

            <div className="mt-4 space-y-1">
              {navigationItems.map(
                (item) => {
                  const active =
                    item.href === "/"
                      ? pathname === "/"
                      : pathname.startsWith(
                          item.href,
                        );

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={[
                        "group flex min-h-13 items-center justify-between rounded-xl px-3.5 py-3 font-condensed text-[15px] font-bold uppercase tracking-[0.07em] transition active:scale-[0.99]",
                        active
                          ? "bg-white/[0.08] text-white"
                          : "text-neutral-300 hover:bg-white/[0.04] hover:text-white",
                      ].join(" ")}
                    >
                      <span>
                        {item.label}
                      </span>

                      <ArrowRight
                        className={[
                          "size-4 transition-transform group-active:translate-x-1",
                          active
                            ? "text-primary"
                            : "text-neutral-600",
                        ].join(" ")}
                      />
                    </Link>
                  );
                },
              )}
            </div>

            <div className="mt-7 grid gap-3">
              <Link
                href="/la-comanda"
                className="font-condensed flex min-h-13 items-center justify-between rounded-xl bg-primary px-4 text-sm font-bold uppercase tracking-[0.08em] text-white transition active:scale-[0.98]"
              >
                <span>
                  Solicită ofertă
                </span>

                <ArrowRight className="size-4" />
              </Link>

              <Link
                href="/cos"
                className="font-condensed flex min-h-13 items-center justify-between rounded-xl bg-white/[0.06] px-4 text-sm font-bold uppercase tracking-[0.08em] text-white transition active:scale-[0.98]"
              >
                <span>
                  Vezi coșul
                </span>

                <span className="flex items-center gap-2">
                  {cartItemsCount > 0 ? (
                    <span className="flex min-w-6 items-center justify-center rounded-full bg-primary px-2 py-0.5 text-[10px] text-white">
                      {cartItemsCount > 99
                        ? "99+"
                        : cartItemsCount}
                    </span>
                  ) : null}

                  <ShoppingBag className="size-4 text-primary" />
                </span>
              </Link>
            </div>
          </nav>

          <div
            className="px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-3"
          >
            <a
              href="tel:+40752315475"
              className="flex items-center gap-3 rounded-2xl bg-white/[0.05] p-3.5 transition active:scale-[0.99]"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
                <Phone className="size-4" />
              </span>

              <span>
                <span className="font-condensed block text-[10px] font-bold uppercase tracking-[0.1em] text-neutral-500">
                  Ai nevoie de ajutor?
                </span>

                <span className="mt-0.5 block text-sm font-semibold text-white">
                  +40 752 315 475
                </span>
              </span>
            </a>

            <p className="mt-4 text-xs leading-5 text-neutral-500">
              Confecții metalice standard și
              personalizate, realizate pentru
              proiecte reale.
            </p>
          </div>
        </aside>
      </div>
    </>
  );
}