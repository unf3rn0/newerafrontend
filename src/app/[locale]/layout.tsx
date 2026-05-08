import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { SiteShell } from "@/components/layout/site-shell";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { isLocale, locales, type Locale } from "@/lib/i18n/config";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;

  if (!isLocale(localeParam)) {
    notFound();
  }

  const locale: Locale = localeParam;
  const dictionary = await getDictionary(locale);

  return (
    <SiteShell dictionary={dictionary} locale={locale}>
      {children}
    </SiteShell>
  );
}
