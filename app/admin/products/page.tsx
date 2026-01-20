"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { Toast } from "../components/Toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Plus, Edit, Loader2, Package } from "lucide-react";

type Product = {
  id: string;
  name: string;
  price: number;
  createdAt: string;
  images?: Array<{ url: string }>;
  company?: { id: number; name: string; logoUrl?: string | null } | null;
  category?: { id: number; name: string } | null;
};

type CompanyGroup = {
  companyId: number;
  companyName: string;
  companyLogoUrl: string | null;
  categories: Record<string, Product[]>;
};

export default function ProductsPage() {
  const [companyGroups, setCompanyGroups] = useState<Record<string, CompanyGroup>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState<{ msg: string; type?: "success" | "error" } | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [searchId, setSearchId] = useState("");

  const loadProducts = useCallback(async () => {
    try {
      setError("");
      const res = await fetch("/api/admin/products/list", { cache: "no-store" });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setCompanyGroups(data);
    } catch {
      setError("فشل تحميل المنتجات");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const deleteProduct = useCallback(async (id: string) => {
    if (!confirm("هل تريد حذف هذا المنتج؟")) return;
    
    setDeletingId(id);
    const res = await fetch(`/api/admin/products?id=${id}`, { method: "DELETE" });
    if (!res.ok) {
      setToast({ msg: "فشل حذف المنتج", type: "error" });
      setDeletingId(null);
      return;
    }
    setToast({ msg: "تم حذف المنتج بنجاح", type: "success" });
    setDeletingId(null);
    await loadProducts();
  }, [loadProducts]);

  const bulkDelete = useCallback(async (months: number) => {
    if (!confirm(`هل تريد حذف المنتجات الأقدم من ${months} أشهر؟`)) return;
    const res = await fetch("/api/admin/products", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ months }),
    });
    if (!res.ok) {
      setToast({ msg: "فشل حذف المنتجات", type: "error" });
      return;
    }
    setToast({ msg: `تم حذف المنتجات الأقدم من ${months} أشهر`, type: "success" });
    await loadProducts();
  }, [loadProducts]);

  const totalProducts = useMemo(() => {
    let total = 0;
    Object.values(companyGroups).forEach(company => {
      Object.values(company.categories).forEach(products => {
        total += products.length;
      });
    });
    return total;
  }, [companyGroups]);

  // البحث بالـ ID
  const filteredCompanyGroups = useMemo(() => {
    if (!searchId.trim()) return companyGroups;
    
    const filtered: Record<string, CompanyGroup> = {};
    Object.entries(companyGroups).forEach(([companyName, company]) => {
      const filteredCategories: Record<string, Product[]> = {};
      
      Object.entries(company.categories).forEach(([categoryName, products]) => {
        const matching = products.filter(p => 
          p.id.toLowerCase().includes(searchId.toLowerCase().trim())
        );
        if (matching.length > 0) {
          filteredCategories[categoryName] = matching;
        }
      });
      
      if (Object.keys(filteredCategories).length > 0) {
        filtered[companyName] = {
          ...company,
          categories: filteredCategories,
        };
      }
    });
    return filtered;
  }, [companyGroups, searchId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive/50 bg-destructive/10">
        <CardContent className="p-8">
          <div className="text-destructive text-lg font-bold">{error}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">المنتجات</h1>
          <p className="text-muted-foreground text-base lg:text-lg">إدارة جميع المنتجات ({totalProducts} منتج)</p>
        </div>
        <Button variant="gold" size="lg" asChild className="uppercase tracking-wide shadow-xl hover:shadow-2xl w-full sm:w-auto">
          <Link href="/admin/products/add">
            <Plus size={18} className="ml-2" />
            إضافة منتج
          </Link>
        </Button>
      </div>

      {/* البحث بالـ ID */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-xl font-black">البحث بالـ ID</CardTitle>
        </CardHeader>
        <CardContent>
          <input
            type="text"
            placeholder="ابحث عن منتج بالـ ID..."
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            className="w-full h-12 px-4 bg-background border border-input rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-ring"
          />
          {searchId && (
            <p className="text-xs text-muted-foreground mt-2">
              تم العثور على {(() => {
                let total = 0;
                Object.values(filteredCompanyGroups).forEach(company => {
                  Object.values(company.categories).forEach(products => {
                    total += products.length;
                  });
                });
                return total;
              })()} منتج
            </p>
          )}
        </CardContent>
      </Card>

      {/* BULK DELETE */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-2xl font-black">حذف جماعي</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 lg:gap-4">
            <Button
              variant="destructive"
              size="lg"
              onClick={() => bulkDelete(3)}
              className="uppercase tracking-wide"
            >
              <Trash2 size={18} className="ml-2" />
              حذف أقدم من 3 أشهر
            </Button>
            <Button
              variant="destructive"
              size="lg"
              onClick={() => bulkDelete(6)}
              className="uppercase tracking-wide"
            >
              <Trash2 size={18} className="ml-2" />
              حذف أقدم من 6 أشهر
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* GROUPED BY COMPANY AND CATEGORY */}
      {Object.keys(filteredCompanyGroups).length === 0 && !loading && (
        <Card className="text-center py-16">
          <CardContent>
            <div className="text-6xl mb-6 opacity-30">📦</div>
            <p className="text-muted-foreground text-lg mb-6">لا توجد منتجات بعد</p>
            <Button variant="gold" size="xl" asChild className="uppercase tracking-wide">
              <Link href="/admin/products/add">
                <Plus size={20} className="ml-2" />
                إضافة منتج جديد
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {Object.entries(filteredCompanyGroups).map(([companyName, company]) => {
        const companyTotalProducts = Object.values(company.categories).reduce(
          (sum, products) => sum + products.length,
          0
        );

        return (
          <Card key={companyName} className="border-border">
            <CardHeader>
              <div className="flex items-center gap-3">
                {company.companyLogoUrl && (
                  <img
                    src={company.companyLogoUrl}
                    alt={companyName}
                    className="w-10 h-10 object-contain rounded-lg border border-border"
                  />
                )}
                <CardTitle className="text-2xl font-black">
                  {companyName} ({companyTotalProducts} منتج)
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {Object.entries(company.categories).map(([categoryName, products]) => (
                <div key={categoryName} className="space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-border/50">
                    <h3 className="text-lg font-black text-foreground">{categoryName}</h3>
                    <span className="text-sm text-muted-foreground">({products.length} منتج)</span>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4">
                    {products.map(p => (
                      <Card key={p.id} className="border-border hover:shadow-lg transition-all duration-200">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3 mb-3">
                            {p.images && p.images.length > 0 ? (
                              <img
                                src={p.images[0].url}
                                alt={p.name || "منتج"}
                                loading="lazy"
                                className="w-16 h-16 object-cover rounded-lg border border-border flex-shrink-0"
                              />
                            ) : (
                              <div className="w-16 h-16 bg-muted rounded-lg border border-border flex items-center justify-center flex-shrink-0">
                                <Package className="w-6 h-6 text-muted-foreground" />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <h3 className="font-black text-base mb-1 truncate">
                                {p.name || `منتج #${p.id.substring(0, 8)}`}
                              </h3>
                              <div className="flex items-center gap-2 flex-wrap mb-1">
                                <span className="text-xs text-muted-foreground font-mono">ID: {p.id.substring(0, 8)}...</span>
                              </div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-foreground font-black text-sm">{p.price.toFixed(2)} ₪</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-2 pt-3 border-t border-border">
                            <Button variant="outline" size="sm" asChild className="flex-1 h-9 text-xs">
                              <Link href={`/admin/products/${p.id}/edit`}>
                                <Edit size={14} className="ml-1.5" />
                                تعديل
                              </Link>
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => deleteProduct(p.id)}
                              disabled={deletingId === p.id}
                              className="flex-1 h-9 text-xs"
                            >
                              {deletingId === p.id ? (
                                <Loader2 size={14} className="ml-1.5 animate-spin" />
                              ) : (
                                <Trash2 size={14} className="ml-1.5" />
                              )}
                              حذف
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        );
      })}

      {toast && (
        <Toast
          message={toast.msg}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
