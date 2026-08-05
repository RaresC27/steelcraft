import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "../generated/prisma/client";

const connectionString =
  process.env.DIRECT_URL ??
  process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "Lipsește DIRECT_URL sau DATABASE_URL din fișierul .env.",
  );
}

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log("Pornesc popularea bazei de date Neon...");

  const categories = [
    {
      name: "Porți metalice",
      slug: "porti-metalice",
      eyebrow: "Acces și securitate",
      description:
        "Porți metalice realizate la comandă pentru proprietăți rezidențiale și comerciale.",
      position: 1,
      isActive: true,
    },
    {
      name: "Garduri metalice",
      slug: "garduri-metalice",
      eyebrow: "Împrejmuiri durabile",
      description:
        "Garduri metalice rezistente, realizate la dimensiunile și stilul proiectului.",
      position: 2,
      isActive: true,
    },
    {
      name: "Balustrade",
      slug: "balustrade",
      eyebrow: "Siguranță și design",
      description:
        "Balustrade metalice pentru scări, balcoane, terase și spații comerciale.",
      position: 3,
      isActive: true,
    },
    {
      name: "Structuri metalice",
      slug: "structuri-metalice",
      eyebrow: "Construcții personalizate",
      description:
        "Structuri metalice personalizate pentru proiecte rezidențiale și industriale.",
      position: 4,
      isActive: true,
    },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: {
        slug: category.slug,
      },
      update: {
        name: category.name,
        eyebrow: category.eyebrow,
        description: category.description,
        position: category.position,
        isActive: category.isActive,
      },
      create: category,
    });
  }

  const [
    gateCategory,
    fenceCategory,
    railingCategory,
    structureCategory,
  ] = await Promise.all([
    prisma.category.findUniqueOrThrow({
      where: {
        slug: "porti-metalice",
      },
    }),

    prisma.category.findUniqueOrThrow({
      where: {
        slug: "garduri-metalice",
      },
    }),

    prisma.category.findUniqueOrThrow({
      where: {
        slug: "balustrade",
      },
    }),

    prisma.category.findUniqueOrThrow({
      where: {
        slug: "structuri-metalice",
      },
    }),
  ]);

  const products = [
    {
      name: "Poartă metalică Modern Line",
      slug: "poarta-metalica-modern-line",
      shortDescription:
        "Poartă metalică modernă, realizată la comandă pentru acces auto.",
      description:
        "Model cu design minimalist, construcție robustă și finisaj rezistent la exterior. Poate fi adaptat pentru deschidere batantă sau culisantă.",
      material: "Oțel vopsit electrostatic",
      price: 8500,
      priceLabel: "8.500 lei",
      image: null,
      featured: true,
      stock: 10,
      canBePurchased: true,
      isActive: true,
      position: 1,
      categoryId: gateCategory.id,
      specifications: [
        {
          label: "Material",
          value: "Oțel structural",
          position: 1,
        },
        {
          label: "Finisaj",
          value: "Vopsire electrostatică",
          position: 2,
        },
        {
          label: "Deschidere",
          value: "Batantă sau culisantă",
          position: 3,
        },
      ],
    },
    {
      name: "Poartă pietonală Urban",
      slug: "poarta-pietonala-urban",
      shortDescription:
        "Poartă pietonală compactă, potrivită pentru proiecte moderne.",
      description:
        "Poartă pietonală cu linii simple și structură metalică rigidă, disponibilă în mai multe dimensiuni și finisaje.",
      material: "Oțel zincat",
      price: 3200,
      priceLabel: "3.200 lei",
      image: null,
      featured: false,
      stock: 10,
      canBePurchased: true,
      isActive: true,
      position: 2,
      categoryId: gateCategory.id,
      specifications: [
        {
          label: "Material",
          value: "Oțel zincat",
          position: 1,
        },
        {
          label: "Lățime",
          value: "Personalizabilă",
          position: 2,
        },
        {
          label: "Închidere",
          value: "Manuală sau electrică",
          position: 3,
        },
      ],
    },
    {
      name: "Gard metalic Linear",
      slug: "gard-metalic-linear",
      shortDescription:
        "Gard metalic cu design liniar și aspect contemporan.",
      description:
        "Sistem de gard metalic modular, realizat pentru durabilitate, întreținere redusă și integrare ușoară cu porți din aceeași gamă.",
      material: "Oțel galvanizat",
      price: 950,
      priceLabel: "950 lei / ml",
      image: null,
      featured: true,
      stock: 25,
      canBePurchased: true,
      isActive: true,
      position: 1,
      categoryId: fenceCategory.id,
      specifications: [
        {
          label: "Material",
          value: "Oțel galvanizat",
          position: 1,
        },
        {
          label: "Preț",
          value: "Calculat per metru liniar",
          position: 2,
        },
        {
          label: "Montaj",
          value: "Disponibil opțional",
          position: 3,
        },
      ],
    },
    {
      name: "Balustradă metalică Loft",
      slug: "balustrada-metalica-loft",
      shortDescription:
        "Balustradă metalică pentru interioare moderne și industriale.",
      description:
        "Balustradă realizată la comandă pentru scări, podeste și balcoane, cu design inspirat din stilul industrial.",
      material: "Oțel vopsit",
      price: 1200,
      priceLabel: "1.200 lei / ml",
      image: null,
      featured: true,
      stock: 20,
      canBePurchased: true,
      isActive: true,
      position: 1,
      categoryId: railingCategory.id,
      specifications: [
        {
          label: "Utilizare",
          value: "Interior și exterior",
          position: 1,
        },
        {
          label: "Finisaj",
          value: "Mat, satinat sau texturat",
          position: 2,
        },
        {
          label: "Montaj",
          value: "Pe treaptă sau lateral",
          position: 3,
        },
      ],
    },
    {
      name: "Copertină metalică Industrial",
      slug: "copertina-metalica-industrial",
      shortDescription:
        "Copertină metalică robustă pentru accesuri și terase.",
      description:
        "Structură metalică realizată la comandă, pregătită pentru învelitori din policarbonat, tablă sau sticlă.",
      material: "Oțel structural",
      price: null,
      priceLabel: "Preț la cerere",
      image: null,
      featured: false,
      stock: null,
      canBePurchased: false,
      isActive: true,
      position: 1,
      categoryId: structureCategory.id,
      specifications: [
        {
          label: "Structură",
          value: "Oțel sudat",
          position: 1,
        },
        {
          label: "Învelitoare",
          value: "Policarbonat, tablă sau sticlă",
          position: 2,
        },
        {
          label: "Dimensiuni",
          value: "Realizate la comandă",
          position: 3,
        },
      ],
    },
  ];

  for (const product of products) {
    const {
      specifications,
      ...productData
    } = product;

    const savedProduct =
      await prisma.product.upsert({
        where: {
          slug: productData.slug,
        },
        update: {
          name: productData.name,
          shortDescription:
            productData.shortDescription,
          description: productData.description,
          material: productData.material,
          price: productData.price,
          priceLabel: productData.priceLabel,
          image: productData.image,
          featured: productData.featured,
          stock: productData.stock,
          canBePurchased:
            productData.canBePurchased,
          isActive: productData.isActive,
          position: productData.position,
          categoryId: productData.categoryId,
        },
        create: productData,
      });

    await prisma.productSpecification.deleteMany({
      where: {
        productId: savedProduct.id,
      },
    });

    await prisma.productSpecification.createMany({
      data: specifications.map(
        (specification) => ({
          label: specification.label,
          value: specification.value,
          position: specification.position,
          productId: savedProduct.id,
        }),
      ),
    });
  }

  const [
    categoryCount,
    productCount,
    specificationCount,
  ] = await Promise.all([
    prisma.category.count(),
    prisma.product.count(),
    prisma.productSpecification.count(),
  ]);

  console.log(
    `Categorii în baza de date: ${categoryCount}`,
  );

  console.log(
    `Produse în baza de date: ${productCount}`,
  );

  console.log(
    `Specificații în baza de date: ${specificationCount}`,
  );

  console.log(
    "Seed Neon finalizat cu succes.",
  );
}

main()
  .catch((error: unknown) => {
    console.error("Seed-ul a eșuat:");
    console.error(error);

    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });