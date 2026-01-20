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
    <main className="min-h-screen bg-background text-foreground pt-20 sm:pt-24">
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 lg:py-16">
        {/* Header */}
        <div className="mb-8 sm:mb-12 lg:mb-16">
          <span className="text-[#D4AF37] text-xs sm:text-sm tracking-wider uppercase block mb-3 sm:mb-4 font-bold">
            مجموعات جديدة
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black mb-4 sm:mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            وصولات جديدة هذا الموسم
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg">اكتشف أحدث وصولاتنا</p>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-12 sm:py-20 text-muted-foreground text-lg sm:text-xl">جاري التحميل...</div>
        ) : newProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {newProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <Card className="text-center py-20">
            <CardContent>
              <div className="text-6xl mb-6 opacity-30">✨</div>
              <p className="text-xl text-muted-foreground">لا توجد منتجات جديدة متاحة</p>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
