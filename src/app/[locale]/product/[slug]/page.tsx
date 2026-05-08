import { Check, Star } from "lucide-react";
import { notFound } from "next/navigation";
import { ProductDetailActions } from "@/components/product/product-detail-actions";
import { ProductGrid } from "@/components/product/product-grid";
import { ProductImageCarousel } from "@/components/product/product-image-carousel";
import { Badge } from "@/components/ui/badge";
import { getProductBySlug, getRelatedProducts } from "@/lib/catalog/db";
import type { ProductPreview } from "@/lib/catalog/types";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { formatMoney } from "@/lib/money";

type ProductPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

function ProductBadges({
  dictionary,
  product,
}: {
  dictionary: Awaited<ReturnType<typeof getDictionary>>;
  product: ProductPreview;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {product.isNew ? <Badge tone="blue">{dictionary.product.new}</Badge> : null}
      {product.isPopular ? <Badge tone="success">{dictionary.product.popular}</Badge> : null}
      {product.oldPrice ? <Badge tone="sale">{dictionary.product.sale}</Badge> : null}
    </div>
  );
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { locale: localeParam, slug } = await params;

  if (!isLocale(localeParam)) {
    notFound();
  }

  const locale: Locale = localeParam;
  const [dictionary, product] = await Promise.all([getDictionary(locale), getProductBySlug(slug)]);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(product);

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="grid gap-10 lg:grid-cols-[1.12fr_0.88fr]">
        <ProductImageCarousel
          alt={product.imageAlt[locale]}
          imageLabel={dictionary.product.image}
          imageUrls={product.imageUrls}
          nextLabel={dictionary.product.nextImage}
          previousLabel={dictionary.product.previousImage}
          priority
          showThumbnails
          sizes="(min-width: 1024px) 54vw, 100vw"
        />

        <section className="lg:sticky lg:top-24 lg:self-start">
          <ProductBadges dictionary={dictionary} product={product} />
          <h1 className="mt-5 text-4xl font-semibold leading-tight sm:text-5xl">
            {product.name[locale]}
          </h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            {product.description[locale]}
          </p>

          <div className="mt-6 flex items-end gap-3">
            <p className="text-2xl font-semibold">{formatMoney(product.price, locale)}</p>
            {product.oldPrice ? (
              <p className="text-base text-muted-foreground line-through">
                {formatMoney(product.oldPrice, locale)}
              </p>
            ) : null}
          </div>

          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-success/20 bg-[#ecfdf5] px-3 py-1 text-sm font-medium text-success">
            <Check aria-hidden="true" className="h-4 w-4" />
            {product.stock > 0 ? dictionary.product.inStock : dictionary.product.outOfStock}
          </div>

          <div className="mt-8">
            <ProductDetailActions dictionary={dictionary} locale={locale} product={product} />
          </div>

          <div className="mt-8 divide-y divide-border rounded-lg border border-border bg-white">
            <div className="p-5">
              <p className="font-medium">{dictionary.product.composition}</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {product.composition[locale]}
              </p>
            </div>
            <div className="p-5">
              <p className="font-medium">{dictionary.product.delivery}</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {product.delivery[locale]}
              </p>
            </div>
          </div>
        </section>
      </div>

      <section className="mt-16 border-t border-border pt-12">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h2 className="text-2xl font-semibold">{dictionary.product.reviews}</h2>
        </div>
        {product.reviews.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-3">
            {product.reviews.map((review) => (
              <article className="rounded-lg border border-border bg-white p-5" key={review.author}>
                <div className="flex gap-1 text-primary">
                  {Array.from({ length: review.rating }).map((_, index) => (
                    <Star aria-hidden="true" className="h-4 w-4 fill-current" key={index} />
                  ))}
                </div>
                <p className="mt-4 font-medium">{review.author}</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {review.body[locale]}
                </p>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-border bg-white p-6 text-sm text-muted-foreground">
            {dictionary.product.noReviews}
          </div>
        )}
      </section>

      <section className="mt-16 border-t border-border pt-12">
        <h2 className="mb-8 text-2xl font-semibold">{dictionary.product.related}</h2>
        <ProductGrid dictionary={dictionary} locale={locale} products={relatedProducts} />
      </section>
    </main>
  );
}
