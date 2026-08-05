import type { OrderStatus } from "@/generated/prisma/client";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

const allowedStatuses = new Set<OrderStatus>([
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "COMPLETED",
  "CANCELLED",
]);

type UpdateOrderStatusRouteProps = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(
  request: Request,
  { params }: UpdateOrderStatusRouteProps,
) {
  try {
    const { id } = await params;
    const orderId = Number(id);

    if (!Number.isInteger(orderId) || orderId <= 0) {
      return NextResponse.json(
        {
          error: "ID-ul comenzii nu este valid.",
        },
        {
          status: 400,
        },
      );
    }

    const body = (await request.json()) as {
      status?: unknown;
    };

    if (
      typeof body.status !== "string" ||
      !allowedStatuses.has(body.status as OrderStatus)
    ) {
      return NextResponse.json(
        {
          error: "Statusul selectat nu este valid.",
        },
        {
          status: 400,
        },
      );
    }

    const existingOrder = await prisma.order.findUnique({
      where: {
        id: orderId,
      },
      select: {
        id: true,
      },
    });

    if (!existingOrder) {
      return NextResponse.json(
        {
          error: "Comanda nu a fost găsită.",
        },
        {
          status: 404,
        },
      );
    }

    const updatedOrder = await prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        status: body.status as OrderStatus,
      },
      select: {
        id: true,
        orderNumber: true,
        status: true,
      },
    });

    return NextResponse.json({
      message: "Statusul comenzii a fost actualizat.",
      order: updatedOrder,
    });
  } catch (error) {
    console.error(
      "Eroare la actualizarea statusului comenzii:",
      error,
    );

    return NextResponse.json(
      {
        error: "Statusul comenzii nu a putut fi actualizat.",
      },
      {
        status: 500,
      },
    );
  }
}