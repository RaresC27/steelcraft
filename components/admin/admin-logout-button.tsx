import { LogOut } from "lucide-react";

import { signOut } from "@/auth";

export function AdminLogoutButton() {
  return (
    <form
      action={async () => {
        "use server";

        await signOut({
          redirectTo: "/admin/login",
        });
      }}
    >
      <button
        type="submit"
        className="font-condensed inline-flex min-h-10 items-center justify-center gap-2 rounded-sm border border-red-300 bg-white px-4 text-xs font-bold uppercase tracking-wider text-red-700 transition hover:bg-red-600 hover:text-white"
      >
        <LogOut className="size-4" />
        Deconectare
      </button>
    </form>
  );
}