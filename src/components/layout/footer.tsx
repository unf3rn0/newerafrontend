import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";
import { localizedPath } from "@/lib/navigation";

type FooterProps = {
  dictionary: Dictionary;
  locale: Locale;
};

export function Footer({ dictionary, locale }: FooterProps) {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.3fr_0.8fr_0.8fr_0.8fr]">
        <div className="max-w-sm">
          <div className="flex items-center gap-3">
            <Image
              alt={dictionary.common.brand}
              className="shrink-0"
              height={55}
              src={siteConfig.assets.logo}
              style={{ height: "48px", width: "auto" }}
              width={72}
            />
            <p className="text-xl font-semibold">{dictionary.common.brand}</p>
          </div>
          <p className="mt-4 text-sm leading-6 text-muted-foreground">
            {dictionary.footer.brandText}
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold">{dictionary.footer.contact}</p>
          <div className="mt-4 space-y-3 text-sm text-muted-foreground">
            <Link
              className="flex items-center gap-2 transition hover:text-foreground"
              href={siteConfig.contacts.instagram}
            >
              <Image
                alt=""
                aria-hidden="true"
                className="h-5 w-5"
                height={20}
                src={siteConfig.assets.icons.instagram}
                width={20}
              />
              {dictionary.common.instagram}
            </Link>
            <Link
              className="flex items-center gap-2 transition hover:text-foreground"
              href={`tel:${siteConfig.contacts.phone}`}
            >
              <Image
                alt=""
                aria-hidden="true"
                className="h-5 w-5"
                height={20}
                src={siteConfig.assets.icons.phone}
                width={20}
              />
              {siteConfig.contacts.phoneDisplay}
            </Link>
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold">{dictionary.footer.customerCare}</p>
          <div className="mt-4 space-y-3 text-sm text-muted-foreground">
            <Link
              className="block transition hover:text-foreground"
              href={localizedPath(locale, "/catalog")}
            >
              {dictionary.nav.catalog}
            </Link>
            <Link
              className="block transition hover:text-foreground"
              href={localizedPath(locale, "/catalog?new=true")}
            >
              {dictionary.nav.new}
            </Link>
            <Link
              className="block transition hover:text-foreground"
              href={localizedPath(locale, "/catalog?popular=true")}
            >
              {dictionary.nav.popular}
            </Link>
            <Link
              className="block transition hover:text-foreground"
              href={localizedPath(locale, "/privacy")}
            >
              {dictionary.footer.privacy}
            </Link>
            <Link
              className="block transition hover:text-foreground"
              href={localizedPath(locale, "/terms")}
            >
              {dictionary.footer.terms}
            </Link>
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold">{dictionary.footer.language}</p>
          <div className="mt-4">
            <LanguageSwitcher locale={locale} />
          </div>
        </div>
      </div>
      <div className="border-t border-border px-4 py-5 text-center text-xs text-muted-foreground sm:px-6">
        © {new Date().getFullYear()} {dictionary.common.brand}. {dictionary.footer.copyright}
      </div>
    </footer>
  );
}
