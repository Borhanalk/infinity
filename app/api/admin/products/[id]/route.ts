import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

/* =========================
   GET SINGLE PRODUCT
========================= */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("GET /products/:id ERROR:", error);
    return new NextResponse("Failed to fetch product", { status: 500 });
  }
}

/* =========================
   UPDATE PRODUCT (with images)
========================= */
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { name, price, description, images, companyId } = await req.json();

    // التحقق من الصور
    if (images && Array.isArray(images)) {
      if (images.length === 0) {
        return new NextResponse("يجب أن يكون للمنتج صورة واحدة على الأقل", { status: 400 });
      }
      if (images.length > 3) {
        return new NextResponse("يمكنك إضافة 3 صور كحد أقصى", { status: 400 });
      }
    }

    if (!name || typeof name !== "string" || !name.trim()) {
      return new NextResponse("Name is required", { status: 400 });
    }
    if (typeof price !== "number" || Number.isNaN(price)) {
      return new NextResponse("Price must be a number", { status: 400 });
    }
    if (!description || typeof description !== "string") {
      return new NextResponse("Description is required", { status: 400 });
    }
    if (typeof companyId !== "number") {
      return new NextResponse("companyId must be a number", { status: 400 });
    }

    const company = await prisma.company.findUnique({
      where: { id: companyId },
    });
    if (!company) {
      return new NextResponse("Company not found", { status: 400 });
    }

    // Update product and images
    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
        price,
        description,
        companyId: Number(companyId),
        images: images && Array.isArray(images) ? {
          deleteMany: {},
          create: images.map((url: string) => ({ url })),
        } : undefined,
      },
      include: {
        images: true,
        colors: true,
        sizes: true,
        company: true,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("PUT /products/:id ERROR:", error);
    return new NextResponse("Failed to update product", { status: 500 });
  }
}
