import Link from "next/link";
import { notFound } from "next/navigation";

import {
    createSpecification,
    updateSpecification,
} from "@/app/admin/produse/[id]/specificatii/actions";
import { DeleteSpecificationButton } from "@/components/admin/delete-specification-button";
import { prisma } from "@/lib/prisma";

type ProductSpecificationsPageProps = {
    params: Promise<{
        id: string;
    }>;
};

const inputClassName =
    "h-11 w-full rounded-sm border border-neutral-300 bg-white px-3 text-sm text-[#111111] outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15";

export default async function ProductSpecificationsPage({
    params,
}: ProductSpecificationsPageProps) {
    const { id } = await params;
    const productId = Number(id);

    if (!Number.isInteger(productId) || productId <= 0) {
        notFound();
    }

    const product = await prisma.product.findUnique({
        where: {
            id: productId,
        },
        select: {
            id: true,
            name: true,
            slug: true,
            specifications: {
                orderBy: [
                    {
                        position: "asc",
                    },
                    {
                        id: "asc",
                    },
                ],
            },
        },
    });

    if (!product) {
        notFound();
    }

    const createAction =
        createSpecification.bind(null, product.id);

    return (
        <main className="min-h-screen bg-neutral-100 py-10">
            <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <Link
                        href="/admin/produse"
                        className="font-condensed text-sm font-bold uppercase tracking-[0.1em] text-neutral-500 transition hover:text-primary"
                    >
                        ← Înapoi la produse
                    </Link>

                    <p className="font-condensed mt-6 text-sm font-bold uppercase tracking-[0.2em] text-primary">
                        Administrare produse
                    </p>

                    <h1 className="font-display mt-2 text-5xl uppercase text-[#111111]">
                        Specificații
                    </h1>

                    <p className="mt-2 text-neutral-600">
                        Produs:{" "}
                        <span className="font-semibold text-[#111111]">
                            {product.name}
                        </span>
                    </p>

                    <div className="mt-5 flex flex-wrap gap-3">
                        <Link
                            href={`/admin/produse/${product.id}/editare`}
                            className="font-condensed inline-flex min-h-10 items-center justify-center rounded-sm border border-[#111111] px-4 text-xs font-bold uppercase tracking-wider text-[#111111] transition hover:bg-[#111111] hover:text-white"
                        >
                            Editează produsul
                        </Link>

                        <Link
                            href={`/produse/${product.slug}`}
                            className="font-condensed inline-flex min-h-10 items-center justify-center rounded-sm border border-neutral-300 bg-white px-4 text-xs font-bold uppercase tracking-wider text-neutral-700 transition hover:border-primary hover:text-primary"
                        >
                            Vezi produsul
                        </Link>

                    </div>
                </div>

                <section className="border border-neutral-200 bg-white p-5 shadow-sm sm:p-7">
                    <div className="mb-6 border-b border-neutral-200 pb-4">
                        <h2 className="font-display text-3xl uppercase text-[#111111]">
                            Adaugă specificație
                        </h2>

                        <p className="mt-1 text-sm text-neutral-600">
                            Exemple: Lungime — 200 cm, Grosime tablă — 1,5 mm.
                        </p>
                    </div>

                    <form
                        action={createAction}
                        className="grid gap-4 md:grid-cols-[1fr_1fr_120px_auto] md:items-end"
                    >
                        <FormField
                            label="Etichetă"
                            htmlFor="new-label"
                        >
                            <input
                                id="new-label"
                                name="label"
                                type="text"
                                required
                                minLength={2}
                                className={inputClassName}
                                placeholder="Ex: Lungime"
                            />
                        </FormField>

                        <FormField
                            label="Valoare"
                            htmlFor="new-value"
                        >
                            <input
                                id="new-value"
                                name="value"
                                type="text"
                                required
                                className={inputClassName}
                                placeholder="Ex: 200 cm"
                            />
                        </FormField>

                        <FormField
                            label="Poziție"
                            htmlFor="new-position"
                        >
                            <input
                                id="new-position"
                                name="position"
                                type="number"
                                min="0"
                                step="1"
                                defaultValue={product.specifications.length}
                                className={inputClassName}
                            />
                        </FormField>

                        <button
                            type="submit"
                            className="font-condensed inline-flex h-11 items-center justify-center rounded-sm bg-primary px-5 text-xs font-bold uppercase tracking-[0.1em] text-white transition hover:opacity-90"
                        >
                            Adaugă
                        </button>
                    </form>
                </section>

                <section className="mt-6 border border-neutral-200 bg-white shadow-sm">
                    <div className="border-b border-neutral-200 px-5 py-5 sm:px-7">
                        <h2 className="font-display text-3xl uppercase text-[#111111]">
                            Specificații existente
                        </h2>

                        <p className="mt-1 text-sm text-neutral-600">
                            {product.specifications.length} specificații
                        </p>
                    </div>

                    {product.specifications.length === 0 ? (
                        <div className="px-5 py-12 text-center text-neutral-600">
                            Produsul nu are încă specificații.
                        </div>
                    ) : (
                        <div className="divide-y divide-neutral-200">
                            {product.specifications.map(
                                (specification) => {
                                    const updateAction =
                                        updateSpecification.bind(
                                            null,
                                            product.id,
                                            specification.id,
                                        );

                                    return (
                                        <div
                                            key={specification.id}
                                            className="p-5 sm:p-7"
                                        >
                                            <form
                                                action={updateAction}
                                                className="grid gap-4 md:grid-cols-[1fr_1fr_120px_auto] md:items-end"
                                            >
                                                <FormField
                                                    label="Etichetă"
                                                    htmlFor={`label-${specification.id}`}
                                                >
                                                    <input
                                                        id={`label-${specification.id}`}
                                                        name="label"
                                                        type="text"
                                                        required
                                                        minLength={2}
                                                        defaultValue={
                                                            specification.label
                                                        }
                                                        className={inputClassName}
                                                    />
                                                </FormField>

                                                <FormField
                                                    label="Valoare"
                                                    htmlFor={`value-${specification.id}`}
                                                >
                                                    <input
                                                        id={`value-${specification.id}`}
                                                        name="value"
                                                        type="text"
                                                        required
                                                        defaultValue={
                                                            specification.value
                                                        }
                                                        className={inputClassName}
                                                    />
                                                </FormField>

                                                <FormField
                                                    label="Poziție"
                                                    htmlFor={`position-${specification.id}`}
                                                >
                                                    <input
                                                        id={`position-${specification.id}`}
                                                        name="position"
                                                        type="number"
                                                        min="0"
                                                        step="1"
                                                        defaultValue={
                                                            specification.position
                                                        }
                                                        className={inputClassName}
                                                    />
                                                </FormField>

                                                <button
                                                    type="submit"
                                                    className="font-condensed inline-flex h-11 items-center justify-center rounded-sm border border-[#111111] px-4 text-xs font-bold uppercase tracking-wider text-[#111111] transition hover:bg-[#111111] hover:text-white"
                                                >
                                                    Salvează
                                                </button>
                                            </form>

                                            <div className="mt-3 flex justify-end">
                                                <DeleteSpecificationButton
                                                    productId={product.id}
                                                    specificationId={
                                                        specification.id
                                                    }
                                                    specificationLabel={
                                                        specification.label
                                                    }
                                                />
                                            </div>
                                        </div>
                                    );
                                },
                            )}
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}

type FormFieldProps = {
    label: string;
    htmlFor: string;
    children: React.ReactNode;
};

function FormField({
    label,
    htmlFor,
    children,
}: FormFieldProps) {
    return (
        <div>
            <label
                htmlFor={htmlFor}
                className="font-condensed mb-2 block text-xs font-bold uppercase tracking-[0.1em] text-neutral-600"
            >
                {label}
            </label>

            {children}
        </div>
    );
}