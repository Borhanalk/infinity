import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/app/lib/supabase-admin";
import { prisma } from "@/app/lib/prisma";
import { verifyAdminToken } from "@/app/lib/admin-auth";

export async function POST(
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

  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json(
      { error: "No file uploaded" },
      { status: 400 }
    );
  }

  const ext = file.name.split(".").pop();
  const fileName = `category-${id}-${Date.now()}.${ext}`;

  const { error } = await supabaseAdmin.storage
    .from("categories")
    .upload(fileName, file, {
      upsert: true,
      contentType: file.type,
    });

  if (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }

  const imageUrl =
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}` +
    `/storage/v1/object/public/categories/${fileName}`;

  await prisma.category.update({
    where: { id: Number(id) },
    data: { imageUrl },
  });

  return NextResponse.json({ success: true, imageUrl });
}
