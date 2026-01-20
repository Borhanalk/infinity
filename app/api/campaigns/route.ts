import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

/* =================================================
   GET ACTIVE CAMPAIGNS (for homepage)
   GET /api/campaigns
================================================= */
export async function GET() {
  try {
    // فحص الاتصال بقاعدة البيانات أولاً
    try {
      await prisma.$connect();
    } catch (connectError: any) {
      console.error("Database connection failed:", connectError);
      return NextResponse.json(null);
    }

    const now = new Date();
    
    const campaigns = await prisma.campaign.findMany({
      where: {
        isActive: true,
        showOnHomepage: true,
        OR: [
          { startDate: null },
          { startDate: { lte: now } },
        ],
        AND: [
          {
            OR: [
              { endDate: null },
              { endDate: { gte: now } },
            ],
          },
        ],
      },
      include: {
        products: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 1, // Get only the most recent active campaign
    });

    return NextResponse.json(campaigns[0] || null);
  } catch (error: any) {
    console.error("Error fetching active campaigns:", error);
    console.error("Error code:", error?.code);
    return NextResponse.json(null);
  } finally {
    // إغلاق الاتصال برفق
    try {
      await prisma.$disconnect();
    } catch (e) {
      // تجاهل أخطاء الإغلاق
    }
  }
}
