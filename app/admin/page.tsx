"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, FolderOpen, Plus, Home, ShoppingBag } from "lucide-react";

type Stats = {
  products: number;
  categories: number;
  recentProducts: Array<{
    id: string;
    name: string;
    price: number;
    createdAt: string;
  }>;
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          console.error("Failed to load stats:", data);
          return;
        }
        setStats(data);
      })
      .catch((err) => {
        console.error("Error loading stats:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground text-lg">جاري التحميل...</div>
      </div>
    );
  }

  if (!stats) {
    return (
      <Card className="border-destructive/50 bg-destructive/10">
        <CardContent className="p-8">
          <div className="text-destructive text-lg font-bold">فشل تحميل الإحصائيات</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="border-b border-border pb-6 lg:pb-8">
        <span className="text-[#D4AF37] text-xs lg:text-sm tracking-wider uppercase block mb-2 lg:mb-3 font-bold">لوحة التحكم</span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-3 lg:mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">لوحة التحكم</h1>
        <p className="text-muted-foreground text-base lg:text-lg">
          مرحباً بك في لوحة إدارة المتجر
        </p>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        <Card asChild className="hover:shadow-xl transition-all duration-300 border-border">
          <Link href="/admin/products">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <CardTitle className="text-xl font-black text-[#D4AF37]">المنتجات</CardTitle>
                <Package className="w-8 h-8 text-[#D4AF37]" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-5xl font-black mb-2">{stats.products}</div>
              <p className="text-sm text-muted-foreground">إدارة المنتجات</p>
            </CardContent>
          </Link>
        </Card>

        <Card asChild className="hover:shadow-xl transition-all duration-300 border-border">
          <Link href="/admin/categories">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <CardTitle className="text-xl font-black text-[#D4AF37]">الكاتيجوري</CardTitle>
                <FolderOpen className="w-8 h-8 text-[#D4AF37]" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-5xl font-black mb-2">{stats.categories}</div>
              <p className="text-sm text-muted-foreground">إدارة الكاتيجوري</p>
            </CardContent>
          </Link>
        </Card>

        <Card asChild className="hover:shadow-xl transition-all duration-300 border-border">
          <Link href="/admin/products/add">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <CardTitle className="text-xl font-black text-[#D4AF37]">إضافة منتج</CardTitle>
                <Plus className="w-8 h-8 text-[#D4AF37]" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black mb-2">جديد</div>
              <p className="text-sm text-muted-foreground">أضف منتج جديد</p>
            </CardContent>
          </Link>
        </Card>
      </div>

      {/* QUICK ACTIONS */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-2xl font-black">إجراءات سريعة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Button
              variant="outline"
              size="lg"
              asChild
              className="h-auto p-6 justify-start hover:border-[#D4AF37] transition-all"
            >
              <Link href="/admin/products/add">
                <Plus className="w-6 h-6 mr-4" />
                <div className="text-right">
                  <div className="font-black text-base">إضافة منتج جديد</div>
                  <div className="text-sm text-muted-foreground">أضف منتج مع صور وألوان ومقاسات</div>
                </div>
              </Link>
            </Button>

            <Button
              variant="outline"
              size="lg"
              asChild
              className="h-auto p-6 justify-start hover:border-[#D4AF37] transition-all"
            >
              <Link href="/admin/categories/add">
                <FolderOpen className="w-6 h-6 mr-4" />
                <div className="text-right">
                  <div className="font-black text-base">إضافة كاتيجوري</div>
                  <div className="text-sm text-muted-foreground">أنشئ كاتيجوري جديدة</div>
                </div>
              </Link>
            </Button>

            <Button
              variant="outline"
              size="lg"
              asChild
              className="h-auto p-6 justify-start hover:border-[#D4AF37] transition-all"
            >
              <Link href="/admin/products">
                <ShoppingBag className="w-6 h-6 mr-4" />
                <div className="text-right">
                  <div className="font-black text-base">عرض جميع المنتجات</div>
                  <div className="text-sm text-muted-foreground">إدارة وتعديل المنتجات</div>
                </div>
              </Link>
            </Button>

            <Button
              variant="outline"
              size="lg"
              asChild
              className="h-auto p-6 justify-start hover:border-[#D4AF37] transition-all"
            >
              <Link href="/">
                <Home className="w-6 h-6 mr-4" />
                <div className="text-right">
                  <div className="font-black text-base">عرض الموقع</div>
                  <div className="text-sm text-muted-foreground">الانتقال إلى الصفحة الرئيسية</div>
                </div>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* RECENT PRODUCTS */}
      {stats.recentProducts.length > 0 && (
        <Card className="border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-black">آخر المنتجات المضافة</CardTitle>
              <Button variant="ghost" size="lg" asChild>
                <Link href="/admin/products">
                  عرض الكل →
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.recentProducts.map((p) => (
                <Button
                  key={p.id}
                  variant="outline"
                  size="lg"
                  asChild
                  className="w-full h-auto p-4 justify-between hover:border-[#D4AF37] transition-all"
                >
                  <Link href={`/admin/products/${p.id}/edit`}>
                    <div className="text-right">
                      <div className="font-black text-base">{p.name}</div>
                      <div className="text-sm text-muted-foreground">
                        ₪{p.price}
                      </div>
                    </div>
                    <span className="text-muted-foreground">→</span>
                  </Link>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
