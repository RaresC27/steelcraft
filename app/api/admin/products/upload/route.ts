import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

import { auth } from "@/auth";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const allowedMimeTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
]);

function createSafeFileName(originalName: string) {
  const extension =
    originalName
      .split(".")
      .pop()
      ?.toLowerCase() || "jpg";

  const baseName = originalName
    .replace(/\.[^/.]+$/, "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

  const uniquePart = `${Date.now()}-${crypto
    .randomUUID()
    .slice(0, 8)}`;

  return `${baseName || "produs"}-${uniquePart}.${extension}`;
}

export async function POST(request: Request) {
  const session = await auth();

  const adminEmail =
    process.env.ADMIN_EMAIL
      ?.trim()
      .toLowerCase();

  if (
    !session?.user?.email ||
    session.user.email.trim().toLowerCase() !== adminEmail
  ) {
    return NextResponse.json(
      {
        error: "Nu ești autorizat.",
      },
      {
        status: 401,
      },
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          error: "Nu a fost selectată nicio imagine.",
        },
        {
          status: 400,
        },
      );
    }

    if (!allowedMimeTypes.has(file.type)) {
      return NextResponse.json(
        {
          error:
            "Format invalid. Sunt acceptate JPG, PNG, WEBP și AVIF.",
        },
        {
          status: 400,
        },
      );
    }

    if (file.size <= 0) {
      return NextResponse.json(
        {
          error: "Fișierul selectat este gol.",
        },
        {
          status: 400,
        },
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          error:
            "Imaginea este prea mare. Dimensiunea maximă este 5 MB.",
        },
        {
          status: 400,
        },
      );
    }

    const fileName = createSafeFileName(file.name);

    const blob = await put(
      `products/${fileName}`,
      file,
      {
        access: "public",
        contentType: file.type,
        addRandomSuffix: false,
      },
    );

    return NextResponse.json(
      {
        message: "Imaginea a fost încărcată.",
        imagePath: blob.url,
        pathname: blob.pathname,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error(
      "Eroare la încărcarea imaginii în Vercel Blob:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Imaginea nu a putut fi încărcată. Încearcă din nou.",
      },
      {
        status: 500,
      },
    );
  }
}