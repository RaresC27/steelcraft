import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { OrderStatusForm } from "@/app/admin/order-status-form"

function formatPrice(value: number) {
  return new Intl.NumberFormat("ro-RO", {
    style: "currency",
    currency: "RON",
  }).format(value);
}

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("ro-RO", {
    dateStyle: "long",
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

type OrderDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function OrderDetailsPage({
  params,
}: OrderDetailsPageProps) {
  const { id } = await params;
  const orderId = Number(id);

  if (!Number.isInteger(orderId) || orderId <= 0) {
    notFound();
  }

  const order = await prisma.order.findUnique({
    where: {
      id: orderId,
    },
    include: {
      items: {
        orderBy: {
          id: "asc",
        },
      },
    },
  });

  if (!order) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-neutral-100 py-10">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Link
              href="/admin/comenzi"
              className="font-barlow-condensed text-sm font-bold uppercase tracking-wider text-neutral-500 transition hover:text-[#ff5500]"
            >
              ← Înapoi la comenzi
            </Link>

            <p className="mt-6 font-barlow-condensed text-sm font-bold uppercase tracking-[0.2em] text-[#ff5500]">
              Detalii comandă
            </p>

            <h1 className="mt-2 break-words font-bebas-neue text-4xl uppercase tracking-wide text-[#111111] sm:text-5xl">
              {order.orderNumber}
            </h1>

            <p className="mt-2 font-barlow text-neutral-600">
              Creată la {formatDate(order.createdAt)}
            </p>
          </div>

          <div className="border border-neutral-200 bg-white p-5 shadow-sm">
            <p className="font-barlow text-sm text-neutral-500">
              Status curent
            </p>

            <p className="mt-1 font-barlow-condensed text-xl font-bold uppercase tracking-wide text-[#111111]">
              {statusLabels[order.status]}
            </p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div className="space-y-8">
            <section className="border border-neutral-200 bg-white p-6 shadow-sm">
              <h2 className="border-b border-neutral-200 pb-4 font-bebas-neue text-3xl uppercase tracking-wide text-[#111111]">
                Produse comandate
              </h2>

              <div className="divide-y divide-neutral-200">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="grid gap-4 py-5 sm:grid-cols-[minmax(0,1fr)_100px_150px]"
                  >
                    <div>
                      <p className="font-barlow-condensed text-lg font-bold uppercase tracking-wide text-[#111111]">
                        {item.productName}
                      </p>

                      <p className="mt-1 font-barlow text-sm text-neutral-500">
                        Product ID: {item.productId}
                      </p>
                    </div>

                    <div>
                      <p className="font-barlow text-xs uppercase tracking-wider text-neutral-500">
                        Cantitate
                      </p>

                      <p className="mt-1 font-barlow-condensed text-lg font-bold text-[#111111]">
                        {item.quantity}
                      </p>
                    </div>

                    <div className="sm:text-right">
                      <p className="font-barlow text-xs uppercase tracking-wider text-neutral-500">
                        Total linie
                      </p>

                      <p className="mt-1 font-barlow-condensed text-lg font-bold text-[#111111]">
                        {formatPrice(
                          Number(item.price) * item.quantity,
                        )}
                      </p>

                      <p className="mt-1 font-barlow text-xs text-neutral-500">
                        {formatPrice(Number(item.price))} / buc.
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-neutral-200 pt-5">
                <span className="font-barlow text-neutral-600">
                  Subtotal comandă
                </span>

                <span className="font-barlow-condensed text-2xl font-bold text-[#111111]">
                  {formatPrice(Number(order.subtotal))}
                </span>
              </div>
            </section>

            <section className="grid gap-8 md:grid-cols-2">
              <div className="border border-neutral-200 bg-white p-6 shadow-sm">
                <h2 className="border-b border-neutral-200 pb-4 font-bebas-neue text-3xl uppercase tracking-wide text-[#111111]">
                  Client
                </h2>

                <dl className="mt-5 space-y-4">
                  <DetailRow
                    label="Nume"
                    value={order.customerName}
                  />

                  <DetailRow
                    label="Email"
                    value={order.email}
                  />

                  <DetailRow
                    label="Telefon"
                    value={order.phone}
                  />

                  <DetailRow
                    label="Firmă"
                    value={order.company}
                  />

                  <DetailRow
                    label="CUI / CIF"
                    value={order.vatNumber}
                  />
                </dl>
              </div>

              <div className="border border-neutral-200 bg-white p-6 shadow-sm">
                <h2 className="border-b border-neutral-200 pb-4 font-bebas-neue text-3xl uppercase tracking-wide text-[#111111]">
                  Livrare
                </h2>

                <dl className="mt-5 space-y-4">
                  <DetailRow
                    label="Județ"
                    value={order.county}
                  />

                  <DetailRow
                    label="Localitate"
                    value={order.city}
                  />

                  <DetailRow
                    label="Adresă"
                    value={order.address}
                  />

                  <DetailRow
                    label="Cod poștal"
                    value={order.postalCode}
                  />
                </dl>
              </div>
            </section>

            {order.notes ? (
              <section className="border border-neutral-200 bg-white p-6 shadow-sm">
                <h2 className="border-b border-neutral-200 pb-4 font-bebas-neue text-3xl uppercase tracking-wide text-[#111111]">
                  Observații
                </h2>

                <p className="mt-5 whitespace-pre-wrap font-barlow leading-relaxed text-neutral-700">
                  {order.notes}
                </p>
              </section>
            ) : null}
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <OrderStatusForm
              orderId={order.id}
              currentStatus={order.status}
            />
          </aside>
        </div>
      </div>
    </main>
  );
}

type DetailRowProps = {
  label: string;
  value: string | null;
};

function DetailRow({
  label,
  value,
}: DetailRowProps) {
  return (
    <div>
      <dt className="font-barlow-condensed text-xs font-bold uppercase tracking-wider text-neutral-500">
        {label}
      </dt>

      <dd className="mt-1 break-words font-barlow text-[#111111]">
        {value || "—"}
      </dd>
    </div>
  );
}