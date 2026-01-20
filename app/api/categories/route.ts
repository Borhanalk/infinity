import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET() {
    try {
        // فحص الاتصال بقاعدة البيانات أولاً
        try {
            await prisma.$connect();
        } catch (connectError: any) {
            console.error("Database connection failed:", connectError);
            return NextResponse.json([], { status: 200 });
        }

        const categories = await prisma.category.findMany({
            orderBy: { id: "desc" },
        });
        return NextResponse.json(categories);
    } catch (error: any) {
        console.error("GET /categories public ERROR:", error);
        console.error("Error code:", error?.code);

        // إرجاع مصفوفة فارغة بدلاً من خطأ لتجنب توقف التطبيق
        return NextResponse.json([], { status: 200 });
    } finally {
        // إغلاق الاتصال برفق
        try {
            await prisma.$disconnect();
        } catch (e) {
            // تجاهل أخطاء الإغلاق
        }
    }
}
