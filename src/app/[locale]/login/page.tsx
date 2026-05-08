import { notFound, redirect } from "next/navigation";
import { LoginForm } from "@/components/auth/login-form";
import { getCurrentSession } from "@/lib/auth/current-session";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getSafeNextPath, localizedPath } from "@/lib/navigation";
import { loginAction } from "./actions";

type LoginPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function LoginPage({ params, searchParams }: LoginPageProps) {
  const [{ locale: localeParam }, rawSearchParams] = await Promise.all([params, searchParams]);

  if (!isLocale(localeParam)) {
    notFound();
  }

  const locale: Locale = localeParam;
  const dictionary = await getDictionary(locale);
  const invalidCredentials = rawSearchParams.error === "invalid";
  const rateLimited = rawSearchParams.error === "rate";
  const nextPath = getSafeNextPath(rawSearchParams.next);
  const session = await getCurrentSession();

  if (session) {
    redirect(localizedPath(locale, nextPath ?? "/profile"));
  }

  return (
    <main className="premium-grid flex flex-1 items-center px-4 py-12 sm:px-6">
      <div className="mx-auto grid w-full max-w-5xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <section className="hidden lg:block">
          <p className="text-sm font-semibold uppercase text-primary">{dictionary.common.brand}</p>
          <h2 className="mt-5 max-w-md text-5xl font-semibold leading-tight">
            {dictionary.auth.loginHeroTitle}
          </h2>
          <p className="mt-5 max-w-md text-base leading-7 text-muted-foreground">
            {dictionary.auth.loginHeroText}
          </p>
        </section>

        <LoginForm
          action={loginAction.bind(null, locale)}
          dictionary={dictionary}
          invalidCredentials={invalidCredentials}
          locale={locale}
          nextPath={nextPath}
          rateLimited={rateLimited}
        />
      </div>
    </main>
  );
}
