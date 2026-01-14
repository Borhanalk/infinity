import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET() {
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
