"use server";

import { revalidatePath } from "next/cache";
import { getCurrentSession } from "@/lib/auth/current-session";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { prisma } from "@/lib/db";
import type { Locale } from "@/lib/i18n/config";
import { localizedPath } from "@/lib/navigation";
import { changePasswordSchema } from "@/lib/validation/auth";

export type ChangePasswordError = "auth" | "current" | "invalid" | "same";

export type ChangePasswordState =
  | { status: "idle" }
  | { status: "success" }
  | { error: ChangePasswordError; status: "error" };

export async function changePasswordAction(
  locale: Locale,
  _state: ChangePasswordState,
  formData: FormData,
): Promise<ChangePasswordState> {
  const session = await getCurrentSession();

  if (!session) {
    return { error: "auth", status: "error" };
  }

  const parsed = changePasswordSchema.safeParse({
    confirmPassword: formData.get("confirmPassword"),
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
  });

  if (!parsed.success) {
    return { error: "invalid", status: "error" };
  }

  const user = await prisma.user.findUnique({
    select: { passwordHash: true },
    where: { id: session.userId },
  });

  if (!user) {
    return { error: "auth", status: "error" };
  }

  const isCurrentPasswordValid = await verifyPassword(
    parsed.data.currentPassword,
    user.passwordHash,
  );

  if (!isCurrentPasswordValid) {
    return { error: "current", status: "error" };
  }

  const isSamePassword = await verifyPassword(parsed.data.newPassword, user.passwordHash);

  if (isSamePassword) {
    return { error: "same", status: "error" };
  }

  const passwordHash = await hashPassword(parsed.data.newPassword);

  await prisma.user.update({
    data: { passwordHash },
    where: { id: session.userId },
  });

  revalidatePath(localizedPath(locale, "/profile"));

  return { status: "success" };
}
