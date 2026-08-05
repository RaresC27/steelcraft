import type { Metadata } from "next";
import {
  Barlow,
  Barlow_Condensed,
  Bebas_Neue,
} from "next/font/google";

import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

import "./globals.css";

const barlow = Barlow({
  subsets: ["latin", "latin-ext"],
  variable: "--font-barlow",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin", "latin-ext"],
  variable: "--font-barlow-condensed",
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  variable: "--font-bebas-neue",
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "SteelCraft | Confecții metalice la comandă",
    template: "%s | SteelCraft",
  },
  description:
    "Hrănitoare pentru animale și confecții metalice realizate din tablă și inox, în dimensiuni standard sau la comandă.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ro">
      <body
        className={`${barlow.variable} ${barlowCondensed.variable} ${bebasNeue.variable} antialiased`}
      >
        <SiteHeader />
        {children}
          <SiteFooter />
      </body>
    </html>
  );
}