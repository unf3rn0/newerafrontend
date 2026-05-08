import "server-only";

import { prisma } from "@/lib/db";

export async function getAdminDashboardData() {
  const [categories, products, orders, promoCodes, users, stats] = await Promise.all([
    prisma.category.findMany({
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      include: { _count: { select: { products: true } } },
    }),
    prisma.product.findMany({
      include: { category: true },
      orderBy: [{ createdAt: "desc" }],
    }),
    prisma.order.findMany({
      include: {
        items: { orderBy: { createdAt: "asc" } },
        user: { select: { email: true, login: true } },
      },
      orderBy: [{ createdAt: "desc" }],
      take: 50,
    }),
    prisma.promoCode.findMany({
      orderBy: [{ createdAt: "desc" }],
      take: 50,
    }),
    prisma.user.findMany({
      include: { _count: { select: { orders: true } } },
      orderBy: [{ createdAt: "desc" }],
      take: 50,
    }),
    Promise.all([
      prisma.product.count(),
      prisma.category.count(),
      prisma.order.count(),
      prisma.promoCode.count(),
      prisma.user.count(),
      prisma.order.aggregate({ _sum: { totalAmount: true } }),
    ]),
  ]);

  const [productCount, categoryCount, orderCount, promoCodeCount, userCount, orderTotals] = stats;

  return {
    categories,
    orders,
    products,
    promoCodes,
    stats: {
      categoryCount,
      orderCount,
      productCount,
      promoCodeCount,
      revenue: Number(orderTotals._sum.totalAmount ?? 0),
      userCount,
    },
    users,
  };
}
