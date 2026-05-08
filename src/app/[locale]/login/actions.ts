"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { Locale } from "@/lib/i18n/config";
import { getSafeNextPath, localizedPath } from "@/lib/navigation";
import { assertAuthRateLimit } from "@/lib/auth/rate-limit";
import { createSessionToken, sessionCookieName, sessionMaxAgeSeconds } from "@/lib/auth/session";
import { loginSchema } from "@/lib/validation/auth";

function redirectToInvalidLogin(
  locale: Locale,
  nextPath: string | null,
  error: "invalid" | "rate" = "invalid",
): never {
  const query = new URLSearchParams({ error });

  if (nextPath) {
    query.set("next", nextPath);
  }

  redirect(localizedPath(locale, `/login?${query.toString()}`));
}

export async function loginAction(locale: Locale, formData: FormData) {
  const nextPath = getSafeNextPath(formData.get("next"));
  const isAllowed = await assertAuthRateLimit("login");

  if (!isAllowed) {
    redirectToInvalidLogin(locale, nextPath, "rate");
  }

  const parsed = loginSchema.safeParse({
    login: formData.get("login"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    redirectToInvalidLogin(locale, nextPath);
  }

  const [{ prisma }, { verifyPassword }] = await Promise.all([
    import("@/lib/db"),
    import("@/lib/auth/password"),
  ]);

  const user = await prisma.user.findUnique({
    select: {
      id: true,
      login: true,
      passwordHash: true,
      role: true,
    },
    where: { login: parsed.data.login },
  });

  if (!user) {
    redirectToInvalidLogin(locale, nextPath);
  }

  const isValidPassword = await verifyPassword(parsed.data.password, user.passwordHash);

  if (!isValidPassword) {
    redirectToInvalidLogin(locale, nextPath);
  }

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
