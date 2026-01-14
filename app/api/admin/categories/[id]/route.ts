import {prisma} from "@/app/lib/prisma";
import { NextResponse } from "next/server";

/* =========================
   GET: جلب Category واحد
========================= */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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
