import { z } from "zod";

const optionalText = (maxLength: number) =>
  z.preprocess(
    (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
    z.string().trim().max(maxLength).optional(),
  );

const optionalEmail = z.preprocess(
  (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
  z.string().trim().toLowerCase().email().max(190).optional(),
);

export const checkoutCartItemSchema = z.object({
  color: optionalText(64),
  productId: z.string().trim().min(1),
  quantity: z.number().int().min(1).max(99),
  size: optionalText(32),
});

export const checkoutSchema = z.object({
  customerAddress: z.string().trim().min(5).max(300),
  customerComment: optionalText(500),
  customerEmail: optionalEmail,
  customerName: z.string().trim().min(2).max(120),
  customerPhone: z.string().trim().min(7).max(32),
  items: z.array(checkoutCartItemSchema).min(1).max(50),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
