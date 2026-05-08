import "server-only";

import { notFound, redirect } from "next/navigation";
import { getCurrentSession } from "@/lib/auth/current-session";
import type { Locale } from "@/lib/i18n/config";
import { localizedPath } from "@/lib/navigation";

export async function requireUser(locale: Locale, nextPath = "/profile") {
  const session = await getCurrentSession();

  if (!session) {
    redirect(localizedPath(locale, `/login?next=${encodeURIComponent(nextPath)}`));
  }

  return session;
}

export async function requireAdmin(locale: Locale, nextPath = "/admin") {
  const session = await requireUser(locale, nextPath);

  if (session.role !== "ADMIN") {
    notFound();
  }

  return session;
}
