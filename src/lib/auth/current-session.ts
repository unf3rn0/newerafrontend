import "server-only";

import { cookies } from "next/headers";
import { sessionCookieName, verifySessionToken } from "@/lib/auth/session";

export async function getCurrentSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(sessionCookieName)?.value;

  if (!token) {
    return null;
  }

  return verifySessionToken(token);
}
