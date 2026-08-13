import Link from "next/link";
import {
  ArrowRight,
  FileText,
} from "lucide-react";

import { prisma } from "@/lib/prisma";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("ro-RO", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function getStatusLabel(status: string) {
  switch (status) {
    case "NEW":
      return "Nouă";

    case "REVIEWING":
      return "În analiză";

    case "QUOTED":
      return "Ofertată";

    case "ACCEPTED":
      return "Acceptată";

    case "REJECTED":
      return "Respinsă";

    case "ARCHIVED":
      return "Arhivată";

    default:
      return status;
  }
}

function getStatusClassName(status: string) {
  switch (status) {
    case "NEW":
      return "bg-orange-100 text-orange-700";

    case "REVIEWING":
      return "bg-blue-100 text-blue-700";

    case "QUOTED":
      return "bg-violet-100 text-violet-700";

    case "ACCEPTED":
      return "bg-green-100 text-green-700";

    case "REJECTED":
      return "bg-red-100 text-red-700";

    default:
      return "bg-neutral-100 text-neutral-600";
  }
}

export default async function CustomProjectsAdminPage() {
  const requests =
    await prisma.customProjectRequest.findMany({
      select: {
        id: true,
        requestNumber: true,
        projectType: true,

        customerName: true,
        email: true,
        phone: true,

        county: true,
        city: true,

        status: true,
        createdAt: true,

        _count: {
          select: {
            files: true,
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });

  return (
    <main className="min-h-screen bg-neutral-100 py-6 sm:py-10">
      <div className="mx-auto w-full max-w-7xl px-3 sm:px-6 lg:px-8">
        <header className="mb-6 sm:mb-8">
          <p className="font-condensed text-xs font-bold uppercase tracking-[0.18em] text-primary">
            SteelCraft Admin
          </p>

          <h1 className="font-display mt-2 text-4xl uppercase leading-none text-[#111111] sm:text-5xl">
            Cereri la comandă
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-600">
            Vezi proiectele personalizate trimise de clienți
            și urmărește statusul fiecărei cereri.
          </p>
        </header>

        {requests.length > 0 ? (
          <div className="space-y-3">
            {requests.map((request) => (
              <Link
                key={request.id}
                href={`/admin/cereri-personalizate/${request.id}`}
                className="group block rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm transition hover:border-primary hover:shadow-md sm:rounded-sm sm:p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={[
                          "rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.06em]",
                          getStatusClassName(
                            request.status,
                          ),
                        ].join(" ")}
                      >
                        {getStatusLabel(
                          request.status,
                        )}
                      </span>

                      <span className="font-condensed text-xs font-bold uppercase tracking-[0.08em] text-neutral-400">
                        {request.requestNumber}
                      </span>
                    </div>

                    <h2 className="font-condensed mt-3 text-lg font-bold uppercase leading-tight text-[#111111] sm:text-xl">
                      {request.projectType}
                    </h2>

                    <p className="mt-2 text-sm font-semibold text-[#111111]">
                      {request.customerName}
                    </p>

                    <p className="mt-1 text-sm text-neutral-500">
                      {request.city && request.county
                        ? `${request.city}, ${request.county}`
                        : request.county ?? "Locație nespecificată"}
                    </p>
                  </div>

                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-[#111111] transition group-hover:bg-primary group-hover:text-white">
                    <ArrowRight className="size-4" />
                  </span>
                </div>

                <div className="mt-4 grid gap-2 border-t border-neutral-200 pt-4 text-xs text-neutral-500 sm:grid-cols-3">
                  <span>
                    {formatDate(
                      request.createdAt,
                    )}
                  </span>

                  <span className="truncate">
                    {request.email}
                  </span>

                  <span className="flex items-center gap-1.5">
                    <FileText className="size-3.5" />
                    {request._count.files} fișiere
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-neutral-200 bg-white px-5 py-14 text-center shadow-sm">
            <FileText className="mx-auto size-8 text-neutral-400" />

            <h2 className="font-display mt-4 text-3xl uppercase text-[#111111]">
              Nu există cereri
            </h2>

            <p className="mt-2 text-sm text-neutral-600">
              Cererile trimise prin pagina „La comandă” vor
              apărea aici.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}