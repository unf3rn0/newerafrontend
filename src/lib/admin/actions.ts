"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/guards";
import { prisma } from "@/lib/db";
import type { Locale } from "@/lib/i18n/config";
import { localizedPath } from "@/lib/navigation";
import {
  adminCategorySchema,
  adminOrderStatusSchema,
  adminProductSchema,
  adminPromoCodeSchema,
} from "@/lib/validation/admin";

type AdminStatus =
  | "category-created"
  | "category-updated"
  | "category-deleted"
  | "category-error"
  | "product-created"
  | "product-updated"
  | "product-deleted"
  | "product-error"
  | "promo-created"
  | "promo-updated"
  | "promo-deleted"
  | "promo-error"
  | "order-updated"
  | "order-error";

function adminRedirect(locale: Locale, status: AdminStatus): never {
  redirect(localizedPath(locale, `/admin?status=${status}`));
}

function bool(formData: FormData, name: string) {
  return formData.get(name) === "true";
}

function splitList(value: FormDataEntryValue | null) {
  if (typeof value !== "string") {
    return [];
  }

  return value
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function productPayload(formData: FormData) {
  return {
    brand: formData.get("brand"),
    categoryId: formData.get("categoryId"),
    colors: splitList(formData.get("colors")),
    composition: formData.get("composition"),
    deliveryInfo: formData.get("deliveryInfo"),
    description: formData.get("description"),
    discountPercent: formData.get("discountPercent"),
    discountValue: formData.get("discountValue"),
    galleryUrls: splitList(formData.get("galleryUrls")),
    gender: formData.get("gender"),
    imageUrl: formData.get("imageUrl"),
    inStock: bool(formData, "inStock"),
    isDiscounted: bool(formData, "isDiscounted"),
    isFeatured: bool(formData, "isFeatured"),
    isNew: bool(formData, "isNew"),
    isPopular: bool(formData, "isPopular"),
    name: formData.get("name"),
    oldPrice: formData.get("oldPrice"),
    price: formData.get("price"),
    sizes: splitList(formData.get("sizes")),
    sku: formData.get("sku"),
    slug: formData.get("slug"),
    status: formData.get("status"),
    stockQuantity: formData.get("stockQuantity"),
  };
}

function categoryPayload(formData: FormData) {
  return {
    description: formData.get("description"),
    imageUrl: formData.get("imageUrl"),
    isActive: bool(formData, "isActive"),
    name: formData.get("name"),
    slug: formData.get("slug"),
    sortOrder: formData.get("sortOrder"),
  };
}

function promoCodePayload(formData: FormData) {
  return {
    code: formData.get("code"),
    description: formData.get("description"),
    discountType: formData.get("discountType"),
    discountValue: formData.get("discountValue"),
    expiresAt: formData.get("expiresAt"),
    isActive: bool(formData, "isActive"),
    maxDiscountAmount: formData.get("maxDiscountAmount"),
    minimumOrderAmount: formData.get("minimumOrderAmount"),
    startsAt: formData.get("startsAt"),
    usageLimit: formData.get("usageLimit"),
  };
}

function revalidateAdmin(locale: Locale) {
  revalidatePath(localizedPath(locale, "/admin"));
  revalidatePath(localizedPath(locale));
  revalidatePath(localizedPath(locale, "/catalog"));
}

export async function createCategoryAction(locale: Locale, formData: FormData) {
  await requireAdmin(locale);
  const parsed = adminCategorySchema.safeParse(categoryPayload(formData));

  if (!parsed.success) {
    adminRedirect(locale, "category-error");
  }

  await prisma.category.create({ data: parsed.data });
  revalidateAdmin(locale);
  adminRedirect(locale, "category-created");
}

export async function updateCategoryAction(locale: Locale, categoryId: string, formData: FormData) {
  await requireAdmin(locale);
  const parsed = adminCategorySchema.safeParse(categoryPayload(formData));

  if (!parsed.success) {
    adminRedirect(locale, "category-error");
  }

  await prisma.category.update({
    data: parsed.data,
    where: { id: categoryId },
  });
  revalidateAdmin(locale);
  adminRedirect(locale, "category-updated");
}

export async function deleteCategoryAction(locale: Locale, categoryId: string) {
  await requireAdmin(locale);

  const productCount = await prisma.product.count({ where: { categoryId } });

  if (productCount > 0) {
    adminRedirect(locale, "category-error");
  }

  await prisma.category.delete({ where: { id: categoryId } });
  revalidateAdmin(locale);
  adminRedirect(locale, "category-deleted");
}

export async function createProductAction(locale: Locale, formData: FormData) {
  await requireAdmin(locale);
  const parsed = adminProductSchema.safeParse(productPayload(formData));

  if (!parsed.success) {
    adminRedirect(locale, "product-error");
  }

  await prisma.product.create({
    data: {
      ...parsed.data,
      discountValue: parsed.data.discountValue?.toFixed(2),
      oldPrice: parsed.data.oldPrice?.toFixed(2),
      price: parsed.data.price.toFixed(2),
    },
  });
  revalidateAdmin(locale);
  adminRedirect(locale, "product-created");
}

export async function updateProductAction(locale: Locale, productId: string, formData: FormData) {
  await requireAdmin(locale);
  const parsed = adminProductSchema.safeParse(productPayload(formData));

  if (!parsed.success) {
    adminRedirect(locale, "product-error");
  }

  await prisma.product.update({
    data: {
      ...parsed.data,
      discountValue: parsed.data.discountValue?.toFixed(2) ?? null,
      oldPrice: parsed.data.oldPrice?.toFixed(2) ?? null,
      price: parsed.data.price.toFixed(2),
    },
    where: { id: productId },
  });
  revalidateAdmin(locale);
  adminRedirect(locale, "product-updated");
}

export async function deleteProductAction(locale: Locale, productId: string) {
  await requireAdmin(locale);

  await prisma.$transaction([
    prisma.cartItem.deleteMany({ where: { productId } }),
    prisma.favorite.deleteMany({ where: { productId } }),
    prisma.review.deleteMany({ where: { productId } }),
    prisma.product.delete({ where: { id: productId } }),
  ]);

  revalidateAdmin(locale);
  adminRedirect(locale, "product-deleted");
}

export async function createPromoCodeAction(locale: Locale, formData: FormData) {
  await requireAdmin(locale);
  const parsed = adminPromoCodeSchema.safeParse(promoCodePayload(formData));

  if (!parsed.success) {
    adminRedirect(locale, "promo-error");
  }

  await prisma.promoCode.create({
    data: {
      ...parsed.data,
      discountValue: parsed.data.discountValue.toFixed(2),
      maxDiscountAmount: parsed.data.maxDiscountAmount?.toFixed(2),
      minimumOrderAmount: parsed.data.minimumOrderAmount?.toFixed(2),
    },
  });
  revalidateAdmin(locale);
  adminRedirect(locale, "promo-created");
}

export async function updatePromoCodeAction(
  locale: Locale,
  promoCodeId: string,
  formData: FormData,
) {
  await requireAdmin(locale);
  const parsed = adminPromoCodeSchema.safeParse(promoCodePayload(formData));

  if (!parsed.success) {
    adminRedirect(locale, "promo-error");
  }

  await prisma.promoCode.update({
    data: {
      ...parsed.data,
      discountValue: parsed.data.discountValue.toFixed(2),
      maxDiscountAmount: parsed.data.maxDiscountAmount?.toFixed(2) ?? null,
      minimumOrderAmount: parsed.data.minimumOrderAmount?.toFixed(2) ?? null,
    },
    where: { id: promoCodeId },
  });
  revalidateAdmin(locale);
  adminRedirect(locale, "promo-updated");
}

export async function deletePromoCodeAction(locale: Locale, promoCodeId: string) {
  await requireAdmin(locale);

  await prisma.promoCode.delete({ where: { id: promoCodeId } });
  revalidateAdmin(locale);
  adminRedirect(locale, "promo-deleted");
}

export async function updateOrderStatusAction(locale: Locale, orderId: string, formData: FormData) {
  await requireAdmin(locale);
  const parsed = adminOrderStatusSchema.safeParse({
    orderStatus: formData.get("orderStatus") || undefined,
    paymentStatus: formData.get("paymentStatus") || undefined,
  });

  if (!parsed.success || (!parsed.data.orderStatus && !parsed.data.paymentStatus)) {
    adminRedirect(locale, "order-error");
  }

  await prisma.order.update({
    data: parsed.data,
    where: { id: orderId },
  });
  revalidateAdmin(locale);
  revalidatePath(localizedPath(locale, `/orders/${orderId}`));
  adminRedirect(locale, "order-updated");
}

export async function setOrderPaymentAction(
  locale: Locale,
  orderId: string,
  paymentStatus: "CONFIRMED" | "REJECTED",
) {
  await requireAdmin(locale);

  await prisma.order.update({
    data: { paymentStatus },
    where: { id: orderId },
  });
  revalidateAdmin(locale);
  revalidatePath(localizedPath(locale, `/orders/${orderId}`));
  adminRedirect(locale, "order-updated");
}

export async function setOrderStatusAction(
  locale: Locale,
  orderId: string,
  orderStatus: "PROCESSING" | "SHIPPED" | "COMPLETED" | "CANCELLED",
) {
  await requireAdmin(locale);

  await prisma.order.update({
    data: { orderStatus },
    where: { id: orderId },
  });
  revalidateAdmin(locale);
  revalidatePath(localizedPath(locale, `/orders/${orderId}`));
  adminRedirect(locale, "order-updated");
}
