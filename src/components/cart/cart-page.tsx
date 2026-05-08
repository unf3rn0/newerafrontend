"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { LinkButton } from "@/components/ui/link-button";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";
import { formatMoney } from "@/lib/money";
import { localizedPath } from "@/lib/navigation";
import { useCartHydrated, useCartStore } from "@/store/cart";

type CartPageClientProps = {
  dictionary: Dictionary;
  isAuthenticated: boolean;
  locale: Locale;
};

export function CartPageClient({ dictionary, isAuthenticated, locale }: CartPageClientProps) {
  const hydrated = useCartHydrated();
  const items = useCartStore((state) => state.items);
  const increaseItem = useCartStore((state) => state.increaseItem);
  const decreaseItem = useCartStore((state) => state.decreaseItem);
  const removeItem = useCartStore((state) => state.removeItem);
  const subtotal = useMemo(
    () => items.reduce((total, item) => total + item.price * item.quantity, 0),
    [items],
  );

  if (!hydrated || items.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-white px-5 py-16 text-center">
        <p className="text-lg font-semibold">{dictionary.cart.empty}</p>
        <div className="mt-6">
          <LinkButton href={localizedPath(locale, "/catalog")} variant="secondary">
            {dictionary.cart.continue}
          </LinkButton>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <div className="space-y-4">
        {items.map((item) => (
          <article
            className="grid gap-4 rounded-lg border border-border bg-white p-4 sm:grid-cols-[120px_1fr_auto]"
            key={`${item.id}-${item.size}-${item.color}`}
          >
            <Link
              className="relative aspect-square overflow-hidden rounded-lg bg-surface-strong"
              href={localizedPath(locale, `/product/${item.slug}`)}
            >
              <Image
                alt={item.name}
                className="object-cover"
                fill
                sizes="120px"
                src={item.imageUrl}
              />
            </Link>
            <div>
              <Link
                className="font-medium transition hover:text-primary"
                href={localizedPath(locale, `/product/${item.slug}`)}
              >
                {item.name}
              </Link>
              <p className="mt-2 text-sm text-muted-foreground">
                {[item.size, item.color].filter(Boolean).join(" / ")}
              </p>
              <p className="mt-3 text-sm font-semibold">{formatMoney(item.price, locale)}</p>
            </div>
            <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end">
              <div className="inline-flex h-10 items-center rounded-lg border border-border bg-white">
                <button
                  aria-label={dictionary.cart.decrease}
                  className="flex h-10 w-10 items-center justify-center text-muted-foreground transition hover:text-foreground"
                  onClick={() => decreaseItem(item.id, item.size, item.color)}
                  type="button"
                >
                  <Minus aria-hidden="true" className="h-4 w-4" />
                </button>
                <span className="w-9 text-center text-sm font-semibold">{item.quantity}</span>
                <button
                  aria-label={dictionary.cart.increase}
                  className="flex h-10 w-10 items-center justify-center text-muted-foreground transition hover:text-foreground"
                  onClick={() => increaseItem(item.id, item.size, item.color)}
                  type="button"
                >
                  <Plus aria-hidden="true" className="h-4 w-4" />
                </button>
              </div>
              <button
                aria-label={dictionary.cart.remove}
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border text-muted-foreground transition hover:border-primary/30 hover:text-foreground"
                onClick={() => removeItem(item.id, item.size, item.color)}
                type="button"
              >
                <Trash2 aria-hidden="true" className="h-4 w-4" />
              </button>
            </div>
          </article>
        ))}
      </div>

      <aside className="h-fit rounded-lg border border-border bg-white p-5">
        <h2 className="text-xl font-semibold">{dictionary.cart.summary}</h2>
        <div className="mt-6 flex items-center justify-between border-t border-border pt-5">
          <span className="text-sm text-muted-foreground">{dictionary.cart.subtotal}</span>
          <span className="text-lg font-semibold">{formatMoney(subtotal, locale)}</span>
        </div>
        <LinkButton
          className="mt-6 w-full"
          href={localizedPath(locale, isAuthenticated ? "/checkout" : "/register?next=/checkout")}
        >
          {dictionary.cart.checkout}
        </LinkButton>
      </aside>
    </div>
  );
}
