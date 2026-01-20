import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    errorFormat: "pretty",
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

// فحص الاتصال بقاعدة البيانات عند بدء التطبيق (في development فقط)
if (process.env.NODE_ENV === "development") {
  prisma.$connect()
    .then(() => {
      console.log("✅ Database connection established");
    })
    .catch((error) => {
      console.error("❌ Database connection failed:", error);
      console.error("Please check your DATABASE_URL in .env file");
    });
}
