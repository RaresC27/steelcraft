"use server";

import { AuthError } from "next-auth";

import type { AdminLoginState } from "@/app/admin/login/form-state";
import { signIn } from "@/auth";

export async function loginAdmin(
  _previousState: AdminLoginState,
  formData: FormData,
): Promise<AdminLoginState> {
  const email = formData.get("email");
  const password =
    formData.get("password");

  if (
    typeof email !== "string" ||
    typeof password !== "string"
  ) {
    return {
      message:
        "Completează emailul și parola.",
    };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/admin",
    });

    return {
      message: "",
    };
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        message:
          "Emailul sau parola sunt incorecte.",
      };
    }

    throw error;
  }
}