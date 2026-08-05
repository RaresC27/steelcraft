import Link from "next/link";

import { cn } from "@/lib/utils";

type SiteLogoProps = {
  className?: string;
  light?: boolean;
};

export function SiteLogo({
  className,
  light = false,
}: SiteLogoProps) {
  return (
    <Link
      href="/"
      aria-label="SteelCraft - Pagina principală"
      className={cn(
        "group inline-flex items-center gap-3",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="relative flex size-10 items-center justify-center overflow-hidden bg-primary"
      >
        <span className="font-display translate-y-px text-2xl leading-none text-white">
          SC
        </span>

        <span className="absolute right-0 top-0 size-2 border-r-2 border-t-2 border-white/60" />
      </span>

      <span className="flex flex-col">
        <span
          className={cn(
            "font-display text-2xl uppercase leading-none tracking-[0.08em]",
            light ? "text-white" : "text-foreground",
          )}
        >
          Steel<span className="text-primary">Craft</span>
        </span>

        <span
          className={cn(
            "font-condensed mt-1 text-[0.6rem] font-bold uppercase tracking-[0.22em]",
            light ? "text-neutral-400" : "text-muted-foreground",
          )}
        >
          Confecții metalice
        </span>
      </span>
    </Link>
  );
}