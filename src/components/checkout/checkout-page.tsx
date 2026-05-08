"use client";

import { AlertCircle, Info } from "lucide-react";
import Image from "next/image";
import { FormEvent, useMemo, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { LinkButton } from "@/components/ui/link-button";
import { createCheckoutOrder } from "@/lib/orders/actions";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";
import { formatMoney } from "@/lib/money";
import { localizedPath } from "@/lib/navigation";
import { useCartHydrated, useCartStore } from "@/store/cart";

type CheckoutPageClientProps = {
  dictionary: Dictionary;
  locale: Locale;
};

type CheckoutError = "auth" | "invalid" | "products" | "unknown";

export function CheckoutPageClient({ dictionary, locale }: CheckoutPageClientProps) {
  const hydrated = useCartHydrated();
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clear);
  const [error, setError] = useState<CheckoutError | null>(null);
  const [isPending, startTransition] = useTransition();
  const subtotal = useMemo(
    () => items.reduce((total, item) => total + item.price * item.quantity, 0),
    [items],
  );

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setError(null);

    startTransition(async () => {
      try {
        const result = await createCheckoutOrder(locale, {
          customerAddress: String(formData.get("customerAddress") ?? ""),
          customerComment: String(formData.get("customerComment") ?? ""),
          customerEmail: String(formData.get("customerEmail") ?? ""),
          customerName: String(formData.get("customerName") ?? ""),
          customerPhone: String(formData.get("customerPhone") ?? ""),
          items: items.map((item) => ({
            color: item.color,
            productId: item.id,
            quantity: item.quantity,
            size: item.size,
          })),
        });

        if (!result.ok) {
          setError(result.error);
          return;
        }

        const orderPath = localizedPath(locale, `/orders/${result.orderId}`);

        clearCart();
        window.location.replace(orderPath);
      } catch {
        setError("unknown");
      }
    });
  }

  if (!hydrated || items.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-white px-5 py-16 text-center">
        <p className="text-lg font-semibold">{dictionary.checkout.empty}</p>
        <div className="mt-6">
          <LinkButton href={localizedPath(locale, "/catalog")} variant="secondary">
            {dictionary.cart.continue}
          </LinkButton>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
      <form
        className="rounded-lg border border-border bg-white p-5 shadow-sm shadow-primary/5"
        onSubmit={handleSubmit}
      >
        <div className="flex items-start gap-3 rounded-lg border border-primary/15 bg-primary/5 p-4">
          <Info aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          <div>
            <p className="text-sm font-semibold">{dictionary.checkout.qrOnlyTitle}</p>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              {dictionary.checkout.qrOnlyText}
            </p>
          </div>
        </div>

        {error ? (
          <div className="mt-5 flex items-start gap-3 rounded-lg border border-warning/25 bg-[#fff7ed] p-4 text-sm font-medium text-warning">
            <AlertCircle aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{dictionary.checkout.errors[error]}</span>
          </div>
        ) : null}

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <label className="block space-y-2 text-sm font-medium">
            <span>{dictionary.checkout.name}</span>
            <Input name="customerName" required />
          </label>
          <label className="block space-y-2 text-sm font-medium">
            <span>{dictionary.checkout.phone}</span>
            <Input autoComplete="tel" name="customerPhone" required />
          </label>
          <label className="block space-y-2 text-sm font-medium sm:col-span-2">
            <span>{dictionary.checkout.email}</span>
            <Input autoComplete="email" name="customerEmail" type="email" />
          </label>
          <label className="block space-y-2 text-sm font-medium sm:col-span-2">
            <span>{dictionary.checkout.address}</span>
            <Input name="customerAddress" required />
          </label>
          <label className="block space-y-2 text-sm font-medium sm:col-span-2">
            <span>{dictionary.checkout.comment}</span>
            <Textarea name="customerComment" />
          </label>
        </div>

        <Button className="mt-6 w-full" disabled={isPending} type="submit">
          {isPending ? dictionary.checkout.creating : dictionary.checkout.submit}
        </Button>
      </form>

      <aside className="h-fit rounded-lg border border-border bg-white p-5 lg:sticky lg:top-24">
        <h2 className="text-xl font-semibold">{dictionary.checkout.summary}</h2>
        <div className="mt-5 max-h-[min(520px,calc(100vh-220px))] space-y-4 overflow-y-auto overscroll-contain pr-2">
          {items.map((item) => (
            <div
              className="grid grid-cols-[56px_1fr] gap-3"
              key={`${item.id}-${item.size}-${item.color}`}
            >
              <div className="relative aspect-square overflow-hidden rounded-lg bg-surface-strong">
                <Image
                  alt={item.name}
                  className="object-cover"
                  fill
                  sizes="56px"
                  src={item.imageUrl}
                />
              </div>
              <div>
                <p className="text-sm font-medium">{item.name}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {[item.size, item.color].filter(Boolean).join(" / ")} · {item.quantity}
                </p>
                <p className="mt-1 text-sm font-semibold">
                  {formatMoney(item.price * item.quantity, locale)}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 flex items-center justify-between border-t border-border pt-5">
          <span className="text-sm text-muted-foreground">{dictionary.cart.subtotal}</span>
          <span className="text-lg font-semibold">{formatMoney(subtotal, locale)}</span>
        </div>
      </aside>
    </div>
  );
}
