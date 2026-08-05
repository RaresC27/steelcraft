"use client";

import {
  useActionState,
} from "react";
import {
  LockKeyhole,
  LogIn,
  Mail,
} from "lucide-react";

import { loginAdmin } from "@/app/admin/login/action";
import { initialAdminLoginState } from "@/app/admin/login/form-state";

export function AdminLoginForm() {
  const [
    state,
    formAction,
    isPending,
  ] = useActionState(
    loginAdmin,
    initialAdminLoginState,
  );

  return (
    <form
      action={formAction}
      className="mt-8 space-y-5"
    >
      <div>
        <label
          htmlFor="email"
          className="font-condensed mb-2 block text-sm font-bold uppercase tracking-[0.1em] text-[#111111]"
        >
          Email
        </label>

        <div className="relative">
          <Mail className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />

          <input
            id="email"
            name="email"
            type="email"
            autoComplete="username"
            required
            className="h-12 w-full rounded-sm border border-neutral-300 bg-white pl-11 pr-4 text-sm text-[#111111] outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
            placeholder="admin@steelcraft.ro"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="password"
          className="font-condensed mb-2 block text-sm font-bold uppercase tracking-[0.1em] text-[#111111]"
        >
          Parolă
        </label>

        <div className="relative">
          <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />

          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="h-12 w-full rounded-sm border border-neutral-300 bg-white pl-11 pr-4 text-sm text-[#111111] outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
            placeholder="Parola administratorului"
          />
        </div>
      </div>

      {state.message ? (
        <div
          role="alert"
          className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {state.message}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={isPending}
        className="font-condensed inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-sm bg-primary px-6 text-sm font-bold uppercase tracking-[0.12em] text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <LogIn className="size-4" />

        {isPending
          ? "Se verifică..."
          : "Autentificare"}
      </button>
    </form>
  );
}