import {
  del,
  put,
} from "@vercel/blob";
import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 4 * 1024 * 1024;
const MAX_PRODUCT_IMAGES = 8;

const allowedMimeTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
]);

type UploadedBlob = {
  url: string;
  pathname: string;
};

type CreatedProductImage = {
  id: number;
  url: string;
  pathname: string | null;
  alt: string | null;
  position: number;
  isPrimary: boolean;
  productId: number;
  createdAt: Date;
  updatedAt: Date;
};

async function isAuthorizedAdmin() {
  const session = await auth();

  const adminEmail =
    process.env.ADMIN_EMAIL
      ?.trim()
      .toLowerCase();

  return Boolean(
    session?.user?.email &&
      adminEmail &&
      session.user.email
        .trim()
        .toLowerCase() === adminEmail,
  );
}

function createSafeFileName(
  originalName: string,
) {
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

  return `${
    baseName || "produs"
  }-${uniquePart}.${extension}`;
}

export async function POST(
  request: Request,
) {
  if (!(await isAuthorizedAdmin())) {
    return NextResponse.json(
      {
        error: "Nu ești autorizat.",
      },
      {
        status: 401,
      },
    );
  }

  const blobToken =
    process.env.BLOB_READ_WRITE_TOKEN;

  if (!blobToken) {
    return NextResponse.json(
      {
        error:
          "BLOB_READ_WRITE_TOKEN nu este configurat.",
      },
      {
        status: 500,
      },
    );
  }

  const uploadedBlobUrls: string[] = [];

  try {
    const formData =
      await request.formData();

    const productId = Number(
      formData.get("productId"),
    );

    const files = formData
      .getAll("files")
      .filter(
        (value): value is File =>
          value instanceof File &&
          value.size > 0,
      );

    if (
      !Number.isInteger(productId) ||
      productId <= 0
    ) {
      return NextResponse.json(
        {
          error: "Produs invalid.",
        },
        {
          status: 400,
        },
      );
    }

    if (files.length === 0) {
      return NextResponse.json(
        {
          error:
            "Nu a fost selectată nicio imagine.",
        },
        {
          status: 400,
        },
      );
    }

    const product =
      await prisma.product.findUnique({
        where: {
          id: productId,
        },
        select: {
          id: true,
          name: true,
          image: true,

          images: {
            select: {
              id: true,
              position: true,
              isPrimary: true,
            },
          },
        },
      });

    if (!product) {
      return NextResponse.json(
        {
          error: "Produsul nu există.",
        },
        {
          status: 404,
        },
      );
    }

    if (
      product.images.length +
        files.length >
      MAX_PRODUCT_IMAGES
    ) {
      return NextResponse.json(
        {
          error: `Un produs poate avea maximum ${MAX_PRODUCT_IMAGES} imagini în galerie.`,
        },
        {
          status: 400,
        },
      );
    }

    for (const file of files) {
      if (
        !allowedMimeTypes.has(
          file.type,
        )
      ) {
        return NextResponse.json(
          {
            error:
              "Sunt acceptate doar JPG, PNG, WEBP și AVIF.",
          },
          {
            status: 400,
          },
        );
      }

      if (file.size <= 0) {
        return NextResponse.json(
          {
            error:
              "Unul dintre fișiere este gol.",
          },
          {
            status: 400,
          },
        );
      }

      if (
        file.size > MAX_FILE_SIZE
      ) {
        return NextResponse.json(
          {
            error:
              "Fiecare imagine trebuie să aibă maximum 4 MB.",
          },
          {
            status: 400,
          },
        );
      }
    }

    const highestPosition =
      product.images.reduce(
        (highest, image) =>
          Math.max(
            highest,
            image.position,
          ),
        -1,
      );

    const hasPrimaryImage =
      product.images.some(
        (image) => image.isPrimary,
      );

    const uploadedBlobs: UploadedBlob[] = [];

    for (const file of files) {
      const fileName =
        createSafeFileName(
          file.name,
        );

      const blob = await put(
        `products/${productId}/gallery/${fileName}`,
        file,
        {
          access: "public",
          contentType: file.type,
          addRandomSuffix: false,
          token: blobToken,
        },
      );

      uploadedBlobs.push(blob);
      uploadedBlobUrls.push(blob.url);
    }

    const shouldSetFirstAsPrimary =
      !product.image &&
      !hasPrimaryImage;

    const createdImages =
      await prisma.$transaction(
        async (transaction) => {
          const results = [];

          for (
            let index = 0;
            index <
            uploadedBlobs.length;
            index += 1
          ) {
            const blob =
              uploadedBlobs[index];

            const isPrimary =
              shouldSetFirstAsPrimary &&
              index === 0;

            const createdImage =
              await transaction.productImage.create({
                data: {
                  productId,
                  url: blob.url,
                  pathname:
                    blob.pathname,
                  alt: product.name,
                  position:
                    highestPosition +
                    index +
                    1,
                  isPrimary,
                },
              });

            results.push(
              createdImage,
            );
          }

          if (
            shouldSetFirstAsPrimary &&
            uploadedBlobs[0]
          ) {
            await transaction.product.update({
              where: {
                id: productId,
              },
              data: {
                image:
                  uploadedBlobs[0]
                    .url,
              },
            });
          }

          return results;
        },
      );

    return NextResponse.json(
      {
        message:
          createdImages.length === 1
            ? "Imaginea a fost adăugată."
            : `${createdImages.length} imagini au fost adăugate.`,
        images: createdImages,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error(
      "Eroare upload galerie:",
      error,
    );

    if (
      uploadedBlobUrls.length > 0
    ) {
      try {
        await del(
          uploadedBlobUrls,
          {
            token: blobToken,
          },
        );
      } catch (cleanupError) {
        console.error(
          "Curățarea imaginilor Blob a eșuat:",
          cleanupError,
        );
      }
    }

    return NextResponse.json(
      {
        error:
          "Imaginile nu au putut fi încărcate.",
      },
      {
        status: 500,
      },
    );
  }
}

export async function PATCH(
  request: Request,
) {
  if (!(await isAuthorizedAdmin())) {
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
    const body = (await request.json()) as {
      productId?: number;
      imageId?: number;
    };

    const productId = Number(
      body.productId,
    );

    const imageId = Number(
      body.imageId,
    );

    if (
      !Number.isInteger(productId) ||
      productId <= 0 ||
      !Number.isInteger(imageId) ||
      imageId <= 0
    ) {
      return NextResponse.json(
        {
          error: "Date invalide.",
        },
        {
          status: 400,
        },
      );
    }

    const image =
      await prisma.productImage.findFirst({
        where: {
          id: imageId,
          productId,
        },
        select: {
          id: true,
          url: true,
        },
      });

    if (!image) {
      return NextResponse.json(
        {
          error: "Imaginea nu există.",
        },
        {
          status: 404,
        },
      );
    }

    await prisma.$transaction([
      prisma.productImage.updateMany({
        where: {
          productId,
        },
        data: {
          isPrimary: false,
        },
      }),

      prisma.productImage.update({
        where: {
          id: imageId,
        },
        data: {
          isPrimary: true,
        },
      }),

      prisma.product.update({
        where: {
          id: productId,
        },
        data: {
          image: image.url,
        },
      }),
    ]);

    return NextResponse.json({
      message:
        "Imaginea principală a fost actualizată.",
      imageId,
    });
  } catch (error) {
    console.error(
      "Eroare setare imagine principală:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Imaginea principală nu a putut fi actualizată.",
      },
      {
        status: 500,
      },
    );
  }
}

export async function DELETE(
  request: Request,
) {
  if (!(await isAuthorizedAdmin())) {
    return NextResponse.json(
      {
        error: "Nu ești autorizat.",
      },
      {
        status: 401,
      },
    );
  }

  const blobToken =
    process.env.BLOB_READ_WRITE_TOKEN;

  try {
    const body = (await request.json()) as {
      productId?: number;
      imageId?: number;
    };

    const productId = Number(
      body.productId,
    );

    const imageId = Number(
      body.imageId,
    );

    if (
      !Number.isInteger(productId) ||
      productId <= 0 ||
      !Number.isInteger(imageId) ||
      imageId <= 0
    ) {
      return NextResponse.json(
        {
          error: "Date invalide.",
        },
        {
          status: 400,
        },
      );
    }

    const image =
      await prisma.productImage.findFirst({
        where: {
          id: imageId,
          productId,
        },
      });

    if (!image) {
      return NextResponse.json(
        {
          error: "Imaginea nu există.",
        },
        {
          status: 404,
        },
      );
    }

    const remainingImages =
      await prisma.productImage.findMany({
        where: {
          productId,
          id: {
            not: imageId,
          },
        },
        orderBy: [
          {
            position: "asc",
          },
          {
            id: "asc",
          },
        ],
      });

    const newPrimaryImage =
      image.isPrimary
        ? remainingImages[0] ?? null
        : null;

    await prisma.$transaction(
      async (transaction) => {
        await transaction.productImage.delete({
          where: {
            id: imageId,
          },
        });

        if (newPrimaryImage) {
          await transaction.productImage.updateMany({
            where: {
              productId,
            },
            data: {
              isPrimary: false,
            },
          });

          await transaction.productImage.update({
            where: {
              id: newPrimaryImage.id,
            },
            data: {
              isPrimary: true,
            },
          });

          await transaction.product.update({
            where: {
              id: productId,
            },
            data: {
              image:
                newPrimaryImage.url,
            },
          });
        } else if (
          image.isPrimary
        ) {
          await transaction.product.update({
            where: {
              id: productId,
            },
            data: {
              image: null,
            },
          });
        }
      },
    );

    if (
      image.url &&
      blobToken
    ) {
      try {
        await del(image.url, {
          token: blobToken,
        });
      } catch (blobError) {
        console.error(
          "Imaginea a fost ștearsă din Neon, dar nu și din Blob:",
          blobError,
        );
      }
    }

    return NextResponse.json({
      message:
        "Imaginea a fost ștearsă.",
      deletedImageId: imageId,
      newPrimaryImageId:
        newPrimaryImage?.id ??
        null,
    });
  } catch (error) {
    console.error(
      "Eroare ștergere imagine:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Imaginea nu a putut fi ștearsă.",
      },
      {
        status: 500,
      },
    );
  }
}