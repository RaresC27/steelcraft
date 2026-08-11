"use client";

import Link from "next/link";
import {
    ArrowRight,
    Menu,
    Phone,
    ShoppingBag,
} from "lucide-react";

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

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { CartLink } from "@/components/cart/cart-link";

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
        label: "Confecții la comandă",
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
    return (
        <Sheet>
            <SheetTrigger
                render={
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label="Deschide meniul"
                        className="size-11 rounded-sm text-white hover:bg-white/10 hover:text-white lg:hidden"
                    />
                }
            >
                <Menu className="size-6" />
            </SheetTrigger>

            <SheetContent
                side="right"
                className="flex w-[88%] max-w-sm flex-col border-l-primary/40 bg-[#0b0b0b] p-0 text-white"
            >
                <SheetHeader className="border-b border-white/10 px-6 py-6 text-left">
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
                    className="flex flex-col px-4 py-6"
                >
                    {navigationItems.map((item, index) => (
                        <SheetClose
                            key={item.href}
                            render={
                                <Link
                                    href={item.href}
                                    className="group flex items-center justify-between border-b border-white/10 px-3 py-4"
                                />
                            }
                        >
                            <span className="flex items-center gap-4">
                                <span className="font-condensed text-xs font-bold text-primary">
                                    {String(index + 1).padStart(2, "0")}
                                </span>

                                <span className="font-condensed text-base font-bold uppercase tracking-[0.08em] text-white transition group-hover:text-primary">
                                    {item.label}
                                </span>
                            </span>

                            <ArrowRight className="size-4 text-neutral-600 transition group-hover:translate-x-1 group-hover:text-primary" />
                        </SheetClose>
                    ))}
                </nav>

                <div className="mt-auto border-t border-white/10 p-6">
                    <p className="font-condensed mb-4 text-xs font-bold uppercase tracking-[0.18em] text-neutral-500">
                        Ai nevoie de ajutor?
                    </p>

                    <a
                        href="tel:+40000000000"
                        className="flex items-center gap-3 text-sm font-semibold text-white transition hover:text-primary"
                    >
                        <span className="flex size-10 items-center justify-center rounded-sm bg-primary">
                            <Phone className="size-4" />
                        </span>

                        <span>
                            <span className="block text-xs font-normal text-neutral-500">
                                Sună-ne
                            </span>

                            +40 000 000 000
                        </span>
                    </a>
                    <CartLink mobile />
                </div>
            </SheetContent>
        </Sheet>
    );
}