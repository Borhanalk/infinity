import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { verifyAdminToken } from "@/app/lib/admin-auth";

// GET - جلب شركة واحدة
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // التحقق من المسؤول
  const admin = await verifyAdminToken(req);
  if (!admin) {
    return NextResponse.json(
      { error: "غير مصرح. يرجى تسجيل الدخول كمسؤول" },
      { status: 401 }
    );
  }
  try {
    const { id } = await params;
    const companyId = parseInt(id);

    if (isNaN(companyId)) {
      return NextResponse.json(
        { error: "معرف الشركة غير صحيح" },
        { status: 400 }
      );
    }

    const company = await prisma.company.findUnique({
      where: { id: companyId },
      include: {
        products: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!company) {
      return NextResponse.json(
        { error: "الشركة غير موجودة" },
        { status: 404 }
      );
    }

    return NextResponse.json(company);
  } catch (error: any) {
    console.error("GET /companies/[id] ERROR:", error);
    return NextResponse.json(
      { error: "فشل تحميل الشركة" },
      { status: 500 }
    );
  }
}

// PUT - تحديث شركة
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // التحقق من المسؤول
  const admin = await verifyAdminToken(req);
  if (!admin) {
    return NextResponse.json(
      { error: "غير مصرح. يرجى تسجيل الدخول كمسؤول" },
      { status: 401 }
    );
  }
  try {
    const { id } = await params;
    const companyId = parseInt(id);

    if (isNaN(companyId)) {
      return NextResponse.json(
        { error: "معرف الشركة غير صحيح" },
        { status: 400 }
      );
    }

    const { name, logoUrl } = await req.json();

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        { error: "اسم الشركة مطلوب" },
        { status: 400 }
      );
    }

    const company = await prisma.company.update({
      where: { id: companyId },
      data: {
        name: name.trim(),
        logoUrl: logoUrl || null,
      },
    });

    return NextResponse.json(company);
  } catch (error: any) {
    console.error("PUT /companies/[id] ERROR:", error);
    
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "الشركة غير موجودة" },
        { status: 404 }
      );
    }

    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "اسم الشركة موجود بالفعل" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "فشل تحديث الشركة" },
      { status: 500 }
    );
  }
}

// DELETE - حذف شركة
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // التحقق من المسؤول
  const admin = await verifyAdminToken(req);
  if (!admin) {
    return NextResponse.json(
      { error: "غير مصرح. يرجى تسجيل الدخول كمسؤول" },
      { status: 401 }
    );
  }
  try {
    const { id } = await params;
    const companyId = parseInt(id);

    if (isNaN(companyId)) {
      return NextResponse.json(
        { error: "معرف الشركة غير صحيح" },
        { status: 400 }
      );
    }

    // التحقق من وجود منتجات مرتبطة بالشركة
    const productsCount = await prisma.product.count({
      where: { companyId },
    });

    if (productsCount > 0) {
      return NextResponse.json(
        { error: `لا يمكن حذف الشركة لأنها مرتبطة بـ ${productsCount} منتج` },
        { status: 400 }
      );
    }

    await prisma.company.delete({
      where: { id: companyId },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("DELETE /companies/[id] ERROR:", error);
    
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "الشركة غير موجودة" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "فشل حذف الشركة" },
      { status: 500 }
    );
  }
}
