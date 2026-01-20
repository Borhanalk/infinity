import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    console.log("Fetching product with ID:", id);
    
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        images: true,
        colors: true,
        sizes: true,
        category: true,
        company: true,
      },
    });

    if (!product) {
      console.log("Product not found:", id);
      return NextResponse.json(
        { error: "Product not found", id },
        { status: 404 }
      );
    }

    console.log("Product found:", product.name);
    return NextResponse.json(product);
  } catch (error: any) {
    const { id } = await params;
    console.error("GET /products/:id ERROR:", error);
    console.error("Error details:", {
      message: error?.message,
      code: error?.code,
      id,
    });
    
    const errorMessage = error?.message || "Unknown error";
    const errorCode = error?.code || "";
    
    // فحص أنواع مختلفة من أخطاء قاعدة البيانات
    const isConnectionError =
      errorCode === "P1001" || // Can't reach database server
      errorCode === "P1000" || // Authentication failed
      errorCode === "P1017" || // Server has closed the connection
      errorMessage.includes("Tenant") ||
      errorMessage.includes("not found") ||
      errorMessage.includes("connection") ||
      errorMessage.includes("Connection") ||
      errorMessage.includes("Invalid") ||
      errorMessage.includes("Can't reach database server") ||
      errorMessage.includes("connect ECONNREFUSED") ||
      errorMessage.includes("ENOTFOUND");

    return NextResponse.json(
      {
        error: "Failed to fetch product",
        message: isConnectionError
          ? "لا يمكن الاتصال بقاعدة البيانات. يرجى التحقق من:\n1. ملف .env يحتوي على DATABASE_URL صحيح\n2. قاعدة البيانات تعمل ومتاحة\n3. الاتصال بالإنترنت نشط"
          : errorMessage,
        details: process.env.NODE_ENV === "development" 
          ? `${errorMessage} (Code: ${errorCode})` 
          : undefined,
        id,
      },
      { status: 500 }
    );
  }
}
