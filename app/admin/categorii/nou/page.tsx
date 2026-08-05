import Link from "next/link";

import { CategoryForm } from "@/components/admin/category-form";

export default function NewCategoryPage() {
  return (
    <main className="min-h-screen bg-neutral-100 py-10">
      <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            href="/admin/categorii"
            className="font-condensed text-sm font-bold uppercase tracking-[0.1em] text-neutral-500 transition hover:text-primary"
          >
            ← Înapoi la categorii
          </Link>

          <p className="font-condensed mt-6 text-sm font-bold uppercase tracking-[0.2em] text-primary">
            Administrare categorii
          </p>

          <h1 className="font-display mt-2 text-5xl uppercase text-[#111111]">
            Categorie nouă
          </h1>
        </div>

        <CategoryForm />
      </div>
    </main>
  );
}