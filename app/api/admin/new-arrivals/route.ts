import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { verifyAdminToken } from "@/app/lib/admin-auth";

// GET - جلب جميع البضاعة الجديدة
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
    const newArrivals = await prisma.newArrival.findMany({
      where: { isActive: true },
      include: {
        product: {
          include: {
            images: true,
            category: true,
            company: true,
          },
        },
      },
      orderBy: { order: "asc" },
    });

    return NextResponse.json(newArrivals);
  } catch (error: any) {
    console.error("GET /new-arrivals ERROR:", error);
    return NextResponse.json(
      { error: "فشل جلب البضاعة الجديدة" },
      { status: 500 }
    );
  }
}

// POST - إضافة منتج للبضاعة الجديدة
export async function POST(req: NextRequest) {
  try {
    const { productId, order } = await req.json();

    if (!productId || typeof productId !== "string") {
      return NextResponse.json(
        { error: "معرف المنتج مطلوب" },
        { status: 400 }
      );
    }

    // التحقق من وجود المنتج
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json(
        { error: "المنتج غير موجود" },
        { status: 404 }
      );
    }

    // التحقق من عدم وجود المنتج بالفعل
    const existing = await prisma.newArrival.findUnique({
      where: { productId },
    });

    if (existing) {
      return NextResponse.json(
        { error: "المنتج موجود بالفعل في البضاعة الجديدة" },
        { status: 400 }
      );
    }

    // الحصول على آخر ترتيب
    const lastOrder = await prisma.newArrival.findFirst({
      orderBy: { order: "desc" },
      select: { order: true },
    });

    const newOrder = order !== undefined ? Number(order) : (lastOrder?.order ?? -1) + 1;

    const newArrival = await prisma.newArrival.create({
      data: {
        productId,
        order: newOrder,
      },
      include: {
        product: {
          include: {
            images: true,
            category: true,
            company: true,
          },
        },
      },
    });

    return NextResponse.json(newArrival);
  } catch (error: any) {
    console.error("POST /new-arrivals ERROR:", error);
    
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "المنتج موجود بالفعل في البضاعة الجديدة" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "فشل إضافة المنتج للبضاعة الجديدة" },
      { status: 500 }
    );
  }
}
