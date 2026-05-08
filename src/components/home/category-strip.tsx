import Image from "next/image";
import Link from "next/link";
import { getCategories } from "@/lib/catalog/db";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";
import { localizedPath } from "@/lib/navigation";

type CategoryStripProps = {
  dictionary: Dictionary;
  locale: Locale;
};

export async function CategoryStrip({ dictionary, locale }: CategoryStripProps) {
  const categories = await getCategories();

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-primary">{dictionary.home.categories}</p>
          <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">{dictionary.nav.catalog}</h2>
        </div>
        <Link
          className="hidden text-sm font-medium text-primary transition hover:text-accent-foreground sm:inline"
          href={localizedPath(locale, "/catalog")}
        >
          {dictionary.home.viewAll}
        </Link>
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        {categories.map((category) => (
          <Link
            className="group relative min-h-64 overflow-hidden rounded-lg bg-surface-strong"
            href={localizedPath(locale, `/catalog?category=${category.slug}`)}
            key={category.slug}
          >
            <Image
              alt={category.name[locale]}
              className="object-cover transition duration-700 group-hover:scale-[1.04]"
              fill
              sizes="(min-width: 1024px) 25vw, 90vw"
              src={category.imageUrl}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#08213a]/70 via-[#08213a]/12 to-transparent" />
            <div className="absolute bottom-0 p-5 text-white">
              <p className="text-lg font-semibold">{category.name[locale]}</p>
              <p className="mt-2 text-sm leading-5 text-white/80">{category.description[locale]}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
