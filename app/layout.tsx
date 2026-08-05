import type { Metadata } from "next";
import {
  Barlow,
  Barlow_Condensed,
  Bebas_Neue,
} from "next/font/google";

import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import { MobileHeader } from "@/components/layout/mobile-header";
import { MobileCartToast } from "@/components/cart/mobile-cart-toast";

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
      <body>
        <div className="hidden lg:block">
          <SiteHeader />
        </div>

        <MobileHeader />

        <div className="min-h-screen pb-24 lg:pb-0">
          {children}
        </div>

        <SiteFooter />

        <MobileCartToast />
        <MobileBottomNav />
      </body>
    </html>
  );
}