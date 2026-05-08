import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  datasource: {
    url:
      process.env.MIGRATE_DATABASE_URL ??
      process.env.DATABASE_URL ??
      "postgresql://postgres:postgres@localhost:5432/newera?schema=public",
  },
  migrations: {
    seed: "node prisma/seed.mjs",
  },
  schema: "prisma/schema.prisma",
});
