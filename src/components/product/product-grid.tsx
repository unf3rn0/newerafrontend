import { ProductCard } from "@/components/product/product-card";
import type { ProductPreview } from "@/lib/catalog/types";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";

type ProductGridProps = {
  dictionary: Dictionary;
  locale: Locale;
  products: ProductPreview[];
};

export function ProductGrid({ dictionary, locale, products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-white px-5 py-14 text-center text-sm text-muted-foreground">
        {dictionary.catalog.empty}
      </div>
    );
  }

  return (
    <div className="grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard dictionary={dictionary} key={product.id} locale={locale} product={product} />
      ))}
    </div>
  );
}
