"use client";

import {
  Home,
  MessageCircle,
  PackageSearch,
  ShoppingBag,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { CART_ITEM_ADDED_EVENT } from "@/lib/cart-events";
import { useCartStore } from "@/app/stores/cart-store";

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

  const items = useCartStore(
    (state) => state.items,
  );

  const [cartAnimationKey, setCartAnimationKey] =
    useState(0);

  const cartItemsCount = useMemo(
    () =>
      items.reduce(
        (total, item) =>
          total + item.quantity,
        0,
      ),
    [items],
  );

  useEffect(() => {
    function animateCart() {
      setCartAnimationKey(
        (current) => current + 1,
      );
    }

    window.addEventListener(
      CART_ITEM_ADDED_EVENT,
      animateCart,
    );

    return () => {
      window.removeEventListener(
        CART_ITEM_ADDED_EVENT,
        animateCart,
      );
    };
  }, []);

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
      className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-[#111111]/95 px-2 pt-2 shadow-[0_-12px_40px_rgba(0,0,0,0.32)] backdrop-blur-xl lg:hidden"
      style={{
        paddingBottom:
          "max(0.5rem, env(safe-area-inset-bottom))",
      }}
    >
      <div className="mx-auto grid max-w-md grid-cols-4 gap-1">
        {navigationItems.map((item) => {
          const Icon = item.icon;

          const active = item.exact
            ? pathname === item.href
            : pathname.startsWith(
                item.href,
              );

          const isCart =
            item.href === "/cos";

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={
                active ? "page" : undefined
              }
              className={[
                "relative flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl px-2 transition-all duration-200 active:scale-95",
                active
                  ? "bg-white/10 text-primary"
                  : "text-neutral-400 active:bg-white/[0.07]",
              ].join(" ")}
            >
              {active ? (
                <span className="absolute top-0 h-0.5 w-7 rounded-full bg-primary shadow-[0_0_12px_rgba(234,88,12,0.75)]" />
              ) : null}

              <span
                key={
                  isCart
                    ? cartAnimationKey
                    : item.href
                }
                className={[
                  "relative",
                  isCart &&
                  cartAnimationKey > 0
                    ? "animate-cart-nav-pop"
                    : "",
                ].join(" ")}
              >
                <Icon
                  className={[
                    "size-5 transition-transform duration-200",
                    active
                      ? "stroke-[2.5]"
                      : "",
                  ].join(" ")}
                />

                {isCart &&
                cartItemsCount > 0 ? (
                  <span
                    key={cartItemsCount}
                    className="animate-cart-badge absolute -right-3.5 -top-2.5 flex min-h-5 min-w-5 items-center justify-center rounded-full border-2 border-[#111111] bg-primary px-1 text-[10px] font-black leading-none text-white shadow-lg"
                  >
                    {cartItemsCount > 99
                      ? "99+"
                      : cartItemsCount}
                  </span>
                ) : null}
              </span>

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