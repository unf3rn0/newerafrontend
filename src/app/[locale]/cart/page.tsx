import { notFound } from "next/navigation";
import { CartPageClient } from "@/components/cart/cart-page";
import { getCurrentSession } from "@/lib/auth/current-session";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { isLocale, type Locale } from "@/lib/i18n/config";

type CartPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function CartPage({ params }: CartPageProps) {
  const { locale: localeParam } = await params;

  if (!isLocale(localeParam)) {
    notFound();
  }

  const locale: Locale = localeParam;
  const [dictionary, session] = await Promise.all([getDictionary(locale), getCurrentSession()]);

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="mb-8">
        <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
          {dictionary.cart.title}
        </h1>
      </div>
      <CartPageClient dictionary={dictionary} isAuthenticated={Boolean(session)} locale={locale} />
    </main>
  );
}
