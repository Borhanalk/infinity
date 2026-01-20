import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { verifyAdminToken } from "@/app/lib/admin-auth";

type Product = {
  id: string;
  name: string;
  price: number;
  createdAt: string;
  images?: Array<{ url: string }>;
  company?: { id: number; name: string; logoUrl?: string | null } | null;
  category?: { id: number; name: string } | null;
};

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
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        price: true,
        createdAt: true,
        images: {
          select: {
            url: true,
          },
          take: 1,
        },
        company: {
          select: {
            id: true,
            name: true,
            logoUrl: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // تجميع حسب الشركة ثم حسب الفئة
    type CompanyGroup = {
      companyId: number;
      companyName: string;
      companyLogoUrl: string | null;
      categories: Record<string, Product[]>;
    };

    const companyGroups: Record<string, CompanyGroup> = {};

    for (const p of products) {
      const companyName = p.company?.name || "بدون شركة";
      const companyId = p.company?.id || 0;
      const companyLogoUrl = p.company?.logoUrl || null;
      const categoryName = p.category?.name || "بدون فئة";

      if (!companyGroups[companyName]) {
        companyGroups[companyName] = {
          companyId,
          companyName,
          companyLogoUrl,
          categories: {},
        };
      }

      if (!companyGroups[companyName].categories[categoryName]) {
        companyGroups[companyName].categories[categoryName] = [];
      }

      companyGroups[companyName].categories[categoryName].push({
        ...p,
        createdAt: p.createdAt.toISOString(),
      });
    }

    return NextResponse.json(companyGroups);
  } catch (error) {
    console.error("GET /products/list ERROR:", error);
    return new NextResponse("Failed to fetch products", { status: 500 });
  }
}
