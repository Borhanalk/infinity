import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

/* =================================================
   CREATE PRODUCT
   POST /api/admin/products
================================================= */
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      name,
      price,
      description,
      categoryId,
      companyId,
      images,
      colors,
      sizes,
      isNew,
      isOnSale,
      discountPercent,
      originalPrice,
    } = body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return new NextResponse("Name is required", { status: 400 });
    }
    if (typeof price !== "number" || Number.isNaN(price)) {
      return new NextResponse("Price must be a number", { status: 400 });
    }
    if (!description || typeof description !== "string") {
      return new NextResponse("Description is required", { status: 400 });
    }
    if (typeof categoryId !== "number") {
      return new NextResponse("categoryId must be a number", { status: 400 });
    }
    if (typeof companyId !== "number") {
      return new NextResponse("companyId must be a number", { status: 400 });
    }

    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });
    if (!category) {
      return new NextResponse("Category not found", { status: 400 });
    }

    const company = await prisma.company.findUnique({
      where: { id: companyId },
    });
    if (!company) {
      return new NextResponse("Company not found", { status: 400 });
    }

    const safeImages = Array.isArray(images) ? images : [];
    
    // التحقق من الصور
    if (safeImages.length === 0) {
      return new NextResponse("يجب إضافة صورة واحدة على الأقل", { status: 400 });
    }
    if (safeImages.length > 3) {
      return new NextResponse("يمكنك إضافة 3 صور كحد أقصى", { status: 400 });
    }
    
    const safeColors = Array.isArray(colors) ? colors : [];
    const safeSizes = Array.isArray(sizes) ? sizes : [];

    const product = await prisma.product.create({
      data: {
        name,
        price,
        description,
        categoryId,
        companyId: Number(companyId),
        isNew: isNew === true,
        isOnSale: isOnSale === true,
        discountPercent: discountPercent ? Number(discountPercent) : null,
        originalPrice: originalPrice ? Number(originalPrice) : null,
        images: {
          create: safeImages.map((url: string) => ({ url })),
        },
        colors: {
          create: safeColors.map((c: any) => ({
            name: c.name,
            hex: c.hex,
          })),
        },
        sizes: {
          create: safeSizes.map((s: any) => ({
            size: s.size,
            quantity: s.quantity,
          })),
        },
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
    console.error("CREATE PRODUCT ERROR:", error);
    return new NextResponse("Error creating product", { status: 500 });
  }
}

/* =================================================
   DELETE SINGLE PRODUCT
   DELETE /api/admin/products?id=PRODUCT_ID
================================================= */
export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return new NextResponse("Missing product id", { status: 400 });
  }

  await prisma.product.delete({
    where: { id },
  });

  return NextResponse.json({ success: true });
}

/* =================================================
   BULK DELETE BY MONTHS
   PUT /api/admin/products
   body: { months: 3 | 6 }
================================================= */
export async function PUT(req: Request) {
  const { months } = await req.json();

  if (!months || typeof months !== "number") {
    return new NextResponse("Invalid months value", { status: 400 });
  }

  const date = new Date();
  date.setMonth(date.getMonth() - months);

  const result = await prisma.product.deleteMany({
    where: {
      createdAt: {
        lt: date,
      },
    },
  });

  return NextResponse.json({
    deleted: result.count,
    olderThanMonths: months,
  });
}
