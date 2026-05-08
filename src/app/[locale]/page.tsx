import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { siteConfig } from "@/config/site";
import { CategoryStrip } from "@/components/home/category-strip";
import { Reveal } from "@/components/motion/reveal";
import { ProductGrid } from "@/components/product/product-grid";
import { LinkButton } from "@/components/ui/link-button";
import { getNewProducts, getPopularProducts } from "@/lib/catalog/db";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { localizedPath } from "@/lib/navigation";

type LocalePageProps = {
  params: Promise<{ locale: string }>;
};

export default async function LocaleHomePage({ params }: LocalePageProps) {
  const { locale: localeParam } = await params;

  if (!isLocale(localeParam)) {
    notFound();
  }

  const locale: Locale = localeParam;
  const [dictionary, newProducts, popularProducts] = await Promise.all([
    getDictionary(locale),
    getNewProducts(4),
    getPopularProducts(4),
  ]);
  const heroBackground = siteConfig.assets.home.heroBackground;
  const aboutImage = siteConfig.assets.home.aboutImage;

  return (
    <main>
      <section className="relative min-h-[calc(100svh-4rem)] overflow-hidden bg-surface-strong">
        <Image
          alt={heroBackground.alt}
          className="object-cover"
          fill
          priority
          sizes="100vw"
          src={heroBackground.src}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/70 to-white/10" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-white via-white/70 to-transparent" />
        <div className="relative mx-auto flex min-h-[calc(100svh-4rem)] w-full max-w-7xl items-center px-4 py-16 sm:px-6 sm:py-20">
          <Reveal className="max-w-2xl">
            <p className="text-sm font-semibold text-primary">{dictionary.home.heroEyebrow}</p>
            <h1 className="mt-5 text-6xl font-semibold leading-none text-foreground sm:text-7xl lg:text-8xl">
              {dictionary.home.heroTitle}
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
              {dictionary.home.heroSubtitle}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <LinkButton href={localizedPath(locale, "/catalog")} size="lg">
                {dictionary.home.heroCta}
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </LinkButton>
              <LinkButton
                href={localizedPath(locale, "/catalog?new=true")}
                size="lg"
                variant="outline"
              >
                {dictionary.home.secondaryCta}
              </LinkButton>
            </div>
          </Reveal>
        </div>
      </section>

      {newProducts.length > 0 ? (
        <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6">
          <Reveal className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-medium text-primary">{dictionary.home.newArrivals}</p>
              <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">
                {dictionary.home.newArrivals}
              </h2>
            </div>
            <LinkButton
              href={localizedPath(locale, "/catalog?new=true")}
              size="sm"
              variant="secondary"
            >
              {dictionary.home.viewAll}
            </LinkButton>
          </Reveal>
          <ProductGrid dictionary={dictionary} locale={locale} products={newProducts} />
        </section>
      ) : null}

      <section className="bg-surface premium-grid">
        <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <Reveal>
            <p className="text-sm font-medium text-primary">{dictionary.nav.about}</p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">
              {dictionary.home.aboutTitle}
            </h2>
            <p className="mt-5 text-base leading-7 text-muted-foreground">
              {dictionary.home.aboutBody}
            </p>
            <p className="mt-5 rounded-lg border border-primary/10 bg-white/72 px-4 py-3 text-sm text-accent-foreground">
              {dictionary.home.deliveryNote}
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="relative min-h-[420px] overflow-hidden rounded-lg border border-primary/10 bg-surface-strong shadow-sm shadow-primary/10">
              <Image
                alt={aboutImage.alt}
                className="object-cover object-center"
                fill
                sizes="(min-width: 1024px) 52vw, 92vw"
                src={aboutImage.src}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 via-transparent to-white/10" />
            </div>
          </Reveal>
        </div>
      </section>

      {popularProducts.length > 0 ? (
        <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6">
          <Reveal className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-medium text-primary">{dictionary.home.popularProducts}</p>
              <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">
                {dictionary.home.popularProducts}
              </h2>
            </div>
            <LinkButton
              href={localizedPath(locale, "/catalog?popular=true")}
              size="sm"
              variant="secondary"
            >
              {dictionary.home.viewAll}
            </LinkButton>
          </Reveal>
          <ProductGrid dictionary={dictionary} locale={locale} products={popularProducts} />
        </section>
      ) : null}

      <CategoryStrip dictionary={dictionary} locale={locale} />
    </main>
  );
}
