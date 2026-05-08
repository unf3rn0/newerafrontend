import Link from "next/link";
import { ProductImageCarousel } from "@/components/product/product-image-carousel";
import { Badge } from "@/components/ui/badge";
import type { ProductPreview } from "@/lib/catalog/types";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";
import { formatMoney } from "@/lib/money";
import { localizedPath } from "@/lib/navigation";

type ProductCardProps = {
  dictionary: Dictionary;
  locale: Locale;
  product: ProductPreview;
};

export function ProductCard({ dictionary, locale, product }: ProductCardProps) {
  const href = localizedPath(locale, `/product/${product.slug}`);

  return (
    <article>
      <ProductImageCarousel
        alt={product.imageAlt[locale]}
        href={href}
        imageLabel={dictionary.product.image}
        imageUrls={product.imageUrls}
        nextLabel={dictionary.product.nextImage}
        previousLabel={dictionary.product.previousImage}
        sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 90vw"
      >
        <div className="absolute left-3 top-3 z-20 flex flex-wrap gap-2">
          {product.isNew ? <Badge tone="blue">{dictionary.product.new}</Badge> : null}
          {product.oldPrice ? <Badge tone="sale">{dictionary.product.sale}</Badge> : null}
        </div>
      </ProductImageCarousel>
      <div className="mt-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <Link className="font-medium transition hover:text-primary" href={href}>
              {product.name[locale]}
            </Link>
            <p className="mt-1 text-sm text-muted-foreground">
              {dictionary.gender[product.gender]}
            </p>
          </div>
          <div className="text-right text-sm font-semibold">
            <p>{formatMoney(product.price, locale)}</p>
            {product.oldPrice ? (
              <p className="font-normal text-muted-foreground line-through">
                {formatMoney(product.oldPrice, locale)}
              </p>
            ) : null}
          </div>
        </div>
        <div className="mt-3 flex gap-1.5">
          {product.colors.slice(0, 4).map((color) => (
            <span
              aria-label={color.name[locale]}
              className="h-4 w-4 rounded-full border border-border"
              key={color.value}
              style={{ backgroundColor: color.hex }}
              title={color.name[locale]}
            />
          ))}
        </div>
      </div>
    </article>
  );
}
