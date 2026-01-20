import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const categoryId = searchParams.get("categoryId");
        const filter = searchParams.get("filter");
        const onSale = searchParams.get("onSale");

        console.log("GET /products - categoryId:", categoryId, "filter:", filter, "onSale:", onSale);

        const where: any = {};

        if (categoryId) {
            where.categoryId = Number(categoryId);
        }

        if (filter === "new") {
            where.isNew = true;
        }

        if (onSale === "true") {
            where.isOnSale = true;
        }

        const products = await prisma.product.findMany({
            where: Object.keys(where).length > 0 ? where : undefined,
            orderBy: { createdAt: "desc" },
            include: {
                images: true,
                colors: true,
                sizes: true,
                category: true,
                company: true,
            },
        });

        console.log("GET /products - Found products:", products.length);
        return NextResponse.json(products);
    } catch (error: any) {
        console.error("GET /products ERROR:", error);

        const errorMessage = error?.message || "Unknown error";
        const isConnectionError =
            errorMessage.includes("Tenant") ||
            errorMessage.includes("not found") ||
            errorMessage.includes("connection") ||
            errorMessage.includes("Invalid") ||
            errorMessage.includes("P1001") ||
            errorMessage.includes("P1000") ||
            errorMessage.includes("Can't reach database server");

        // إرجاع مصفوفة فارغة بدلاً من خطأ لتجنب توقف التطبيق
        // يمكن للصفحة أن تتعامل مع المصفوفة الفارغة بشكل أفضل
        return NextResponse.json(
            {
                error: isConnectionError
                    ? "Database connection error. Please check your DATABASE_URL in .env file"
                    : "Failed to fetch products",
                products: [], // مصفوفة فارغة لتجنب توقف التطبيق
                details: process.env.NODE_ENV === "development" ? errorMessage : undefined
            },
            { status: 200 } // 200 بدلاً من 500 حتى لا يتوقف التطبيق
        );
    }
}
