"use client";

import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import { localizedPath } from "@/lib/navigation";
import { useCartHydrated, useCartStore } from "@/store/cart";

export function CartHeaderLink({ label, locale }: { label: string; locale: Locale }) {
  const hydrated = useCartHydrated();
  const count = useCartStore((state) =>
    state.items.reduce((total, item) => total + item.quantity, 0),
  );

  return (
    <Link
      aria-label={label}
      className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white text-foreground transition hover:border-primary/30 hover:bg-surface-strong"
      href={localizedPath(locale, "/cart")}
    >
      <ShoppingBag aria-hidden="true" className="h-4 w-4" />
      {hydrated && count > 0 ? (
        <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[11px] font-semibold text-primary-foreground">
          {count}
        </span>
      ) : null}
    </Link>
  );
}
