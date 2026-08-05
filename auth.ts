import { compare } from "bcryptjs";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";

const credentialsSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email(),

  password: z
    .string()
    .min(1),
});

function getAdminPasswordHash() {
  const encodedHash =
    process.env.ADMIN_PASSWORD_HASH_BASE64?.trim();

  if (!encodedHash) {
    return null;
  }

  try {
    const decodedHash = Buffer.from(
      encodedHash,
      "base64",
    ).toString("utf8");

    if (
      decodedHash.length !== 60 ||
      !decodedHash.startsWith("$2")
    ) {
      console.error(
        "ADMIN_PASSWORD_HASH_BASE64 nu conține un hash bcrypt valid.",
        {
          hashLength: decodedHash.length,
          startsWithBcryptPrefix:
            decodedHash.startsWith("$2"),
        },
      );

      return null;
    }

    return decodedHash;
  } catch (error) {
    console.error(
      "ADMIN_PASSWORD_HASH_BASE64 nu a putut fi decodat.",
      error,
    );

    return null;
  }
}

export const {
  handlers,
  auth,
  signIn,
  signOut,
} = NextAuth({
  secret: process.env.AUTH_SECRET,

  pages: {
    signIn: "/admin/login",
  },

  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 8,
  },

  providers: [
    Credentials({
      credentials: {
        email: {
          label: "Email",
          type: "email",
        },

        password: {
          label: "Parolă",
          type: "password",
        },
      },

      async authorize(credentials) {
        const parsed =
          credentialsSchema.safeParse(credentials);

        if (!parsed.success) {
          console.warn(
            "Login respins: datele introduse nu sunt valide.",
          );

          return null;
        }

        const adminEmail =
          process.env.ADMIN_EMAIL
            ?.trim()
            .toLowerCase();

        const adminPasswordHash =
          getAdminPasswordHash();

        if (!adminEmail || !adminPasswordHash) {
          console.error(
            "Configurația administratorului lipsește sau este invalidă.",
            {
              hasAdminEmail: Boolean(adminEmail),
              hasPasswordHash:
                Boolean(adminPasswordHash),
            },
          );

          return null;
        }

        const emailMatches =
          parsed.data.email === adminEmail;

        if (!emailMatches) {
          console.warn(
            "Login respins: date de autentificare incorecte.",
          );

          return null;
        }

        const passwordIsValid = await compare(
          parsed.data.password,
          adminPasswordHash,
        );

        console.log("Verificare autentificare admin:", {
          emailMatches,
          passwordIsValid,
          hashLength: adminPasswordHash.length,
        });

        if (!passwordIsValid) {
          return null;
        }

        return {
          id: "steelcraft-admin",
          name: "Administrator SteelCraft",
          email: adminEmail,
        };
      },
    }),
  ],

  callbacks: {
    authorized({ auth: session, request }) {
      const pathname = request.nextUrl.pathname;

      const isLoginPage =
        pathname === "/admin/login";

      const isProtectedAdminPage =
        pathname.startsWith("/admin") &&
        !isLoginPage;

      const isAuthenticated =
        Boolean(session?.user);

      if (isLoginPage && isAuthenticated) {
        return Response.redirect(
          new URL("/admin", request.nextUrl),
        );
      }

      if (isProtectedAdminPage) {
        return isAuthenticated;
      }

      return true;
    },
  },
});