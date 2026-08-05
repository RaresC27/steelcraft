import Link from "next/link";
import {
  AlertTriangle,
  Boxes,
  FolderTree,
  Mail,
  PackageCheck,
  ShoppingCart,
  TrendingUp,
} from "lucide-react";

import { AdminLogoutButton } from "@/components/admin/admin-logout-button";

import { prisma } from "@/lib/prisma";

const orderStatusLabels = {
  PENDING: "În așteptare",
  CONFIRMED: "Confirmată",
  PROCESSING: "În procesare",
  SHIPPED: "Expediată",
  COMPLETED: "Finalizată",
  CANCELLED: "Anulată",
} as const;

const orderStatusClasses = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  PROCESSING: "bg-purple-100 text-purple-800",
  SHIPPED: "bg-cyan-100 text-cyan-800",
  COMPLETED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
} as const;

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

export default async function AdminDashboardPage() {
  const [
    totalOrders,
    newOrders,
    totalProducts,
    activeProducts,
    outOfStockProducts,
    totalCategories,
    contactMessages,
    salesAggregate,
    latestOrders,
  ] = await Promise.all([
    prisma.order.count(),

    prisma.order.count({
      where: {
        status: "PENDING",
      },
    }),

    prisma.product.count(),

    prisma.product.count({
      where: {
        isActive: true,
      },
    }),

    prisma.product.count({
      where: {
        isActive: true,
        canBePurchased: true,
        OR: [
          {
            stock: null,
          },
          {
            stock: {
              lte: 0,
            },
          },
        ],
      },
    }),

    prisma.category.count(),

    prisma.contactMessage.count({
      where: {
        status: "NEW",
      },
    }),

    prisma.order.aggregate({
      where: {
        status: {
          not: "CANCELLED",
        },
      },
      _sum: {
        total: true,
      },
    }),

    prisma.order.findMany({
      take: 6,
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
    }),
  ]);

  const totalSales = Number(
    salesAggregate._sum.total ?? 0,
  );

  const stats = [
    {
      label: "Comenzi totale",
      value: totalOrders,
      description: `${newOrders} în așteptare`,
      href: "/admin/comenzi",
      icon: ShoppingCart,
    },
    {
      label: "Vânzări",
      value: formatPrice(totalSales),
      description: "Fără comenzile anulate",
      href: "/admin/comenzi",
      icon: TrendingUp,
    },
    {
      label: "Produse",
      value: totalProducts,
      description: `${activeProducts} active`,
      href: "/admin/produse",
      icon: Boxes,
    },
    {
      label: "Fără stoc",
      value: outOfStockProducts,
      description: "Produse cumpărabile",
      href: "/admin/produse",
      icon: AlertTriangle,
    },
    {
      label: "Categorii",
      value: totalCategories,
      description: "Structura catalogului",
      href: "/admin/categorii",
      icon: FolderTree,
    },
    {
      label: "Mesaje noi",
      value: contactMessages,
      description: "Solicitări de contact",
      href: "/admin/mesaje",
      icon: Mail,
    },
  ];

  return (
    <main className="min-h-screen bg-neutral-100 py-10">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="mb-8">
          <p className="font-condensed text-sm font-bold uppercase tracking-[0.2em] text-primary">
            SteelCraft Admin
          </p>

          <h1 className="font-display mt-2 text-5xl uppercase text-[#111111] sm:text-6xl">
            Dashboard
          </h1>

          <p className="mt-3 max-w-2xl leading-7 text-neutral-600">
            Vezi rapid situația comenzilor, produselor, stocului și
            mesajelor primite.
          </p>
        </header>

        <nav className="mb-8 flex flex-wrap gap-3">
          <AdminNavigationLink
            href="/admin"
            label="Dashboard"
            active
          />

          <AdminNavigationLink
            href="/admin/comenzi"
            label="Comenzi"
          />

          <AdminNavigationLink
            href="/admin/produse"
            label="Produse"
          />

          <AdminNavigationLink
            href="/admin/categorii"
            label="Categorii"
          />

          <AdminNavigationLink
            href="/admin/mesaje"
            label="Mesaje"
          />

          <AdminLogoutButton 
          
          />
        </nav>

        <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <Link
                key={stat.label}
                href={stat.href}
                className="group border border-neutral-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-5">
                  <div>
                    <p className="font-condensed text-sm font-bold uppercase tracking-[0.1em] text-neutral-500">
                      {stat.label}
                    </p>

                    <p className="font-display mt-3 text-4xl uppercase leading-none text-[#111111]">
                      {stat.value}
                    </p>

                    <p className="mt-3 text-sm text-neutral-500">
                      {stat.description}
                    </p>
                  </div>

                  <span className="flex size-12 shrink-0 items-center justify-center rounded-sm bg-[#111111] text-primary transition group-hover:bg-primary group-hover:text-white">
                    <Icon className="size-5" />
                  </span>
                </div>
              </Link>
            );
          })}
        </section>

        <div className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,1fr)_340px]">
          <section className="overflow-hidden border border-neutral-200 bg-white shadow-sm">
            <div className="flex items-center justify-between gap-4 border-b border-neutral-200 px-5 py-5 sm:px-7">
              <div>
                <h2 className="font-display text-3xl uppercase text-[#111111]">
                  Ultimele comenzi
                </h2>

                <p className="mt-1 text-sm text-neutral-500">
                  Cele mai recente comenzi înregistrate.
                </p>
              </div>

              <Link
                href="/admin/comenzi"
                className="font-condensed shrink-0 text-xs font-bold uppercase tracking-[0.1em] text-primary transition hover:opacity-70"
              >
                Vezi toate
              </Link>
            </div>

            {latestOrders.length === 0 ? (
              <div className="px-6 py-14 text-center">
                <ShoppingCart className="mx-auto size-9 text-neutral-300" />

                <p className="mt-4 font-semibold text-[#111111]">
                  Nu există comenzi
                </p>

                <p className="mt-1 text-sm text-neutral-500">
                  Comenzile noi vor apărea aici.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] border-collapse">
                  <thead className="bg-neutral-50">
                    <tr>
                      <th className="px-5 py-3 text-left font-condensed text-xs font-bold uppercase tracking-wider text-neutral-500">
                        Comandă
                      </th>

                      <th className="px-5 py-3 text-left font-condensed text-xs font-bold uppercase tracking-wider text-neutral-500">
                        Client
                      </th>

                      <th className="px-5 py-3 text-left font-condensed text-xs font-bold uppercase tracking-wider text-neutral-500">
                        Total
                      </th>

                      <th className="px-5 py-3 text-left font-condensed text-xs font-bold uppercase tracking-wider text-neutral-500">
                        Status
                      </th>

                      <th className="px-5 py-3 text-right font-condensed text-xs font-bold uppercase tracking-wider text-neutral-500">
                        Detalii
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-neutral-200">
                    {latestOrders.map((order) => (
                      <tr
                        key={order.id}
                        className="transition hover:bg-neutral-50"
                      >
                        <td className="px-5 py-4">
                          <p className="font-condensed font-bold text-[#111111]">
                            {order.orderNumber}
                          </p>

                          <p className="mt-1 text-xs text-neutral-500">
                            {formatDate(order.createdAt)}
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          <p className="text-sm font-semibold text-[#111111]">
                            {order.customerName}
                          </p>

                          <p className="mt-1 text-xs text-neutral-500">
                            {order._count.items} produse
                          </p>
                        </td>

                        <td className="px-5 py-4 font-condensed text-base font-bold text-[#111111]">
                          {formatPrice(Number(order.total))}
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={[
                              "inline-flex px-3 py-1 font-condensed text-xs font-bold uppercase tracking-wider",
                              orderStatusClasses[order.status],
                            ].join(" ")}
                          >
                            {orderStatusLabels[order.status]}
                          </span>
                        </td>

                        <td className="px-5 py-4 text-right">
                          <Link
                            href={`/admin/comenzi/${order.id}`}
                            className="font-condensed inline-flex min-h-9 items-center justify-center border border-neutral-300 px-3 text-xs font-bold uppercase tracking-wider text-neutral-700 transition hover:border-primary hover:text-primary"
                          >
                            Deschide
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <aside className="space-y-6">
            <section className="border border-neutral-200 bg-white p-6 shadow-sm">
              <h2 className="font-display text-3xl uppercase text-[#111111]">
                Acțiuni rapide
              </h2>

              <div className="mt-5 space-y-3">
                <QuickAction
                  href="/admin/produse/nou"
                  label="Adaugă produs"
                />

                <QuickAction
                  href="/admin/categorii/nou"
                  label="Adaugă categorie"
                />

                <QuickAction
                  href="/admin/comenzi"
                  label="Gestionează comenzile"
                />

                <QuickAction
                  href="/admin/mesaje"
                  label="Vezi mesajele"
                />
              </div>
            </section>

            <section className="border border-neutral-200 bg-[#111111] p-6 text-white shadow-sm">
              <PackageCheck className="size-7 text-primary" />

              <h2 className="font-display mt-5 text-3xl uppercase">
                Situație magazin
              </h2>

              <dl className="mt-5 space-y-4">
                <DashboardDetail
                  label="Comenzi noi"
                  value={String(newOrders)}
                />

                <DashboardDetail
                  label="Produse active"
                  value={String(activeProducts)}
                />

                <DashboardDetail
                  label="Produse fără stoc"
                  value={String(outOfStockProducts)}
                />

                <DashboardDetail
                  label="Mesaje noi"
                  value={String(contactMessages)}
                />
              </dl>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}

type AdminNavigationLinkProps = {
  href: string;
  label: string;
  active?: boolean;
};

function AdminNavigationLink({
  href,
  label,
  active = false,
}: AdminNavigationLinkProps) {
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

type QuickActionProps = {
  href: string;
  label: string;
};

function QuickAction({
  href,
  label,
}: QuickActionProps) {
  return (
    <Link
      href={href}
      className="font-condensed flex min-h-11 items-center justify-between border border-neutral-200 px-4 text-sm font-bold uppercase tracking-[0.08em] text-[#111111] transition hover:border-primary hover:bg-primary/5 hover:text-primary"
    >
      {label}

      <span aria-hidden="true">→</span>
    </Link>
  );
}

type DashboardDetailProps = {
  label: string;
  value: string;
};

function DashboardDetail({
  label,
  value,
}: DashboardDetailProps) {
  return (
    <div className="flex items-center justify-between border-b border-white/10 pb-3 last:border-b-0 last:pb-0">
      <dt className="text-sm text-neutral-400">
        {label}
      </dt>

      <dd className="font-condensed text-xl font-bold text-white">
        {value}
      </dd>
    </div>
  );
}