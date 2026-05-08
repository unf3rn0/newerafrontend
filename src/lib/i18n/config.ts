export const locales = ["ru", "en", "tg"] as const;
export const defaultLocale = "ru" satisfies (typeof locales)[number];

export type Locale = (typeof locales)[number];

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}
