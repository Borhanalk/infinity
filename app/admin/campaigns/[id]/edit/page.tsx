"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Toast } from "../../../components/Toast";

type Product = {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
};

type CampaignProduct = { productId: string };

type Campaign = {
  id: string;
  title: string;
  description?: string | null;
  discountPercent?: number | null;
  discountAmount?: number | null;
  isActive: boolean;
  showOnHomepage: boolean;
  startDate?: string | null;
  endDate?: string | null;
  products: CampaignProduct[];
};

type ToastState = { msg: string; type?: "success" | "error" } | null;

function toDateTimeLocal(value?: string | null) {
  // مهم: datetime-local يحتاج وقت "محلي" وليس UTC
  if (!value) return "";
  const d = new Date(value);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}

function asNumberOrNull(v: string) {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

export default function EditCampaignPage() {
  const params = useParams();
  const id = (params?.id as string) || "";
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [campaign, setCampaign] = useState<Campaign | null>(null);

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
    if (!id) {
      setLoading(false);
      setToast({ msg: "المعرف غير صحيح", type: "error" });
      return;
    }

    const controller = new AbortController();

    (async () => {
      setLoading(true);
      try {
        const [campaignRes, productsRes] = await Promise.all([
          fetch(`/api/admin/campaigns/${id}`, { signal: controller.signal }),
          fetch("/api/products", { signal: controller.signal }),
        ]);

        if (!campaignRes.ok) throw new Error("campaign");
        if (!productsRes.ok) throw new Error("products");

        const campaignData: Campaign = await campaignRes.json();
        const productsData: Product[] = await productsRes.json();

        setCampaign(campaignData);
        setProducts(productsData);

        const ids = (campaignData.products || []).map((p) => p.productId);
        setSelectedProducts(ids);

        setFormData({
          title: campaignData.title || "",
          description: (campaignData.description as string) || "",
          discountType: campaignData.discountPercent != null ? "percent" : "amount",
          discountPercent:
            campaignData.discountPercent != null ? String(campaignData.discountPercent) : "",
          discountAmount:
            campaignData.discountAmount != null ? String(campaignData.discountAmount) : "",
          isActive: Boolean(campaignData.isActive),
          showOnHomepage: Boolean(campaignData.showOnHomepage),
          startDate: toDateTimeLocal(campaignData.startDate),
          endDate: toDateTimeLocal(campaignData.endDate),
        });
      } catch (e) {
        if ((e as any)?.name === "AbortError") return;
        setToast({ msg: "فشل تحميل البيانات", type: "error" });
      } finally {
        setLoading(false);
      }
    })();

    return () => controller.abort();
  }, [id]);

  function toggleProduct(productId: string) {
    setSelectedProducts((prev) =>
      prev.includes(productId) ? prev.filter((x) => x !== productId) : [...prev, productId]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!id) return;

    // تحقق إضافي قبل الإرسال
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

      const res = await fetch(`/api/admin/campaigns/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error();

      setToast({ msg: "تم تحديث الخصم بنجاح", type: "success" });
      setTimeout(() => router.push("/admin/campaigns"), 800);
    } catch {
      setToast({ msg: "فشل تحديث الخصم", type: "error" });
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="p-8">جاري التحميل...</div>;
  if (!campaign) return <div className="p-8 text-red-600">الخصم غير موجود</div>;

  return (
    <div className="max-w-4xl" dir="rtl">
      <h1 className="text-3xl font-black mb-8 text-gray-900">تعديل الخصم</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <section className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-black mb-4 text-gray-900">المعلومات الأساسية</h2>

          <input
            type="text"
            placeholder="عنوان الخصم"
            required
            className="w-full bg-white border border-gray-200 px-4 py-3 rounded-lg text-gray-900 mb-3 focus:outline-none focus:ring-2 focus:ring-black"
            value={formData.title}
            onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
          />

          <textarea
            placeholder="وصف الخصم (اختياري)"
            className="w-full bg-white border border-gray-200 px-4 py-3 rounded-lg text-gray-900 mb-3 focus:outline-none focus:ring-2 focus:ring-black"
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
          />

          <div className="flex flex-wrap gap-6 items-center">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData((p) => ({ ...p, isActive: e.target.checked }))}
                className="w-4 h-4"
              />
              <span className="font-bold">نشط</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.showOnHomepage}
                onChange={(e) => setFormData((p) => ({ ...p, showOnHomepage: e.target.checked }))}
                className="w-4 h-4"
              />
              <span className="font-bold">عرض في الصفحة الرئيسية</span>
            </label>
          </div>
        </section>

        {/* Discount Type */}
        <section className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-black mb-4 text-gray-900">نوع الخصم</h2>

          <div className="flex flex-wrap gap-6 mb-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="discountType"
                value="percent"
                checked={formData.discountType === "percent"}
                onChange={() => setFormData((p) => ({ ...p, discountType: "percent" }))}
                className="w-4 h-4"
              />
              <span className="font-bold">نسبة مئوية (%)</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="discountType"
                value="amount"
                checked={formData.discountType === "amount"}
                onChange={() => setFormData((p) => ({ ...p, discountType: "amount" }))}
                className="w-4 h-4"
              />
              <span className="font-bold">مبلغ ثابت (₪)</span>
            </label>
          </div>

          {formData.discountType === "percent" ? (
            <input
              type="number"
              placeholder="نسبة الخصم (0-100)"
              min={0}
              max={100}
              required
              className="w-full bg-white border border-gray-200 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-black"
              value={formData.discountPercent}
              onChange={(e) => setFormData((p) => ({ ...p, discountPercent: e.target.value }))}
            />
          ) : (
            <input
              type="number"
              placeholder="مبلغ الخصم"
              min={0}
              step="0.01"
              required
              className="w-full bg-white border border-gray-200 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-black"
              value={formData.discountAmount}
              onChange={(e) => setFormData((p) => ({ ...p, discountAmount: e.target.value }))}
            />
          )}
        </section>

        {/* Dates */}
        <section className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-black mb-4 text-gray-900">تواريخ الخصم (اختياري)</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold mb-2">تاريخ البداية</label>
              <input
                type="datetime-local"
                className="w-full bg-white border border-gray-200 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-black"
                value={formData.startDate}
                onChange={(e) => setFormData((p) => ({ ...p, startDate: e.target.value }))}
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">تاريخ النهاية</label>
              <input
                type="datetime-local"
                className="w-full bg-white border border-gray-200 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-black"
                value={formData.endDate}
                onChange={(e) => setFormData((p) => ({ ...p, endDate: e.target.value }))}
              />
            </div>
          </div>
        </section>

        {/* Products Selection */}
        <section className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-black mb-4 text-gray-900">
            اختيار المنتجات ({selectedCount} منتج محدد)
          </h2>

          <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-lg p-4">
            {products.length === 0 ? (
              <p className="text-gray-500 text-center py-8">لا توجد منتجات</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {products.map((product) => {
                  const checked = selectedProducts.includes(product.id);
                  return (
                    <label
                      key={product.id}
                      className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition ${checked
                          ? "border-black bg-gray-50"
                          : "border-gray-200 hover:border-gray-300"
                        }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleProduct(product.id)}
                        className="w-4 h-4"
                      />
                      <div className="flex-1">
                        <div className="font-bold text-sm">{product.name}</div>
                        <div className="text-xs text-gray-500">{product.price} ₪</div>
                      </div>
                    </label>
                  );
                })}
              </div>
            )}
          </div>

          {selectedCount === 0 && (
            <p className="text-sm text-red-600 mt-3 font-bold">اختر منتج واحد على الأقل</p>
          )}
        </section>

        {/* Buttons */}
        <div className="flex flex-wrap gap-4">
          <button
            type="submit"
            disabled={saving || !canSubmit}
            className="px-8 py-3 bg-black text-white font-black rounded hover:bg-gray-800 transition-all shadow-lg disabled:opacity-50"
          >
            {saving ? "جاري الحفظ..." : "حفظ التغييرات"}
          </button>

          <button
            type="button"
            onClick={() => router.push("/admin/campaigns")}
            className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg font-bold transition-all"
          >
            إلغاء
          </button>
        </div>
      </form>

      {toast && (
        <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  );
}
