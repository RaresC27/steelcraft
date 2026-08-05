import {
  ShieldCheck,
} from "lucide-react";

import { AdminLoginForm } from "@/components/admin/admin-login-form";

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-100 px-4 py-12">
      <section className="w-full max-w-md border border-neutral-200 bg-white p-6 shadow-[0_24px_80px_rgba(0,0,0,0.12)] sm:p-8">
        <span className="flex size-14 items-center justify-center rounded-sm bg-[#111111] text-primary">
          <ShieldCheck className="size-6" />
        </span>

        <p className="font-condensed mt-7 text-sm font-bold uppercase tracking-[0.2em] text-primary">
          SteelCraft Admin
        </p>

        <h1 className="font-display mt-2 text-5xl uppercase leading-none text-[#111111]">
          Autentificare
        </h1>

        <p className="mt-4 text-sm leading-7 text-neutral-600">
          Introdu datele administratorului pentru a accesa
          comenzile, produsele și mesajele.
        </p>

        <AdminLoginForm />
      </section>
    </main>
  );
}