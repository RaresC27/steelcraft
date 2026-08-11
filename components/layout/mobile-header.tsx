"use client";

import {
    Menu,
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
        href: "/contact",
        label: "Contact",
    },
    {
        href: "/la-comanda",
        label: "Confecții la comandă",
    }
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

        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = "";
        };
    }, [isMenuOpen]);

    if (pathname.startsWith("/admin")) {
        return null;
    }

    return (
        <>
            <header className="sticky top-0 z-40 border-b border-white/10 bg-[#111111]/95 text-white shadow-lg backdrop-blur-xl lg:hidden">
                <div className="flex h-16 items-center justify-between px-3">
                    <button
                        type="button"
                        onClick={() => setIsMenuOpen(true)}
                        aria-label="Deschide meniul"
                        aria-expanded={isMenuOpen}
                        className="flex size-11 items-center justify-center rounded-full text-white transition active:scale-95 active:bg-white/10"
                    >
                        <Menu className="size-6" />
                    </button>

                    <Link
                        href="/"
                        className="font-display text-2xl uppercase leading-none tracking-[0.08em] text-white"
                    >
                        Steel
                        <span className="text-primary">
                            Craft
                        </span>
                    </Link>

                    <Link
                        href="/cos"
                        aria-label={`Deschide coșul. ${cartItemsCount} produse`}
                        className="relative flex size-11 items-center justify-center rounded-full text-white transition active:scale-95 active:bg-white/10"
                    >
                        <ShoppingBag className="size-5" />

                        {cartItemsCount > 0 ? (
                            <span
                                key={cartItemsCount}
                                className="animate-cart-badge absolute -right-0.5 -top-0.5 flex min-h-5 min-w-5 items-center justify-center rounded-full border-2 border-[#111111] bg-primary px-1 text-[9px] font-black text-white"
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
                    onClick={() => setIsMenuOpen(false)}
                    className={[
                        "absolute inset-0 bg-black/65 backdrop-blur-sm transition-opacity duration-300",
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
                        "absolute inset-y-0 left-0 flex w-[86%] max-w-sm flex-col border-r border-white/10 bg-[#111111] text-white shadow-2xl transition-transform duration-300 ease-out",
                        isMenuOpen
                            ? "translate-x-0"
                            : "-translate-x-full",
                    ].join(" ")}
                >
                    <div className="flex h-16 items-center justify-between border-b border-white/10 px-5">
                        <Link
                            href="/"
                            className="font-display text-2xl uppercase tracking-[0.08em] text-white"
                        >
                            Steel
                            <span className="text-primary">
                                Craft
                            </span>
                        </Link>

                        <button
                            type="button"
                            onClick={() => setIsMenuOpen(false)}
                            aria-label="Închide meniul"
                            className="flex size-11 items-center justify-center rounded-full text-white transition active:scale-95 active:bg-white/10"
                        >
                            <X className="size-5" />
                        </button>
                    </div>

                    <nav className="flex-1 overflow-y-auto px-5 py-7">
                        <p className="font-condensed text-xs font-bold uppercase tracking-[0.2em] text-neutral-500">
                            Navigație
                        </p>

                        <div className="mt-5 space-y-2">
                            {navigationItems.map((item) => {
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
                                            "group flex min-h-14 items-center justify-between rounded-sm border px-4 font-condensed text-base font-bold uppercase tracking-[0.1em] transition active:scale-[0.98]",
                                            active
                                                ? "border-primary bg-primary text-white"
                                                : "border-white/10 bg-white/[0.03] text-white active:bg-white/10",
                                        ].join(" ")}
                                    >
                                        <span>{item.label}</span>

                                        <span
                                            aria-hidden="true"
                                            className={[
                                                "transition-transform group-active:translate-x-1",
                                                active
                                                    ? "text-white"
                                                    : "text-primary",
                                            ].join(" ")}
                                        >
                                            →
                                        </span>
                                    </Link>
                                );
                            })}
                        </div>

                        <div className="mt-8 border-t border-white/10 pt-6">
                            <Link
                                href="/cos"
                                className="flex min-h-14 items-center justify-between rounded-sm bg-white px-4 font-condensed text-base font-bold uppercase tracking-[0.1em] text-[#111111] transition active:scale-[0.98]"
                            >
                                <span>Vezi coșul</span>

                                <ShoppingBag className="size-5 text-primary" />
                            </Link>
                        </div>
                    </nav>

                    <div className="border-t border-white/10 px-5 py-5">
                        <p className="font-condensed text-xs font-bold uppercase tracking-[0.15em] text-primary">
                            SteelCraft
                        </p>

                        <p className="mt-2 text-sm leading-6 text-neutral-400">
                            Produse metalice realizate la comandă,
                            cu accent pe rezistență și finisaje de
                            calitate.
                        </p>
                    </div>
                </aside>
            </div>
        </>
    );
}