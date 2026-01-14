import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { id: "desc" },
    });

    return NextResponse.json(categories);
  } catch (error: any) {
    console.error("GET /categories ERROR:", error);

    const errorMessage = error?.message || "Unknown error";
    const isConnectionError =
      errorMessage.includes("Tenant") ||
      errorMessage.includes("not found") ||
      errorMessage.includes("connection") ||
      errorMessage.includes("Invalid");

    // إرجاع مصفوفة فارغة مع رسالة خطأ في الـ response
    return NextResponse.json(
      {
        error: "Database connection error",
        message: isConnectionError
          ? "Please check your DATABASE_URL in .env file. Make sure your Supabase project is active and the connection string is correct."
          : errorMessage,
        categories: [] // مصفوفة فارغة لتجنب توقف التطبيق
      },
      { status: 200 } // 200 بدلاً من 500 حتى لا يتوقف التطبيق
    );
  }
}

export async function POST(req: Request) {
  try {
    const { name } = await req.json();

    if (!name || !name.trim()) {
      return new NextResponse("Category name is required", { status: 400 });
    }

    const category = await prisma.category.create({
      data: { name },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error("POST /categories ERROR:", error);
    return new NextResponse("Failed to create category", { status: 500 });
  }
}
