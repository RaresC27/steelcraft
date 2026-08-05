import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { NextResponse } from "next/server";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const allowedMimeTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

function createSafeFileName(originalName: string) {
  const extension = path
    .extname(originalName)
    .toLowerCase();

  const baseName = path
    .basename(originalName, extension)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

  const uniquePart = `${Date.now()}-${crypto
    .randomUUID()
    .slice(0, 8)}`;

  return `${baseName || "produs"}-${uniquePart}${extension}`;
}

export async function POST(request: Request) {
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
            "Format invalid. Sunt acceptate JPG, PNG și WEBP.",
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

    const uploadDirectory = path.join(
      process.cwd(),
      "public",
      "uploads",
      "products",
    );

    await mkdir(uploadDirectory, {
      recursive: true,
    });

    const filePath = path.join(
      uploadDirectory,
      fileName,
    );

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    await writeFile(filePath, buffer);

    return NextResponse.json(
      {
        message: "Imaginea a fost încărcată.",
        imagePath: `/uploads/products/${fileName}`,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error(
      "Eroare la încărcarea imaginii:",
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