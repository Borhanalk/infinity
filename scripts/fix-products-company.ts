// scripts/fix-products-company.ts
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  try {
    // إنشاء شركة افتراضية إذا لم تكن موجودة
    let defaultCompany = await prisma.company.findFirst({
      where: { name: "غير محدد" },
    });

    if (!defaultCompany) {
      defaultCompany = await prisma.company.create({
        data: {
          name: "غير محدد",
        },
      });
      console.log("✅ تم إنشاء شركة افتراضية");
    }

    // تحديث جميع المنتجات التي لا تحتوي على companyId
    const result = await prisma.product.updateMany({
      where: {
        companyId: null,
      },
      data: {
        companyId: defaultCompany.id,
      },
    });

    console.log(`✅ تم تحديث ${result.count} منتج بدون شركة`);
    console.log("✅ الآن يمكنك تشغيل: npx prisma db push");
  } catch (error: any) {
    console.error("❌ خطأ:", error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
