import Link from "next/link";
import { Phone, ShoppingBag } from "lucide-react";

import { Container } from "@/components/layout/container";
import { MobileNavigation } from "@/components/layout/mobile-navigation";
import { SiteLogo } from "@/components/layout/site-logo";
import { Button } from "@/components/ui/button";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { CartLink } from "@/components/cart/cart-link";

const navigationItems = [
    { label: "Acasă", href: "/" },
    { label: "Produse", href: "/produse" },
    { label: "La comandă", href: "/confectii-la-comanda" },
    { label: "Despre", href: "/despre" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
];

export function SiteHeader() {
    return (
        <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0b0b0b]/95 text-white backdrop-blur-md">
            <div className="hidden border-b border-white/10 lg:block">
                <Container className="flex h-9 items-center justify-between">
                    <p className="font-condensed text-xs font-semibold uppercase tracking-[0.14em] text-neutral-400">
                        Confecții metalice standard și la comandă
                    </p>

                    <div className="flex items-center gap-6">
                        <span className="font-condensed text-xs font-semibold uppercase tracking-[0.12em] text-neutral-400">
                            Livrare în toată țara
                        </span>

                        <a
                            href="tel:+40000000000"
                            className="flex items-center gap-2 text-xs font-semibold text-white transition hover:text-primary"
                        >
                            <Phone className="size-3.5 text-primary" />
                            +40 000 000 000
                        </a>
                    </div>
                </Container>
            </div>

            <Container className="flex h-[76px] items-center justify-between">
                <SiteLogo light />

                <nav
                    aria-label="Navigare principală"
                    className="hidden items-center lg:flex"
                >
                    {navigationItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="font-condensed group relative px-3 py-7 text-sm font-bold uppercase tracking-[0.08em] text-neutral-300 transition hover:text-white xl:px-4"
                        >
                            {item.label}

                            <span className="absolute bottom-5 left-3 h-0.5 w-0 bg-primary transition-all duration-300 group-hover:w-[calc(100%-1.5rem)] xl:left-4 xl:group-hover:w-[calc(100%-2rem)]" />
                        </Link>
                    ))}
                </nav>

                <div className="hidden items-center gap-2 lg:flex">
                    <Link
                        href="/cont"
                        className={cn(
                            buttonVariants({ variant: "ghost" }),
                            "font-condensed h-11 rounded-sm px-4 text-sm font-bold uppercase tracking-[0.08em] text-white hover:bg-white/10 hover:text-white",
                        )}
                    >
                        Contul meu
                    </Link>

                    <CartLink />
                </div>

                <MobileNavigation />
            </Container>
        </header>
    );
}