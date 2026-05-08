import { notFound, redirect } from "next/navigation";
import { ChangePasswordForm } from "@/components/profile/change-password-form";
import { getCurrentSession } from "@/lib/auth/current-session";
import { prisma } from "@/lib/db";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { formatMoney } from "@/lib/money";
import { getOrdersForUser } from "@/lib/orders/db";
import { localizedPath } from "@/lib/navigation";
import { LinkButton } from "@/components/ui/link-button";
import { changePasswordAction } from "./actions";

type ProfilePageProps = {
  params: Promise<{ locale: string }>;
};

function formatOrderDate(date: Date, locale: Locale) {
  return new Intl.DateTimeFormat(locale === "tg" ? "tg-TJ" : locale, {
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { locale: localeParam } = await params;

  if (!isLocale(localeParam)) {
    notFound();
  }

  const locale: Locale = localeParam;
  const [dictionary, session] = await Promise.all([getDictionary(locale), getCurrentSession()]);

  if (!session) {
    redirect(localizedPath(locale, "/login"));
  }

  const [orders, user] = await Promise.all([
    getOrdersForUser(session.userId),
    prisma.user.findUnique({
      select: {
        email: true,
        login: true,
      },
      where: { id: session.userId },
    }),
  ]);

  if (!user) {
    redirect(localizedPath(locale, "/login"));
  }

  const changePassword = changePasswordAction.bind(null, locale);

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
      <section>
        <p className="text-sm font-semibold text-primary">{dictionary.common.brand}</p>
        <h1 className="mt-4 text-4xl font-semibold leading-tight">
          {dictionary.auth.profileTitle}
        </h1>
        <div className="mt-6 grid gap-4 text-sm text-muted-foreground sm:grid-cols-2 xl:grid-cols-[minmax(160px,220px)_minmax(240px,340px)_minmax(0,1fr)]">
          <div className="h-full min-h-24 rounded-lg border border-border bg-surface px-4 py-3">
            <p className="font-medium text-foreground">{dictionary.auth.accountLogin}</p>
            <p className="mt-1">{user.login}</p>
          </div>
          <div className="h-full min-h-24 rounded-lg border border-border bg-surface px-4 py-3">
            <p className="font-medium text-foreground">{dictionary.auth.accountEmail}</p>
            <p className="mt-1 break-all">{user.email}</p>
          </div>
          <ChangePasswordForm action={changePassword} dictionary={dictionary} />
        </div>
      </section>

      <section className="mt-10">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase text-primary">
              {dictionary.common.brand}
            </p>
            <h2 className="mt-2 text-3xl font-semibold leading-tight">{dictionary.orders.title}</h2>
          </div>
          <LinkButton href={localizedPath(locale, "/catalog")} variant="secondary">
            {dictionary.cart.continue}
          </LinkButton>
        </div>

        {orders.length === 0 ? (
          <div className="rounded-lg border border-border bg-white p-8 text-sm text-muted-foreground">
            {dictionary.orders.empty}
          </div>
        ) : (
          <div className="grid gap-4">
            {orders.map((order) => (
              <article
                className="grid gap-4 rounded-lg border border-border bg-white p-5 sm:grid-cols-[1fr_auto] sm:items-center"
                key={order.id}
              >
                <div>
                  <p className="font-semibold">{order.orderNumber}</p>
                  <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted-foreground">
                    <span>
                      {dictionary.orders.paymentStatus}:{" "}
                      {dictionary.orders.paymentStatuses[order.paymentStatus]}
                    </span>
                    <span>
                      {dictionary.orders.orderDate}: {formatOrderDate(order.createdAt, locale)}
                    </span>
                    <span>
                      {dictionary.orders.itemsCount}: {order.items.length}
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3 sm:justify-end">
                  <p className="text-lg font-semibold">
                    {formatMoney(Number(order.totalAmount), locale)}
                  </p>
                  <LinkButton href={localizedPath(locale, `/orders/${order.id}`)} variant="outline">
                    {dictionary.orders.openOrder}
                  </LinkButton>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
