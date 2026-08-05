"use client";

import {
  Home,
  MessageCircle,
  PackageSearch,
  ShoppingBag,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navigationItems = [
  {
    href: "/",
    label: "Acasă",
    icon: Home,
    exact: true,
  },
  {
    href: "/produse",
    label: "Produse",
    icon: PackageSearch,
  },
  {
    href: "/cos",
    label: "Coș",
    icon: ShoppingBag,
  },
  {
    href: "/contact",
    label: "Contact",
    icon: MessageCircle,
  },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  const shouldHide =
    pathname.startsWith("/admin") ||
    pathname === "/checkout" ||
    pathname.startsWith(
      "/comanda-finalizata",
    );

  if (shouldHide) {
    return null;
  }

  return (
    <nav
      aria-label="Navigație mobilă"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#111111]/95 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-12px_35px_rgba(0,0,0,0.28)] backdrop-blur-xl lg:hidden"
    >
      <div className="mx-auto grid max-w-md grid-cols-4 gap-1">
        {navigationItems.map((item) => {
          const Icon = item.icon;

          const active = item.exact
            ? pathname === item.href
            : pathname.startsWith(
                item.href,
              );

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={
                active ? "page" : undefined
              }
              className={[
                "relative flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl px-2 transition active:scale-95",
                active
                  ? "bg-white/10 text-primary"
                  : "text-neutral-400 active:bg-white/[0.06]",
              ].join(" ")}
            >
              {active ? (
                <span className="absolute top-0 h-0.5 w-7 rounded-full bg-primary" />
              ) : null}

              <Icon
                className={[
                  "size-5",
                  active
                    ? "stroke-[2.4]"
                    : "",
                ].join(" ")}
              />

              <span className="font-condensed text-[11px] font-bold uppercase tracking-[0.05em]">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}