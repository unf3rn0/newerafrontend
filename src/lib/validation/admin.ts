import { z } from "zod";

const slugSchema = z
  .string()
  .trim()
  .min(2)
  .max(120)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

const optionalText = (maxLength: number) =>
  z.preprocess(
    (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
    z.string().trim().max(maxLength).optional(),
  );

const optionalNumber = z.preprocess(
  (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
  z.coerce.number().min(0).optional(),
);

const optionalInteger = z.preprocess(
  (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
  z.coerce.number().int().min(0).optional(),
);

const optionalDate = z.preprocess((value) => {
  if (typeof value !== "string" || value.trim() === "") {
    return undefined;
  }

  return new Date(value);
}, z.date().optional());

export const adminCategorySchema = z.object({
  description: optionalText(500),
  imageUrl: optionalText(1000),
  isActive: z.boolean(),
  name: z.string().trim().min(2).max(120),
  slug: slugSchema,
  sortOrder: z.coerce.number().int().min(0).max(9999),
});

export const adminProductSchema = z.object({
  brand: z.string().trim().min(2).max(120),
  categoryId: z.string().trim().min(1),
  colors: z.array(z.string().trim().min(1).max(64)).min(1).max(30),
  composition: optionalText(1000),
  deliveryInfo: optionalText(1000),
  description: z.string().trim().min(10).max(3000),
  discountPercent: optionalNumber,
  discountValue: optionalNumber,
  galleryUrls: z.array(z.string().trim().min(1).max(1000)).max(12),
  gender: z.enum(["WOMEN", "MEN", "UNISEX"]),
  imageUrl: z.string().trim().min(1).max(1000),
  inStock: z.boolean(),
  isDiscounted: z.boolean(),
  isFeatured: z.boolean(),
  isNew: z.boolean(),
  isPopular: z.boolean(),
  name: z.string().trim().min(2).max(160),
  oldPrice: optionalNumber,
  price: z.coerce.number().positive().max(1000000),
  sizes: z.array(z.string().trim().min(1).max(24)).min(1).max(30),
  sku: z.string().trim().min(2).max(120),
  slug: slugSchema,
  status: z.enum(["DRAFT", "ACTIVE", "ARCHIVED"]),
  stockQuantity: z.coerce.number().int().min(0).max(100000),
});

export const adminOrderStatusSchema = z.object({
  orderStatus: z.enum(["NEW", "PROCESSING", "SHIPPED", "COMPLETED", "CANCELLED"]).optional(),
  paymentStatus: z
    .enum(["UNPAID", "USER_MARKED_PAID", "WAITING_CONFIRMATION", "CONFIRMED", "REJECTED"])
    .optional(),
});

export const adminPromoCodeSchema = z
  .object({
    code: z
      .string()
      .trim()
      .min(2)
      .max(64)
      .transform((value) => value.toUpperCase()),
    description: optionalText(500),
    discountType: z.enum(["PERCENT", "FIXED"]),
    discountValue: z.coerce.number().positive().max(1000000),
    expiresAt: optionalDate,
    isActive: z.boolean(),
    maxDiscountAmount: optionalNumber,
    minimumOrderAmount: optionalNumber,
    startsAt: optionalDate,
    usageLimit: optionalInteger,
  })
  .refine((value) => value.discountType !== "PERCENT" || value.discountValue <= 100, {
    path: ["discountValue"],
  })
  .refine((value) => !value.startsAt || !value.expiresAt || value.expiresAt >= value.startsAt, {
    path: ["expiresAt"],
  });

export type AdminCategoryInput = z.infer<typeof adminCategorySchema>;
export type AdminProductInput = z.infer<typeof adminProductSchema>;
export type AdminPromoCodeInput = z.infer<typeof adminPromoCodeSchema>;
