import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

/* =================================================
   GET CAMPAIGN BY ID
   GET /api/admin/campaigns/[id]
================================================= */
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const campaign = await prisma.campaign.findUnique({
      where: { id },
      include: {
        products: true,
      },
    });

    if (!campaign) {
      return NextResponse.json(
        { error: "Campaign not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(campaign);
  } catch (error) {
    console.error("Error fetching campaign:", error);
    return NextResponse.json(
      { error: "Failed to fetch campaign" },
      { status: 500 }
    );
  }
}

/* =================================================
   UPDATE CAMPAIGN
   PUT /api/admin/campaigns/[id]
================================================= */
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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
      productIds,
    } = body;

    // Get existing campaign products
    const existingCampaign = await prisma.campaign.findUnique({
      where: { id },
      include: { products: true },
    });

    if (!existingCampaign) {
      return NextResponse.json(
        { error: "Campaign not found" },
        { status: 404 }
      );
    }

    // Remove old products from sale if needed
    const oldProductIds = existingCampaign.products.map((p) => p.productId);
    if (oldProductIds.length > 0) {
      // Check if products are in other active campaigns
      for (const productId of oldProductIds) {
        const otherCampaigns = await prisma.campaignProduct.findMany({
          where: {
            productId,
            campaignId: { not: id },
            campaign: { isActive: true },
          },
        });

        if (otherCampaigns.length === 0) {
          // No other active campaigns, remove sale status
          await prisma.product.update({
            where: { id: productId },
            data: {
              isOnSale: false,
              price: existingCampaign.products.find((p) => p.productId === productId)
                ? await prisma.product.findUnique({ where: { id: productId } }).then((p) => p?.originalPrice || p?.price || 0)
                : undefined,
            },
          });
        }
      }
    }

    // Delete old campaign products
    await prisma.campaignProduct.deleteMany({
      where: { campaignId: id },
    });

    // Update campaign
    const campaign = await prisma.campaign.update({
      where: { id },
      data: {
        title: title || undefined,
        description: description !== undefined ? description : undefined,
        discountPercent: discountPercent !== undefined ? Number(discountPercent) : undefined,
        discountAmount: discountAmount !== undefined ? Number(discountAmount) : undefined,
        isActive: isActive !== undefined ? Boolean(isActive) : undefined,
        showOnHomepage: showOnHomepage !== undefined ? Boolean(showOnHomepage) : undefined,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
      },
    });

    // Add new products
    if (Array.isArray(productIds) && productIds.length > 0) {
      await prisma.campaignProduct.createMany({
        data: productIds.map((productId: string) => ({
          campaignId: id,
          productId,
        })),
        skipDuplicates: true,
      });

      // Update products
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

    const updatedCampaign = await prisma.campaign.findUnique({
      where: { id },
      include: {
        products: true,
      },
    });

    return NextResponse.json(updatedCampaign);
  } catch (error) {
    console.error("Error updating campaign:", error);
    return NextResponse.json(
      { error: "Failed to update campaign" },
      { status: 500 }
    );
  }
}

/* =================================================
   DELETE CAMPAIGN
   DELETE /api/admin/campaigns/[id]
================================================= */
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Get campaign products before deletion
    const campaign = await prisma.campaign.findUnique({
      where: { id },
      include: { products: true },
    });

    if (!campaign) {
      return NextResponse.json(
        { error: "Campaign not found" },
        { status: 404 }
      );
    }

    // Remove sale status from products
    const productIds = campaign.products.map((p) => p.productId);
    for (const productId of productIds) {
      const otherCampaigns = await prisma.campaignProduct.findMany({
        where: {
          productId,
          campaignId: { not: id },
          campaign: { isActive: true },
        },
      });

      if (otherCampaigns.length === 0) {
        const product = await prisma.product.findUnique({
          where: { id: productId },
        });
        if (product) {
          await prisma.product.update({
            where: { id: productId },
            data: {
              isOnSale: false,
              price: product.originalPrice || product.price,
            },
          });
        }
      }
    }

    // Delete campaign (cascade will delete campaign products)
    await prisma.campaign.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting campaign:", error);
    return NextResponse.json(
      { error: "Failed to delete campaign" },
      { status: 500 }
    );
  }
}
