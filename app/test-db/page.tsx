import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function TestDatabasePage() {
  const [
    categoryCount,
    productCount,
    specificationCount,
    messageCount,
  ] = await Promise.all([
    prisma.category.count(),
    prisma.product.count(),
    prisma.productSpecification.count(),
    prisma.contactMessage.count(),
  ]);

  return (
    <main className="min-h-screen bg-neutral-100 px-4 py-20">
      <div className="mx-auto max-w-xl rounded-sm border border-neutral-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="font-condensed text-sm font-bold uppercase tracking-[0.16em] text-primary">
          Test bază de date
        </p>

        <h1 className="font-display mt-3 text-4xl uppercase leading-none text-[#111111] sm:text-5xl">
          Prisma și SQLite funcționează
        </h1>

        <p className="mt-4 text-sm leading-7 text-neutral-600">
          Valorile de mai jos sunt citite direct din baza de date
          SQLite.
        </p>

        <dl className="mt-8 divide-y divide-neutral-200 border-y border-neutral-200">
          <DatabaseCount
            label="Categorii"
            value={categoryCount}
          />

          <DatabaseCount
            label="Produse"
            value={productCount}
          />

          <DatabaseCount
            label="Specificații"
            value={specificationCount}
          />

          <DatabaseCount
            label="Mesaje"
            value={messageCount}
          />
        </dl>
      </div>
    </main>
  );
}

type DatabaseCountProps = {
  label: string;
  value: number;
};

function DatabaseCount({
  label,
  value,
}: DatabaseCountProps) {
  return (
    <div className="flex items-center justify-between gap-4 py-4">
      <dt className="text-sm text-neutral-600">
        {label}
      </dt>

      <dd className="text-lg font-bold text-[#111111]">
        {value}
      </dd>
    </div>
  );
}