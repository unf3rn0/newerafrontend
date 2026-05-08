import "server-only";

import { prisma } from "@/lib/db";

export function getOrdersForUser(userId: string) {
  return prisma.order.findMany({
    include: {
      items: {
        orderBy: { createdAt: "asc" },
      },
    },
    orderBy: { createdAt: "desc" },
    where: { userId },
  });
}

export function getOrderForUser(orderId: string, userId: string) {
  return prisma.order.findFirst({
    include: {
      items: {
        orderBy: { createdAt: "asc" },
      },
    },
    where: {
      id: orderId,
      userId,
    },
  });
}
