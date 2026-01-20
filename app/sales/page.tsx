"use client";

import { useEffect, useState } from "react";
import { ProductCard } from "../components/ProductCard";

type Product = {
  id: string;
  name: string;
  price: number;
  originalPrice?: number | null;
  description: string;
  images: Array<{ id: string; url: string }>;
  isOnSale: boolean;
  discountPercent?: number | null;
  isNew: boolean;
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

export default function SalesPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await fetch("/api/products?onSale=true", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          // التحقق من وجود products في الـ response (في حالة وجود خطأ)
          let productsData: any[] = [];
          if (data.products) {
            productsData = Array.isArray(data.products) ? data.products.filter((p: any) => p.isOnSale) : [];
          } else if (Array.isArray(data)) {
            productsData = data.filter((p: any) => p.isOnSale);
          }
          
          // التأكد من أن جميع الحقول المطلوبة موجودة
          setProducts(productsData.map((p: any) => ({
            ...p,
            isOnSale: p.isOnSale ?? false,
            isNew: p.isNew ?? false,
            categoryId: p.categoryId ?? 0,
            images: p.images || [],
            description: p.description || "",
            colors: p.colors || [],
            sizes: p.sizes || [],
          })));
        } else {
          const errorData = await res.json().catch(() => ({}));
          // إذا كان هناك products في الـ response حتى مع وجود خطأ، استخدمها
          if (errorData.products) {
            const productsData = Array.isArray(errorData.products) ? errorData.products.filter((p: any) => p.isOnSale) : [];
            setProducts(productsData.map((p: any) => ({
              ...p,
              isOnSale: p.isOnSale ?? false,
              isNew: p.isNew ?? false,
              categoryId: p.categoryId ?? 0,
              images: p.images || [],
              description: p.description || "",
              colors: p.colors || [],
              sizes: p.sizes || [],
            })));
          } else {
            setProducts([]);
          }
          console.error("Failed to load products:", errorData);
        }
      } catch (err) {
        console.error("Error loading products:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  const filteredProducts = products.filter((p) => {
    if (filter === "all") return true;
    if (filter === "10-20" && p.discountPercent && p.discountPercent >= 10 && p.discountPercent < 20) return true;
    if (filter === "20-40" && p.discountPercent && p.discountPercent >= 20 && p.discountPercent < 40) return true;
    if (filter === "40+" && p.discountPercent && p.discountPercent >= 40) return true;
    if (filter === "under99" && p.price < 99) return true;
    return false;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-secondary/20 text-foreground pt-16 sm:pt-20 lg:pt-24 overflow-x-hidden" dir="rtl">
      <section className="py-6 sm:py-12 lg:py-16 xl:py-20 px-3 sm:px-4 lg:px-6 xl:px-16">
        <div className="max-w-7xl mx-auto overflow-hidden">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <span className="text-[#D4AF37] text-xs sm:text-sm tracking-[0.3em] uppercase block mb-3 sm:mb-4 font-bold">מבצעים</span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black mb-3 sm:mb-4 bg-gradient-to-r from-foreground via-[#D4AF37] to-foreground/70 bg-clip-text text-transparent">הזדמנות אחרונה</h1>
            <p className="text-gray-400 text-sm sm:text-base lg:text-lg font-medium">הצעות מוגבלות בזמן על פריטים יוקרתיים</p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 sm:gap-3 mb-6 sm:mb-8 lg:mb-12 justify-center">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 sm:px-6 py-2 border-2 text-xs sm:text-sm tracking-wider uppercase transition-all duration-300 rounded-lg font-semibold ${
                filter === "all"
                  ? "border-[#D4AF37] bg-gradient-to-r from-[#D4AF37] to-[#C9A961] text-black shadow-lg scale-105"
                  : "border-[#D4AF37]/30 text-gray-400 hover:border-[#D4AF37] hover:bg-[#D4AF37]/10 hover:scale-105"
              }`}
            >
              כל המבצעים
            </button>
            <button
              onClick={() => setFilter("10-20")}
              className={`px-4 sm:px-6 py-2 border-2 text-xs sm:text-sm tracking-wider uppercase transition-all duration-300 rounded-lg font-semibold ${
                filter === "10-20"
                  ? "border-[#D4AF37] bg-gradient-to-r from-[#D4AF37] to-[#C9A961] text-black shadow-lg scale-105"
                  : "border-[#D4AF37]/30 text-gray-400 hover:border-[#D4AF37] hover:bg-[#D4AF37]/10 hover:scale-105"
              }`}
            >
              10-20% הנחה
            </button>
            <button
              onClick={() => setFilter("20-40")}
              className={`px-4 sm:px-6 py-2 border-2 text-xs sm:text-sm tracking-wider uppercase transition-all duration-300 rounded-lg font-semibold ${
                filter === "20-40"
                  ? "border-[#D4AF37] bg-gradient-to-r from-[#D4AF37] to-[#C9A961] text-black shadow-lg scale-105"
                  : "border-[#D4AF37]/30 text-gray-400 hover:border-[#D4AF37] hover:bg-[#D4AF37]/10 hover:scale-105"
              }`}
            >
              20-40% הנחה
            </button>
            <button
              onClick={() => setFilter("40+")}
              className={`px-4 sm:px-6 py-2 border-2 text-xs sm:text-sm tracking-wider uppercase transition-all duration-300 rounded-lg font-semibold ${
                filter === "40+"
                  ? "border-[#D4AF37] bg-gradient-to-r from-[#D4AF37] to-[#C9A961] text-black shadow-lg scale-105"
                  : "border-[#D4AF37]/30 text-gray-400 hover:border-[#D4AF37] hover:bg-[#D4AF37]/10 hover:scale-105"
              }`}
            >
              40%+ הנחה
            </button>
            <button
              onClick={() => setFilter("under99")}
              className={`px-4 sm:px-6 py-2 border-2 text-xs sm:text-sm tracking-wider uppercase transition-all duration-300 rounded-lg font-semibold ${
                filter === "under99"
                  ? "border-[#D4AF37] bg-gradient-to-r from-[#D4AF37] to-[#C9A961] text-black shadow-lg scale-105"
                  : "border-[#D4AF37]/30 text-gray-400 hover:border-[#D4AF37] hover:bg-[#D4AF37]/10 hover:scale-105"
              }`}
            >
              מתחת ל-99 ₪
            </button>
          </div>

          {loading && (
            <div className="text-center py-12 sm:py-20 text-gray-400 text-base sm:text-lg font-medium">טוען...</div>
          )}

          {/* Products Grid - 3 columns on mobile, same as homepage */}
          {!loading && filteredProducts.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-4 lg:gap-6 xl:gap-8">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {!loading && filteredProducts.length === 0 && (
            <div className="text-center py-12 sm:py-20">
              <div className="text-5xl mb-4 opacity-30">⚜</div>
              <div className="text-gray-400 text-base sm:text-lg font-medium">לא נמצאו מוצרים</div>
              <div className="text-gray-500 text-sm mt-2 font-medium">נסה מסננים שונים</div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
