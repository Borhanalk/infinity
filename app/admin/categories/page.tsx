"use client";

import Link from "next/link";
import { useEffect, useState, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Plus, Edit, Image as ImageIcon, Trash2, Loader2, Folder } from "lucide-react";
import { Toast } from "../components/Toast";

type Category = {
  id: number;
  name: string;
  imageUrl?: string | null;
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [dbError, setDbError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type?: "success" | "error" } | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const loadCategories = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/categories", {
        cache: "no-store",
      });

      const data = await res.json();

      if (data.error && data.message) {
        setDbError(data.message);
        console.warn("⚠️ Database connection issue:", data.message);
      } else {
        setDbError(null);
      }

      setCategories(data.categories || data || []);
    } catch (error) {
      setToast({ msg: "فشل تحميل الفئات", type: "error" });
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteCategory = useCallback(async (id: number) => {
    if (!confirm("هل أنت متأكد من حذف هذه الفئة؟")) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        const errorMsg = data?.error || data?.message || "فشل حذف الفئة";
        setToast({ msg: errorMsg, type: "error" });
        setDeletingId(null);
        return;
      }

      setToast({ msg: "تم حذف الفئة بنجاح", type: "success" });
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch (err: any) {
      console.error("Error deleting category:", err);
      setToast({ msg: "حدث خطأ أثناء حذف الفئة", type: "error" });
    } finally {
      setDeletingId(null);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const categoriesCount = useMemo(() => categories.length, [categories.length]);

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
          <h1 className="text-4xl md:text-5xl font-black mb-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">الفئات</h1>
          <p className="text-muted-foreground text-lg">إدارة جميع الفئات ({categoriesCount} فئة)</p>
        </div>
        <Button variant="gold" size="xl" asChild className="uppercase tracking-wide shadow-xl hover:shadow-2xl">
          <Link href="/admin/categories/add">
            <Plus size={20} className="ml-2" />
            إضافة فئة
          </Link>
        </Button>
      </div>

      {/* رسالة خطأ قاعدة البيانات */}
      {dbError && (
        <Card className="border-orange-500/50 bg-orange-500/10">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-orange-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-black text-orange-300 mb-2 text-lg">
                  مشكلة في الاتصال بقاعدة البيانات
                </h3>
                <p className="text-sm text-orange-200/80 mb-3">{dbError}</p>
                <p className="text-xs text-orange-200/60">
                  راجع ملف <code className="bg-background/30 px-2 py-1 rounded">.env</code> وتأكد من صحة <code className="bg-background/30 px-2 py-1 rounded">DATABASE_URL</code>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {categories.length === 0 && !loading && !dbError && (
        <Card className="text-center py-16">
          <CardContent>
            <div className="text-6xl mb-6 opacity-30">📁</div>
            <p className="text-muted-foreground text-lg mb-6">لا توجد فئات بعد</p>
            <Button variant="gold" size="xl" asChild className="uppercase tracking-wide">
              <Link href="/admin/categories/add">
                <Plus size={20} className="ml-2" />
                إضافة فئة جديدة
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {categories.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {categories.map((c) => (
            <Card key={c.id} className="border-border hover:shadow-lg transition-all duration-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  {c.imageUrl ? (
                    <img
                      src={c.imageUrl}
                      alt={c.name}
                      loading="lazy"
                      className="w-16 h-16 object-cover rounded-lg border border-border flex-shrink-0"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-muted rounded-lg border border-border flex items-center justify-center flex-shrink-0">
                      <Folder className="w-6 h-6 text-muted-foreground" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-black truncate">{c.name}</h3>
                  </div>
                </div>

                <div className="flex gap-2 pt-3 border-t border-border">
                  <Button variant="outline" size="sm" asChild className="flex-1 h-9 text-xs">
                    <Link href={`/admin/categories/edit/${c.id}`}>
                      <Edit size={14} className="ml-1.5" />
                      تعديل
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild className="flex-1 h-9 text-xs">
                    <Link href={`/admin/categories/image/${c.id}`}>
                      <ImageIcon size={14} className="ml-1.5" />
                      صورة
                    </Link>
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteCategory(c.id)}
                    disabled={deletingId === c.id}
                    className="flex-1 h-9 text-xs"
                  >
                    {deletingId === c.id ? (
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
