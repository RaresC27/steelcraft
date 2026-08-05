import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  Boxes,
  CalendarDays,
  FolderPlus,
  FolderTree,
  ListChecks,
  Mail,
  MessageSquareText,
  PackageCheck,
  PackagePlus,
  ShoppingCart,
  TrendingUp,
  type LucideIcon,
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

function formatCurrentDate(value: Date) {
  return new Intl.DateTimeFormat("ro-RO", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
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

  const stats: Array<{
    label: string;
    value: string | number;
    description: string;
    href: string;
    icon: LucideIcon;
    attention?: boolean;
  }> = [
    {
      label: "Comenzi",
      value: totalOrders,
      description: `${newOrders} în așteptare`,
      href: "/admin/comenzi",
      icon: ShoppingCart,
      attention: newOrders > 0,
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
      attention: outOfStockProducts > 0,
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
      attention: contactMessages > 0,
    },
  ];

  return (
    <main className="min-h-screen bg-neutral-100 pb-[max(2rem,env(safe-area-inset-bottom))]">
      {/* Header mobil și desktop */}
      <header className="border-b border-white/10 bg-[#111111] text-white">
        <div className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 sm:py-8 lg:px-8">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="font-condensed text-[11px] font-bold uppercase tracking-[0.2em] text-primary sm:text-sm">
                SteelCraft Admin
              </p>

              <h1 className="font-display mt-1 text-4xl uppercase leading-none sm:mt-2 sm:text-6xl">
                Dashboard
              </h1>

              <div className="mt-3 flex items-center gap-2 text-xs text-neutral-400 sm:text-sm">
                <CalendarDays className="size-4 shrink-0 text-primary" />

                <span className="capitalize">
                  {formatCurrentDate(new Date())}
                </span>
              </div>
            </div>

            <div className="shrink-0">
              <AdminLogoutButton />
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 sm:mt-7 sm:max-w-xl">
            <Link
              href="/admin/comenzi"
              className="flex min-h-16 items-center gap-3 rounded-xl border border-white/10 bg-white/[0.05] px-4 transition active:scale-[0.98] hover:border-primary/50 hover:bg-white/[0.08] sm:rounded-sm"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-white sm:rounded-sm">
                <ShoppingCart className="size-5" />
              </span>

              <span>
                <span className="font-display block text-2xl leading-none">
                  {newOrders}
                </span>

                <span className="mt-1 block text-[11px] text-neutral-400">
                  comenzi noi
                </span>
              </span>
            </Link>

            <Link
              href="/admin/mesaje"
              className="flex min-h-16 items-center gap-3 rounded-xl border border-white/10 bg-white/[0.05] px-4 transition active:scale-[0.98] hover:border-primary/50 hover:bg-white/[0.08] sm:rounded-sm"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-primary sm:rounded-sm">
                <Mail className="size-5" />
              </span>

              <span>
                <span className="font-display block text-2xl leading-none">
                  {contactMessages}
                </span>

                <span className="mt-1 block text-[11px] text-neutral-400">
                  mesaje noi
                </span>
              </span>
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-7xl px-3 py-5 sm:px-6 sm:py-8 lg:px-8">
        {/* Navigație scrollabilă pe mobil */}
        <nav
          aria-label="Navigație administrare"
          className="mobile-scrollbar-hidden -mx-3 mb-6 flex gap-2 overflow-x-auto px-3 pb-2 sm:mx-0 sm:mb-8 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0"
        >
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
        </nav>

        {/* Statistici */}
        <section className="grid grid-cols-2 gap-3 sm:gap-5 xl:grid-cols-3">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <Link
                key={stat.label}
                href={stat.href}
                className="group relative min-w-0 overflow-hidden rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm transition active:scale-[0.98] hover:border-primary/40 hover:shadow-md sm:rounded-sm sm:p-6"
              >
                {stat.attention ? (
                  <span className="absolute right-3 top-3 size-2 rounded-full bg-primary shadow-[0_0_10px_rgba(255,85,0,0.7)]" />
                ) : null}

                <div className="flex items-start justify-between gap-2">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#111111] text-primary transition group-hover:bg-primary group-hover:text-white sm:size-12 sm:rounded-sm">
                    <Icon className="size-4 sm:size-5" />
                  </span>

                  <ArrowRight className="size-4 text-neutral-300 transition group-hover:translate-x-1 group-hover:text-primary" />
                </div>

                <p className="font-display mt-5 break-words text-3xl uppercase leading-none text-[#111111] sm:text-4xl">
                  {stat.value}
                </p>

                <p className="font-condensed mt-2 text-xs font-bold uppercase tracking-[0.08em] text-[#111111] sm:text-sm">
                  {stat.label}
                </p>

                <p className="mt-1 line-clamp-2 text-[11px] leading-5 text-neutral-500 sm:text-sm">
                  {stat.description}
                </p>
              </Link>
            );
          })}
        </section>

        <div className="mt-6 grid gap-6 sm:mt-8 xl:grid-cols-[minmax(0,1fr)_340px] xl:gap-8">
          {/* Ultimele comenzi */}
          <section className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm sm:rounded-sm">
            <div className="flex items-start justify-between gap-4 border-b border-neutral-200 px-4 py-5 sm:items-center sm:px-7">
              <div>
                <p className="font-condensed text-[10px] font-bold uppercase tracking-[0.16em] text-primary">
                  Activitate recentă
                </p>

                <h2 className="font-display mt-1 text-3xl uppercase leading-none text-[#111111]">
                  Ultimele comenzi
                </h2>

                <p className="mt-2 hidden text-sm text-neutral-500 sm:block">
                  Cele mai recente comenzi înregistrate.
                </p>
              </div>

              <Link
                href="/admin/comenzi"
                className="font-condensed shrink-0 text-xs font-bold uppercase tracking-[0.08em] text-primary transition active:scale-95 hover:opacity-70"
              >
                Vezi toate
              </Link>
            </div>

            {latestOrders.length === 0 ? (
              <div className="px-6 py-14 text-center">
                <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-neutral-100">
                  <ShoppingCart className="size-6 text-neutral-400" />
                </span>

                <p className="mt-4 font-semibold text-[#111111]">
                  Nu există comenzi
                </p>

                <p className="mt-1 text-sm text-neutral-500">
                  Comenzile noi vor apărea aici.
                </p>
              </div>
            ) : (
              <>
                {/* Carduri pe mobil */}
                <div className="divide-y divide-neutral-200 md:hidden">
                  {latestOrders.map((order) => (
                    <Link
                      key={order.id}
                      href={`/admin/comenzi/${order.id}`}
                      className="group block p-4 transition active:bg-neutral-50"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <p className="font-condensed truncate text-sm font-bold uppercase tracking-[0.04em] text-[#111111]">
                            {order.orderNumber}
                          </p>

                          <p className="mt-1 text-xs text-neutral-500">
                            {formatDate(order.createdAt)}
                          </p>
                        </div>

                        <span
                          className={[
                            "inline-flex shrink-0 rounded-full px-2.5 py-1 font-condensed text-[10px] font-bold uppercase tracking-[0.06em]",
                            orderStatusClasses[
                              order.status
                            ],
                          ].join(" ")}
                        >
                          {
                            orderStatusLabels[
                              order.status
                            ]
                          }
                        </span>
                      </div>

                      <div className="mt-4 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-[#111111]">
                            {order.customerName}
                          </p>

                          <p className="mt-1 text-xs text-neutral-500">
                            {order._count.items}{" "}
                            {order._count.items === 1
                              ? "produs"
                              : "produse"}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="font-condensed text-lg font-bold text-[#111111]">
                            {formatPrice(
                              Number(order.total),
                            )}
                          </p>

                          <span className="mt-1 inline-flex items-center gap-1 font-condensed text-[10px] font-bold uppercase tracking-[0.08em] text-primary">
                            Deschide
                            <ArrowRight className="size-3 transition group-hover:translate-x-1" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Tabel pe desktop */}
                <div className="hidden overflow-x-auto md:block">
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
                              {formatDate(
                                order.createdAt,
                              )}
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
                            {formatPrice(
                              Number(order.total),
                            )}
                          </td>

                          <td className="px-5 py-4">
                            <span
                              className={[
                                "inline-flex rounded-full px-3 py-1 font-condensed text-xs font-bold uppercase tracking-wider",
                                orderStatusClasses[
                                  order.status
                                ],
                              ].join(" ")}
                            >
                              {
                                orderStatusLabels[
                                  order.status
                                ]
                              }
                            </span>
                          </td>

                          <td className="px-5 py-4 text-right">
                            <Link
                              href={`/admin/comenzi/${order.id}`}
                              className="font-condensed inline-flex min-h-9 items-center justify-center rounded-sm border border-neutral-300 px-3 text-xs font-bold uppercase tracking-wider text-neutral-700 transition hover:border-primary hover:text-primary"
                            >
                              Deschide
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </section>

          <aside className="space-y-6">
            {/* Acțiuni rapide */}
            <section className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm sm:rounded-sm sm:p-6">
              <div>
                <p className="font-condensed text-[10px] font-bold uppercase tracking-[0.16em] text-primary">
                  Administrare
                </p>

                <h2 className="font-display mt-1 text-3xl uppercase text-[#111111]">
                  Acțiuni rapide
                </h2>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3 xl:grid-cols-1">
                <QuickAction
                  href="/admin/produse/nou"
                  label="Adaugă produs"
                  icon={PackagePlus}
                />

                <QuickAction
                  href="/admin/categorii/nou"
                  label="Categorie nouă"
                  icon={FolderPlus}
                />

                <QuickAction
                  href="/admin/comenzi"
                  label="Comenzi"
                  icon={ListChecks}
                />

                <QuickAction
                  href="/admin/mesaje"
                  label="Mesaje"
                  icon={MessageSquareText}
                />
              </div>
            </section>

            {/* Situație magazin */}
            <section className="overflow-hidden rounded-2xl bg-[#111111] p-5 text-white shadow-sm sm:rounded-sm sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-condensed text-[10px] font-bold uppercase tracking-[0.16em] text-primary">
                    Rezumat
                  </p>

                  <h2 className="font-display mt-1 text-3xl uppercase">
                    Situație magazin
                  </h2>
                </div>

                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-primary sm:rounded-sm">
                  <PackageCheck className="size-5" />
                </span>
              </div>

              <dl className="mt-6 space-y-4">
                <DashboardDetail
                  label="Comenzi noi"
                  value={String(newOrders)}
                  attention={newOrders > 0}
                />

                <DashboardDetail
                  label="Produse active"
                  value={String(activeProducts)}
                />

                <DashboardDetail
                  label="Produse fără stoc"
                  value={String(outOfStockProducts)}
                  attention={outOfStockProducts > 0}
                />

                <DashboardDetail
                  label="Mesaje noi"
                  value={String(contactMessages)}
                  attention={contactMessages > 0}
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
      aria-current={active ? "page" : undefined}
      className={[
        "font-condensed flex min-h-10 shrink-0 items-center justify-center rounded-full border px-4 text-xs font-bold uppercase tracking-[0.08em] transition active:scale-95 sm:rounded-sm sm:text-sm",
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
  icon: LucideIcon;
};

function QuickAction({
  href,
  label,
  icon: Icon,
}: QuickActionProps) {
  return (
    <Link
      href={href}
      className="group flex min-h-[104px] flex-col justify-between rounded-xl border border-neutral-200 bg-neutral-50 p-3 transition active:scale-[0.98] hover:border-primary/50 hover:bg-primary/[0.04] sm:rounded-sm xl:min-h-14 xl:flex-row xl:items-center xl:p-4"
    >
      <span className="flex size-10 items-center justify-center rounded-xl bg-[#111111] text-primary transition group-hover:bg-primary group-hover:text-white sm:rounded-sm">
        <Icon className="size-4" />
      </span>

      <span className="mt-3 flex items-end justify-between gap-2 xl:mt-0 xl:flex-1 xl:items-center xl:pl-3">
        <span className="font-condensed text-xs font-bold uppercase leading-5 tracking-[0.06em] text-[#111111] sm:text-sm">
          {label}
        </span>

        <ArrowRight className="size-4 shrink-0 text-neutral-400 transition group-hover:translate-x-1 group-hover:text-primary" />
      </span>
    </Link>
  );
}

type DashboardDetailProps = {
  label: string;
  value: string;
  attention?: boolean;
};

function DashboardDetail({
  label,
  value,
  attention = false,
}: DashboardDetailProps) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-3 last:border-b-0 last:pb-0">
      <dt className="flex items-center gap-2 text-sm text-neutral-400">
        <span
          className={[
            "size-1.5 rounded-full",
            attention
              ? "bg-primary shadow-[0_0_8px_rgba(255,85,0,0.7)]"
              : "bg-neutral-600",
          ].join(" ")}
        />

        {label}
      </dt>

      <dd className="font-condensed text-xl font-bold text-white">
        {value}
      </dd>
    </div>
  );
}