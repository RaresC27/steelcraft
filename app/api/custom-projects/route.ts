import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { customProjectSchema } from "@/lib/validation/custom-project";

export const runtime = "nodejs";

function createRequestNumber() {
  const date = new Date();

  const year =
    date.getFullYear();

  const month = String(
    date.getMonth() + 1,
  ).padStart(2, "0");

  const day = String(
    date.getDate(),
  ).padStart(2, "0");

  const unique =
    crypto
      .randomUUID()
      .replace(/-/g, "")
      .slice(0, 6)
      .toUpperCase();

  return `SC-PROJ-${year}${month}${day}-${unique}`;
}

export async function POST(
  request: Request,
) {
  try {
    const body: unknown =
      await request.json();

    const validation =
      customProjectSchema.safeParse(
        body,
      );

    if (!validation.success) {
      return NextResponse.json(
        {
          error:
            "Verifică informațiile introduse.",
          fieldErrors:
            validation.error.flatten()
              .fieldErrors,
        },
        {
          status: 400,
        },
      );
    }

    const data =
      validation.data;

    const projectRequest =
      await prisma.customProjectRequest.create(
        {
          data: {
            requestNumber:
              createRequestNumber(),

            projectType:
              data.projectType,

            material:
              data.material || null,

            finish:
              data.finish || null,

            usage:
              data.usage || null,

            lengthValue:
              data.lengthValue,

            widthValue:
              data.widthValue,

            heightValue:
              data.heightValue,

            dimensionUnit:
              data.dimensionUnit,

            quantity:
              data.quantity,

            needsRecommendation:
              data.needsRecommendation,

            customerName:
              data.customerName,

            email:
              data.email,

            phone:
              data.phone,

            company:
              data.company || null,

            vatNumber:
              data.vatNumber || null,

            county:
              data.county,

            city:
              data.city,

            notes:
              data.notes,
          },

          select: {
            id: true,
            requestNumber: true,
            status: true,
            createdAt: true,
          },
        },
      );

    return NextResponse.json(
      {
        message:
          "Cererea a fost înregistrată.",
        request:
          projectRequest,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error(
      "Eroare creare proiect personalizat:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Cererea nu a putut fi trimisă. Încearcă din nou.",
      },
      {
        status: 500,
      },
    );
  }
}