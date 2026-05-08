import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import type { CategoryPreview, LocalizedText, ProductPreview } from "@/lib/catalog/types";
import { mapProductColor } from "@/lib/catalog/options";
import type { CatalogSearchInput } from "@/lib/validation/catalog";

type ProductWithRelations = Prisma.ProductGetPayload<{
  include: {
    category: true;
    reviews: {
      include: {
        user: {
          select: {
            login: true;
            name: true;
          };
        };
      };
    };
  };
}>;

const categoryCopy: Record<string, { description: LocalizedText; name: LocalizedText }> = {
  knitwear: {
    description: {
      en: "Soft pieces with tactile premium texture.",
      ru: "Мягкие вещи с тактильной premium-фактурой.",
      tg: "Молҳои мулоим бо фактураи premium.",
    },
    name: { en: "Knitwear", ru: "Трикотаж", tg: "Трикотаж" },
  },
  outerwear: {
    description: {
      en: "Outer layers with clean structure and quiet volume.",
      ru: "Верхние слои с чистой структурой и спокойным объемом.",
      tg: "Қабатҳои болоӣ бо сохтори тоза ва ҳаҷми ором.",
    },
    name: { en: "Outerwear", ru: "Верхняя одежда", tg: "Либоси болоӣ" },
  },
  shirts: {
    description: {
      en: "Shirts and tops for polished everyday looks.",
      ru: "Рубашки и топы для собранных ежедневных образов.",
      tg: "Куртаҳо ва топҳо барои образҳои ҳаррӯзаи мураттаб.",
    },
    name: { en: "Shirts", ru: "Рубашки", tg: "Куртаҳо" },
  },
  trousers: {
    description: {
      en: "Tailored bottoms with relaxed movement.",
      ru: "Низ с выверенной посадкой и свободным движением.",
      tg: "Поёнпӯш бо нишасти дақиқ ва ҳаракати озод.",
    },
    name: { en: "Trousers", ru: "Брюки", tg: "Шимҳо" },
  },
};

function localized(value: string): LocalizedText {
  return { en: value, ru: value, tg: value };
}

function mapCategory(category: {
  description: string | null;
  imageUrl: string | null;
  name: string;
  slug: string;
}): CategoryPreview {
  const knownCopy = categoryCopy[category.slug];

  return {
    description: knownCopy?.description ?? localized(category.description ?? ""),
    imageUrl: category.imageUrl ?? "/assets/brand-mark.svg",
    name: knownCopy?.name ?? localized(category.name),
    slug: category.slug,
  };
}

function mapProduct(product: ProductWithRelations): ProductPreview {
  const imageUrls = [product.imageUrl, ...product.galleryUrls].filter(Boolean);
  const oldPrice = product.oldPrice === null ? undefined : Number(product.oldPrice);
  const description = localized(product.description);

  return {
    brand: product.brand,
    categorySlug: product.category.slug,
    colors: product.colors.map(mapProductColor),
    composition: localized(product.composition ?? ""),
    delivery: localized(product.deliveryInfo ?? ""),
    description,
    gender: product.gender,
    id: product.id,
    imageAlt: localized(product.name),
    imageUrls,
    isFeatured: product.isFeatured,
    isNew: product.isNew,
    isPopular: product.isPopular,
    name: localized(product.name),
    oldPrice,
    price: Number(product.price),
    reviews: product.reviews.map((review) => ({
      author: review.user.name ?? review.user.login,
      body: localized(review.body ?? product.description),
      rating: review.rating,
    })),
    sizes: product.sizes,
    sku: product.sku,
    slug: product.slug,
    stock: product.stockQuantity,
  };
}

async function getActiveProducts() {
  const products = await prisma.product.findMany({
    include: {
      category: true,
      reviews: {
        include: {
          user: {
            select: {
              login: true,
              name: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        where: { isVisible: true },
      },
    },
    orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
    where: { status: "ACTIVE" },
  });

  return products.map(mapProduct);
}

export async function getCategories() {
  const categories = await prisma.category.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    where: { isActive: true },
  });

  return categories.map(mapCategory);
}

export async function getFeaturedProducts(limit?: number) {
  const products = (await getActiveProducts()).filter((product) => product.isFeatured);

  return typeof limit === "number" ? products.slice(0, limit) : products;
}

export async function getNewProducts(limit?: number) {
  const products = (await getActiveProducts()).filter((product) => product.isNew);

  return typeof limit === "number" ? products.slice(0, limit) : products;
}

export async function getPopularProducts(limit?: number) {
  const products = (await getActiveProducts()).filter((product) => product.isPopular);

  return typeof limit === "number" ? products.slice(0, limit) : products;
}

export async function getProductBySlug(slug: string) {
  const product = await prisma.product.findFirst({
    include: {
      category: true,
      reviews: {
        include: {
          user: {
            select: {
              login: true,
              name: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        where: { isVisible: true },
      },
    },
    where: {
      slug,
      status: "ACTIVE",
    },
  });

  return product ? mapProduct(product) : null;
}

export async function getRelatedProducts(product: ProductPreview) {
  const products = (await getActiveProducts()).filter((item) => item.slug !== product.slug);

  return products
    .filter((item) => item.categorySlug === product.categorySlug)
    .concat(products.filter((item) => item.categorySlug !== product.categorySlug))
    .slice(0, 3);
}

export async function filterProducts(input: CatalogSearchInput) {
  const query = input.q?.toLowerCase();

  const filtered = (await getActiveProducts()).filter((product) => {
    const matchesQuery =
      !query ||
      Object.values(product.name).some((value) => value.toLowerCase().includes(query)) ||
      Object.values(product.description).some((value) => value.toLowerCase().includes(query));
    const matchesCategory = !input.category || product.categorySlug === input.category;
    const matchesSize = !input.size || product.sizes.includes(input.size);
    const matchesColor =
      !input.color || product.colors.some((color) => color.value === input.color);
    const matchesGender = !input.gender || product.gender === input.gender;
    const matchesMin = input.min === undefined || product.price >= input.min;
    const matchesMax = input.max === undefined || product.price <= input.max;
    const matchesNew = !input.new || product.isNew;
    const matchesSale = !input.sale || product.oldPrice !== undefined;
    const matchesPopular = !input.popular || product.isPopular;

    return (
      matchesQuery &&
      matchesCategory &&
      matchesSize &&
      matchesColor &&
      matchesGender &&
      matchesMin &&
      matchesMax &&
      matchesNew &&
      matchesSale &&
      matchesPopular
    );
  });

  return filtered.sort((a, b) => {
    switch (input.sort) {
      case "new":
        return Number(b.isNew) - Number(a.isNew);
      case "popular":
        return Number(b.isPopular) - Number(a.isPopular);
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      case "featured":
      default:
        return Number(b.isFeatured) - Number(a.isFeatured);
    }
  });
}
