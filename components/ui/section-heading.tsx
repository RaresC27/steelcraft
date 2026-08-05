import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  children: React.ReactNode;
  accent?: React.ReactNode;
  eyebrow?: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeading({
  children,
  accent,
  eyebrow,
  description,
  align = "center",
  className,    
}: SectionHeadingProps) {
  const isCentered = align === "center";

  return (
    <div
      className={cn(
        "mb-10 md:mb-12",
        isCentered ? "mx-auto max-w-3xl text-center" : "max-w-3xl",
        className,
      )}
    >
      {eyebrow ? (
        <p className="font-condensed mb-3 text-sm font-bold uppercase tracking-[0.2em] text-primary">
          {eyebrow}
        </p>
      ) : null}

      <h2 className="font-display text-4xl uppercase leading-none tracking-[0.08em] text-foreground sm:text-5xl">
        {children}{" "}
        {accent ? <span className="text-primary">{accent}</span> : null}
      </h2>

      {description ? (
        <p
          className={cn(
            "mt-5 max-w-2xl text-base leading-7 text-muted-foreground",
            isCentered && "mx-auto",
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}