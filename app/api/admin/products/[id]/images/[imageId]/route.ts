import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { verifyAdminToken } from "@/app/lib/admin-auth";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ imageId: string }> }
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
    const { imageId } = await params;
    await prisma.productImage.delete({
      where: { id: imageId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /products/:id/images/:imageId ERROR:", error);
    return new NextResponse("Failed to delete image", { status: 500 });
  }
}
