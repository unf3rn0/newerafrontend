"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { Locale } from "@/lib/i18n/config";
import { getSafeNextPath, localizedPath } from "@/lib/navigation";
import { assertAuthRateLimit } from "@/lib/auth/rate-limit";
import { createSessionToken, sessionCookieName, sessionMaxAgeSeconds } from "@/lib/auth/session";
import { registerSchema } from "@/lib/validation/auth";

function redirectToRegisterError(
  locale: Locale,
  error: "exists" | "invalid" | "rate",
  nextPath: string | null,
): never {
  const query = new URLSearchParams({ error });

  if (nextPath) {
    query.set("next", nextPath);
  }

  redirect(localizedPath(locale, `/register?${query.toString()}`));
}

export async function registerAction(locale: Locale, formData: FormData) {
  const nextPath = getSafeNextPath(formData.get("next"));
  const isAllowed = await assertAuthRateLimit("register");

  if (!isAllowed) {
    redirectToRegisterError(locale, "rate", nextPath);
  }

  const parsed = registerSchema.safeParse({
    email: formData.get("email"),
    login: formData.get("login"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    redirectToRegisterError(locale, "invalid", nextPath);
  }

  const [{ prisma }, { hashPassword }] = await Promise.all([
    import("@/lib/db"),
    import("@/lib/auth/password"),
  ]);

  const existingUser = await prisma.user.findFirst({
    select: { id: true },
    where: {
      OR: [{ email: parsed.data.email }, { login: parsed.data.login }],
    },
  });

  if (existingUser) {
    redirectToRegisterError(locale, "exists", nextPath);
  }

  const passwordHash = await hashPassword(parsed.data.password);
  const user = await prisma.user.create({
    data: {
      email: parsed.data.email,
      login: parsed.data.login,
      passwordHash,
      role: "USER",
    },
    select: {
      id: true,
      login: true,
      role: true,
    },
  });
  const sessionToken = createSessionToken({
    login: user.login,
    role: user.role,
    userId: user.id,
  });
  const cookieStore = await cookies();

  cookieStore.set(sessionCookieName, sessionToken, {
    httpOnly: true,
    maxAge: sessionMaxAgeSeconds,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  redirect(localizedPath(locale, nextPath ?? "/profile"));
}
