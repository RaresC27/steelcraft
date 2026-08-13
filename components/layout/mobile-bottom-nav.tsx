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

  useEffect(() => {
    const footer =
      document.getElementById(
        "site-footer",
      );

    if (!footer) {
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
          /*
           * Bara începe să dispară puțin înainte
           * ca footer-ul să ocupe mult din ecran.
           */
          root: null,
          threshold: 0,
          rootMargin:
            "0px 0px 80px 0px",
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
        "fixed inset-x-0 bottom-0 z-50 px-2 pt-2 backdrop-blur-xl transition-[transform,opacity] duration-300 ease-out lg:hidden",
        "bg-[#0a0a0a]/94 shadow-[0_-10px_35px_rgba(0,0,0,0.22)]",
        isFooterVisible
          ? "pointer-events-none translate-y-full opacity-0"
          : "translate-y-0 opacity-100",
      ].join(" ")}
      style={{
        paddingBottom:
          "max(0.5rem, env(safe-area-inset-bottom))",
      }}
    >
      <div className="mx-auto grid max-w-md grid-cols-4 gap-1">
        {navigationItems.map(
          (item) => {
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
                  "relative flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl px-2 transition duration-200 active:scale-95",
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
                        ? "stroke-[2.4]"
                        : "",
                    ].join(" ")}
                  />

                  {isCart &&
                  cartItemsCount > 0 ? (
                    <span
                      key={
                        cartItemsCount
                      }
                      className="animate-cart-badge absolute -right-3.5 -top-2.5 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-black leading-none text-white shadow-[0_4px_12px_rgba(255,85,0,0.3)]"
                    >
                      {cartItemsCount >
                      99
                        ? "99+"
                        : cartItemsCount}
                    </span>
                  ) : null}
                </span>

                <span className="font-condensed text-[11px] font-bold uppercase tracking-[0.04em]">
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