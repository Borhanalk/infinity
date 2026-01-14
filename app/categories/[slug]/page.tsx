"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ProductCard } from "../../components/ProductCard";
import { Card, CardContent } from "@/components/ui/card";

type Category = {
  id: number;
  name: string;
  slug?: string;
};

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

export default function CategoryPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch category by slug or ID
    fetch("/api/categories")
      .then((res) => res.json())
      .then((categories) => {
        const foundCategory = Array.isArray(categories)
          ? categories.find((c: any) => c.slug === slug || c.id === Number(slug))
          : null;
        setCategory(foundCategory || null);
        
        if (foundCategory) {
          // Fetch products for this category
          return fetch(`/api/products?categoryId=${foundCategory.id}`);
        }
        return null;
      })
      .then((res) => {
        if (res) {
          return res.json();
        }
        return [];
      })
      .then((data) => {
        setProducts(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setProducts([]);
        setLoading(false);
      });
  }, [slug]);

  if (!category && !loading) {
    return (
      <main className="min-h-screen bg-background text-foreground pt-24">
        <div className="container mx-auto px-6 py-20 text-center">
          <Card>
            <CardContent className="p-12">
              <div className="text-6xl mb-6 opacity-30">📂</div>
              <h1 className="text-4xl font-black mb-4">الفئة غير موجودة</h1>
              <p className="text-muted-foreground text-lg">الفئة التي تبحث عنها غير موجودة.</p>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground pt-24">
      <div className="container mx-auto px-6 py-16">
        {/* Header */}
        <div className="mb-16">
          <span className="text-[#D4AF37] text-sm tracking-wider uppercase block mb-4 font-bold">
            فئة
          </span>
          <h1 className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            {category?.name}
          </h1>
          <p className="text-muted-foreground text-lg">تصفح مجموعة {category?.name} الخاصة بنا</p>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-20 text-muted-foreground text-xl">جاري التحميل...</div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <Card className="text-center py-20">
            <CardContent>
              <div className="text-6xl mb-6 opacity-30">📦</div>
              <p className="text-xl text-muted-foreground">لا توجد منتجات في هذه الفئة</p>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
