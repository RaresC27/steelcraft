import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { CategoryCard } from "@/components/product/category-card";
import { buttonVariants } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { productCategories } from "@/data/product-categories";
import { cn } from "@/lib/utils";

export function ProductCategoriesSection() {
    return (
        <Section className="bg-neutral-50">
            <Container>
                <div className="mb-8 flex flex-col gap-5 sm:mb-10 lg:flex-row lg:items-end lg:justify-between">
                    <SectionHeading
                        accent="SteelCraft"
                        description="Descoperă principalele categorii de produse și soluții metalice disponibile."
                        className="mb-0"
                    >
                        Produsele
                    </SectionHeading>

                    <Link
                        href="/produse"
                        className={cn(
                            buttonVariants({
                                variant: "outline",
                                size: "lg",
                            }),
                            "font-condensed h-12 w-full shrink-0 rounded-sm border-neutral-300 px-5 text-sm font-bold uppercase tracking-[0.1em] sm:w-fit sm:px-6 sm:tracking-[0.12em]",
                        )}
                    >
                        Vezi toate produsele
                        <ArrowRight className="size-4" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
                    {productCategories.map((category, index) => (
                        <CategoryCard
                            key={category.slug}
                            category={category}
                            index={index}
                        />
                    ))}
                </div>
            </Container>
        </Section>
    );
}