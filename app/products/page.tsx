"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "../contexts/CartContext";
import { ProductCard } from "../components/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Filter } from "lucide-react";

type Category = { id: number; name: string };
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

export default function ProductsListPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterCategory, setFilterCategory] = useState<number | "">("");
  const [search, setSearch] = useState("");

  async function loadData(categoryId?: number) {
    try {
      setError("");
      setLoading(true);

      // إضافة timeout للطلبات
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 ثانية

      const [catRes, prodRes] = await Promise.all([
        fetch("/api/categories", {
          cache: "no-store",
          signal: controller.signal,
        }).catch((err) => {
          if (err.name === 'AbortError') {
            throw new Error("انتهت مهلة الاتصال. يرجى المحاولة مرة أخرى.");
          }
          throw err;
        }),
        fetch(
          categoryId
            ? `/api/products?categoryId=${categoryId}`
            : "/api/products",
          {
            cache: "no-store",
            signal: controller.signal,
          }
        ).catch((err) => {
          if (err.name === 'AbortError') {
            throw new Error("انتهت مهلة الاتصال. يرجى المحاولة مرة أخرى.");
          }
          throw err;
        }),
      ]);

      clearTimeout(timeoutId);

      if (catRes.ok) {
        const cats = await catRes.json();
        setCategories(Array.isArray(cats) ? cats : []);
      } else {
        setCategories([]);
      }

      if (prodRes.ok) {
        const prods = await prodRes.json();

        // التحقق من نوع الاستجابة
        if (Array.isArray(prods)) {
          // إذا كان الـ response مصفوفة مباشرة (حالة النجاح العادية)
          setProducts(prods);
          if (prods.length === 0) {
            setError("لا توجد منتجات متاحة حالياً");
          }
        } else if (prods && typeof prods === 'object') {
          // إذا كان الـ response كائن (قد يحتوي على error أو products)
          if (prods.products !== undefined) {
            // إذا كان هناك products في الـ response
            setProducts(Array.isArray(prods.products) ? prods.products : []);
            if (prods.error || prods.message) {
              // إظهار رسالة الخطأ بشكل واضح
              const errorMsg = prods.message || prods.error || "حدث خطأ في تحميل المنتجات";
              setError(errorMsg);
              console.warn("⚠️ Database connection issue:", prods.error || prods.message);
            }
          } else if (prods.error || prods.message) {
            // إذا كان هناك خطأ فقط بدون products
            setProducts([]);
            const errorMsg = prods.message || prods.error || "حدث خطأ في تحميل المنتجات";
            setError(errorMsg);
          } else {
            // استجابة غير متوقعة
            setProducts([]);
            setError("فشل تحميل المنتجات - استجابة غير صحيحة من السيرفر");
          }
        } else {
          setProducts([]);
          setError("فشل تحميل المنتجات - استجابة غير صحيحة من السيرفر");
        }
      } else {
        const errorData = await prodRes.json().catch(() => ({}));
        // إذا كان هناك products في الـ response حتى مع وجود خطأ، استخدمها
        if (errorData.products !== undefined) {
          setProducts(Array.isArray(errorData.products) ? errorData.products : []);
        } else if (Array.isArray(errorData)) {
          setProducts(errorData);
        } else {
          setProducts([]);
        }
        // إظهار خطأ بشكل واضح
        const errorMsg = errorData.message || errorData.details || errorData.error || `فشل تحميل المنتجات (${prodRes.status})`;
        setError(errorMsg);
      }
    } catch (err: any) {
      setError(err.message || "فشل تحميل المنتجات");
      setCategories([]);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryIdParam = urlParams.get("categoryId");
    const categoryId = categoryIdParam ? Number(categoryIdParam) : undefined;

    if (categoryId) {
      setFilterCategory(categoryId);
    }

    loadData(categoryId);
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const categoryIdParam = urlParams.get("categoryId");
      const categoryId = categoryIdParam ? Number(categoryIdParam) : undefined;
      setFilterCategory(categoryId || "");
      loadData(categoryId);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const filtered = products.filter((p) => {
    const matchesSearch =
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !filterCategory || p.categoryId === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background text-foreground pt-16 sm:pt-20 lg:pt-24 overflow-x-hidden">
      <section className="py-4 sm:py-8 lg:py-12 xl:py-16 px-3 sm:px-4 lg:px-6">
        <div className="max-w-7xl mx-auto overflow-hidden">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-4 sm:mb-8 lg:mb-12 border-b border-border pb-3 sm:pb-6 lg:pb-8">
            <div>
              <span className="text-[#D4AF37] text-xs sm:text-sm tracking-wider uppercase block mb-1.5 sm:mb-2 lg:mb-3 font-bold">מוצרים</span>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-black bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">כל המוצרים</h1>
            </div>
          </div>

          {/* Filters */}
          <Card className="mb-4 sm:mb-8 lg:mb-12 border-border">
            <CardContent className="p-3 sm:p-4 lg:p-6">
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 lg:gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute right-2.5 sm:right-3 lg:right-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                  <Input
                    placeholder="חיפוש..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pr-9 sm:pr-10 lg:pr-12 h-10 sm:h-12 lg:h-14 text-sm sm:text-base rounded-xl"
                  />
                </div>
                <div className="relative w-full sm:w-auto">
                  <Filter className="absolute right-2.5 sm:right-3 lg:right-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                  <select
                    value={filterCategory === "" ? "" : String(filterCategory)}
                    onChange={(e) =>
                      setFilterCategory(e.target.value ? Number(e.target.value) : "")
                    }
                    className="h-10 sm:h-12 lg:h-14 px-9 sm:px-10 lg:px-12 pr-9 sm:pr-10 lg:pr-12 bg-background border border-input rounded-xl text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-ring w-full sm:min-w-[200px]"
                  >
                    <option value="">כל הקטגוריות</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {loading && (
            <div className="text-center py-12 sm:py-20 text-muted-foreground text-base sm:text-xl">טוען...</div>
          )}

          {/* Products Grid - 3 columns on mobile, 4 on desktop */}
          {!loading && filtered.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3 md:gap-4 lg:gap-6 xl:gap-8">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <Card className="text-center py-20">
              <CardContent>
                <div className="text-6xl mb-6 opacity-30">
                  {error && (error.includes("Database connection") || error.includes("قاعدة البيانات"))
                    ? "⚠️"
                    : "🔍"}
                </div>
                <div className="text-muted-foreground text-xl mb-2">
                  {error && (error.includes("Database connection") || error.includes("قاعدة البيانات"))
                    ? "לא ניתן להתחבר למסד הנתונים"
                    : products.length === 0 && error
                      ? "נכשל בטעינת המוצרים"
                      : "לא נמצאו מוצרים"}
                </div>
                <div className="text-muted-foreground/70 text-sm mb-4">
                  {error && (error.includes("Database connection") || error.includes("قاعدة البيانات"))
                    ? "אנא בדוק:\n1. קובץ .env מכיל DATABASE_URL תקין\n2. מסד הנתונים פועל וזמין\n3. החיבור לאינטרנט פעיל"
                    : products.length === 0 && error
                      ? error
                      : "נסה מונחי חיפוש שונים או בחר קטגוריה אחרת"}
                </div>
                {error && (
                  <div className="mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-right">
                    <div className="text-sm font-bold text-destructive mb-2">تفاصيل الخطأ:</div>
                    <div className="text-xs text-muted-foreground whitespace-pre-line">{error}</div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </div>
  );
}
