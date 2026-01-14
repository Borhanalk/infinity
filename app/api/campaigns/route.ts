import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

/* =================================================
   GET ACTIVE CAMPAIGNS (for homepage)
   GET /api/campaigns
================================================= */
export async function GET() {
  try {
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
  } catch (error) {
    console.error("Error fetching active campaigns:", error);
    return NextResponse.json(null);
  }
}
