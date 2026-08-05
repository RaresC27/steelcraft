export type ProductSpecification = {
  label: string;
  value: string;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  categorySlug: string;
  shortDescription: string;
  description: string;
  price: number | null;
  priceLabel?: string;
  material: string;
  featured?: boolean;
  specifications: ProductSpecification[];
};

export const products: Product[] = [
  {
    id: "prod-001",
    name: "Hrănitoare metalică pentru porci",
    slug: "hranitoare-metalica-pentru-porci",
    categorySlug: "hranitoare-pentru-animale",
    shortDescription:
      "Hrănitoare solidă din tablă zincată, potrivită pentru gospodării și ferme.",
    description:
      "Hrănitoare metalică proiectată pentru utilizare zilnică în gospodării și exploatații zootehnice. Construcția robustă ajută la păstrarea hranei într-un spațiu protejat și permite curățarea rapidă a produsului.",
    price: 450,
    material: "Tablă zincată",
    featured: true,
    specifications: [
      {
        label: "Material",
        value: "Tablă zincată",
      },
      {
        label: "Utilizare",
        value: "Porci și purcei",
      },
      {
        label: "Montaj",
        value: "Produs livrat asamblat",
      },
      {
        label: "Personalizare",
        value: "Dimensiuni disponibile la cerere",
      },
    ],
  },
  {
    id: "prod-002",
    name: "Hrănitoare pentru păsări",
    slug: "hranitoare-pentru-pasari",
    categorySlug: "hranitoare-pentru-animale",
    shortDescription:
      "Model compact și rezistent pentru găini, curcani și alte păsări.",
    description:
      "Hrănitoare compactă realizată pentru distribuirea eficientă a hranei în gospodării și ferme mici. Forma produsului reduce risipa și permite accesul facil al păsărilor.",
    price: 180,
    material: "Tablă zincată",
    specifications: [
      {
        label: "Material",
        value: "Tablă zincată",
      },
      {
        label: "Utilizare",
        value: "Păsări",
      },
      {
        label: "Amplasare",
        value: "Interior sau spațiu acoperit",
      },
      {
        label: "Personalizare",
        value: "Disponibilă la cerere",
      },
    ],
  },
  {
    id: "prod-003",
    name: "Hrănitoare lungă pentru animale",
    slug: "hranitoare-lunga-pentru-animale",
    categorySlug: "hranitoare-pentru-animale",
    shortDescription:
      "Hrănitoare cu lungime extinsă, disponibilă și în dimensiuni personalizate.",
    description:
      "Model destinat hrănirii simultane a mai multor animale. Lungimea, lățimea și grosimea materialului pot fi adaptate în funcție de spațiul disponibil și de modul de utilizare.",
    price: null,
    priceLabel: "Preț la cerere",
    material: "Tablă",
    specifications: [
      {
        label: "Material",
        value: "Tablă",
      },
      {
        label: "Lungime",
        value: "Personalizabilă",
      },
      {
        label: "Finisaj",
        value: "La alegere",
      },
      {
        label: "Execuție",
        value: "Pe bază de comandă",
      },
    ],
  },
  {
    id: "prod-004",
    name: "Cutie metalică industrială",
    slug: "cutie-metalica-industriala",
    categorySlug: "confectii-din-tabla",
    shortDescription:
      "Cutie metalică realizată pentru depozitare, protecție sau integrare tehnică.",
    description:
      "Cutie metalică potrivită pentru protejarea componentelor, depozitare sau integrare în ansambluri tehnice. Produsul poate fi adaptat prin decupaje, perforații, capace și sisteme de prindere.",
    price: 320,
    material: "Tablă vopsită",
    featured: true,
    specifications: [
      {
        label: "Material",
        value: "Tablă",
      },
      {
        label: "Finisaj",
        value: "Vopsire",
      },
      {
        label: "Dimensiuni",
        value: "Standard sau personalizate",
      },
      {
        label: "Execuție",
        value: "Sudată",
      },
    ],
  },
  {
    id: "prod-005",
    name: "Tavă metalică ranforsată",
    slug: "tava-metalica-ranforsata",
    categorySlug: "confectii-din-tabla",
    shortDescription:
      "Tavă rezistentă pentru utilizare profesională și industrială.",
    description:
      "Tavă metalică robustă, realizată pentru transport, colectare sau utilizare în spații de producție. Marginile îndoite și elementele de ranforsare contribuie la rezistența ansamblului.",
    price: 240,
    material: "Tablă",
    specifications: [
      {
        label: "Material",
        value: "Tablă",
      },
      {
        label: "Construcție",
        value: "Ranforsată",
      },
      {
        label: "Dimensiuni",
        value: "Personalizabile",
      },
      {
        label: "Finisaj",
        value: "La cerere",
      },
    ],
  },
  {
    id: "prod-006",
    name: "Carcasă metalică la comandă",
    slug: "carcasa-metalica-la-comanda",
    categorySlug: "confectii-din-tabla",
    shortDescription:
      "Carcase realizate după desen, dimensiuni sau specificații tehnice.",
    description:
      "Carcasă metalică fabricată conform cerințelor tehnice ale clientului. Poate include decupaje, perforații, uși, capace, balamale și elemente de fixare.",
    price: null,
    priceLabel: "Preț la cerere",
    material: "Tablă",
    specifications: [
      {
        label: "Material",
        value: "Tablă",
      },
      {
        label: "Execuție",
        value: "După desen tehnic",
      },
      {
        label: "Decupaje",
        value: "Disponibile la cerere",
      },
      {
        label: "Finisaj",
        value: "Personalizabil",
      },
    ],
  },
  {
    id: "prod-007",
    name: "Masă de lucru din inox",
    slug: "masa-de-lucru-din-inox",
    categorySlug: "confectii-din-inox",
    shortDescription:
      "Masă profesională din inox pentru spații de producție și procesare.",
    description:
      "Masă de lucru rezistentă, potrivită pentru bucătării profesionale, spații de procesare și alte medii unde curățarea ușoară și durabilitatea sunt importante.",
    price: 1250,
    material: "Inox",
    featured: true,
    specifications: [
      {
        label: "Material",
        value: "Inox",
      },
      {
        label: "Construcție",
        value: "Sudată",
      },
      {
        label: "Picioare",
        value: "Reglabile",
      },
      {
        label: "Dimensiuni",
        value: "Personalizabile",
      },
    ],
  },
  {
    id: "prod-008",
    name: "Cuvă din inox",
    slug: "cuva-din-inox",
    categorySlug: "confectii-din-inox",
    shortDescription:
      "Cuvă rezistentă, ușor de curățat și adaptabilă proiectului.",
    description:
      "Cuvă realizată din inox pentru utilizare profesională. Dimensiunile, adâncimea, evacuarea și sistemul de susținere pot fi configurate în funcție de proiect.",
    price: null,
    priceLabel: "Preț la cerere",
    material: "Inox",
    specifications: [
      {
        label: "Material",
        value: "Inox",
      },
      {
        label: "Adâncime",
        value: "Personalizabilă",
      },
      {
        label: "Evacuare",
        value: "Opțională",
      },
      {
        label: "Execuție",
        value: "La comandă",
      },
    ],
  },
  {
    id: "prod-009",
    name: "Raft metalic din inox",
    slug: "raft-metalic-din-inox",
    categorySlug: "confectii-din-inox",
    shortDescription:
      "Raft robust pentru bucătării profesionale, laboratoare și producție.",
    description:
      "Raft din inox proiectat pentru depozitarea produselor și echipamentelor în spații profesionale. Poate fi realizat cu unul sau mai multe niveluri.",
    price: 680,
    material: "Inox",
    specifications: [
      {
        label: "Material",
        value: "Inox",
      },
      {
        label: "Niveluri",
        value: "Configurabile",
      },
      {
        label: "Montaj",
        value: "Pe pardoseală",
      },
      {
        label: "Dimensiuni",
        value: "Personalizabile",
      },
    ],
  },
];

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug);
}