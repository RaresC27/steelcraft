import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ExternalLink,
  FileText,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

import { CustomProjectStatusForm } from "@/components/admin/custom-project-status-form";
import { prisma } from "@/lib/prisma";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("ro-RO", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(date);
}

function formatDimension(
  value: unknown,
  unit: string | null,
) {
  if (value === null || value === undefined) {
    return "—";
  }

  return `${Number(value)} ${unit ?? ""}`.trim();
}

export default async function CustomProjectRequestPage({
  params,
}: PageProps) {
  const { id } = await params;

  const requestId = Number(id);

  if (
    !Number.isInteger(requestId) ||
    requestId <= 0
  ) {
    notFound();
  }

  const request =
    await prisma.customProjectRequest.findUnique({
      where: {
        id: requestId,
      },

      select: {
        id: true,
        requestNumber: true,

        projectType: true,
        material: true,
        finish: true,
        usage: true,

        lengthValue: true,
        widthValue: true,
        heightValue: true,
        dimensionUnit: true,

        quantity: true,
        needsRecommendation: true,

        customerName: true,
        email: true,
        phone: true,

        company: true,
        vatNumber: true,

        county: true,
        city: true,

        notes: true,

        status: true,
        createdAt: true,
        updatedAt: true,

        files: {
          select: {
            id: true,
            url: true,
            fileName: true,
            mimeType: true,
            size: true,
          },

          orderBy: {
            position: "asc",
          },
        },
      },
    });

  if (!request) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-neutral-100 py-6 sm:py-10">
      <div className="mx-auto w-full max-w-5xl px-3 sm:px-6 lg:px-8">
        <Link
          href="/admin/cereri-personalizate"
          className="font-condensed text-xs font-bold uppercase tracking-[0.08em] text-neutral-500 transition hover:text-primary"
        >
          ← Înapoi la cereri
        </Link>

        <header className="mt-5 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm sm:rounded-sm sm:p-7">
          <p className="font-condensed text-xs font-bold uppercase tracking-[0.14em] text-primary">
            {request.requestNumber}
          </p>

          <h1 className="font-display mt-2 text-4xl uppercase leading-none text-[#111111] sm:text-5xl">
            {request.projectType}
          </h1>

          <p className="mt-3 text-sm text-neutral-500">
            Trimisă la{" "}
            {formatDate(
              request.createdAt,
            )}
          </p>

          <div className="mt-5">
            <CustomProjectStatusForm
              requestId={request.id}
              currentStatus={request.status}
            />
          </div>
        </header>

        <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_0.75fr]">
          <div className="space-y-5">
            <AdminSection title="Detalii proiect">
              <InfoGrid>
                <InfoItem
                  label="Tip proiect"
                  value={
                    request.projectType
                  }
                />

                <InfoItem
                  label="Material"
                  value={
                    request.material ??
                    "De stabilit"
                  }
                />

                <InfoItem
                  label="Finisaj"
                  value={
                    request.finish ??
                    "De stabilit"
                  }
                />

                <InfoItem
                  label="Utilizare"
                  value={
                    request.usage ??
                    "Nespecificată"
                  }
                />

                <InfoItem
                  label="Cantitate"
                  value={
                    request.quantity
                      ? `${request.quantity} buc.`
                      : "De stabilit"
                  }
                />

                <InfoItem
                  label="Recomandare"
                  value={
                    request.needsRecommendation
                      ? "Da"
                      : "Nu"
                  }
                />
              </InfoGrid>
            </AdminSection>

            <AdminSection title="Dimensiuni">
              <div className="grid grid-cols-3 gap-3">
                <DimensionCard
                  label="L"
                  value={formatDimension(
                    request.lengthValue,
                    request.dimensionUnit,
                  )}
                />

                <DimensionCard
                  label="l"
                  value={formatDimension(
                    request.widthValue,
                    request.dimensionUnit,
                  )}
                />

                <DimensionCard
                  label="H"
                  value={formatDimension(
                    request.heightValue,
                    request.dimensionUnit,
                  )}
                />
              </div>
            </AdminSection>

            <AdminSection title="Descriere">
              <p className="whitespace-pre-line text-sm leading-7 text-neutral-700">
                {request.notes ??
                  "Nu au fost adăugate observații."}
              </p>
            </AdminSection>

            {request.files.length > 0 ? (
              <AdminSection title="Fișiere">
                <div className="space-y-2">
                  {request.files.map(
                    (file) => (
                      <a
                        key={file.id}
                        href={file.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-between gap-3 rounded-xl border border-neutral-200 p-3 transition hover:border-primary"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <FileText className="size-5 shrink-0 text-primary" />

                          <span className="truncate text-sm font-semibold text-[#111111]">
                            {
                              file.fileName
                            }
                          </span>
                        </div>

                        <ExternalLink className="size-4 shrink-0 text-neutral-500" />
                      </a>
                    ),
                  )}
                </div>
              </AdminSection>
            ) : null}
          </div>

          <aside className="space-y-5">
            <AdminSection title="Client">
              <p className="font-condensed text-xl font-bold uppercase text-[#111111]">
                {request.customerName}
              </p>

              <div className="mt-4 space-y-3">
                <a
                  href={`tel:${request.phone}`}
                  className="flex items-center gap-3 text-sm text-neutral-700 transition hover:text-primary"
                >
                  <Phone className="size-4 text-primary" />
                  {request.phone}
                </a>

                <a
                  href={`mailto:${request.email}`}
                  className="flex min-w-0 items-center gap-3 text-sm text-neutral-700 transition hover:text-primary"
                >
                  <Mail className="size-4 shrink-0 text-primary" />

                  <span className="truncate">
                    {request.email}
                  </span>
                </a>

                <div className="flex items-start gap-3 text-sm text-neutral-700">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />

                  <span>
                    {request.city
                      ? `${request.city}, `
                      : ""}
                    {request.county ??
                      "Locație nespecificată"}
                  </span>
                </div>
              </div>
            </AdminSection>

            {(request.company ||
              request.vatNumber) && (
              <AdminSection title="Firmă">
                <InfoItem
                  label="Denumire"
                  value={
                    request.company ??
                    "—"
                  }
                />

                <div className="mt-4">
                  <InfoItem
                    label="CUI / CIF"
                    value={
                      request.vatNumber ??
                      "—"
                    }
                  />
                </div>
              </AdminSection>
            )}
          </aside>
        </div>
      </div>
    </main>
  );
}

function AdminSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm sm:rounded-sm sm:p-6">
      <h2 className="font-display text-2xl uppercase leading-none text-[#111111]">
        {title}
      </h2>

      <div className="mt-4">
        {children}
      </div>
    </section>
  );
}

function InfoGrid({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {children}
    </div>
  );
}

function InfoItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-neutral-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold text-[#111111]">
        {value}
      </p>
    </div>
  );
}

function DimensionCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-neutral-100 p-3 text-center">
      <p className="font-condensed text-xs font-bold uppercase text-neutral-400">
        {label}
      </p>

      <p className="font-condensed mt-1 text-lg font-bold text-[#111111]">
        {value}
      </p>
    </div>
  );
}