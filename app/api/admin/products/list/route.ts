import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

type GroupedProducts = Record<string, Array<{
  id: string;
  name: string;
  price: number;
  createdAt: string;
}>>;

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        price: true,
        createdAt: true,
        images: {
          select: {
            url: true,
          },
          take: 1,
        },
        company: {
          select: {
            name: true,
            logoUrl: true,
          },
        },
      },
    });

    const groups: GroupedProducts = {};

    for (const p of products) {
      const date = new Date(p.createdAt);
      const monthKey = date.toLocaleString("en-US", {
        month: "long",
        year: "numeric",
      });

      if (!groups[monthKey]) groups[monthKey] = [];
      groups[monthKey].push({
        ...p,
        createdAt: p.createdAt.toISOString(),
      });
    }

    return NextResponse.json(groups);
  } catch (error) {
    console.error("GET /products/list ERROR:", error);
    return new NextResponse("Failed to fetch products", { status: 500 });
  }
}
