"use server";

import { randomInt } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentSession } from "@/lib/auth/current-session";
import { prisma } from "@/lib/db";
import type { Locale } from "@/lib/i18n/config";
import { localizedPath } from "@/lib/navigation";
import { checkoutSchema, type CheckoutInput } from "@/lib/validation/checkout";

type CreateOrderResult =
  | { ok: true; orderId: string }
  | { error: "auth" | "invalid" | "products"; ok: false };

function createOrderNumber() {
  const now = new Date();
  const datePart = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("");

  return `NE-${datePart}-${Date.now()}-${randomInt(1000, 9999)}`;
}

export async function createCheckoutOrder(
  locale: Locale,
  input: CheckoutInput,
): Promise<CreateOrderResult> {
  const session = await getCurrentSession();

  if (!session) {
    return { error: "auth", ok: false };
  }

  const parsed = checkoutSchema.safeParse(input);

  if (!parsed.success) {
    return { error: "invalid", ok: false };
  }

  const productIds = [...new Set(parsed.data.items.map((item) => item.productId))];
  const products = await prisma.product.findMany({
    select: {
      id: true,
      imageUrl: true,
      inStock: true,
      name: true,
      price: true,
      slug: true,
      status: true,
      stockQuantity: true,
    },
    where: {
      id: { in: productIds },
      inStock: true,
      status: "ACTIVE",
    },
  });
  const productsById = new Map(products.map((product) => [product.id, product]));

  const orderItems = parsed.data.items.map((item) => {
    const product = productsById.get(item.productId);

    if (!product || item.quantity > product.stockQuantity) {
      return null;
    }

    const price = Number(product.price);
    const lineTotal = price * item.quantity;

    return {
      color: item.color,
      imageUrl: product.imageUrl,
      lineTotal,
      price,
      productId: product.id,
      productName: product.name,
      productSlug: product.slug,
      quantity: item.quantity,
      size: item.size,
    };
  });

  if (orderItems.some((item) => item === null)) {
    return { error: "products", ok: false };
  }

  const safeOrderItems = orderItems.filter((item) => item !== null);
  const totalAmount = safeOrderItems.reduce((total, item) => total + item.lineTotal, 0);

  const order = await prisma.order.create({
    data: {
      customerAddress: parsed.data.customerAddress,
      customerComment: parsed.data.customerComment,
      customerEmail: parsed.data.customerEmail,
      customerName: parsed.data.customerName,
      customerPhone: parsed.data.customerPhone,
      discountAmount: "0.00",
      items: {
        create: safeOrderItems.map((item) => ({
          color: item.color,
          imageUrl: item.imageUrl,
          lineTotal: item.lineTotal.toFixed(2),
          price: item.price.toFixed(2),
          productId: item.productId,
          productName: item.productName,
          productSlug: item.productSlug,
          quantity: item.quantity,
          size: item.size,
        })),
      },
      orderNumber: createOrderNumber(),
      orderStatus: "NEW",
      paymentStatus: "UNPAID",
      totalAmount: totalAmount.toFixed(2),
      userId: session.userId,
    },
    select: { id: true },
  });

  revalidatePath(localizedPath(locale, "/profile"));

  return { ok: true, orderId: order.id };
}

export async function markOrderPaid(locale: Locale, orderId: string) {
  const session = await getCurrentSession();

  if (!session) {
    redirect(localizedPath(locale, `/login?next=${encodeURIComponent(`/orders/${orderId}`)}`));
  }

  const order = await prisma.order.findFirst({
    select: {
      id: true,
      paymentStatus: true,
    },
    where: {
      id: orderId,
      userId: session.userId,
    },
  });

  if (order?.paymentStatus === "UNPAID") {
    await prisma.order.update({
      data: {
        paidMarkedAt: new Date(),
        paymentNote: "User marked the QR payment as completed.",
        paymentStatus: "USER_MARKED_PAID",
      },
      where: { id: order.id },
    });
  }

  revalidatePath(localizedPath(locale, "/profile"));
  revalidatePath(localizedPath(locale, `/orders/${orderId}`));
  redirect(localizedPath(locale, `/orders/${orderId}`));
}
