import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

// GET - جلب البضاعة الجديدة للصفحة الرئيسية (عام)
export async function GET() {
  try {
    // فحص الاتصال بقاعدة البيانات أولاً
    try {
      await prisma.$connect();
    } catch (connectError: any) {
      console.error("Database connection failed:", connectError);
      return NextResponse.json([], { status: 200 });
    }

    const newArrivals = await prisma.newArrival.findMany({
      where: { isActive: true },
      include: {
        product: {
          include: {
            images: true,
            category: true,
            company: true,
            colors: true,
            sizes: true,
          },
        },
      },
      orderBy: { order: "asc" },
      take: 20, // حد أقصى 20 منتج
    });

    // تحويل البيانات إلى شكل المنتجات
    const products = newArrivals.map((na) => na.product);

    return NextResponse.json(products);
  } catch (error: any) {
    console.error("GET /new-arrivals ERROR:", error);
    console.error("Error code:", error?.code);
    // إرجاع مصفوفة فارغة بدلاً من خطأ لتجنب توقف التطبيق
    return NextResponse.json([], { status: 200 });
  } finally {
    // إغلاق الاتصال برفق
    try {
      await prisma.$disconnect();
    } catch (e) {
      // تجاهل أخطاء الإغلاق
    }
  }
}
