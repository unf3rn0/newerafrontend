import { ShieldCheck, UserRound } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { CartHeaderLink } from "@/components/cart/cart-header-link";
import type { SessionPayload } from "@/lib/auth/session";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";
import { localizedPath } from "@/lib/navigation";

type HeaderProps = {
  dictionary: Dictionary;
  locale: Locale;
  session: SessionPayload | null;
};

export function Header({ dictionary, locale, session }: HeaderProps) {
  const navItems = [
    { href: "/", label: dictionary.nav.home },
    { href: "/catalog", label: dictionary.nav.catalog },
    { href: "/catalog?new=true", label: dictionary.nav.new },
    { href: "/catalog?popular=true", label: dictionary.nav.popular },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link
          aria-label={dictionary.common.brand}
          className="flex items-center gap-3"
          href={localizedPath(locale)}
        >
          <Image
            alt={dictionary.common.brand}
            className="shrink-0"
            height={55}
            priority
            src={siteConfig.assets.logo}
            style={{ height: "44px", width: "auto" }}
            width={72}
          />
        </Link>

        <nav
          aria-label={dictionary.nav.home}
          className="hidden items-center gap-7 text-sm font-medium text-muted-foreground md:flex"
        >
          {navItems.map((item) => (
            <Link
              className="transition hover:text-foreground"
              href={localizedPath(locale, item.href)}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <CartHeaderLink label={dictionary.nav.cart} locale={locale} />
          {session?.role === "ADMIN" ? (
            <Link
              className="hidden h-10 items-center justify-center gap-2 rounded-full border border-border bg-white px-4 text-sm font-semibold text-foreground shadow-sm shadow-primary/5 transition hover:border-primary/40 hover:bg-surface-strong focus:outline-none focus:ring-2 focus:ring-primary/25 sm:inline-flex"
              href={localizedPath(locale, "/admin")}
            >
              <ShieldCheck aria-hidden="true" className="h-4 w-4" />
              <span>{dictionary.nav.admin}</span>
            </Link>
          ) : null}
          {session ? (
            <Link
              className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm shadow-primary/15 transition hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/25"
              href={localizedPath(locale, "/profile")}
            >
              <UserRound aria-hidden="true" className="h-4 w-4" />
              <span>{dictionary.nav.account}</span>
            </Link>
          ) : (
            <Link
              className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-primary px-3 text-sm font-semibold text-primary-foreground shadow-sm shadow-primary/15 transition hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/25 sm:px-4"
              href={localizedPath(locale, "/login")}
            >
              <UserRound aria-hidden="true" className="h-4 w-4" />
              <span>{dictionary.nav.login}</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
