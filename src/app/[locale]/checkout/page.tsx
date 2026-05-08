import { notFound, redirect } from "next/navigation";
import { CheckoutPageClient } from "@/components/checkout/checkout-page";
import { getCurrentSession } from "@/lib/auth/current-session";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { localizedPath } from "@/lib/navigation";

type CheckoutPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function CheckoutPage({ params }: CheckoutPageProps) {
  const { locale: localeParam } = await params;

  if (!isLocale(localeParam)) {
    notFound();
  }

  const locale: Locale = localeParam;
  const [dictionary, session] = await Promise.all([getDictionary(locale), getCurrentSession()]);

  if (!session) {
    redirect(localizedPath(locale, "/register?next=/checkout"));
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="mb-8 max-w-2xl">
        <p className="text-sm font-semibold uppercase text-primary">{dictionary.common.brand}</p>
        <h1 className="mt-3 text-4xl font-semibold leading-tight sm:text-5xl">
          {dictionary.checkout.title}
        </h1>
        <p className="mt-4 text-base leading-7 text-muted-foreground">
          {dictionary.checkout.subtitle}
        </p>
      </div>
      <CheckoutPageClient dictionary={dictionary} locale={locale} />
    </main>
  );
}
