import Link from "next/link";

import { prisma } from "@/lib/prisma";

function formatPrice(value: number) {
  return new Intl.NumberFormat("ro-RO", {
    style: "currency",
    currency: "RON",
  }).format(value);
}

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("ro-RO", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value);
}

const statusLabels = {
  PENDING: "În așteptare",
  CONFIRMED: "Confirmată",
  PROCESSING: "În procesare",
  SHIPPED: "Expediată",
  COMPLETED: "Finalizată",
  CANCELLED: "Anulată",
} as const;

export default async function OrdersAdminPage() {
  const orders = await prisma.order.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      _count: {
        select: {
          items: true,
        },
      },
    },
  });

  return (
    <main className="min-h-screen bg-neutral-100 py-10">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-barlow-condensed text-sm font-bold uppercase tracking-[0.2em] text-[#ff5500]">
              Administrare
            </p>

            <h1 className="mt-2 font-bebas-neue text-4xl uppercase tracking-wide text-[#111111] sm:text-5xl">
              Comenzi
            </h1>

            <p className="mt-2 font-barlow text-neutral-600">
              Vezi și gestionează comenzile primite.
            </p>
          </div>

          <div className="border border-neutral-200 bg-white px-5 py-3 shadow-sm">
            <p className="font-barlow text-sm text-neutral-500">
              Total comenzi
            </p>

            <p className="font-barlow-condensed text-2xl font-bold text-[#111111]">
              {orders.length}
            </p>
          </div>
        </div>

        {orders.length === 0 ? (
          <section className="border border-neutral-200 bg-white px-6 py-16 text-center shadow-sm">
            <h2 className="font-bebas-neue text-3xl uppercase text-[#111111]">
              Nu există comenzi
            </h2>

            <p className="mt-2 font-barlow text-neutral-600">
              Comenzile noi vor apărea aici.
            </p>
          </section>
        ) : (
          <section className="overflow-hidden border border-neutral-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] border-collapse">
                <thead className="bg-[#111111] text-white">
                  <tr>
                    <th className="px-5 py-4 text-left font-barlow-condensed text-sm uppercase tracking-wider">
                      Comandă
                    </th>

                    <th className="px-5 py-4 text-left font-barlow-condensed text-sm uppercase tracking-wider">
                      Client
                    </th>

                    <th className="px-5 py-4 text-left font-barlow-condensed text-sm uppercase tracking-wider">
                      Produse
                    </th>

                    <th className="px-5 py-4 text-left font-barlow-condensed text-sm uppercase tracking-wider">
                      Total
                    </th>

                    <th className="px-5 py-4 text-left font-barlow-condensed text-sm uppercase tracking-wider">
                      Status
                    </th>

                    <th className="px-5 py-4 text-left font-barlow-condensed text-sm uppercase tracking-wider">
                      Data
                    </th>

                    <th className="px-5 py-4 text-right font-barlow-condensed text-sm uppercase tracking-wider">
                      Acțiuni
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-neutral-200">
                  {orders.map((order) => (
                    <tr
                      key={order.id}
                      className="transition hover:bg-neutral-50"
                    >
                      <td className="px-5 py-4">
                        <p className="font-barlow-condensed font-bold text-[#111111]">
                          {order.orderNumber}
                        </p>

                        <p className="mt-1 font-barlow text-xs text-neutral-500">
                          ID #{order.id}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <p className="font-barlow font-semibold text-[#111111]">
                          {order.customerName}
                        </p>

                        <p className="mt-1 font-barlow text-sm text-neutral-500">
                          {order.phone}
                        </p>
                      </td>

                      <td className="px-5 py-4 font-barlow text-sm text-neutral-700">
                        {order._count.items}
                      </td>

                      <td className="px-5 py-4 font-barlow-condensed text-lg font-bold text-[#111111]">
                        {formatPrice(Number(order.subtotal))}
                      </td>

                      <td className="px-5 py-4">
                        <span className="inline-flex bg-neutral-100 px-3 py-1 font-barlow-condensed text-xs font-bold uppercase tracking-wider text-neutral-700">
                          {statusLabels[order.status]}
                        </span>
                      </td>

                      <td className="px-5 py-4 font-barlow text-sm text-neutral-600">
                        {formatDate(order.createdAt)}
                      </td>

                      <td className="px-5 py-4 text-right">
                        <Link
                          href={`/admin/comenzi/${order.id}`}
                          className="inline-flex min-h-10 items-center justify-center border border-[#111111] px-4 font-barlow-condensed text-sm font-bold uppercase tracking-wider text-[#111111] transition hover:bg-[#111111] hover:text-white"
                        >
                          Detalii
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