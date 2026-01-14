import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

// GET - جلب البضاعة الجديدة للصفحة الرئيسية (عام)
export async function GET() {
  try {
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
    return NextResponse.json(
      { error: "فشل جلب البضاعة الجديدة" },
      { status: 500 }
    );
  }
}
