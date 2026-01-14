import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET() {
    try {
        const categories = await prisma.category.findMany({
            orderBy: { id: "desc" },
        });
        return NextResponse.json(categories);
    } catch (error: any) {
        console.error("GET /categories public ERROR:", error);

        // إرجاع مصفوفة فارغة بدلاً من خطأ لتجنب توقف التطبيق
        return NextResponse.json([], { status: 200 });
    }
}
