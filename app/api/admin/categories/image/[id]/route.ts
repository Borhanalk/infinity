import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/app/lib/supabase-admin";
import { prisma } from "@/app/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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
