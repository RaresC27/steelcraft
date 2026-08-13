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

import { useCartStore } from "@/app/stores/cart-store";
import { CART_ITEM_ADDED_EVENT } from "@/lib/cart-events";

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

  const [
    cartAnimationKey,
    setCartAnimationKey,
  ] = useState(0);

  const [
    isFooterVisible,
    setIsFooterVisible,
  ] = useState(false);

  const cartItemsCount = useMemo(
    () =>
      items.reduce(
        (total, item) =>
          total + item.quantity,
        0,
      ),
    [items],
  );

  /*
   * Animația coșului când este adăugat
   * un produs.
   */
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

  /*
   * Ascundem bottom nav-ul atunci când
   * footer-ul începe să intre în ecran.
   *
   * Astfel footer-ul poate fi văzut complet
   * și nu rămâne nimic peste linkurile lui.
   */
  useEffect(() => {
    const footer =
      document.getElementById(
        "site-footer",
      );

    if (!footer) {
      setIsFooterVisible(false);
      return;
    }

    const observer =
      new IntersectionObserver(
        ([entry]) => {
          setIsFooterVisible(
            entry.isIntersecting,
          );
        },
        {
          root: null,
          threshold: 0,

          /*
           * Bara începe să dispară puțin
           * înainte ca footer-ul să ajungă
           * efectiv sub ea.
           */
          rootMargin:
            "0px 0px 72px 0px",
        },
      );

    observer.observe(footer);

    return () => {
      observer.disconnect();
    };
  }, [pathname]);

  const shouldHide =
    pathname.startsWith("/admin") ||
    pathname === "/checkout" ||
    pathname.startsWith(
      "/comanda-finalizata",
    ) ||
    pathname.startsWith(
      "/la-comanda/multumim",
    );

  if (shouldHide) {
    return null;
  }

  return (
    <nav
      aria-label="Navigație mobilă"
      aria-hidden={
        isFooterVisible
          ? "true"
          : undefined
      }
      className={[
        /*
         * Background solid, nu transparent.
         *
         * Important mai ales pe iPhone pentru
         * ca zona safe-area să aibă exact
         * aceeași culoare până jos.
         */
        "fixed inset-x-0 bottom-0 z-50 bg-[#0a0a0a] lg:hidden",

        /*
         * Safe spacing în partea de sus.
         */
        "px-2 pt-2",

        /*
         * Umbra este doar în partea superioară.
         */
        "shadow-[0_-10px_32px_rgba(0,0,0,0.22)]",

        /*
         * Tranziție când intrăm în footer.
         */
        "will-change-transform transition-[transform,opacity] duration-300 ease-out",

        isFooterVisible
          ? "pointer-events-none translate-y-[110%] opacity-0"
          : "translate-y-0 opacity-100",
      ].join(" ")}
      style={{
        /*
         * Pe iPhone această zonă include
         * Home Indicator-ul.
         *
         * Background-ul nav-ului acoperă
         * inclusiv padding-ul, deci culoarea
         * #0a0a0a continuă până jos.
         */
        paddingBottom:
          "max(0.55rem, env(safe-area-inset-bottom))",
      }}
    >
      <div className="mx-auto grid max-w-md grid-cols-4 gap-1">
        {navigationItems.map(
          (item) => {
            const Icon = item.icon;

            const active = item.exact
              ? pathname ===
                item.href
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
                  active
                    ? "page"
                    : undefined
                }
                tabIndex={
                  isFooterVisible
                    ? -1
                    : undefined
                }
                className={[
                  "relative flex min-h-[58px] flex-col items-center justify-center gap-1 rounded-xl px-2",
                  "transition-[background-color,color,transform] duration-200",
                  "active:scale-[0.96]",

                  active
                    ? "bg-white/[0.08] text-primary"
                    : "text-neutral-400 active:bg-white/[0.06]",
                ].join(" ")}
              >
                <span
                  key={
                    isCart
                      ? cartAnimationKey
                      : item.href
                  }
                  className={[
                    "relative flex items-center justify-center",
                    isCart &&
                    cartAnimationKey > 0
                      ? "animate-cart-nav-pop"
                      : "",
                  ].join(" ")}
                >
                  <Icon
                    className={[
                      "size-[21px] transition-transform duration-200",

                      active
                        ? "stroke-[2.5]"
                        : "stroke-[2]",
                    ].join(" ")}
                  />

                  {isCart &&
                  cartItemsCount > 0 ? (
                    <span
                      key={
                        cartItemsCount
                      }
                      className={[
                        "animate-cart-badge",
                        "absolute -right-3.5 -top-2.5",
                        "flex min-h-5 min-w-5 items-center justify-center",
                        "rounded-full bg-primary px-1",
                        "text-[9px] font-black leading-none text-white",
                        "shadow-[0_4px_12px_rgba(255,85,0,0.35)]",
                      ].join(" ")}
                    >
                      {cartItemsCount >
                      99
                        ? "99+"
                        : cartItemsCount}
                    </span>
                  ) : null}
                </span>

                <span
                  className={[
                    "font-condensed text-[10px] font-bold uppercase tracking-[0.04em]",
                    active
                      ? "text-primary"
                      : "text-neutral-400",
                  ].join(" ")}
                >
                  {item.label}
                </span>
              </Link>
            );
          },
        )}
      </div>
    </nav>
  );
}