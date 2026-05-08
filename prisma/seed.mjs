import "dotenv/config";
import bcrypt from "bcrypt";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const connectionString =
  process.env.DATABASE_URL ?? "postgresql://postgres:postgres@localhost:5432/newera?schema=public";

const prisma = new PrismaClient({
  adapter: new PrismaPg(connectionString),
});

const categories = [
  {
    description: "Structured outer layers for the NewEra wardrobe.",
    imageUrl:
      "https://images.unsplash.com/photo-1548624313-0396c75e4b1a?auto=format&fit=crop&w=900&q=80",
    name: "Outerwear",
    slug: "outerwear",
    sortOrder: 10,
  },
  {
    description: "Clean shirts and tops for everyday premium styling.",
    imageUrl:
      "https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=900&q=80",
    name: "Shirts",
    slug: "shirts",
    sortOrder: 20,
  },
  {
    description: "Soft knitwear with tactile texture.",
    imageUrl:
      "https://images.unsplash.com/photo-1516762689617-e1cffcef479d?auto=format&fit=crop&w=900&q=80",
    name: "Knitwear",
    slug: "knitwear",
    sortOrder: 30,
  },
  {
    description: "Tailored trousers with relaxed movement.",
    imageUrl:
      "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=900&q=80",
    name: "Trousers",
    slug: "trousers",
    sortOrder: 40,
  },
];

const products = [
  {
    brand: "NewEra",
    categorySlug: "outerwear",
    colors: ["Sky", "Porcelain"],
    composition: "Premium wool blend with a soft structured lining.",
    deliveryInfo: "Delivery is confirmed manually after QR payment verification.",
    description:
      "A structured NewEra coat designed for a clean premium wardrobe. Calm silhouette, soft blue styling, and refined everyday comfort.",
    galleryUrls: [
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80",
    ],
    gender: "UNISEX",
    imageUrl:
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1200&q=80",
    inStock: true,
    isDiscounted: false,
    isFeatured: true,
    isNew: true,
    isPopular: true,
    name: "NewEra Signature Coat",
    oldPrice: null,
    price: "1890.00",
    sizes: ["S", "M", "L"],
    sku: "NE-COAT-001",
    slug: "newera-signature-coat",
    status: "ACTIVE",
    stockQuantity: 12,
  },
];
const promoCodes = [];

async function seedAdminUser() {
  const email = process.env.ADMIN_EMAIL ?? "admin@newera.local";
  const login = process.env.ADMIN_LOGIN ?? "admin";
  const password = process.env.ADMIN_PASSWORD;

  if (!password) {
    throw new Error("ADMIN_PASSWORD is required when seeding the admin user.");
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.upsert({
    create: {
      email,
      login,
      name: "NewEra Admin",
      passwordHash,
      role: "ADMIN",
    },
    update: {
      email,
      passwordHash,
      role: "ADMIN",
    },
    where: { login },
  });
}

async function main() {
  const categoryBySlug = new Map();

  for (const category of categories) {
    const savedCategory = await prisma.category.upsert({
      create: category,
      update: category,
      where: { slug: category.slug },
    });

    categoryBySlug.set(category.slug, savedCategory);
  }

  for (const product of products) {
    const category = categoryBySlug.get(product.categorySlug);

    if (!category) {
      throw new Error(`Missing seed category: ${product.categorySlug}`);
    }

    const productData = { ...product };
    delete productData.categorySlug;

    await prisma.product.upsert({
      create: {
        ...productData,
        categoryId: category.id,
      },
      update: {
        ...productData,
        categoryId: category.id,
      },
      where: { slug: product.slug },
    });
  }

  for (const promoCode of promoCodes) {
    await prisma.promoCode.upsert({
      create: promoCode,
      update: promoCode,
      where: { code: promoCode.code },
    });
  }

  await seedAdminUser();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
