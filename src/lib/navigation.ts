import type { Locale } from "@/lib/i18n/config";

export function localizedPath(locale: Locale, path = "/") {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  if (normalizedPath === "/") {
    return `/${locale}`;
  }

  return `/${locale}${normalizedPath}`;
}

export function getSafeNextPath(value: FormDataEntryValue | string | string[] | undefined | null) {
  const nextPath = Array.isArray(value) ? value[0] : value;

  if (typeof nextPath !== "string") {
    return null;
  }

  if (!nextPath.startsWith("/") || nextPath.startsWith("//") || nextPath.includes("://")) {
    return null;
  }

  return nextPath;
}
