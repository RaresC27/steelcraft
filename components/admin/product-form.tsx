"use client";

import Link from "next/link";
import {
    useActionState,
    useEffect,
    useState,
} from "react";
import { createProduct, updateProduct } from "@/app/admin/produse/action";
import { initialProductFormState } from "@/app/admin/produse/form-state";
import { ProductImageUpload } from "@/components/admin/product-image-upload";


type CategoryOption = {
    id: number;
    name: string;
};

type EditableProduct = {
    id: number;
    name: string;
    slug: string;
    shortDescription: string;
    description: string;
    material: string;
    price: number | null;
    priceLabel: string | null;
    stock: number | null;
    image: string | null;
    categoryId: number;
    position: number;
    featured: boolean;
    canBePurchased: boolean;
    isActive: boolean;
};

type ProductFormProps = {
    categories: CategoryOption[];
    product?: EditableProduct;
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

export function ProductForm({
    categories,
    product,
}: ProductFormProps) {
    const isEditing = Boolean(product);

    const action = product
        ? updateProduct.bind(null, product.id)
        : createProduct;

    const [state, formAction, isPending] = useActionState(
        action,
        initialProductFormState,
    );

    const [name, setName] = useState(product?.name ?? "");
    const [slug, setSlug] = useState(product?.slug ?? "");

    const [slugWasEdited, setSlugWasEdited] =
        useState(Boolean(product));

    const [canBePurchased, setCanBePurchased] =
        useState(product?.canBePurchased ?? false);

    return (
        <form
            action={formAction}
            className="space-y-6"
        >
            {state.message ? (
                <div
                    role="alert"
                    className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                    {state.message}
                </div>
            ) : null}

            <section className="border border-neutral-200 bg-white p-5 shadow-sm sm:p-7">
                <SectionHeading
                    title="Informații generale"
                    description="Datele principale afișate în catalog și pe pagina produsului."
                />

                <div className="grid gap-5 sm:grid-cols-2">
                    <FormField
                        label="Nume produs"
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
                            placeholder="Ex: Hrănitoare metalică 2 metri"
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
                            placeholder="hranitoare-metalica-2-metri"
                        />
                    </FormField>

                    <div className="sm:col-span-2">
                        <FormField
                            label="Descriere scurtă"
                            htmlFor="shortDescription"
                            required
                            error={
                                state.errors?.shortDescription?.[0]
                            }
                        >
                            <textarea
                                id="shortDescription"
                                name="shortDescription"
                                rows={3}
                                defaultValue={product?.shortDescription ?? ""}
                                className="min-h-24 w-full resize-y rounded-sm border border-neutral-300 bg-white px-4 py-3 text-sm leading-6 text-[#111111] outline-none transition placeholder:text-neutral-400 focus:border-primary focus:ring-2 focus:ring-primary/15"
                            />
                        </FormField>
                    </div>

                    <div className="sm:col-span-2">
                        <FormField
                            label="Descriere completă"
                            htmlFor="description"
                            required
                            error={state.errors?.description?.[0]}
                        >
                            <textarea
                                id="description"
                                name="description"
                                defaultValue={product?.description ?? ""}
                                className={textareaClassName}
                            />
                        </FormField>
                    </div>

                    <FormField
                        label="Material"
                        htmlFor="material"
                        required
                        error={state.errors?.material?.[0]}
                    >
                        <input
                            id="material"
                            name="material"
                            type="text"
                            defaultValue={product?.material ?? ""}
                            className={inputClassName}
                        />
                    </FormField>

                    <FormField
                        label="Categorie"
                        htmlFor="categoryId"
                        required
                        error={state.errors?.categoryId?.[0]}
                    >
                        <select
                            id="categoryId"
                            name="categoryId"
                            defaultValue={
                                product ? String(product.categoryId) : ""
                            }
                            className={inputClassName}
                        >
                            <option value="" disabled>
                                Selectează categoria
                            </option>

                            {categories.map((category) => (
                                <option
                                    key={category.id}
                                    value={category.id}
                                >
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </FormField>
                </div>
            </section>

            <section className="border border-neutral-200 bg-white p-5 shadow-sm sm:p-7">
                <SectionHeading
                    title="Preț și stoc"
                    description="Configurează vânzarea online sau păstrează produsul doar pentru cereri de ofertă."
                />

                <div className="mb-6">
                    <label className="flex cursor-pointer items-start gap-3 border border-neutral-200 bg-neutral-50 p-4">
                        <input
                            type="checkbox"
                            name="canBePurchased"
                            checked={canBePurchased}
                            onChange={(event) =>
                                setCanBePurchased(
                                    event.target.checked,
                                )
                            }
                            className="mt-1 size-4 accent-primary"
                        />

                        <span>
                            <span className="font-condensed block text-sm font-bold uppercase tracking-[0.08em] text-[#111111]">
                                Poate fi cumpărat online
                            </span>

                            <span className="mt-1 block text-sm leading-6 text-neutral-600">
                                Dacă este dezactivat, produsul va afișa
                                „Solicită o ofertă”.
                            </span>
                        </span>
                    </label>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                    <FormField
                        label="Preț"
                        htmlFor="price"
                        required={canBePurchased}
                        error={state.errors?.price?.[0]}
                    >
                        <input
                            id="price"
                            name="price"
                            type="number"
                            min="0"
                            step="0.01"
                            disabled={!canBePurchased}
                            defaultValue={product?.price ?? ""}
                            className={[
                                inputClassName,
                                !canBePurchased
                                    ? "cursor-not-allowed bg-neutral-100 opacity-60"
                                    : "",
                            ].join(" ")}
                        />
                    </FormField>

                    <FormField
                        label="Stoc"
                        htmlFor="stock"
                        required={canBePurchased}
                        error={state.errors?.stock?.[0]}
                    >
                        <input
                            id="stock"
                            name="stock"
                            type="number"
                            min="0"
                            step="1"
                            disabled={!canBePurchased}
                            defaultValue={product?.stock ?? ""}
                            className={[
                                inputClassName,
                                !canBePurchased
                                    ? "cursor-not-allowed bg-neutral-100 opacity-60"
                                    : "",
                            ].join(" ")}
                        />
                    </FormField>

                    <div className="sm:col-span-2">
                        <FormField
                            label="Etichetă preț"
                            htmlFor="priceLabel"
                            error={state.errors?.priceLabel?.[0]}
                        >
                            <input
                                id="priceLabel"
                                name="priceLabel"
                                type="text"
                                defaultValue={product?.priceLabel ?? ""}
                                className={inputClassName}
                            />
                        </FormField>
                    </div>
                </div>
            </section>

            <section className="border border-neutral-200 bg-white p-5 shadow-sm sm:p-7">
                <SectionHeading
                    title="Imagine și afișare"
                    description="Configurează imaginea, poziția și vizibilitatea produsului."
                />

                <div className="grid gap-5 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                        <FormField
                            label="Cale imagine"
                            htmlFor="image"
                            error={state.errors?.image?.[0]}
                        >
                            <input
                                id="image"
                                type="text"
                                className={inputClassName}
                                placeholder="/images/products/produs.jpg"
                            />
                        </FormField>

                        <p className="mt-2 text-xs leading-5 text-neutral-500">
                            Momentan introduci manual calea unei imagini
                            existente în folderul public. Upload-ul îl
                            implementăm separat.
                        </p>
                        <div className="sm:col-span-2">
                            <div className="mb-2">
                                <p className="font-condensed text-sm font-bold uppercase tracking-[0.08em] text-[#111111]">
                                    Imagine produs
                                </p>
                            </div>

                            <ProductImageUpload
                                initialImage={product?.image}
                            />

                            {state.errors?.image?.[0] ? (
                                <p
                                    role="alert"
                                    className="mt-2 text-sm text-red-600"
                                >
                                    {state.errors.image[0]}
                                </p>
                            ) : null}
                        </div>
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
                            defaultValue={product?.position ?? 0}
                            className={inputClassName}
                        />
                    </FormField>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    <CheckboxField
                        name="isActive"
                        label="Produs activ"
                        description="Produsul apare în catalog și poate fi accesat."
                        defaultChecked={product?.isActive ?? true}
                    />

                    <CheckboxField
                        name="featured"
                        label="Produs recomandat"
                        description="Poate fi afișat prioritar în secțiunile speciale."
                        defaultChecked={product?.featured ?? false}
                    />
                </div>
            </section>

            <div className="flex flex-col-reverse gap-3 border border-neutral-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-end">
                <Link
                    href="/admin/produse"
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
                            : "Adaugă produsul"}
                </button>
            </div>
        </form>
    );
}

type SectionHeadingProps = {
    title: string;
    description: string;
};

function SectionHeading({
    title,
    description,
}: SectionHeadingProps) {
    return (
        <div className="mb-6 border-b border-neutral-200 pb-4">
            <h2 className="font-display text-3xl uppercase text-[#111111]">
                {title}
            </h2>

            <p className="mt-1 text-sm leading-6 text-neutral-600">
                {description}
            </p>
        </div>
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

type CheckboxFieldProps = {
    name: string;
    label: string;
    description: string;
    defaultChecked?: boolean;
};

function CheckboxField({
    name,
    label,
    description,
    defaultChecked = false,
}: CheckboxFieldProps) {
    return (
        <label className="flex cursor-pointer items-start gap-3 border border-neutral-200 bg-neutral-50 p-4 transition hover:border-primary/50">
            <input
                type="checkbox"
                name={name}
                defaultChecked={defaultChecked}
                className="mt-1 size-4 accent-primary"
            />

            <span>
                <span className="font-condensed block text-sm font-bold uppercase tracking-[0.08em] text-[#111111]">
                    {label}
                </span>

                <span className="mt-1 block text-sm leading-6 text-neutral-600">
                    {description}
                </span>
            </span>
        </label>
    );
}