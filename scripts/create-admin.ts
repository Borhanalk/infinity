// scripts/create-admin.ts
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL?.trim();
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    console.error("❌ خطأ: يجب تحديد ADMIN_EMAIL و ADMIN_PASSWORD في ملف .env.local");
    console.error("مثال:\nADMIN_EMAIL=admin@infinity.com\nADMIN_PASSWORD=A@123");
    process.exit(1);
  }

  try {
    // حذف جميع المسؤولين السابقين
    const deleted = await prisma.admin.deleteMany({});
    console.log(`✅ تم حذف ${deleted.count} مسؤول سابق`);

    // تشفير كلمة المرور
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(adminPassword, saltRounds);

    // إنشاء المسؤول الجديد
    const admin = await prisma.admin.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
      },
    });

    console.log("✅ تم إنشاء المسؤول بنجاح!");
    console.log(`📧 البريد الإلكتروني: ${admin.email}`);
    console.log(`🆔 المعرف: ${admin.id}`);
    console.log(`📅 تاريخ الإنشاء: ${admin.createdAt.toISOString()}`);
    console.log("\n⚠️ تحذير: لا تشارك بيانات الدخول مع أي شخص!");
  } catch (error: any) {
    console.error("❌ خطأ في إنشاء المسؤول:", error?.message || error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
