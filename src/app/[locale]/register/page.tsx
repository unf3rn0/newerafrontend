import { notFound, redirect } from "next/navigation";
import { RegisterForm } from "@/components/auth/register-form";
import { getCurrentSession } from "@/lib/auth/current-session";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getSafeNextPath, localizedPath } from "@/lib/navigation";
import { registerAction } from "./actions";

type RegisterPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function getError(error: string | string[] | undefined) {
  return error === "exists" || error === "invalid" || error === "rate" ? error : null;
}

export default async function RegisterPage({ params, searchParams }: RegisterPageProps) {
  const [{ locale: localeParam }, rawSearchParams] = await Promise.all([params, searchParams]);

  if (!isLocale(localeParam)) {
    notFound();
  }

  const locale: Locale = localeParam;
  const dictionary = await getDictionary(locale);
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
            {dictionary.auth.registerHeroTitle}
          </h2>
          <p className="mt-5 max-w-md text-base leading-7 text-muted-foreground">
            {dictionary.auth.registerHeroText}
          </p>
        </section>

        <RegisterForm
          action={registerAction.bind(null, locale)}
          dictionary={dictionary}
          error={getError(rawSearchParams.error)}
          locale={locale}
          nextPath={nextPath}
        />
      </div>
    </main>
  );
}
