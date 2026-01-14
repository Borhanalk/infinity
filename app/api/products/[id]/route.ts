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
    const isConnectionError =
      errorMessage.includes("Tenant") ||
      errorMessage.includes("not found") ||
      errorMessage.includes("connection") ||
      errorMessage.includes("Invalid") ||
      errorMessage.includes("P1001") ||
      errorMessage.includes("P2002");

    return NextResponse.json(
      {
        error: "Failed to fetch product",
        details: isConnectionError
          ? "Database connection error. Please check your DATABASE_URL in .env file"
          : errorMessage,
        id,
      },
      { status: 500 }
    );
  }
}
