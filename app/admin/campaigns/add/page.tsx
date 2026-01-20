"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Toast } from "../../components/Toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2, Save, ArrowLeft, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Product = {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
};

type ToastState = { msg: string; type?: "success" | "error" } | null;

function asNumberOrNull(v: string) {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

export default function AddCampaignPage() {
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<ToastState>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    discountType: "percent" as "percent" | "amount",
    discountPercent: "",
    discountAmount: "",
    isActive: true,
    showOnHomepage: false,
    startDate: "",
    endDate: "",
  });

  const selectedCount = selectedProducts.length;

  const canSubmit = useMemo(() => {
    if (!formData.title.trim()) return false;
    if (selectedCount === 0) return false;

    if (formData.discountType === "percent") {
      const n = asNumberOrNull(formData.discountPercent);
      if (n === null) return false;
      if (n < 0 || n > 100) return false;
      return true;
    } else {
      const n = asNumberOrNull(formData.discountAmount);
      if (n === null) return false;
      if (n < 0) return false;
      return true;
    }
  }, [formData, selectedCount]);

  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/products", { signal: controller.signal });
        if (!res.ok) throw new Error();
        const data: Product[] = await res.json();
        setProducts(data);
      } catch (e) {
        if ((e as any)?.name === "AbortError") return;
        setToast({ msg: "فشل تحميل المنتجات", type: "error" });
      } finally {
        setLoading(false);
      }
    })();

    return () => controller.abort();
  }, []);

  function toggleProduct(productId: string) {
    setSelectedProducts((prev) =>
      prev.includes(productId) ? prev.filter((x) => x !== productId) : [...prev, productId]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!canSubmit) {
      setToast({ msg: "تأكد من العنوان ونوع الخصم واختيار منتجات", type: "error" });
      return;
    }

    setSaving(true);

    try {
      const payload: any = {
        title: formData.title.trim(),
        description: formData.description.trim() ? formData.description.trim() : null,
        isActive: formData.isActive,
        showOnHomepage: formData.showOnHomepage,
        productIds: selectedProducts,
        startDate: formData.startDate ? new Date(formData.startDate).toISOString() : null,
        endDate: formData.endDate ? new Date(formData.endDate).toISOString() : null,
      };

      if (formData.discountType === "percent") {
        payload.discountPercent = asNumberOrNull(formData.discountPercent);
        payload.discountAmount = null;
      } else {
        payload.discountAmount = asNumberOrNull(formData.discountAmount);
        payload.discountPercent = null;
      }

      const res = await fetch("/api/admin/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        const errorMsg = data?.error || data?.message || "فشل إنشاء الخصم";
        setToast({ msg: errorMsg, type: "error" });
        setSaving(false);
        return;
      }

      setToast({ msg: "تم إنشاء الخصم بنجاح", type: "success" });
      setTimeout(() => router.push("/admin/campaigns"), 800);
    } catch (err: any) {
      console.error("Error creating campaign:", err);
      const errorMsg = err?.message || "حدث خطأ أثناء إنشاء الخصم";
      setToast({ msg: errorMsg, type: "error" });
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8" dir="rtl">
      <div>
        <h1 className="text-4xl md:text-5xl font-black mb-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">إضافة خصم جديد</h1>
        <p className="text-muted-foreground text-lg">أنشئ خصم جديد للمنتجات</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-2xl font-black">المعلومات الأساسية</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="title" className="text-base font-bold mb-2 block">عنوان الخصم</Label>
              <Input
                id="title"
                type="text"
                placeholder="عنوان الخصم"
                required
                className="h-14 text-base rounded-xl"
                value={formData.title}
                onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="description" className="text-base font-bold mb-2 block">وصف الخصم (اختياري)</Label>
              <textarea
                id="description"
                placeholder="وصف الخصم (اختياري)"
                className="w-full min-h-[100px] px-4 py-3 bg-background border border-input rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                value={formData.description}
                onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
              />
            </div>

            <div className="flex flex-wrap gap-6 items-center pt-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData((p) => ({ ...p, isActive: e.target.checked }))}
                  className="w-5 h-5 rounded border-input"
                />
                <span className="font-bold text-base">نشط</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.showOnHomepage}
                  onChange={(e) => setFormData((p) => ({ ...p, showOnHomepage: e.target.checked }))}
                  className="w-5 h-5 rounded border-input"
                />
                <span className="font-bold text-base">عرض في الصفحة الرئيسية</span>
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Discount Type */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-2xl font-black">نوع الخصم</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-wrap gap-6">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="discountType"
                  checked={formData.discountType === "percent"}
                  onChange={() => setFormData((p) => ({ ...p, discountType: "percent" }))}
                  className="w-5 h-5"
                />
                <span className="font-bold text-base">نسبة مئوية (%)</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="discountType"
                  checked={formData.discountType === "amount"}
                  onChange={() => setFormData((p) => ({ ...p, discountType: "amount" }))}
                  className="w-5 h-5"
                />
                <span className="font-bold text-base">مبلغ ثابت (₪)</span>
              </label>
            </div>

            {formData.discountType === "percent" ? (
              <div>
                <Label htmlFor="discountPercent" className="text-base font-bold mb-2 block">نسبة الخصم (0-100)</Label>
                <Input
                  id="discountPercent"
                  type="number"
                  placeholder="نسبة الخصم (0-100)"
                  min={0}
                  max={100}
                  required
                  className="h-14 text-base rounded-xl"
                  value={formData.discountPercent}
                  onChange={(e) => setFormData((p) => ({ ...p, discountPercent: e.target.value }))}
                />
              </div>
            ) : (
              <div>
                <Label htmlFor="discountAmount" className="text-base font-bold mb-2 block">مبلغ الخصم</Label>
                <Input
                  id="discountAmount"
                  type="number"
                  placeholder="مبلغ الخصم"
                  min={0}
                  step="0.01"
                  required
                  className="h-14 text-base rounded-xl"
                  value={formData.discountAmount}
                  onChange={(e) => setFormData((p) => ({ ...p, discountAmount: e.target.value }))}
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Dates */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-2xl font-black">تواريخ الخصم (اختياري)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="startDate" className="text-base font-bold mb-2 block">تاريخ البداية</Label>
                <Input
                  id="startDate"
                  type="datetime-local"
                  className="h-14 text-base rounded-xl"
                  value={formData.startDate}
                  onChange={(e) => setFormData((p) => ({ ...p, startDate: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="endDate" className="text-base font-bold mb-2 block">تاريخ النهاية</Label>
                <Input
                  id="endDate"
                  type="datetime-local"
                  className="h-14 text-base rounded-xl"
                  value={formData.endDate}
                  onChange={(e) => setFormData((p) => ({ ...p, endDate: e.target.value }))}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Products Selection */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-2xl font-black">
              اختيار المنتجات ({selectedCount} منتج محدد)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-h-96 overflow-y-auto border border-border rounded-xl p-4">
              {products.length === 0 ? (
                <p className="text-muted-foreground text-center py-8 text-lg">لا توجد منتجات</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {products.map((product) => {
                    const checked = selectedProducts.includes(product.id);
                    return (
                      <label
                        key={product.id}
                        className={cn(
                          "flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all",
                          checked
                            ? "border-[#D4AF37] bg-[#D4AF37]/10"
                            : "border-border hover:border-[#D4AF37]/50"
                        )}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleProduct(product.id)}
                          className="w-5 h-5 rounded border-input"
                        />
                        <div className="flex-1">
                          <div className="font-black text-base mb-1">{product.name}</div>
                          <div className="text-sm text-muted-foreground">{product.price} ₪</div>
                        </div>
                        {checked && <CheckCircle2 className="w-5 h-5 text-[#D4AF37]" />}
                      </label>
                    );
                  })}
                </div>
              )}
            </div>

            {selectedCount === 0 && (
              <p className="text-sm text-destructive mt-4 font-bold">اختر منتج واحد على الأقل</p>
            )}
          </CardContent>
        </Card>

        {/* Buttons */}
        <div className="flex flex-wrap gap-4">
          <Button
            variant="gold"
            size="xl"
            type="submit"
            disabled={saving || !canSubmit}
            className="uppercase tracking-wide shadow-xl hover:shadow-2xl"
          >
            {saving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin ml-2" />
                جاري الحفظ...
              </>
            ) : (
              <>
                <Save size={20} className="ml-2" />
                حفظ الخصم
              </>
            )}
          </Button>

          <Button
            variant="outline"
            size="xl"
            type="button"
            onClick={() => router.push("/admin/campaigns")}
            className="uppercase tracking-wide"
          >
            <ArrowLeft size={20} className="ml-2" />
            إلغاء
          </Button>
        </div>
      </form>

      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
