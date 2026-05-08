import { siteConfig } from "@/config/site";
import type { Locale } from "@/lib/i18n/config";

const localeMap: Record<Locale, string> = {
  en: "en-US",
  ru: "ru-RU",
  tg: "tg-Cyrl-TJ",
};

export function formatMoney(amount: number, locale: Locale, currency = siteConfig.currency) {
  return new Intl.NumberFormat(localeMap[locale], {
    currency,
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
    style: "currency",
  }).format(amount);
}
