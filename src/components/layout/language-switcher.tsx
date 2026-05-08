"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, type Locale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

const labels: Record<Locale, string> = {
  en: "EN",
  ru: "RU",
  tg: "TG",
};

export function LanguageSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const segments = pathname.split("/");

  return (
    <div className="inline-flex w-fit rounded-full border border-border bg-white p-1">
      {locales.map((item) => {
        segments[1] = item;
        const href = segments.join("/") || `/${item}`;

        return (
          <Link
            aria-current={item === locale ? "page" : undefined}
            className={cn(
              "flex h-7 min-w-9 items-center justify-center rounded-full px-2 text-xs font-medium transition",
              item === locale
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-surface-strong hover:text-foreground",
            )}
            href={href}
            key={item}
          >
            {labels[item]}
          </Link>
        );
      })}
    </div>
  );
}
