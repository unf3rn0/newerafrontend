import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckboxField } from "@/components/ui/checkbox-field";
import { CustomSelect } from "@/components/ui/custom-select";
import { Input } from "@/components/ui/input";
import { colorOptions, sizeOptions } from "@/lib/catalog/options";
import type { CategoryPreview } from "@/lib/catalog/types";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";
import { localizedPath } from "@/lib/navigation";
import type { CatalogSearchInput } from "@/lib/validation/catalog";

type CatalogFiltersProps = {
  categories: CategoryPreview[];
  dictionary: Dictionary;
  input: CatalogSearchInput;
  locale: Locale;
};

export function CatalogFilters({ categories, dictionary, input, locale }: CatalogFiltersProps) {
  const categorySelectOptions = [
    { label: dictionary.catalog.allCategories, value: "" },
    ...categories.map((category) => ({ label: category.name[locale], value: category.slug })),
  ];
  const sortSelectOptions = [
    { label: dictionary.catalog.featured, value: "featured" },
    { label: dictionary.catalog.new, value: "new" },
    { label: dictionary.catalog.popular, value: "popular" },
    { label: dictionary.catalog.priceAsc, value: "price-asc" },
    { label: dictionary.catalog.priceDesc, value: "price-desc" },
  ];
  const sizeSelectOptions = [
    { label: dictionary.catalog.allSizes, value: "" },
    ...sizeOptions.map((size) => ({ label: size, value: size })),
  ];
  const colorSelectOptions = [
    { label: dictionary.catalog.allColors, value: "" },
    ...colorOptions.map((color) => ({ label: color.label[locale], value: color.value })),
  ];
  const genderSelectOptions = [
    { label: dictionary.catalog.allGenders, value: "" },
    { label: dictionary.gender.WOMEN, value: "WOMEN" },
    { label: dictionary.gender.MEN, value: "MEN" },
    { label: dictionary.gender.UNISEX, value: "UNISEX" },
  ];

  return (
    <form
      action={localizedPath(locale, "/catalog")}
      className="rounded-lg border border-border bg-white p-4 shadow-sm shadow-primary/5"
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <label className="space-y-2 text-sm font-medium">
          <span>{dictionary.catalog.search}</span>
          <Input
            defaultValue={input.q}
            name="q"
            placeholder={dictionary.catalog.searchPlaceholder}
            type="search"
          />
        </label>
        <div className="space-y-2 text-sm font-medium">
          <span>{dictionary.catalog.category}</span>
          <CustomSelect
            ariaLabel={dictionary.catalog.category}
            defaultValue={input.category ?? ""}
            name="category"
            options={categorySelectOptions}
          />
        </div>
        <div className="space-y-2 text-sm font-medium">
          <span>{dictionary.catalog.sort}</span>
          <CustomSelect
            ariaLabel={dictionary.catalog.sort}
            defaultValue={input.sort ?? "featured"}
            name="sort"
            options={sortSelectOptions}
          />
        </div>
        <div className="space-y-2 text-sm font-medium">
          <span>{dictionary.catalog.size}</span>
          <CustomSelect
            ariaLabel={dictionary.catalog.size}
            defaultValue={input.size ?? ""}
            name="size"
            options={sizeSelectOptions}
          />
        </div>
        <div className="space-y-2 text-sm font-medium">
          <span>{dictionary.catalog.color}</span>
          <CustomSelect
            ariaLabel={dictionary.catalog.color}
            defaultValue={input.color ?? ""}
            name="color"
            options={colorSelectOptions}
          />
        </div>
        <div className="space-y-2 text-sm font-medium">
          <span>{dictionary.catalog.gender}</span>
          <CustomSelect
            ariaLabel={dictionary.catalog.gender}
            defaultValue={input.gender ?? ""}
            name="gender"
            options={genderSelectOptions}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <label className="space-y-2 text-sm font-medium">
            <span>{dictionary.catalog.priceFrom}</span>
            <Input defaultValue={input.min} min={0} name="min" type="number" />
          </label>
          <label className="space-y-2 text-sm font-medium">
            <span>{dictionary.catalog.priceTo}</span>
            <Input defaultValue={input.max} min={0} name="max" type="number" />
          </label>
        </div>
      </div>

      <div className="mt-5 flex flex-col justify-between gap-4 border-t border-border pt-4 sm:flex-row sm:items-center">
        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
          <CheckboxField
            defaultChecked={Boolean(input.new)}
            label={dictionary.catalog.new}
            name="new"
          />
          <CheckboxField
            defaultChecked={Boolean(input.sale)}
            label={dictionary.catalog.sale}
            name="sale"
          />
          <CheckboxField
            defaultChecked={Boolean(input.popular)}
            label={dictionary.catalog.popular}
            name="popular"
          />
        </div>
        <div className="flex gap-2">
          <Link
            className="inline-flex h-11 items-center justify-center rounded-lg border border-border bg-white px-5 text-sm font-medium transition hover:bg-surface-strong"
            href={localizedPath(locale, "/catalog")}
          >
            {dictionary.catalog.reset}
          </Link>
          <Button type="submit">{dictionary.catalog.apply}</Button>
        </div>
      </div>
    </form>
  );
}
