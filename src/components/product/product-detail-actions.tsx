"use client";

import { CreditCard, Minus, Plus, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import type { ProductPreview } from "@/lib/catalog/types";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";
import { localizedPath } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/cart";

type ProductDetailActionsProps = {
  dictionary: Dictionary;
  locale: Locale;
  product: ProductPreview;
};

export function ProductDetailActions({ dictionary, locale, product }: ProductDetailActionsProps) {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.value);
  const [quantity, setQuantity] = useState(1);

  const selectedColorName = useMemo(
    () => product.colors.find((color) => color.value === selectedColor)?.name[locale],
    [locale, product.colors, selectedColor],
  );

  function addCurrentItem() {
    addItem(
      {
        color: selectedColorName,
        id: product.id,
        imageUrl: product.imageUrls[0],
        name: product.name[locale],
        price: product.price,
        size: selectedSize,
        slug: product.slug,
      },
      quantity,
    );
  }

  function buyNow() {
    addCurrentItem();
    router.push(localizedPath(locale, "/cart"));
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium">{dictionary.product.sizes}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {product.sizes.map((size) => (
            <button
              className={cn(
                "flex h-10 min-w-11 items-center justify-center rounded-lg border px-3 text-sm font-medium transition",
                selectedSize === size
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-white hover:border-primary/35",
              )}
              key={size}
              onClick={() => setSelectedSize(size)}
              type="button"
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-medium">{dictionary.product.colors}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {product.colors.map((color) => (
            <button
              aria-label={color.name[locale]}
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full border transition",
                selectedColor === color.value ? "border-primary" : "border-border",
              )}
              key={color.value}
              onClick={() => setSelectedColor(color.value)}
              title={color.name[locale]}
              type="button"
            >
              <span
                className="h-7 w-7 rounded-full border border-border"
                style={{ backgroundColor: color.hex }}
              />
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-medium">{dictionary.product.quantity}</p>
        <div className="mt-3 inline-flex h-11 items-center rounded-lg border border-border bg-white">
          <button
            aria-label="Decrease"
            className="flex h-11 w-11 items-center justify-center text-muted-foreground transition hover:text-foreground"
            onClick={() => setQuantity((value) => Math.max(1, value - 1))}
            type="button"
          >
            <Minus aria-hidden="true" className="h-4 w-4" />
          </button>
          <span className="w-10 text-center text-sm font-semibold">{quantity}</span>
          <button
            aria-label="Increase"
            className="flex h-11 w-11 items-center justify-center text-muted-foreground transition hover:text-foreground"
            onClick={() => setQuantity((value) => Math.min(product.stock, value + 1))}
            type="button"
          >
            <Plus aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Button className="w-full" onClick={addCurrentItem} type="button" variant="outline">
          <ShoppingBag aria-hidden="true" className="h-4 w-4" />
          {dictionary.product.addToCart}
        </Button>
        <Button className="w-full" onClick={buyNow} type="button">
          <CreditCard aria-hidden="true" className="h-4 w-4" />
          {dictionary.product.buyNow}
        </Button>
      </div>
    </div>
  );
}
