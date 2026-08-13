import Link from "next/link";
import { Phone } from "lucide-react";

import { CartLink } from "@/components/cart/cart-link";
import { Container } from "@/components/layout/container";
import { MobileNavigation } from "@/components/layout/mobile-navigation";
import { SiteLogo } from "@/components/layout/site-logo";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
    label: "Despre",
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

export function SiteHeader() {
  return (
    <header
      className="sticky top-0 z-50 bg-[#0a0a0a] text-white"
      style={{
        paddingTop:
          "env(safe-area-inset-top)",
      }}
    >
      {/* Bara informativă desktop */}
      <div className="hidden lg:block">
        <Container className="flex h-9 items-center justify-between">
          <p className="font-condensed text-[11px] font-semibold uppercase tracking-[0.12em] text-neutral-400">
            Confecții metalice standard și la comandă
          </p>

          <div className="flex items-center gap-5">
            <span className="font-condensed text-[11px] font-semibold uppercase tracking-[0.1em] text-neutral-400">
              Livrare în toată țara
            </span>

            <a
              href="tel:+40752315475"
              className="group flex items-center gap-2 text-xs font-semibold text-neutral-200 transition-colors hover:text-white"
            >
              <span className="flex size-7 items-center justify-center rounded-full bg-white/[0.06] text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                <Phone className="size-3.5" />
              </span>

              <span>
                +40 752 315 475
              </span>
            </a>
          </div>
        </Container>
      </div>

      {/* Navigația principală */}
      <Container className="flex h-[74px] items-center justify-between gap-6">
        <div className="shrink-0">
          <SiteLogo light />
        </div>

        <nav
          aria-label="Navigare principală"
          className="hidden flex-1 items-center justify-center gap-1 lg:flex"
        >
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="font-condensed rounded-lg px-3 py-2.5 text-sm font-bold uppercase tracking-[0.07em] text-neutral-300 transition-colors duration-200 hover:bg-white/[0.05] hover:text-white xl:px-4"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden shrink-0 items-center gap-2 lg:flex">
          <Link
            href="/cont"
            className={cn(
              buttonVariants({
                variant: "ghost",
              }),
              "font-condensed h-11 rounded-lg px-4 text-sm font-bold uppercase tracking-[0.07em] text-neutral-200 hover:bg-white/[0.06] hover:text-white",
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