import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { verifyAdminToken } from "@/app/lib/admin-auth";

export async function GET(req: NextRequest) {
  // التحقق من المسؤول
  const admin = await verifyAdminToken(req);
  if (!admin) {
    return NextResponse.json(
      { error: "غير مصرح. يرجى تسجيل الدخول كمسؤول" },
      { status: 401 }
    );
  }
  try {
    const [productCount, categoryCount, recentProducts] = await Promise.all([
      prisma.product.count(),
      prisma.category.count(),
      prisma.product.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          price: true,
          createdAt: true,
        },
      }),
    ]);

    return NextResponse.json({
      products: productCount,
      categories: categoryCount,
      recentProducts: recentProducts.map((p) => ({
        ...p,
        createdAt: p.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error("GET /admin/stats ERROR:", error);
    return new NextResponse("Failed to fetch stats", { status: 500 });
  }
}
