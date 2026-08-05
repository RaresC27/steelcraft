"use client";

import Link from "next/link";
import {
  useActionState,
  useEffect,
  useState,
} from "react";

import {
  createCategory,
  updateCategory,
} from "@/app/admin/categorii/action";
import { initialCategoryFormState } from "@/app/admin/categorii/form-state";

type EditableCategory = {
  id: number;
  name: string;
  slug: string;
  eyebrow: string | null;
  description: string;
  position: number;
  isActive: boolean;
};

type CategoryFormProps = {
  category?: EditableCategory;
};

const inputClassName =
  "h-12 w-full rounded-sm border border-neutral-300 bg-white px-4 text-sm text-[#111111] outline-none transition placeholder:text-neutral-400 focus:border-primary focus:ring-2 focus:ring-primary/15";

const textareaClassName =
  "min-h-36 w-full resize-y rounded-sm border border-neutral-300 bg-white px-4 py-3 text-sm leading-6 text-[#111111] outline-none transition placeholder:text-neutral-400 focus:border-primary focus:ring-2 focus:ring-primary/15";

function createSlug(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function CategoryForm({
  category,
}: CategoryFormProps) {
  const isEditing = Boolean(category);

  const action = category
    ? updateCategory.bind(null, category.id)
    : createCategory;

  const [state, formAction, isPending] = useActionState(
    action,
    initialCategoryFormState,
  );

  const [name, setName] = useState(category?.name ?? "");
  const [slug, setSlug] = useState(category?.slug ?? "");
  const [slugWasEdited, setSlugWasEdited] =
    useState(Boolean(category));

  useEffect(() => {
    if (!slugWasEdited) {
      setSlug(createSlug(name));
    }
  }, [name, slugWasEdited]);

  return (
    <form
      action={formAction}
      className="space-y-6"
    >
      {state.message ? (
        <div
          role="alert"
          className={[
            "border px-4 py-3 text-sm",
            state.success
              ? "border-green-200 bg-green-50 text-green-700"
              : "border-red-200 bg-red-50 text-red-700",
          ].join(" ")}
        >
          {state.message}
        </div>
      ) : null}

      <section className="border border-neutral-200 bg-white p-5 shadow-sm sm:p-7">
        <div className="mb-6 border-b border-neutral-200 pb-4">
          <h2 className="font-display text-3xl uppercase text-[#111111]">
            Informații categorie
          </h2>

          <p className="mt-1 text-sm leading-6 text-neutral-600">
            Completează datele afișate în catalog.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <FormField
            label="Nume categorie"
            htmlFor="name"
            required
            error={state.errors?.name?.[0]}
          >
            <input
              id="name"
              name="name"
              type="text"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              className={inputClassName}
              placeholder="Ex: Porți metalice"
            />
          </FormField>

          <FormField
            label="Slug"
            htmlFor="slug"
            required
            error={state.errors?.slug?.[0]}
          >
            <input
              id="slug"
              name="slug"
              type="text"
              value={slug}
              onChange={(event) => {
                setSlugWasEdited(true);
                setSlug(event.target.value);
              }}
              className={inputClassName}
              placeholder="porti-metalice"
            />
          </FormField>

          <div className="sm:col-span-2">
            <FormField
              label="Text scurt"
              htmlFor="eyebrow"
              error={state.errors?.eyebrow?.[0]}
            >
              <input
                id="eyebrow"
                name="eyebrow"
                type="text"
                defaultValue={category?.eyebrow ?? ""}
                className={inputClassName}
                placeholder="Ex: Soluții pentru proprietatea ta"
              />
            </FormField>
          </div>

          <div className="sm:col-span-2">
            <FormField
              label="Descriere"
              htmlFor="description"
              required
              error={state.errors?.description?.[0]}
            >
              <textarea
                id="description"
                name="description"
                defaultValue={category?.description ?? ""}
                className={textareaClassName}
                placeholder="Descrie categoria și tipurile de produse disponibile."
              />
            </FormField>
          </div>

          <FormField
            label="Poziție"
            htmlFor="position"
            error={state.errors?.position?.[0]}
          >
            <input
              id="position"
              name="position"
              type="number"
              min="0"
              step="1"
              defaultValue={category?.position ?? 0}
              className={inputClassName}
            />
          </FormField>
        </div>

        <div className="mt-6">
          <label className="flex cursor-pointer items-start gap-3 border border-neutral-200 bg-neutral-50 p-4">
            <input
              type="checkbox"
              name="isActive"
              defaultChecked={category?.isActive ?? true}
              className="mt-1 size-4 accent-primary"
            />

            <span>
              <span className="font-condensed block text-sm font-bold uppercase tracking-[0.08em] text-[#111111]">
                Categorie activă
              </span>

              <span className="mt-1 block text-sm leading-6 text-neutral-600">
                Categoria și produsele sale pot fi afișate public.
              </span>
            </span>
          </label>
        </div>
      </section>

      <div className="flex flex-col-reverse gap-3 border border-neutral-200 bg-white p-5 shadow-sm sm:flex-row sm:justify-end">
        <Link
          href="/admin/categorii"
          className="font-condensed inline-flex min-h-12 items-center justify-center rounded-sm border border-neutral-300 px-6 text-sm font-bold uppercase tracking-[0.1em] text-neutral-700 transition hover:border-[#111111] hover:text-[#111111]"
        >
          Renunță
        </Link>

        <button
          type="submit"
          disabled={isPending}
          className="font-condensed inline-flex min-h-12 items-center justify-center rounded-sm bg-primary px-7 text-sm font-bold uppercase tracking-[0.12em] text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending
            ? "Se salvează..."
            : isEditing
              ? "Salvează modificările"
              : "Adaugă categoria"}
        </button>
      </div>
    </form>
  );
}

type FormFieldProps = {
  label: string;
  htmlFor: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
};

function FormField({
  label,
  htmlFor,
  required = false,
  error,
  children,
}: FormFieldProps) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="font-condensed mb-2 block text-sm font-bold uppercase tracking-[0.08em] text-[#111111]"
      >
        {label}

        {required ? (
          <span className="ml-1 text-primary">*</span>
        ) : null}
      </label>

      {children}

      {error ? (
        <p
          role="alert"
          className="mt-2 text-sm text-red-600"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}