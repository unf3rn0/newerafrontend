import type { ReactNode } from "react";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";
import { getCurrentSession } from "@/lib/auth/current-session";
import { Footer } from "./footer";
import { Header } from "./header";

type SiteShellProps = {
  children: ReactNode;
  dictionary: Dictionary;
  locale: Locale;
};

export async function SiteShell({ children, dictionary, locale }: SiteShellProps) {
  const session = await getCurrentSession();

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header dictionary={dictionary} locale={locale} session={session} />
      <div className="flex flex-1 flex-col">{children}</div>
      <Footer dictionary={dictionary} locale={locale} />
    </div>
  );
}
