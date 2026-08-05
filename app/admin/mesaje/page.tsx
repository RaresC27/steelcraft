import Link from "next/link";

import { prisma } from "@/lib/prisma";

const statusLabels = {
  NEW: "Nou",
  READ: "Citit",
  ANSWERED: "Răspuns",
  ARCHIVED: "Arhivat",
} as const;

const statusClasses = {
  NEW: "bg-orange-100 text-orange-800",
  READ: "bg-blue-100 text-blue-800",
  ANSWERED: "bg-green-100 text-green-800",
  ARCHIVED: "bg-neutral-100 text-neutral-600",
} as const;

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("ro-RO", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value);
}

export default async function AdminMessagesPage() {
  const messages = await prisma.contactMessage.findMany({
    include: {
      product: {
        select: {
          name: true,
          slug: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const newMessagesCount = messages.filter(
    (message) => message.status === "NEW",
  ).length;

  return (
    <main className="min-h-screen bg-neutral-100 py-10">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-condensed text-sm font-bold uppercase tracking-[0.2em] text-primary">
              Administrare
            </p>

            <h1 className="font-display mt-2 text-5xl uppercase text-[#111111]">
              Mesaje
            </h1>

            <p className="mt-2 text-neutral-600">
              Vezi și gestionează solicitările primite prin formularul
              de contact.
            </p>
          </div>

          <div className="border border-neutral-200 bg-white px-5 py-3 shadow-sm">
            <p className="text-sm text-neutral-500">
              Mesaje noi
            </p>

            <p className="font-condensed text-2xl font-bold text-[#111111]">
              {newMessagesCount}
            </p>
          </div>
        </header>

        <nav className="mb-6 flex flex-wrap gap-3">
          <AdminNavLink
            href="/admin"
            label="Dashboard"
          />

          <AdminNavLink
            href="/admin/comenzi"
            label="Comenzi"
          />

          <AdminNavLink
            href="/admin/produse"
            label="Produse"
          />

          <AdminNavLink
            href="/admin/categorii"
            label="Categorii"
          />

          <AdminNavLink
            href="/admin/mesaje"
            label="Mesaje"
            active
          />
        </nav>

        {messages.length === 0 ? (
          <section className="border border-neutral-200 bg-white px-6 py-16 text-center shadow-sm">
            <h2 className="font-display text-3xl uppercase text-[#111111]">
              Nu există mesaje
            </h2>

            <p className="mt-2 text-neutral-600">
              Mesajele trimise prin formular vor apărea aici.
            </p>
          </section>
        ) : (
          <section className="overflow-hidden border border-neutral-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1050px] border-collapse">
                <thead className="bg-[#111111] text-white">
                  <tr>
                    <th className="px-5 py-4 text-left font-condensed text-sm uppercase tracking-wider">
                      Expeditor
                    </th>

                    <th className="px-5 py-4 text-left font-condensed text-sm uppercase tracking-wider">
                      Subiect
                    </th>

                    <th className="px-5 py-4 text-left font-condensed text-sm uppercase tracking-wider">
                      Produs
                    </th>

                    <th className="px-5 py-4 text-left font-condensed text-sm uppercase tracking-wider">
                      Status
                    </th>

                    <th className="px-5 py-4 text-left font-condensed text-sm uppercase tracking-wider">
                      Data
                    </th>

                    <th className="px-5 py-4 text-right font-condensed text-sm uppercase tracking-wider">
                      Acțiuni
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-neutral-200">
                  {messages.map((message) => (
                    <tr
                      key={message.id}
                      className="transition hover:bg-neutral-50"
                    >
                      <td className="px-5 py-4">
                        <p className="font-semibold text-[#111111]">
                          {message.name}
                        </p>

                        <p className="mt-1 text-sm text-neutral-500">
                          {message.email}
                        </p>

                        {message.phone ? (
                          <p className="mt-1 text-sm text-neutral-500">
                            {message.phone}
                          </p>
                        ) : null}
                      </td>

                      <td className="px-5 py-4">
                        <p className="max-w-xs truncate font-medium text-[#111111]">
                          {message.subject}
                        </p>

                        <p className="mt-1 max-w-xs truncate text-sm text-neutral-500">
                          {message.message}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        {message.product ? (
                          <Link
                            href={`/produse/${message.product.slug}`}
                            className="text-sm font-semibold text-primary transition hover:opacity-70"
                          >
                            {message.product.name}
                          </Link>
                        ) : (
                          <span className="text-sm text-neutral-400">
                            General
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={[
                            "inline-flex px-3 py-1 font-condensed text-xs font-bold uppercase tracking-wider",
                            statusClasses[message.status],
                          ].join(" ")}
                        >
                          {statusLabels[message.status]}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-sm text-neutral-600">
                        {formatDate(message.createdAt)}
                      </td>

                      <td className="px-5 py-4 text-right">
                        <Link
                          href={`/admin/mesaje/${message.id}`}
                          className="font-condensed inline-flex min-h-10 items-center justify-center border border-[#111111] px-4 text-xs font-bold uppercase tracking-wider text-[#111111] transition hover:bg-[#111111] hover:text-white"
                        >
                          Deschide
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

type AdminNavLinkProps = {
  href: string;
  label: string;
  active?: boolean;
};

function AdminNavLink({
  href,
  label,
  active = false,
}: AdminNavLinkProps) {
  return (
    <Link
      href={href}
      className={[
        "font-condensed rounded-sm border px-4 py-2 text-sm font-bold uppercase tracking-[0.08em] transition",
        active
          ? "border-primary bg-primary text-white"
          : "border-neutral-300 bg-white text-neutral-700 hover:border-primary hover:text-primary",
      ].join(" ")}
    >
      {label}
    </Link>
  );
}