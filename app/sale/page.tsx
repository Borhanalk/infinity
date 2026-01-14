"use client";

import { useEffect, useState } from "react";
import { ProductCard } from "../components/ProductCard";
import { FiltersBar } from "../components/FiltersBar";
import { Button } from "@/components/ui/button";
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

const FILTERS = [
  { id: "all", label: "جميع العروض" },
  { id: "10-20", label: "خصم 10-20%" },
  { id: "20-40", label: "خصم 20-40%" },
  { id: "40+", label: "خصم 40%+" },
  { id: "under99", label: "أقل من 99 ₪" },
];

export default function SalePage() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setProducts([]);
        setLoading(false);
      });
  }, []);

  const saleProducts = products.filter((p) => p.isOnSale || (p.originalPrice && p.originalPrice > p.price));

  const filteredProducts = saleProducts.filter((product) => {
    if (activeFilter === "all") return true;
    
    const discount = product.originalPrice && product.originalPrice > product.price
      ? ((product.originalPrice - product.price) / product.originalPrice) * 100
      : product.discountPercent || 0;

    if (activeFilter === "10-20" && discount >= 10 && discount < 20) return true;
    if (activeFilter === "20-40" && discount >= 20 && discount < 40) return true;
    if (activeFilter === "40+" && discount >= 40) return true;
    if (activeFilter === "under99" && product.price < 99) return true;
    return false;
  });

  return (
    <main className="min-h-screen bg-background text-foreground pt-24">
      <div className="container mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-[#D4AF37] text-sm tracking-wider uppercase block mb-4 font-bold">
            מבצעים
          </span>
          <h1 className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            آخر فرصة
          </h1>
          <p className="text-muted-foreground text-lg">عروض محدودة على القطع المميزة</p>
        </div>

        {/* Filters */}
        <FiltersBar filters={FILTERS} activeFilter={activeFilter} onFilterChange={setActiveFilter} />

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-20 text-muted-foreground text-xl">جاري التحميل...</div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <Card className="text-center py-20">
            <CardContent>
              <div className="text-6xl mb-6 opacity-30">🏷️</div>
              <p className="text-xl text-muted-foreground">لم يتم العثور على منتجات</p>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
