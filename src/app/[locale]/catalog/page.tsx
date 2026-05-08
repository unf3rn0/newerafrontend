import { SlidersHorizontal } from "lucide-react";
import { notFound } from "next/navigation";
import { CatalogFilters } from "@/components/catalog/catalog-filters";
import { ProductGrid } from "@/components/product/product-grid";
import { filterProducts, getCategories } from "@/lib/catalog/db";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { catalogSearchSchema } from "@/lib/validation/catalog";

type CatalogPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function normalizeSearchParams(searchParams: Record<string, string | string[] | undefined>) {
  return Object.fromEntries(
    Object.entries(searchParams).map(([key, value]) => [
      key,
      Array.isArray(value) ? value[0] : value,
    ]),
  );
}

export default async function CatalogPage({ params, searchParams }: CatalogPageProps) {
  const [{ locale: localeParam }, rawSearchParams] = await Promise.all([params, searchParams]);

  if (!isLocale(localeParam)) {
    notFound();
  }

  const locale: Locale = localeParam;
  const input = catalogSearchSchema.parse(normalizeSearchParams(rawSearchParams));
  const [dictionary, categories, filteredProducts] = await Promise.all([
    getDictionary(locale),
    getCategories(),
    filterProducts(input),
  ]);

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="mb-8 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-surface-strong px-3 py-1 text-sm font-medium text-accent-foreground">
            <SlidersHorizontal aria-hidden="true" className="h-4 w-4" />
            {dictionary.catalog.results}: {filteredProducts.length}
          </div>
          <h1 className="mt-5 text-4xl font-semibold leading-tight sm:text-5xl">
            {dictionary.catalog.title}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
            {dictionary.catalog.subtitle}
          </p>
        </div>
      </div>

      <CatalogFilters
        categories={categories}
        dictionary={dictionary}
        input={input}
        locale={locale}
      />

      <div className="mt-10">
        <ProductGrid dictionary={dictionary} locale={locale} products={filteredProducts} />
      </div>
    </main>
  );
}
