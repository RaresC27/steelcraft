"use client";

import Image from "next/image";
import {
  ChangeEvent,
  useRef,
  useState,
} from "react";
import {
  ImageIcon,
  LoaderCircle,
  Trash2,
  Upload,
} from "lucide-react";

type ProductImageUploadProps = {
  initialImage?: string | null;
};

type UploadResponse = {
  error?: string;
  message?: string;
  imagePath?: string;
};

export function ProductImageUpload({
  initialImage = null,
}: ProductImageUploadProps) {
  const fileInputRef =
    useRef<HTMLInputElement>(null);

  const [imagePath, setImagePath] = useState(
    initialImage ?? "",
  );

  const [isUploading, setIsUploading] =
    useState(false);

  const [error, setError] = useState("");

  async function handleFileChange(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setError("");
    setIsUploading(true);

    try {
      const uploadFormData = new FormData();
      uploadFormData.append("file", file);

      const response = await fetch(
        "/api/admin/products/upload",
        {
          method: "POST",
          body: uploadFormData,
        },
      );

      const data =
        (await response.json()) as UploadResponse;

      if (!response.ok || !data.imagePath) {
        throw new Error(
          data.error ??
            "Imaginea nu a putut fi încărcată.",
        );
      }

      setImagePath(data.imagePath);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "A apărut o eroare la încărcare.",
      );
    } finally {
      setIsUploading(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  function handleRemove() {
    setImagePath("");
    setError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  return (
    <div>
      {/*
       * Acest input este cel trimis de formular.
       * Nu trebuie să fie disabled.
       */}
      <input
        type="hidden"
        name="image"
        value={imagePath}
        readOnly
      />

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        className="sr-only"
      />

      <div className="grid gap-5 md:grid-cols-[220px_minmax(0,1fr)]">
        <div className="relative aspect-[4/3] overflow-hidden rounded-sm border border-neutral-200 bg-neutral-100">
          {imagePath ? (
            <Image
              src={imagePath}
              alt="Imagine produs"
              fill
              unoptimized
              className="object-cover"
              sizes="220px"
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center px-5 text-center text-neutral-400">
              <ImageIcon className="size-9" />

              <p className="mt-3 text-sm">
                Nu este selectată nicio imagine.
              </p>
            </div>
          )}

          {isUploading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm">
              <LoaderCircle className="size-7 animate-spin text-primary" />
            </div>
          ) : null}
        </div>

        <div className="flex flex-col justify-center">
          <p className="text-sm leading-6 text-neutral-600">
            Încarcă o imagine JPG, PNG sau WEBP de maximum
            5 MB.
          </p>

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              disabled={isUploading}
              onClick={() =>
                fileInputRef.current?.click()
              }
              className="font-condensed inline-flex min-h-11 items-center justify-center gap-2 rounded-sm bg-primary px-5 text-xs font-bold uppercase tracking-[0.1em] text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isUploading ? (
                <LoaderCircle className="size-4 animate-spin" />
              ) : (
                <Upload className="size-4" />
              )}

              {isUploading
                ? "Se încarcă..."
                : imagePath
                  ? "Schimbă imaginea"
                  : "Alege imagine"}
            </button>

            {imagePath ? (
              <button
                type="button"
                disabled={isUploading}
                onClick={handleRemove}
                className="font-condensed inline-flex min-h-11 items-center justify-center gap-2 rounded-sm border border-red-300 px-5 text-xs font-bold uppercase tracking-[0.1em] text-red-700 transition hover:bg-red-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Trash2 className="size-4" />
                Elimină
              </button>
            ) : null}
          </div>

          {imagePath ? (
            <div className="mt-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                Cale imagine
              </p>

              <p className="mt-1 break-all text-xs text-neutral-600">
                {imagePath}
              </p>
            </div>
          ) : null}

          {error ? (
            <p
              role="alert"
              className="mt-3 text-sm text-red-600"
            >
              {error}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}