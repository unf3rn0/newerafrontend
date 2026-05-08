import "server-only";

import ru from "@/messages/ru.json";
import { defaultLocale, type Locale } from "./config";

export type Dictionary = typeof ru;

const dictionaries = {
  ru: () => import("@/messages/ru.json").then((module) => module.default),
  en: () => import("@/messages/en.json").then((module) => module.default),
  tg: () => import("@/messages/tg.json").then((module) => module.default),
} satisfies Record<Locale, () => Promise<Dictionary>>;

export async function getDictionary(locale: Locale) {
  return dictionaries[locale]();
}

export async function getDefaultDictionary() {
  return getDictionary(defaultLocale);
}
