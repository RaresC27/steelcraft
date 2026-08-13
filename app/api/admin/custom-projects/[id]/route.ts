import { NextResponse } from "next/server";
import { z } from "zod";

import { isAdminAuthenticated } from "@/lib/auth/require-admin";
import { prisma } from "@/lib/prisma";

const statusSchema = z.object({
  status: z.enum([
    "NEW",
    "REVIEWING",
    "QUOTED",
    "ACCEPTED",
    "REJECTED",
    "ARCHIVED",
  ]),
});

type RouteProps = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(
  request: Request,
  { params }: RouteProps,
) {
  const isAdmin =
    await isAdminAuthenticated();

  if (!isAdmin) {
    return NextResponse.json(
      {
        error: "Nu ești autorizat.",
      },
      {
        status: 401,
      },
    );
  }

  const { id } = await params;

  const requestId = Number(id);

  if (
    !Number.isInteger(requestId) ||
    requestId <= 0
  ) {
    return NextResponse.json(
      {
        error: "Cerere invalidă.",
      },
      {
        status: 400,
      },
    );
  }

  const body: unknown =
    await request.json();

  const validation =
    statusSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(
      {
        error: "Status invalid.",
      },
      {
        status: 400,
      },
    );
  }

  try {
    const project =
      await prisma.customProjectRequest.update({
        where: {
          id: requestId,
        },

        data: {
          status:
            validation.data.status,
        },

        select: {
          id: true,
          status: true,
          updatedAt: true,
        },
      });

    return NextResponse.json({
      project,
    });
  } catch {
    return NextResponse.json(
      {
        error:
          "Statusul nu a putut fi actualizat.",
      },
      {
        status: 500,
      },
    );
  }
}