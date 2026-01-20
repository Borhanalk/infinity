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

      const [catRes, prodRes] = await Promise.all([
        fetch("/api/categories", { cache: "no-store" }),
        fetch(
          categoryId
            ? `/api/products?categoryId=${categoryId}`
            : "/api/products",
          { cache: "no-store" }
        ),
      ]);

      if (catRes.ok) {
        const cats = await catRes.json();
        setCategories(Array.isArray(cats) ? cats : []);
      } else {
        setCategories([]);
      }

      if (prodRes.ok) {
        const prods = await prodRes.json();
        // التحقق من وجود products في الـ response (في حالة وجود خطأ)
        if (prods.products) {
          setProducts(Array.isArray(prods.products) ? prods.products : []);
          if (prods.error) {
            // إظهار تحذير فقط، لا خطأ
            console.warn("⚠️ Database connection issue:", prods.error);
          }
        } else {
          setProducts(Array.isArray(prods) ? prods : []);
        }
      } else {
        const errorData = await prodRes.json().catch(() => ({}));
        // إذا كان هناك products في الـ response حتى مع وجود خطأ، استخدمها
        if (errorData.products) {
          setProducts(Array.isArray(errorData.products) ? errorData.products : []);
        } else {
          setProducts([]);
        }
        // إظهار خطأ فقط إذا لم تكن هناك منتجات
        if (!errorData.products || errorData.products.length === 0) {
          setError(errorData.details || errorData.error || "فشل تحميل المنتجات");
        }
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
    <div className="min-h-screen bg-background text-foreground pt-20 sm:pt-24">
      <section className="py-8 sm:py-12 lg:py-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 sm:mb-12 border-b border-border pb-6 sm:pb-8">
            <div>
              <span className="text-muted-foreground text-xs sm:text-sm tracking-wider uppercase block mb-2 sm:mb-3 font-bold">المنتجات</span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black">جميع المنتجات</h1>
            </div>
          </div>

          {/* Filters */}
          <Card className="mb-8 sm:mb-12 border-border">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  <Input
                    placeholder="بحث..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pr-10 sm:pr-12 h-12 sm:h-14 text-sm sm:text-base rounded-xl"
                  />
                </div>
                <div className="relative w-full sm:w-auto">
                  <Filter className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  <select
                    value={filterCategory === "" ? "" : String(filterCategory)}
                    onChange={(e) =>
                      setFilterCategory(e.target.value ? Number(e.target.value) : "")
                    }
                    className="h-12 sm:h-14 px-10 sm:px-12 pr-10 sm:pr-12 bg-background border border-input rounded-xl text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-ring w-full sm:min-w-[200px]"
                  >
                    <option value="">جميع الفئات</option>
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
            <div className="text-center py-20 text-muted-foreground text-xl">جاري التحميل...</div>
          )}

          {/* Products Grid */}
          {!loading && filtered.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <Card className="text-center py-20">
              <CardContent>
                <div className="text-6xl mb-6 opacity-30">🔍</div>
                <div className="text-muted-foreground text-xl mb-2">
                  {error && error.includes("Database connection")
                    ? "لا يمكن الاتصال بقاعدة البيانات"
                    : "لم يتم العثور على منتجات"}
                </div>
                <div className="text-muted-foreground/70 text-sm">
                  {error && error.includes("Database connection")
                    ? "يرجى التحقق من إعدادات قاعدة البيانات"
                    : "جرب مصطلحات بحث مختلفة"}
                </div>
                {error && error.includes("Database connection") && (
                  <div className="mt-4 text-xs text-muted-foreground/60">
                    {error}
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
