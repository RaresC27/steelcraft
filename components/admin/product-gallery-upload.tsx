"use client";

import Image from "next/image";
import {
  Check,
  ImagePlus,
  LoaderCircle,
  Star,
  Trash2,
} from "lucide-react";
import {
  type ChangeEvent,
  useRef,
  useState,
} from "react";

type ProductGalleryImage = {
  id: number;
  url: string;
  pathname: string | null;
  alt: string | null;
  position: number;
  isPrimary: boolean;
};

type ProductGalleryUploadProps = {
  productId: number;
  initialImages: ProductGalleryImage[];
};

type GalleryResponse = {
  error?: string;
  message?: string;
  images?: ProductGalleryImage[];
  imageId?: number;
  deletedImageId?: number;
  newPrimaryImageId?: number | null;
};

export function ProductGalleryUpload({
  productId,
  initialImages,
}: ProductGalleryUploadProps) {
  const fileInputRef =
    useRef<HTMLInputElement>(null);

  const [images, setImages] =
    useState(initialImages);

  const [isUploading, setIsUploading] =
    useState(false);

  const [busyImageId, setBusyImageId] =
    useState<number | null>(null);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

async function handleFilesChange(
  event: ChangeEvent<HTMLInputElement>,
) {
  const files = Array.from(
    event.target.files ?? [],
  );

  if (files.length === 0) {
    return;
  }

  setError("");
  setMessage("");
  setIsUploading(true);

  try {
    const formData = new FormData();

    formData.set(
      "productId",
      String(productId),
    );

    for (const file of files) {
      formData.append("files", file);
    }

    const response = await fetch(
      "/api/admin/products/gallery",
      {
        method: "POST",
        body: formData,
      },
    );

    const result =
      (await response.json()) as GalleryResponse;

    if (!response.ok) {
      throw new Error(
        result.error ??
          "Uploadul nu a reușit.",
      );
    }

    setImages((currentImages) => [
      ...currentImages,
      ...(result.images ?? []),
    ]);

    setMessage(
      result.message ??
        "Imaginile au fost adăugate.",
    );
  } catch (caughtError) {
    setError(
      caughtError instanceof Error
        ? caughtError.message
        : "A apărut o eroare.",
    );
  } finally {
    setIsUploading(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }
}
  async function handleSetPrimary(
    imageId: number,
  ) {
    setError("");
    setMessage("");
    setBusyImageId(imageId);

    try {
      const response = await fetch(
        "/api/admin/products/gallery",
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            productId,
            imageId,
          }),
        },
      );

      const result =
        (await response.json()) as GalleryResponse;

      if (!response.ok) {
        throw new Error(
          result.error ??
            "Imaginea principală nu a putut fi schimbată.",
        );
      }

      setImages((currentImages) =>
        currentImages.map((image) => ({
          ...image,
          isPrimary:
            image.id === imageId,
        })),
      );

      setMessage(
        result.message ??
          "Imaginea principală a fost schimbată.",
      );
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "A apărut o eroare.",
      );
    } finally {
      setBusyImageId(null);
    }
  }

  async function handleDelete(
    imageId: number,
  ) {
    const shouldDelete =
      window.confirm(
        "Sigur vrei să ștergi această imagine?",
      );

    if (!shouldDelete) {
      return;
    }

    setError("");
    setMessage("");
    setBusyImageId(imageId);

    try {
      const response = await fetch(
        "/api/admin/products/gallery",
        {
          method: "DELETE",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            productId,
            imageId,
          }),
        },
      );

      const result =
        (await response.json()) as GalleryResponse;

      if (!response.ok) {
        throw new Error(
          result.error ??
            "Imaginea nu a putut fi ștearsă.",
        );
      }

      setImages((currentImages) =>
        currentImages
          .filter(
            (image) =>
              image.id !== imageId,
          )
          .map((image) => ({
            ...image,
            isPrimary:
              image.id ===
              result.newPrimaryImageId
                ? true
                : image.isPrimary,
          })),
      );

      setMessage(
        result.message ??
          "Imaginea a fost ștearsă.",
      );
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "A apărut o eroare.",
      );
    } finally {
      setBusyImageId(null);
    }
  }

  const canUpload =
    !isUploading &&
    images.length < 8;

  return (
    <section className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm sm:rounded-sm sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-condensed text-xs font-bold uppercase tracking-[0.16em] text-primary">
            Galerie produs
          </p>

          <h2 className="font-display mt-1 text-3xl uppercase text-[#111111]">
            Imagini secundare
          </h2>

          <p className="mt-2 max-w-xl text-sm leading-6 text-neutral-500">
            Selectează mai multe imagini, alege
            imaginea principală sau elimină imaginile
            de care nu mai ai nevoie.
          </p>
        </div>

        <span className="font-condensed shrink-0 text-sm font-bold text-neutral-400">
          {images.length}/8
        </span>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp,image/avif"
        onChange={handleFilesChange}
        className="sr-only"
      />

      <button
        type="button"
        disabled={!canUpload}
        onClick={() =>
          fileInputRef.current?.click()
        }
        className="mt-5 flex min-h-24 w-full flex-col items-center justify-center rounded-xl border border-dashed border-neutral-300 bg-neutral-50 px-4 text-center transition active:scale-[0.99] hover:border-primary hover:bg-primary/[0.03] disabled:cursor-not-allowed disabled:opacity-50 sm:rounded-sm"
      >
        {isUploading ? (
          <LoaderCircle className="size-6 animate-spin text-primary" />
        ) : (
          <ImagePlus className="size-6 text-primary" />
        )}

        <span className="font-condensed mt-2 text-sm font-bold uppercase tracking-[0.08em] text-[#111111]">
          {isUploading
            ? "Se încarcă imaginile..."
            : images.length >= 8
              ? "Ai atins limita de imagini"
              : "Adaugă imagini în galerie"}
        </span>

        <span className="mt-1 text-xs text-neutral-500">
          Maximum 8 imagini, câte 4 MB fiecare
        </span>
      </button>

      {error ? (
        <p
          role="alert"
          className="mt-4 text-sm text-red-600"
        >
          {error}
        </p>
      ) : null}

      {message ? (
        <p className="mt-4 flex items-center gap-2 text-sm text-green-700">
          <Check className="size-4" />
          {message}
        </p>
      ) : null}

      {images.length > 0 ? (
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {images.map((image) => {
            const isBusy =
              busyImageId === image.id;

            return (
              <article
                key={image.id}
                className="group overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50 sm:rounded-sm"
              >
                <div className="relative aspect-square overflow-hidden bg-neutral-100">
                  <Image
                    src={image.url}
                    alt={
                      image.alt ??
                      "Imagine produs"
                    }
                    fill
                    className="object-cover"
                    sizes="(max-width: 639px) 50vw, 240px"
                  />

                  {image.isPrimary ? (
                    <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-1 font-condensed text-[10px] font-bold uppercase tracking-[0.06em] text-white shadow-lg">
                      <Star className="size-3 fill-current" />
                      Principală
                    </span>
                  ) : null}

                  {isBusy ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/55">
                      <LoaderCircle className="size-6 animate-spin text-white" />
                    </div>
                  ) : null}
                </div>

                <div className="grid grid-cols-2 border-t border-neutral-200">
                  <button
                    type="button"
                    disabled={
                      isBusy ||
                      image.isPrimary
                    }
                    onClick={() =>
                      handleSetPrimary(
                        image.id,
                      )
                    }
                    className="font-condensed flex min-h-11 items-center justify-center gap-1.5 border-r border-neutral-200 px-2 text-[10px] font-bold uppercase tracking-[0.05em] text-neutral-700 transition hover:bg-primary/5 hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Star className="size-3.5" />
                    Principală
                  </button>

                  <button
                    type="button"
                    disabled={isBusy}
                    onClick={() =>
                      handleDelete(image.id)
                    }
                    className="font-condensed flex min-h-11 items-center justify-center gap-1.5 px-2 text-[10px] font-bold uppercase tracking-[0.05em] text-red-700 transition hover:bg-red-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Trash2 className="size-3.5" />
                    Șterge
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="mt-6 rounded-xl border border-neutral-200 bg-neutral-50 px-5 py-8 text-center sm:rounded-sm">
          <p className="text-sm font-semibold text-[#111111]">
            Galeria este goală
          </p>

          <p className="mt-1 text-xs leading-5 text-neutral-500">
            Imaginea principală existentă continuă să
            fie afișată până când adaugi imagini în
            galerie.
          </p>
        </div>
      )}
    </section>
  );
}