import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { verifyAdminToken } from "@/app/lib/admin-auth";

/* =================================================
   CREATE PRODUCT
   POST /api/admin/products
================================================= */
export async function POST(req: NextRequest) {
  // التحقق من المسؤول
  const admin = await verifyAdminToken(req);
  if (!admin) {
    return NextResponse.json(
      { error: "غير مصرح. يرجى تسجيل الدخول كمسؤول" },
      { status: 401 }
    );
  }
  try {
    const body = await req.json();

    console.log("POST /api/admin/products - Received body:", {
      name: body.name,
      price: body.price,
      description: body.description ? `${body.description.substring(0, 50)}...` : "missing",
      categoryId: body.categoryId,
      companyId: body.companyId,
      imagesCount: Array.isArray(body.images) ? body.images.length : 0,
      colorsCount: Array.isArray(body.colors) ? body.colors.length : 0,
      sizesCount: Array.isArray(body.sizes) ? body.sizes.length : 0,
    });

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
      discountAmount,
      originalPrice,
    } = body;

    // اسم المنتج اختياري (يمكن أن يكون فارغاً)
    const productName = (name && typeof name === "string" && name.trim()) ? name.trim() : "";
    if (typeof price !== "number" || Number.isNaN(price) || price <= 0) {
      console.error("Validation error: Price is invalid", price);
      return NextResponse.json(
        { error: "السعر غير صحيح", message: "السعر يجب أن يكون رقماً أكبر من الصفر" },
        { status: 400 }
      );
    }
    // الوصف اختياري - لا نتحقق منه
    const productDescription = (description && typeof description === "string" && description.trim()) 
      ? description.trim() 
      : "";
    if (typeof categoryId !== "number" || categoryId === null || categoryId === undefined) {
      console.error("Validation error: categoryId is invalid", categoryId);
      return NextResponse.json(
        { error: "الفئة غير صحيحة", message: "يرجى اختيار فئة صحيحة" },
        { status: 400 }
      );
    }
    if (typeof companyId !== "number" || companyId === null || companyId === undefined) {
      console.error("Validation error: companyId is invalid", companyId);
      return NextResponse.json(
        { error: "الشركة غير صحيحة", message: "يرجى اختيار شركة صحيحة" },
        { status: 400 }
      );
    }

    // التحقق من وجود الفئة في قاعدة البيانات
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });
    if (!category) {
      console.error("Validation error: Category not found", categoryId);
      return NextResponse.json(
        { error: "الفئة غير موجودة", message: `الفئة برقم ${categoryId} غير موجودة في قاعدة البيانات` },
        { status: 400 }
      );
    }

    // التحقق من وجود الشركة في قاعدة البيانات
    const company = await prisma.company.findUnique({
      where: { id: companyId },
    });
    if (!company) {
      console.error("Validation error: Company not found", companyId);
      return NextResponse.json(
        { error: "الشركة غير موجودة", message: `الشركة برقم ${companyId} غير موجودة في قاعدة البيانات` },
        { status: 400 }
      );
    }

    const safeImages = Array.isArray(images) ? images : [];
    
    // التحقق من الصور
    if (safeImages.length === 0) {
      console.error("Validation error: No images provided");
      return NextResponse.json(
        { error: "يجب إضافة صورة واحدة على الأقل", message: "يجب إضافة صورة واحدة على الأقل" },
        { status: 400 }
      );
    }
    if (safeImages.length > 3) {
      console.error("Validation error: Too many images", safeImages.length);
      return NextResponse.json(
        { error: "يمكنك إضافة 3 صور كحد أقصى", message: "يمكنك إضافة 3 صور كحد أقصى" },
        { status: 400 }
      );
    }
    
    // التحقق من أن جميع الصور هي URLs صحيحة
    for (const img of safeImages) {
      if (typeof img !== "string" || !img.trim()) {
        console.error("Validation error: Invalid image URL", img);
        return NextResponse.json(
          { error: "صورة غير صحيحة", message: "واحدة أو أكثر من الصور غير صحيحة" },
          { status: 400 }
        );
      }
    }
    
    const safeColors = Array.isArray(colors) ? colors : [];
    const safeSizes = Array.isArray(sizes) ? sizes : [];

    const product = await prisma.product.create({
      data: {
        name: productName,
        price,
        description: productDescription,
        categoryId,
        companyId: Number(companyId),
        isNew: isNew === true,
        isOnSale: isOnSale === true,
        discountPercent: discountPercent ? Number(discountPercent) : null,
        discountAmount: discountAmount ? Number(discountAmount) : null,
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

    console.log("Product created successfully:", product.id);
    return NextResponse.json(product);
  } catch (error: any) {
    console.error("CREATE PRODUCT ERROR:", error);
    console.error("Error details:", {
      message: error?.message,
      code: error?.code,
      meta: error?.meta,
    });
    
    // معالجة أخطاء Prisma بشكل أفضل
    if (error?.code === "P2002") {
      return NextResponse.json(
        { error: "خطأ في قاعدة البيانات", message: "يبدو أن هناك منتجاً بنفس الاسم موجوداً بالفعل" },
        { status: 400 }
      );
    }
    
    if (error?.code === "P2003") {
      return NextResponse.json(
        { error: "خطأ في قاعدة البيانات", message: "الفئة أو الشركة المحددة غير موجودة" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        error: "خطأ في حفظ المنتج", 
        message: process.env.NODE_ENV === "development" 
          ? error?.message || "حدث خطأ غير متوقع" 
          : "حدث خطأ في حفظ المنتج. يرجى المحاولة مرة أخرى" 
      },
      { status: 500 }
    );
  }
}

/* =================================================
   DELETE SINGLE PRODUCT
   DELETE /api/admin/products?id=PRODUCT_ID
================================================= */
export async function DELETE(req: NextRequest) {
  // التحقق من المسؤول
  const admin = await verifyAdminToken(req);
  if (!admin) {
    return NextResponse.json(
      { error: "غير مصرح. يرجى تسجيل الدخول كمسؤول" },
      { status: 401 }
    );
  }
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
export async function PUT(req: NextRequest) {
  // التحقق من المسؤول
  const admin = await verifyAdminToken(req);
  if (!admin) {
    return NextResponse.json(
      { error: "غير مصرح. يرجى تسجيل الدخول كمسؤول" },
      { status: 401 }
    );
  }
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
