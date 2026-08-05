import {
  Beef,
  Factory,
  PanelsTopLeft,
  type LucideIcon,
} from "lucide-react";

export type ProductCategory = {
  title: string;
  slug: string;
  description: string;
  eyebrow: string;
  icon: LucideIcon;
};

export const productCategories: ProductCategory[] = [
  {
    title: "Hrănitoare pentru animale",
    slug: "hranitoare-pentru-animale",
    description:
      "Hrănitoare metalice rezistente pentru gospodării, ferme și exploatații zootehnice.",
    eyebrow: "Zootehnie",
    icon: Beef,
  },
  {
    title: "Confecții din tablă",
    slug: "confectii-din-tabla",
    description:
      "Produse standard și piese realizate din tablă, adaptate cerințelor proiectului.",
    eyebrow: "Producție metalică",
    icon: PanelsTopLeft,
  },
  {
    title: "Confecții din inox",
    slug: "confectii-din-inox",
    description:
      "Soluții durabile din inox pentru spații unde rezistența și igiena sunt esențiale.",
    eyebrow: "Inox",
    icon: Factory,
  },
];