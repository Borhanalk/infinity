import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { verifyAdminToken } from "@/app/lib/admin-auth";

// GET - جلب جميع الشركات
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
    const companies = await prisma.company.findMany({
      orderBy: { name: "asc" },
    });

    return NextResponse.json(companies);
  } catch (error: any) {
    console.error("GET /companies ERROR:", error);
    return NextResponse.json(
      { error: "فشل تحميل الشركات", companies: [] },
      { status: 200 }
    );
  }
}

// POST - إنشاء شركة جديدة
export async function POST(req: NextRequest) {
  try {
    const { name, logoUrl } = await req.json();

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        { error: "اسم الشركة مطلوب" },
        { status: 400 }
      );
    }

    const company = await prisma.company.create({
      data: {
        name: name.trim(),
        logoUrl: logoUrl || null,
      },
    });

    return NextResponse.json(company);
  } catch (error: any) {
    console.error("POST /companies ERROR:", error);
    
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "اسم الشركة موجود بالفعل" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "فشل إنشاء الشركة" },
      { status: 500 }
    );
  }
}
