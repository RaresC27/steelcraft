import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils";

type SectionProps = ComponentPropsWithoutRef<"section">;

export function Section({
  className,
  children,
  ...props
}: SectionProps) {
  return (
    <section
      className={cn("py-16 md:py-20 lg:py-24", className)}
      {...props}
    >
      {children}
    </section>
  );
}