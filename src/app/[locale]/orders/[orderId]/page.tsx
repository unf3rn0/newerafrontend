import { Camera, CheckCircle2, CreditCard, Phone, QrCode } from "lucide-react";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";
import { LinkButton } from "@/components/ui/link-button";
import { getCurrentSession } from "@/lib/auth/current-session";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { formatMoney } from "@/lib/money";
import { markOrderPaid } from "@/lib/orders/actions";
import { getOrderForUser } from "@/lib/orders/db";
import { localizedPath } from "@/lib/navigation";

type OrderPageProps = {
  params: Promise<{ locale: string; orderId: string }>;
};

export default async function OrderPage({ params }: OrderPageProps) {
  const { locale: localeParam, orderId } = await params;

  if (!isLocale(localeParam)) {
    notFound();
  }

  const locale: Locale = localeParam;
  const [dictionary, session] = await Promise.all([getDictionary(locale), getCurrentSession()]);

  if (!session) {
    redirect(localizedPath(locale, `/login?next=${encodeURIComponent(`/orders/${orderId}`)}`));
  }

  const order = await getOrderForUser(orderId, session.userId);

  if (!order) {
    notFound();
  }

  const paymentStatusLabel = dictionary.orders.paymentStatuses[order.paymentStatus];
  const orderStatusLabel = dictionary.orders.orderStatuses[order.orderStatus];
  const isUnpaid = order.paymentStatus === "UNPAID";

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase text-primary">{dictionary.orders.order}</p>
          <h1 className="mt-3 text-4xl font-semibold leading-tight sm:text-5xl">
            {order.orderNumber}
          </h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            {dictionary.orders.status}: {paymentStatusLabel} · {orderStatusLabel}
          </p>
        </div>
        <LinkButton href={localizedPath(locale, "/profile")} variant="secondary">
          {dictionary.orders.backToProfile}
        </LinkButton>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <section className="space-y-4">
          <div className="rounded-lg border border-border bg-white p-5">
            <h2 className="text-xl font-semibold">{dictionary.orders.items}</h2>
            <div className="mt-5 space-y-4">
              {order.items.map((item) => (
                <article
                  className="grid gap-4 border-b border-border pb-4 last:border-0 last:pb-0 sm:grid-cols-[90px_1fr_auto]"
                  key={item.id}
                >
                  <div className="relative aspect-square overflow-hidden rounded-lg bg-surface-strong">
                    {item.imageUrl ? (
                      <Image
                        alt={item.productName}
                        className="object-cover"
                        fill
                        sizes="90px"
                        src={item.imageUrl}
                      />
                    ) : null}
                  </div>
                  <div>
                    <p className="font-medium">{item.productName}</p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {[item.size, item.color].filter(Boolean).join(" / ")} · {item.quantity}
                    </p>
                  </div>
                  <p className="text-sm font-semibold sm:text-right">
                    {formatMoney(Number(item.lineTotal), locale)}
                  </p>
                </article>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-border bg-white p-5">
              <h2 className="text-xl font-semibold">{dictionary.orders.customer}</h2>
              <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                <p>{order.customerName}</p>
                <p>{order.customerPhone}</p>
                {order.customerEmail ? <p>{order.customerEmail}</p> : null}
              </div>
            </div>
            <div className="rounded-lg border border-border bg-white p-5">
              <h2 className="text-xl font-semibold">{dictionary.orders.delivery}</h2>
              <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                <p>{order.customerAddress}</p>
                {order.customerComment ? <p>{order.customerComment}</p> : null}
              </div>
            </div>
          </div>
        </section>

        <aside className="h-fit rounded-lg border border-border bg-white p-5">
          <div className="flex items-center gap-2 text-sm font-semibold text-primary">
            <QrCode aria-hidden="true" className="h-4 w-4" />
            {dictionary.orders.qrTitle}
          </div>
          <div className="relative mx-auto mt-5 aspect-square w-full max-w-64 overflow-hidden rounded-lg border border-border bg-white p-4">
            <Image
              alt={dictionary.orders.qrTitle}
              className="object-contain"
              fill
              sizes="256px"
              src={siteConfig.assets.paymentQr}
            />
          </div>
          <p className="mt-5 text-sm leading-6 text-muted-foreground">{dictionary.orders.qrText}</p>

          <div className="mt-6 rounded-lg bg-surface p-4 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">{dictionary.orders.total}</span>
              <span className="font-semibold">
                {formatMoney(Number(order.totalAmount), locale)}
              </span>
            </div>
          </div>

          {isUnpaid ? (
            <form action={markOrderPaid.bind(null, locale, order.id)} className="mt-5">
              <Button className="w-full" type="submit">
                <CreditCard aria-hidden="true" className="h-4 w-4" />
                {dictionary.orders.markPaid}
              </Button>
            </form>
          ) : (
            <div className="mt-5 flex items-start gap-3 rounded-lg border border-primary/15 bg-primary/5 p-4 text-sm font-medium leading-6 text-primary">
              <CheckCircle2 aria-hidden="true" className="mt-1 h-4 w-4 shrink-0" />
              <span>{dictionary.orders.markedPaid}</span>
            </div>
          )}

          <p className="mt-5 text-sm leading-6 text-muted-foreground">
            {dictionary.orders.contactAfterPayment}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <LinkButton
              href={siteConfig.contacts.instagram}
              rel="noreferrer"
              target="_blank"
              variant="outline"
            >
              <Camera aria-hidden="true" className="h-4 w-4" />
              {dictionary.common.instagram}
            </LinkButton>
            <LinkButton href={`tel:${siteConfig.contacts.phone}`} variant="outline">
              <Phone aria-hidden="true" className="h-4 w-4" />
              {dictionary.common.phone}
            </LinkButton>
          </div>
        </aside>
      </div>
    </main>
  );
}
