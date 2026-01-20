import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const categoryId = searchParams.get("categoryId");
        const filter = searchParams.get("filter");
        const onSale = searchParams.get("onSale");

        console.log("GET /products - categoryId:", categoryId, "filter:", filter, "onSale:", onSale);

        // فحص الاتصال بقاعدة البيانات أولاً
        try {
            await prisma.$connect();
        } catch (connectError: any) {
            console.error("Database connection failed:", connectError);
            const errorMessage = connectError?.message || "Connection failed";
            return NextResponse.json(
                {
                    error: "Database connection error",
                    message: "لا يمكن الاتصال بقاعدة البيانات. يرجى التحقق من إعدادات DATABASE_URL في ملف .env",
                    products: [],
                    details: process.env.NODE_ENV === "development" ? errorMessage : undefined,
                },
                { status: 200 }
            );
        }

        const where: any = {};

        if (categoryId) {
            const parsedCategoryId = Number(categoryId);
            if (!isNaN(parsedCategoryId)) {
                where.categoryId = parsedCategoryId;
            }
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
        console.error("Error code:", error?.code);
        console.error("Error meta:", error?.meta);

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

        // إرجاع مصفوفة فارغة مع رسالة خطأ واضحة
        return NextResponse.json(
            {
                error: isConnectionError
                    ? "Database connection error"
                    : "Failed to fetch products",
                message: isConnectionError
                    ? "لا يمكن الاتصال بقاعدة البيانات. يرجى التحقق من:\n1. ملف .env يحتوي على DATABASE_URL صحيح\n2. قاعدة البيانات تعمل ومتاحة\n3. الاتصال بالإنترنت نشط"
                    : "فشل جلب المنتجات من قاعدة البيانات",
                products: [],
                details: process.env.NODE_ENV === "development" 
                    ? `${errorMessage} (Code: ${errorCode})` 
                    : undefined
            },
            { status: 200 }
        );
    } finally {
        // إغلاق الاتصال برفق
        try {
            await prisma.$disconnect();
        } catch (e) {
            // تجاهل أخطاء الإغلاق
        }
    }
}
