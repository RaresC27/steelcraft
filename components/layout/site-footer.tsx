import Link from "next/link";
import {
  ArrowRight,
  Clock3,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

import { Container } from "@/components/layout/container";
import { SiteLogo } from "@/components/layout/site-logo";

const navigationLinks = [
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

const usefulLinks = [
  {
    label: "Coșul meu",
    href: "/cos",
  },
  {
    label: "Livrare și retur",
    href: "/livrare-si-retur",
  },
  {
    label: "Termeni și condiții",
    href: "/termeni-si-conditii",
  },
  {
    label: "Politica de confidențialitate",
    href: "/politica-de-confidentialitate",
  },
];

const productLinks = [
  {
    label: "Hrănitoare pentru animale",
    href: "/produse?category=hranitoare-pentru-animale",
  },
  {
    label: "Adăpători și vălăuri",
    href: "/produse?category=adapatori",
  },
  {
    label: "Confecții din tablă",
    href: "/produse?category=confectii-din-tabla",
  },
  {
    label: "Confecții din inox",
    href: "/produse?category=confectii-din-inox",
  },
];

export function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      id="site-footer"
      className="bg-[#0a0a0a] text-white"
    >
      <Container className="py-10 sm:py-14 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.75fr_0.75fr_1fr] lg:gap-12">
          {/* Brand */}
          <div>
            <SiteLogo light />

            <p className="mt-5 max-w-md text-sm leading-7 text-neutral-300">
              Hrănitoare, adăpători și confecții metalice
              realizate din tablă neagră, tablă zincată,
              inox și oțel, standard sau la comandă.
            </p>

            <div className="mt-6 grid gap-3 sm:flex sm:flex-wrap">
              <Link
                href="/la-comanda"
                className="font-condensed inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-bold uppercase tracking-[0.08em] text-white transition hover:opacity-90 active:scale-[0.98] sm:rounded-sm"
              >
                Solicită ofertă
                <ArrowRight className="size-4" />
              </Link>

              <Link
                href="/produse"
                className="font-condensed inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-5 text-sm font-bold uppercase tracking-[0.08em] text-white transition hover:border-white/30 hover:bg-white/[0.08] active:scale-[0.98] sm:rounded-sm"
              >
                Vezi produsele
              </Link>
            </div>

            {/* Contact rapid pe mobil */}
            <div className="mt-8 lg:hidden">
              <div className="grid gap-3 sm:grid-cols-2">
                <MobileContactLink
                  icon={Phone}
                  label="Telefon"
                  value="+40 000 000 000"
                  href="tel:+40000000000"
                />

                <MobileContactLink
                  icon={Mail}
                  label="Email"
                  value="contact@steelcraft.ro"
                  href="mailto:contact@steelcraft.ro"
                />
              </div>
            </div>
          </div>

          {/* Navigare */}
          <FooterColumn title="Navigare">
            {navigationLinks.map((link) => (
              <FooterLink
                key={link.href}
                href={link.href}
              >
                {link.label}
              </FooterLink>
            ))}
          </FooterColumn>

          {/* Produse */}
          <FooterColumn title="Produse">
            {productLinks.map((link) => (
              <FooterLink
                key={link.href}
                href={link.href}
              >
                {link.label}
              </FooterLink>
            ))}
          </FooterColumn>

          {/* Contact desktop */}
          <div className="hidden lg:block">
            <p className="font-condensed text-xs font-bold uppercase tracking-[0.16em] text-neutral-300">
              Contact
            </p>

            <h2 className="font-display mt-2 text-3xl uppercase leading-none text-white">
              Hai să discutăm
            </h2>

            <div className="mt-6 space-y-5">
              <FooterContactItem
                icon={Phone}
                label="Telefon"
                value="+40 000 000 000"
                href="tel:+40000000000"
              />

              <FooterContactItem
                icon={Mail}
                label="Email"
                value="contact@steelcraft.ro"
                href="mailto:contact@steelcraft.ro"
              />

              <FooterContactItem
                icon={MapPin}
                label="Locație"
                value="Baia Sprie, Maramureș"
              />

              <FooterContactItem
                icon={Clock3}
                label="Program"
                value="Luni–Vineri, 08:00–17:00"
              />
            </div>
          </div>
        </div>

        {/* Legal */}
        <div className="mt-10 pt-2 sm:mt-12">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <nav
              aria-label="Linkuri legale"
              className="flex flex-wrap gap-x-5 gap-y-3"
            >
              {usefulLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="font-condensed text-xs font-semibold uppercase tracking-[0.07em] text-neutral-300 transition-colors hover:text-primary"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <p className="max-w-xl text-xs leading-6 text-neutral-400 lg:text-right">
              Prețurile, disponibilitatea și termenul de
              execuție pot varia în funcție de produs,
              dimensiuni și specificațiile proiectului.
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-7 flex flex-col gap-2 pt-1 text-xs text-neutral-400 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {currentYear}{" "}
            <span className="font-semibold text-neutral-200">
              SteelCraft
            </span>
            . Toate drepturile rezervate.
          </p>

          <p className="text-neutral-400">
            Confecții metalice standard și la comandă.
          </p>
        </div>
      </Container>
    </footer>
  );
}

type FooterColumnProps = {
  title: string;
  children: React.ReactNode;
};

function FooterColumn({
  title,
  children,
}: FooterColumnProps) {
  return (
    <div>
      <p className="font-condensed text-xs font-bold uppercase tracking-[0.16em] text-neutral-300">
        {title}
      </p>

      <nav className="mt-4 flex flex-col items-start gap-3">
        {children}
      </nav>
    </div>
  );
}

type FooterLinkProps = {
  href: string;
  children: React.ReactNode;
};

function FooterLink({
  href,
  children,
}: FooterLinkProps) {
  return (
    <Link
      href={href}
      className="text-sm font-medium text-neutral-300 transition-colors duration-200 hover:text-primary"
    >
      {children}
    </Link>
  );
}

type FooterContactItemProps = {
  icon: React.ComponentType<{
    className?: string;
  }>;
  label: string;
  value: string;
  href?: string;
};

function FooterContactItem({
  icon: Icon,
  label,
  value,
  href,
}: FooterContactItemProps) {
  const content = (
    <span className="group flex items-start gap-3">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.06] text-primary transition group-hover:bg-primary group-hover:text-white">
        <Icon className="size-4" />
      </span>

      <span className="min-w-0">
        <span className="font-condensed block text-[10px] font-bold uppercase tracking-[0.1em] text-neutral-400">
          {label}
        </span>

        <span className="mt-1 block break-words text-sm font-medium text-neutral-200 transition-colors group-hover:text-white">
          {value}
        </span>
      </span>
    </span>
  );

  if (href) {
    return (
      <a
        href={href}
        className="block"
      >
        {content}
      </a>
    );
  }

  return content;
}

type MobileContactLinkProps = {
  icon: React.ComponentType<{
    className?: string;
  }>;
  label: string;
  value: string;
  href: string;
};

function MobileContactLink({
  icon: Icon,
  label,
  value,
  href,
}: MobileContactLinkProps) {
  return (
    <a
      href={href}
      className="flex min-w-0 items-center gap-3 rounded-2xl bg-white/[0.06] p-3.5 transition active:scale-[0.98]"
    >
      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
        <Icon className="size-4" />
      </span>

      <span className="min-w-0">
        <span className="font-condensed block text-[10px] font-bold uppercase tracking-[0.1em] text-neutral-400">
          {label}
        </span>

        <span className="mt-0.5 block truncate text-sm font-medium text-white">
          {value}
        </span>
      </span>
    </a>
  );
}