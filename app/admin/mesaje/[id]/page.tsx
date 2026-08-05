    import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Mail,
  Package,
  Phone,
  User,
} from "lucide-react";

import { ContactMessageStatusForm } from "@/components/admin/contact-message-status-form";
import { prisma } from "@/lib/prisma";

const statusLabels = {
  NEW: "Nou",
  READ: "Citit",
  ANSWERED: "Răspuns",
  ARCHIVED: "Arhivat",
} as const;

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("ro-RO", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(value);
}

type ContactMessagePageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ContactMessagePage({
  params,
}: ContactMessagePageProps) {
  const { id } = await params;
  const messageId = Number(id);

  if (!Number.isInteger(messageId) || messageId <= 0) {
    notFound();
  }

  const message =
    await prisma.contactMessage.findUnique({
      where: {
        id: messageId,
      },
      include: {
        product: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
    });

  if (!message) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-neutral-100 py-10">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <header className="mb-8">
          <Link
            href="/admin/mesaje"
            className="font-condensed text-sm font-bold uppercase tracking-[0.1em] text-neutral-500 transition hover:text-primary"
          >
            ← Înapoi la mesaje
          </Link>

          <p className="font-condensed mt-6 text-sm font-bold uppercase tracking-[0.2em] text-primary">
            Detalii mesaj
          </p>

          <h1 className="font-display mt-2 text-5xl uppercase text-[#111111]">
            {message.subject}
          </h1>

          <p className="mt-2 text-neutral-600">
            Primit la {formatDate(message.createdAt)}
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="space-y-6">
            <section className="border border-neutral-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="border-b border-neutral-200 pb-4">
                <h2 className="font-display text-3xl uppercase text-[#111111]">
                  Mesaj
                </h2>
              </div>

              <p className="mt-6 whitespace-pre-wrap text-base leading-8 text-neutral-700">
                {message.message}
              </p>
            </section>

            <section className="border border-neutral-200 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="font-display text-3xl uppercase text-[#111111]">
                Date expeditor
              </h2>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <ContactDetail
                  icon={User}
                  label="Nume"
                  value={message.name}
                />

                <ContactDetail
                  icon={Mail}
                  label="Email"
                  value={message.email}
                  href={`mailto:${message.email}`}
                />

                <ContactDetail
                  icon={Phone}
                  label="Telefon"
                  value={message.phone || "—"}
                  href={
                    message.phone
                      ? `tel:${message.phone}`
                      : undefined
                  }
                />

                <ContactDetail
                  icon={Package}
                  label="Produs"
                  value={
                    message.product?.name ||
                    "Solicitare generală"
                  }
                  href={
                    message.product
                      ? `/produse/${message.product.slug}`
                      : undefined
                  }
                />
              </div>
            </section>
          </div>

          <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
            <section className="border border-neutral-200 bg-white p-6 shadow-sm">
              <h2 className="font-display text-3xl uppercase text-[#111111]">
                Administrare
              </h2>

              <div className="mt-5">
                <ContactMessageStatusForm
                  messageId={message.id}
                  currentStatus={message.status}
                />
              </div>
            </section>

            <section className="border border-neutral-200 bg-[#111111] p-6 text-white shadow-sm">
              <p className="font-condensed text-xs font-bold uppercase tracking-[0.16em] text-primary">
                Status curent
              </p>

              <p className="font-display mt-3 text-3xl uppercase">
                {statusLabels[message.status]}
              </p>

              <p className="mt-3 text-sm leading-6 text-neutral-400">
                Actualizat la {formatDate(message.updatedAt)}
              </p>
            </section>

            <section className="border border-neutral-200 bg-white p-6 shadow-sm">
              <h2 className="font-display text-3xl uppercase text-[#111111]">
                Contact rapid
              </h2>

              <div className="mt-5 space-y-3">
                <a
                  href={`mailto:${message.email}?subject=${encodeURIComponent(
                    `Re: ${message.subject}`,
                  )}`}
                  className="font-condensed flex min-h-11 items-center justify-center bg-primary px-4 text-sm font-bold uppercase tracking-wider text-white transition hover:opacity-90"
                >
                  Răspunde prin email
                </a>

                {message.phone ? (
                  <a
                    href={`tel:${message.phone}`}
                    className="font-condensed flex min-h-11 items-center justify-center border border-[#111111] px-4 text-sm font-bold uppercase tracking-wider text-[#111111] transition hover:bg-[#111111] hover:text-white"
                  >
                    Sună clientul
                  </a>
                ) : null}
              </div>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}

type ContactDetailProps = {
  icon: React.ComponentType<{
    className?: string;
  }>;
  label: string;
  value: string;
  href?: string;
};

function ContactDetail({
  icon: Icon,
  label,
  value,
  href,
}: ContactDetailProps) {
  const content = (
    <div className="flex items-start gap-3">
      <span className="flex size-10 shrink-0 items-center justify-center bg-neutral-100 text-primary">
        <Icon className="size-4" />
      </span>

      <div>
        <p className="font-condensed text-xs font-bold uppercase tracking-wider text-neutral-500">
          {label}
        </p>

        <p className="mt-1 break-words text-sm font-semibold text-[#111111]">
          {value}
        </p>
      </div>
    </div>
  );

  if (!href) {
    return content;
  }

  if (
    href.startsWith("mailto:") ||
    href.startsWith("tel:")
  ) {
    return (
      <a
        href={href}
        className="transition hover:text-primary"
      >
        {content}
      </a>
    );
  }

  return (
    <Link
      href={href}
      className="transition hover:text-primary"
    >
      {content}
    </Link>
  );
}