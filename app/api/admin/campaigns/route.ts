import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

/* =================================================
   GET ALL CAMPAIGNS
   GET /api/admin/campaigns
================================================= */
export async function GET() {
  try {
    const campaigns = await prisma.campaign.findMany({
      include: {
        products: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(campaigns);
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    return NextResponse.json(
      { error: "Failed to fetch campaigns" },
      { status: 500 }
    );
  }
}

/* =================================================
   CREATE CAMPAIGN
   POST /api/admin/campaigns
================================================= */
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      title,
      description,
      discountPercent,
      discountAmount,
      isActive,
      showOnHomepage,
      startDate,
      endDate,
      productIds, // Array of product IDs
    } = body;

    if (!title || typeof title !== "string" || !title.trim()) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    // Create campaign
    const campaign = await prisma.campaign.create({
      data: {
        title,
        description: description || null,
        discountPercent: discountPercent ? Number(discountPercent) : null,
        discountAmount: discountAmount ? Number(discountAmount) : null,
        isActive: isActive !== undefined ? Boolean(isActive) : true,
        showOnHomepage: showOnHomepage !== undefined ? Boolean(showOnHomepage) : false,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
      },
    });

    // Add products to campaign
    if (Array.isArray(productIds) && productIds.length > 0) {
      await prisma.campaignProduct.createMany({
        data: productIds.map((productId: string) => ({
          campaignId: campaign.id,
          productId,
        })),
        skipDuplicates: true,
      });

      // Update products: set isOnSale and calculate prices
      for (const productId of productIds) {
        const product = await prisma.product.findUnique({
          where: { id: productId },
        });

        if (product) {
          const originalPrice = product.originalPrice || product.price;
          let newPrice = product.price;

          if (discountPercent) {
            newPrice = originalPrice * (1 - discountPercent / 100);
          } else if (discountAmount) {
            newPrice = Math.max(0, originalPrice - discountAmount);
          }

          await prisma.product.update({
            where: { id: productId },
            data: {
              isOnSale: true,
              originalPrice: originalPrice,
              price: newPrice,
              discountPercent: discountPercent || null,
            },
          });
        }
      }
    }

    const campaignWithProducts = await prisma.campaign.findUnique({
      where: { id: campaign.id },
      include: {
        products: true,
      },
    });

    return NextResponse.json(campaignWithProducts);
  } catch (error) {
    console.error("Error creating campaign:", error);
    return NextResponse.json(
      { error: "Failed to create campaign" },
      { status: 500 }
    );
  }
}
