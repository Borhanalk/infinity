import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

// DELETE - حذف منتج من البضاعة الجديدة
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.newArrival.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("DELETE /new-arrivals/[id] ERROR:", error);
    return NextResponse.json(
      { error: "فشل حذف المنتج من البضاعة الجديدة" },
      { status: 500 }
    );
  }
}

// PUT - تحديث ترتيب أو حالة المنتج
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { order, isActive } = await req.json();

    const updateData: any = {};
    if (order !== undefined) updateData.order = Number(order);
    if (isActive !== undefined) updateData.isActive = Boolean(isActive);

    const updated = await prisma.newArrival.update({
      where: { id },
      data: updateData,
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

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("PUT /new-arrivals/[id] ERROR:", error);
    return NextResponse.json(
      { error: "فشل تحديث البضاعة الجديدة" },
      { status: 500 }
    );
  }
}
