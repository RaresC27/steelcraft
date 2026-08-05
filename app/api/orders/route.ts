import { NextResponse } from "next/server";

import { calculateShippingCost } from "@/lib/commerce/shipping";
import { prisma } from "@/lib/prisma";
import { checkoutSchema } from "@/lib/validation/checkout";

class OrderError extends Error {
  status: number;

  constructor(message: string, status = 400) {
    super(message);

    this.name = "OrderError";
    this.status = status;
  }
}

function cleanOptionalText(value?: string) {
  const cleanedValue = value?.trim();

  return cleanedValue ? cleanedValue : null;
}

function createOrderNumber() {
  const date = new Date();

  const datePart = [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("");

  const randomPart = crypto
    .randomUUID()
    .slice(0, 8)
    .toUpperCase();

  return `SC-${datePart}-${randomPart}`;
}

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();

    const parsed = checkoutSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Verifică informațiile introduse.",
          fieldErrors:
            parsed.error.flatten().fieldErrors,
        },
        {
          status: 400,
        },
      );
    }

    const {
      customerName,
      email,
      phone,
      company,
      vatNumber,
      county,
      city,
      address,
      postalCode,
      notes,
      paymentMethod,
      items,
    } = parsed.data;

    /*
     * Cardul apare momentan doar în interfață.
     * Îl activăm după integrarea procesatorului.
     */
    if (paymentMethod === "CARD") {
      return NextResponse.json(
        {
          error:
            "Plata cu cardul nu este disponibilă momentan. Selectează plata ramburs.",
          fieldErrors: {
            paymentMethod: [
              "Selectează plata ramburs pentru a continua.",
            ],
          },
        },
        {
          status: 400,
        },
      );
    }

    /*
     * Combinăm produsele duplicate trimise accidental.
     */
    const quantityByProductId = new Map<number, number>();

    for (const item of items) {
      const currentQuantity =
        quantityByProductId.get(item.productId) ?? 0;

      quantityByProductId.set(
        item.productId,
        currentQuantity + item.quantity,
      );
    }

    const cartItems = Array.from(
      quantityByProductId,
      ([productId, quantity]) => ({
        productId,
        quantity,
      }),
    );

    const productIds = cartItems.map(
      (item) => item.productId,
    );

    const createdOrder = await prisma.$transaction(
      async (tx) => {
        const products = await tx.product.findMany({
          where: {
            id: {
              in: productIds,
            },
          },
          select: {
            id: true,
            name: true,
            slug: true,
            price: true,
            stock: true,
            isActive: true,
            canBePurchased: true,
          },
        });

        if (products.length !== productIds.length) {
          throw new OrderError(
            "Unul sau mai multe produse din coș nu mai există.",
            409,
          );
        }

        const productsById = new Map(
          products.map((product) => [
            product.id,
            product,
          ]),
        );

        const validatedItems = cartItems.map(
          (cartItem) => {
            const product = productsById.get(
              cartItem.productId,
            );

            if (!product) {
              throw new OrderError(
                "Unul dintre produsele din coș nu mai există.",
                409,
              );
            }

            if (!product.isActive) {
              throw new OrderError(
                `Produsul „${product.name}” nu mai este disponibil.`,
                409,
              );
            }

            if (
              !product.canBePurchased ||
              product.price === null
            ) {
              throw new OrderError(
                `Produsul „${product.name}” nu poate fi comandat online.`,
                409,
              );
            }

            const availableStock = product.stock ?? 0;

            if (availableStock <= 0) {
              throw new OrderError(
                `Produsul „${product.name}” nu mai este în stoc.`,
                409,
              );
            }

            if (
              cartItem.quantity > availableStock
            ) {
              throw new OrderError(
                `Pentru produsul „${product.name}” sunt disponibile doar ${availableStock} bucăți.`,
                409,
              );
            }

            return {
              productId: product.id,
              productName: product.name,
              productSlug: product.slug,
              price: product.price,
              quantity: cartItem.quantity,
            };
          },
        );

        const subtotal = validatedItems.reduce(
          (total, item) =>
            total +
            Number(item.price) * item.quantity,
          0,
        );

        const shippingCost =
          calculateShippingCost(subtotal);

        const total = subtotal + shippingCost;

        /*
         * Scădem stocul în aceeași tranzacție.
         */
        for (const item of validatedItems) {
          const updateResult =
            await tx.product.updateMany({
              where: {
                id: item.productId,
                isActive: true,
                canBePurchased: true,
                stock: {
                  gte: item.quantity,
                },
              },
              data: {
                stock: {
                  decrement: item.quantity,
                },
              },
            });

          if (updateResult.count !== 1) {
            throw new OrderError(
              `Stocul pentru produsul „${item.productName}” s-a modificat. Reîncarcă pagina și încearcă din nou.`,
              409,
            );
          }
        }

        const orderNumber = createOrderNumber();

        return tx.order.create({
          data: {
            orderNumber,
            customerName,
            email,
            phone,

            company: cleanOptionalText(company),
            vatNumber:
              cleanOptionalText(vatNumber),

            county,
            city,
            address,
            postalCode:
              cleanOptionalText(postalCode),

            notes: cleanOptionalText(notes),

            subtotal,
            shippingCost,
            total,

            paymentMethod: "CASH_ON_DELIVERY",
            paymentStatus: "PENDING",

            items: {
              create: validatedItems.map(
                (item) => ({
                  productId: item.productId,
                  productName:
                    item.productName,
                  productSlug:
                    item.productSlug,
                  price: item.price,
                  quantity: item.quantity,
                }),
              ),
            },
          },
          select: {
            id: true,
            orderNumber: true,
            subtotal: true,
            shippingCost: true,
            total: true,
            paymentMethod: true,
            paymentStatus: true,
            status: true,
            createdAt: true,
          },
        });
      },
    );

    return NextResponse.json(
      {
        message:
          "Comanda a fost înregistrată cu succes.",
        order: {
          ...createdOrder,
          subtotal: Number(
            createdOrder.subtotal,
          ),
          shippingCost: Number(
            createdOrder.shippingCost,
          ),
          total: Number(createdOrder.total),
        },
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    if (error instanceof OrderError) {
      return NextResponse.json(
        {
          error: error.message,
        },
        {
          status: error.status,
        },
      );
    }

    if (
      error instanceof SyntaxError
    ) {
      return NextResponse.json(
        {
          error:
            "Datele trimise către server nu sunt valide.",
        },
        {
          status: 400,
        },
      );
    }

    console.error(
      "Eroare la crearea comenzii:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Comanda nu a putut fi înregistrată. Încearcă din nou.",
      },
      {
        status: 500,
      },
    );
  }
}