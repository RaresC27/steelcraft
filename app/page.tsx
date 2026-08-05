import {
  Hammer,
  ShieldCheck,
  Truck,
} from "lucide-react";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { HomeHero } from "@/components/sections/home-hero";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";
import { ProductCategoriesSection } from "@/components/sections/product-categories-section";

const benefits = [
  {
    title: "Fabricație la comandă",
    description:
      "Produse metalice realizate după dimensiunile și cerințele proiectului tău.",
    icon: Hammer,
  },
  {
    title: "Construcție rezistentă",
    description:
      "Materiale atent alese, suduri solide și finisaje pregătite pentru utilizare îndelungată.",
    icon: ShieldCheck,
  },
  {
    title: "Livrare în toată țara",
    description:
      "Pregătim și expediem comenzile în condiții sigure, indiferent de localitate.",
    icon: Truck,
  },
];

export default function HomePage() {
  return (
    <main>
      <HomeHero />
      <ProductCategoriesSection />

      <Section>
        <Container>
          <SectionHeading
            accent="SteelCraft?"
            description="Punem accent pe materiale potrivite, execuție atentă și soluții adaptate fiecărui client."
          >
            De ce să alegi
          </SectionHeading>

          <div className="grid gap-5 md:grid-cols-3">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;

              return (
                <Card
                  key={benefit.title}
                  className="group rounded-sm border-neutral-200 py-0 transition duration-300 hover:-translate-y-2 hover:border-primary hover:shadow-[0_20px_40px_rgba(255,85,0,0.08)]"
                >
                  <CardContent className="flex flex-col items-center px-7 py-10 text-center">
                    <div className="mb-6 flex size-[72px] items-center justify-center rounded-sm bg-[#111111] text-primary transition duration-300 group-hover:-rotate-3 group-hover:scale-105 group-hover:bg-primary group-hover:text-white">
                      <Icon
                        className="size-8"
                        strokeWidth={1.8}
                      />
                    </div>

                    <h2 className="font-condensed text-lg font-bold uppercase tracking-[0.08em]">
                      {benefit.title}
                    </h2>

                    <p className="mt-3 text-sm leading-7 text-muted-foreground">
                      {benefit.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </Container>
      </Section>
    </main>
  );
}