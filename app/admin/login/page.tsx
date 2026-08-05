import {
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";

import { AdminLoginForm } from "@/components/admin/admin-login-form";

export default function AdminLoginPage() {
  return (
    <main className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-[#0b0b0b] px-3 py-6 text-white sm:px-6 sm:py-10">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-1 bg-primary"
      />

      <div
        aria-hidden="true"
        className="absolute -right-20 -top-24 size-72 rounded-full bg-primary/10 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="absolute -bottom-28 -left-24 size-80 rounded-full bg-white/[0.04] blur-3xl"
      />

      <section className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-white p-5 text-[#111111] shadow-[0_24px_80px_rgba(0,0,0,0.42)] sm:rounded-sm sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-[#111111] text-primary sm:size-14 sm:rounded-sm">
            <ShieldCheck className="size-5 sm:size-6" />
          </span>

          <div className="flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1.5">
            <LockKeyhole className="size-3.5 text-primary" />

            <span className="font-condensed text-[10px] font-bold uppercase tracking-[0.12em] text-neutral-600">
              Acces securizat
            </span>
          </div>
        </div>

        <div className="mt-6 sm:mt-7">
          <p className="font-condensed text-xs font-bold uppercase tracking-[0.18em] text-primary sm:text-sm">
            SteelCraft Admin
          </p>

          <h1 className="font-display mt-2 text-[2.7rem] uppercase leading-[0.9] text-[#111111] sm:text-5xl">
            Autentificare
          </h1>

          <p className="mt-4 text-sm leading-6 text-neutral-600 sm:leading-7">
            Introdu datele administratorului pentru a accesa
            comenzile, produsele și mesajele.
          </p>
        </div>

        <div className="mt-6 sm:mt-8">
          <AdminLoginForm />
        </div>

        <div className="mt-6 border-t border-neutral-200 pt-4">
          <p className="text-center text-xs leading-5 text-neutral-500">
            Accesul este permis doar administratorilor autorizați.
          </p>
        </div>
      </section>
    </main>
  );
}