"use client";

import { useEffect, useState } from "react";
import { ProductCard } from "../../components/ProductCard";
import { Card, CardContent } from "@/components/ui/card";

type Product = {
  id: string;
  name: string;
  price: number;
  description: string;
  isNew: boolean;
  isOnSale: boolean;
  discountPercent?: number | null;
  originalPrice?: number | null;
  categoryId: number;
  category?: {
    id: number;
    name: string;
  };
  company?: {
    id: number;
    name: string;
    logoUrl?: string | null;
  } | null;
  images: Array<{
    id: string;
    url: string;
  }>;
  colors: Array<{
    id: string;
    name: string;
    hex: string;
  }>;
  sizes: Array<{
    id: string;
    size: string;
    quantity: number;
  }>;
};

export default function NewCollectionsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products?filter=new")
      .then((res) => res.json())
      .then((data) => {
        // التحقق من وجود products في الـ response (في حالة وجود خطأ)
        if (data.products) {
          setProducts(Array.isArray(data.products) ? data.products : []);
        } else if (Array.isArray(data)) {
          setProducts(data);
        } else {
          setProducts([]);
        }
        setLoading(false);
      })
      .catch(() => {
        setProducts([]);
        setLoading(false);
      });
  }, []);

  const newProducts = products.filter((p) => p.isNew);

  return (
    <main className="min-h-screen bg-background text-foreground pt-16 sm:pt-20 lg:pt-24 overflow-x-hidden">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-8 lg:py-12 xl:py-16 overflow-hidden">
        {/* Header */}
        <div className="mb-6 sm:mb-8 lg:mb-12 xl:mb-16">
          <span className="text-[#D4AF37] text-xs sm:text-sm tracking-wider uppercase block mb-2 sm:mb-3 lg:mb-4 font-bold">
            חדש
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-black mb-3 sm:mb-4 lg:mb-6 bg-gradient-to-r from-foreground via-[#D4AF37] to-foreground/70 bg-clip-text text-transparent">
            הגעות חדשות לעונה
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base lg:text-lg">גלה את ההגעות החדשות שלנו</p>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-12 sm:py-20 text-muted-foreground text-base sm:text-lg lg:text-xl">טוען...</div>
        ) : newProducts.length > 0 ? (
          <div className="grid grid-cols-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 lg:gap-6 xl:gap-8">
            {newProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <Card className="text-center py-12 sm:py-20">
            <CardContent>
              <div className="text-5xl sm:text-6xl mb-4 sm:mb-6 opacity-30">✨</div>
              <p className="text-base sm:text-lg lg:text-xl text-muted-foreground">אין מוצרים חדשים זמינים</p>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
