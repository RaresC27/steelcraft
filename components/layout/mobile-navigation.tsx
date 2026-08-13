"use client";

import Link from "next/link";
import {
  ArrowRight,
  Menu,
  Phone,
} from "lucide-react";
import { usePathname } from "next/navigation";

import { CartLink } from "@/components/cart/cart-link";
import { SiteLogo } from "@/components/layout/site-logo";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const navigationItems = [
  {
    label: "Acasă",
    href: "/",
  },
  {
    label: "Produse",
    href: "/produse",
  },
  {
    label: "La comandă",
    href: "/la-comanda",
  },
  {
    label: "Despre noi",
    href: "/despre",
  },
  {
    label: "Blog",
    href: "/blog",
  },
  {
    label: "Contact",
    href: "/contact",
  },
];

export function MobileNavigation() {
  const pathname = usePathname();

  return (
    <Sheet>
      <SheetTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Deschide meniul"
            className="size-11 rounded-full text-white transition hover:bg-white/[0.07] hover:text-white active:scale-95 lg:hidden"
          />
        }
      >
        <Menu className="size-6" />
      </SheetTrigger>

      <SheetContent
        side="right"
        className="flex w-[90%] max-w-[390px] flex-col border-0 bg-[#0a0a0a] p-0 text-white shadow-[-24px_0_70px_rgba(0,0,0,0.4)]"
      >
        <SheetHeader className="px-5 pb-4 pt-[max(1.25rem,env(safe-area-inset-top))] text-left">
          <SheetTitle className="sr-only">
            Navigare SteelCraft
          </SheetTitle>

          <SheetDescription className="sr-only">
            Meniul principal al site-ului SteelCraft
          </SheetDescription>

          <SiteLogo light />
        </SheetHeader>

        <nav
          aria-label="Navigare mobilă"
          className="flex-1 overflow-y-auto px-4 py-4"
        >
          <p className="font-condensed px-2 text-[10px] font-bold uppercase tracking-[0.16em] text-neutral-500">
            Navigare
          </p>

          <div className="mt-3 space-y-1">
            {navigationItems.map(
              (item) => {
                const active =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(
                        item.href,
                      );

                return (
                  <SheetClose
                    key={item.href}
                    render={
                      <Link
                        href={item.href}
                        aria-current={
                          active
                            ? "page"
                            : undefined
                        }
                        className={[
                          "group flex min-h-13 items-center justify-between rounded-xl px-3.5 py-3 transition active:scale-[0.99]",
                          active
                            ? "bg-white/[0.08]"
                            : "hover:bg-white/[0.04]",
                        ].join(" ")}
                      />
                    }
                  >
                    <span
                      className={[
                        "font-condensed text-[15px] font-bold uppercase tracking-[0.07em]",
                        active
                          ? "text-white"
                          : "text-neutral-300",
                      ].join(" ")}
                    >
                      {item.label}
                    </span>

                    <ArrowRight
                      className={[
                        "size-4 transition-transform duration-200 group-hover:translate-x-0.5",
                        active
                          ? "text-primary"
                          : "text-neutral-600",
                      ].join(" ")}
                    />
                  </SheetClose>
                );
              },
            )}
          </div>

          <div className="mt-7">
            <SheetClose
              render={
                <Link
                  href="/la-comanda"
                  className="font-condensed flex min-h-13 items-center justify-between rounded-xl bg-primary px-4 text-sm font-bold uppercase tracking-[0.08em] text-white transition active:scale-[0.98]"
                />
              }
            >
              <span>
                Solicită o ofertă
              </span>

              <ArrowRight className="size-4" />
            </SheetClose>
          </div>

          <div className="mt-3">
            <CartLink mobile />
          </div>
        </nav>

        <div
          className="px-5 pt-3"
          style={{
            paddingBottom:
              "max(1.25rem, env(safe-area-inset-bottom))",
          }}
        >
          <a
            href="tel:+40752315475"
            className="group flex items-center gap-3 rounded-2xl bg-white/[0.05] p-3.5 transition active:scale-[0.99]"
          >
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary transition group-hover:bg-primary group-hover:text-white">
              <Phone className="size-4" />
            </span>

            <span className="min-w-0">
              <span className="font-condensed block text-[10px] font-bold uppercase tracking-[0.1em] text-neutral-400">
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
            proiectul tău.
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}