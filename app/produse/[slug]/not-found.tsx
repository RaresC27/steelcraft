import Link from "next/link";
import {
  ArrowLeft,
  PackageX,
} from "lucide-react";

import { Container } from "@/components/layout/container";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function ProductNotFound() {
  return (
    <main className="flex min-h-[70vh] items-center bg-neutral-50 py-20">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <div className="mx-auto flex size-24 items-center justify-center rounded-sm bg-[#111111] text-primary">
            <PackageX
              className="size-11"
              strokeWidth={1.5}
            />
          </div>

          <p className="font-condensed mt-8 text-sm font-bold uppercase tracking-[0.2em] text-primary">
            Eroare 404
          </p>

          <h1 className="font-display mt-3 text-6xl uppercase leading-[0.9] text-[#111111] sm:text-7xl">
            Produsul nu a fost găsit
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-base leading-8 text-neutral-600">
            Produsul pe care îl cauți nu există, a fost mutat sau
            nu mai este disponibil momentan.
          </p>

          <Link
            href="/produse"
            className={cn(
              buttonVariants({
                size: "lg",
              }),
              "font-condensed mt-8 h-14 rounded-sm px-8 text-sm font-bold uppercase tracking-[0.12em]",
            )}
          >
            <ArrowLeft className="size-4" />
            Înapoi la produse
          </Link>
        </div>
      </Container>
    </main>
  );
}