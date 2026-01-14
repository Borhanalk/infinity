"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2, Save, ArrowLeft } from "lucide-react";
import { Toast } from "../../../components/Toast";

export default function EditCategoryPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState<{ msg: string; type?: "success" | "error" } | null>(null);

  useEffect(() => {
    async function loadCategory() {
      try {
        const res = await fetch(`/api/admin/categories/${id}`, {
          cache: "no-store",
        });

        if (!res.ok) throw new Error();

        const data = await res.json();
        setName(data.name);
      } catch {
        setError("فشل تحميل الفئة");
        setToast({ msg: "فشل تحميل الفئة", type: "error" });
      } finally {
        setLoading(false);
      }
    }

    loadCategory();
  }, [id]);

  async function save() {
    setSaving(true);
    setError("");

    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });

      if (!res.ok) {
        setError("فشل حفظ التغييرات");
        setToast({ msg: "فشل حفظ التغييرات", type: "error" });
        setSaving(false);
        return;
      }

      setToast({ msg: "تم حفظ التغييرات بنجاح", type: "success" });
      setTimeout(() => router.push("/admin/categories"), 1000);
    } catch {
      setError("حدث خطأ أثناء الحفظ");
      setToast({ msg: "حدث خطأ أثناء الحفظ", type: "error" });
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
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-4xl md:text-5xl font-black mb-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">تعديل الفئة</h1>
        <p className="text-muted-foreground text-lg">عدّل معلومات الفئة</p>
      </div>

      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-2xl font-black">معلومات الفئة</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => { e.preventDefault(); save(); }} className="space-y-6">
            {error && (
              <Card className="border-destructive/50 bg-destructive/10">
                <CardContent className="p-4">
                  <p className="text-destructive font-bold text-sm">{error}</p>
                </CardContent>
              </Card>
            )}

            <div>
              <Label htmlFor="name" className="text-base font-bold mb-2 block">
                اسم الفئة *
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="اسم الفئة"
                className="h-14 text-base rounded-xl"
                required
                disabled={saving}
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                variant="gold"
                size="xl"
                type="submit"
                disabled={saving}
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
                    حفظ التغييرات
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="xl"
                type="button"
                onClick={() => router.push("/admin/categories")}
                className="uppercase tracking-wide"
              >
                <ArrowLeft size={20} className="ml-2" />
                إلغاء
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

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
