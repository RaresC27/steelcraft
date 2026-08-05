import "server-only";

import { redirect } from "next/navigation";

import { auth } from "@/auth";

export async function requireAdmin() {
  const session = await auth();

  if (
    !session?.user ||
    session.user.email !==
      process.env.ADMIN_EMAIL?.trim().toLowerCase()
  ) {
    redirect("/admin/login");
  }

  return session;
}

export async function isAdminAuthenticated() {
  const session = await auth();

  return Boolean(
    session?.user &&
      session.user.email ===
        process.env.ADMIN_EMAIL?.trim().toLowerCase(),
  );
}