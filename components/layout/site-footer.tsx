import Link from "next/link";
import {
  Clock3,
  Mail,
  MapPin,
  Phone,
  ShoppingBag,
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
    href: "/confectii-la-comanda",
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
    label: "Porți metalice",
    href: "/produse?category=porti-metalice",
  },
  {
    label: "Garduri metalice",
    href: "/produse?category=garduri-metalice",
  },
  {
    label: "Balustrade",
    href: "/produse?category=balustrade",
  },
  {
    label: "Structuri metalice",
    href: "/produse?category=structuri-metalice",
  },
];

export function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-[#0b0b0b] text-white">
      <div className="border-b border-white/10">
        <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.25fr_0.75fr_0.75fr_1fr] lg:gap-12 lg:py-18">
          <div>
            <SiteLogo light />

            <p className="mt-5 max-w-sm text-sm leading-7 text-neutral-400">
              Produse și confecții metalice realizate pentru ferme,
              gospodării, proprietăți rezidențiale și proiecte
              comerciale. Punem accent pe materiale rezistente,
              execuție atentă și soluții adaptate fiecărui client.
            </p>

            <Link
              href="/produse"
              className="font-condensed mt-7 inline-flex min-h-12 items-center justify-center gap-2 rounded-sm bg-primary px-6 text-sm font-bold uppercase tracking-[0.12em] text-white transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0b0b]"
            >
              <ShoppingBag className="size-4" />
              Vezi produsele
            </Link>
          </div>

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

          <div>
            <h2 className="font-condensed text-sm font-bold uppercase tracking-[0.18em] text-white">
              Contact
            </h2>

            <div className="mt-5 space-y-5">
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
                value="România, Baia Sprie, Maramures"
              />

              <FooterContactItem
                icon={Clock3}
                label="Program"
                value="Luni–Vineri, 08:00–17:00"
              />
            </div>
          </div>
        </Container>
      </div>

      <div className="border-b border-white/10">
        <Container className="flex flex-col gap-5 py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs leading-6 text-neutral-500">
            Informațiile privind prețurile, livrarea și
            disponibilitatea produselor pot fi actualizate în
            funcție de proiect și stoc.
          </p>

          <nav
            aria-label="Linkuri legale"
            className="flex flex-wrap gap-x-5 gap-y-3"
          >
            {usefulLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-condensed text-xs font-bold uppercase tracking-[0.1em] text-neutral-400 transition hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </Container>
      </div>

      <Container className="flex flex-col gap-3 py-5 text-xs text-neutral-500 sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {currentYear} SteelCraft. Toate drepturile rezervate.
        </p>

        <p>
          Confecții metalice standard și la comandă.
        </p>
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
      <h2 className="font-condensed text-sm font-bold uppercase tracking-[0.18em] text-white">
        {title}
      </h2>

      <nav className="mt-5 flex flex-col items-start gap-3">
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
      className="group inline-flex items-center gap-2 text-sm text-neutral-400 transition hover:text-primary"
    >
      <span className="h-px w-3 bg-neutral-700 transition group-hover:w-5 group-hover:bg-primary" />

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
      <span className="flex size-10 shrink-0 items-center justify-center rounded-sm border border-white/10 bg-white/5 text-primary transition group-hover:border-primary group-hover:bg-primary group-hover:text-white">
        <Icon className="size-4" />
      </span>

      <span>
        <span className="font-condensed block text-xs font-bold uppercase tracking-[0.12em] text-neutral-500">
          {label}
        </span>

        <span className="mt-1 block text-sm text-neutral-300 transition group-hover:text-white">
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