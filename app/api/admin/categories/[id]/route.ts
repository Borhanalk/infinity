import {prisma} from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken } from "@/app/lib/admin-auth";

/* =========================
   GET: جلب Category واحد
========================= */
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
  const { id } = await params;
  const category = await prisma.category.findUnique({
    where: { id: Number(id) },
  });

  if (!category) {
    return NextResponse.json(
      { error: "Category not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(category);
}

/* =========================
   PUT: تعديل الاسم
========================= */
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
  const { id } = await params;
  const { name } = await req.json();

  if (!name || !name.trim()) {
    return NextResponse.json(
      { error: "Name is required" },
      { status: 400 }
    );
  }

  const category = await prisma.category.update({
    where: { id: Number(id) },
    data: { name },
  });

  return NextResponse.json(category);
}

/* =========================
   DELETE: حذف Category
========================= */
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
    const categoryId = Number(id);

    const relatedCount = await prisma.product.count({
      where: { categoryId },
    });

    if (relatedCount > 0) {
      return NextResponse.json(
        { error: "Category has products. Delete or reassign them first." },
        { status: 400 }
      );
    }

    await prisma.category.delete({
      where: { id: categoryId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE category ERROR:", error);
    return NextResponse.json(
      { error: "Failed to delete category" },
      { status: 500 }
    );
  }
}
