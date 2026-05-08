import type { Locale } from "@/lib/i18n/config";

export type LocalizedText = Record<Locale, string>;

export type CategoryPreview = {
  description: LocalizedText;
  imageUrl: string;
  name: LocalizedText;
  slug: string;
};

export type ProductPreview = {
  brand: string;
  categorySlug: string;
  colors: Array<{ hex: string; name: LocalizedText; value: string }>;
  composition: LocalizedText;
  delivery: LocalizedText;
  description: LocalizedText;
  gender: "WOMEN" | "MEN" | "UNISEX";
  id: string;
  imageAlt: LocalizedText;
  imageUrls: string[];
  isFeatured: boolean;
  isNew: boolean;
  isPopular: boolean;
  name: LocalizedText;
  oldPrice?: number;
  price: number;
  reviews: Array<{ author: string; body: LocalizedText; rating: number }>;
  sizes: string[];
  sku: string;
  slug: string;
  stock: number;
};
