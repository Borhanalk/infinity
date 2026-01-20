"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Loader2, Package, ArrowUp, ArrowDown } from "lucide-react";
import { Toast } from "../components/Toast";

type NewArrival = {
  id: string;
  productId: string;
  order: number;
  isActive: boolean;
  product: {
    id: string;
    name: string;
    price: number;
    images: Array<{ url: string }>;
    company?: { name: string; logoUrl?: string | null } | null;
  };
};

export default function NewArrivalsPage() {
  const [newArrivals, setNewArrivals] = useState<NewArrival[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState<{ msg: string; type?: "success" | "error" } | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string>("");

  const loadData = useCallback(async () => {
    try {
      setError("");
      const [arrivalsRes, productsRes] = await Promise.all([
        fetch("/api/admin/new-arrivals", { cache: "no-store" }),
        fetch("/api/admin/products/list", { cache: "no-store" }),
      ]);

      if (!arrivalsRes.ok) throw new Error("فشل تحميل البضاعة الجديدة");
      if (!productsRes.ok) throw new Error("فشل تحميل المنتجات");

      const arrivalsData = await arrivalsRes.json();
      const productsData = await productsRes.json();

      // تحويل المنتجات من المجموعات إلى قائمة مسطحة
      const allProducts: any[] = [];
      Object.values(productsData).forEach((group: any) => {
        if (Array.isArray(group)) {
          allProducts.push(...group);
        }
      });

      setNewArrivals(arrivalsData);
      setProducts(allProducts);
    } catch (err) {
      setError("فشل تحميل البيانات");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const addProduct = useCallback(async () => {
    if (!selectedProductId) {
      setToast({ msg: "يرجى اختيار منتج", type: "error" });
      return;
    }

    try {
      const res = await fetch("/api/admin/new-arrivals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: selectedProductId }),
      });

      const data = await res.json();

      if (!res.ok) {
        const errorMsg = data?.error || data?.message || "فشل إضافة المنتج";
        setToast({ msg: errorMsg, type: "error" });
        return;
      }

      setToast({ msg: "تم إضافة المنتج بنجاح", type: "success" });
      setSelectedProductId("");
      loadData();
    } catch (err: any) {
      console.error("Error adding product:", err);
      setToast({ msg: "حدث خطأ أثناء إضافة المنتج", type: "error" });
    }
  }, [selectedProductId, loadData]);

  const deleteProduct = useCallback(async (id: string) => {
    if (!confirm("هل تريد حذف هذا المنتج من البضاعة الجديدة؟")) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/new-arrivals/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        const errorMsg = data?.error || data?.message || "فشل حذف المنتج";
        setToast({ msg: errorMsg, type: "error" });
        setDeletingId(null);
        return;
      }

      setToast({ msg: "تم حذف المنتج بنجاح", type: "success" });
      setDeletingId(null);
      loadData();
    } catch (err: any) {
      console.error("Error deleting product:", err);
      setToast({ msg: "حدث خطأ أثناء حذف المنتج", type: "error" });
      setDeletingId(null);
    }
  }, [loadData]);

  const updateOrder = useCallback(async (id: string, direction: "up" | "down") => {
    const item = newArrivals.find((na) => na.id === id);
    if (!item) return;

    const currentIndex = newArrivals.findIndex((na) => na.id === id);
    if (direction === "up" && currentIndex === 0) return;
    if (direction === "down" && currentIndex === newArrivals.length - 1) return;

    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    const targetItem = newArrivals[targetIndex];

    // تبادل الترتيب
    try {
      const [res1, res2] = await Promise.all([
        fetch(`/api/admin/new-arrivals/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order: targetItem.order }),
        }),
        fetch(`/api/admin/new-arrivals/${targetItem.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order: item.order }),
        }),
      ]);

      const data1 = await res1.json();
      const data2 = await res2.json();

      if (!res1.ok || !res2.ok) {
        const errorMsg = data1?.error || data2?.error || data1?.message || data2?.message || "فشل تحديث الترتيب";
        setToast({ msg: errorMsg, type: "error" });
        return;
      }

      loadData();
    } catch (err: any) {
      console.error("Error updating order:", err);
      setToast({ msg: "حدث خطأ أثناء تحديث الترتيب", type: "error" });
    }
  }, [newArrivals, loadData]);

  const availableProducts = useMemo(() => {
    const usedProductIds = new Set(newArrivals.map((na) => na.productId));
    return products.filter((p) => !usedProductIds.has(p.id));
  }, [products, newArrivals]);

  const newArrivalsCount = useMemo(() => newArrivals.length, [newArrivals.length]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-black mb-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">البضاعة الجديدة</h1>
          <p className="text-muted-foreground text-lg">إدارة المنتجات المعروضة في الصفحة الرئيسية ({newArrivalsCount} منتج)</p>
        </div>
      </div>

      {error && (
        <Card className="border-destructive/50 bg-destructive/10">
          <CardContent className="p-6">
            <div className="text-destructive text-lg font-bold">{error}</div>
          </CardContent>
        </Card>
      )}

      {/* إضافة منتج جديد */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-2xl font-black">إضافة منتج للبضاعة الجديدة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="flex-1 h-12 px-4 bg-background border border-input rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">اختر منتج...</option>
              {availableProducts.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} - {p.price} ₪
                </option>
              ))}
            </select>
            <Button
              variant="gold"
              size="xl"
              onClick={addProduct}
              disabled={!selectedProductId}
              className="uppercase tracking-wide"
            >
              <Plus size={20} className="ml-2" />
              إضافة
            </Button>
          </div>
          {availableProducts.length === 0 && (
            <p className="text-sm text-muted-foreground mt-3">جميع المنتجات موجودة بالفعل في البضاعة الجديدة</p>
          )}
        </CardContent>
      </Card>

      {/* قائمة البضاعة الجديدة */}
      {newArrivals.length === 0 ? (
        <Card className="text-center py-16">
          <CardContent>
            <div className="text-6xl mb-6 opacity-30">✨</div>
            <p className="text-muted-foreground text-lg mb-6">لا توجد منتجات في البضاعة الجديدة</p>
            <p className="text-sm text-muted-foreground">أضف منتجات من القائمة أعلاه</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {newArrivals.map((na, index) => (
            <Card key={na.id} className="border-border hover:shadow-lg transition-all duration-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  {/* أزرار الترتيب */}
                  <div className="flex flex-col gap-1">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => updateOrder(na.id, "up")}
                      disabled={index === 0}
                      className="h-8 w-8"
                    >
                      <ArrowUp size={14} />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => updateOrder(na.id, "down")}
                      disabled={index === newArrivals.length - 1}
                      className="h-8 w-8"
                    >
                      <ArrowDown size={14} />
                    </Button>
                  </div>

                  {/* رقم الترتيب */}
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#C9A961] flex items-center justify-center text-white font-black text-sm">
                    {index + 1}
                  </div>

                  {/* صورة المنتج */}
                  {na.product.images && na.product.images.length > 0 ? (
                    <img
                      src={na.product.images[0].url}
                      alt={na.product.name}
                      loading="lazy"
                      className="w-16 h-16 object-cover rounded-lg border border-border flex-shrink-0"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-muted rounded-lg border border-border flex items-center justify-center flex-shrink-0">
                      <Package className="w-6 h-6 text-muted-foreground" />
                    </div>
                  )}

                  {/* معلومات المنتج */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-black text-base mb-1 truncate">{na.product.name}</h3>
                    <div className="flex items-center gap-3">
                      <span className="text-foreground font-black text-sm">{na.product.price} ₪</span>
                      {na.product.company && (
                        <span className="text-xs text-muted-foreground font-bold">{na.product.company.name}</span>
                      )}
                    </div>
                  </div>

                  {/* زر الحذف */}
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteProduct(na.id)}
                    disabled={deletingId === na.id}
                    className="h-9"
                  >
                    {deletingId === na.id ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Trash2 size={14} />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

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
