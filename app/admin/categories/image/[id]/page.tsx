"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2, Upload, ArrowLeft, Image as ImageIcon } from "lucide-react";
import { Toast } from "../../../components/Toast";

export default function UploadCategoryImage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();

  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type?: "success" | "error" } | null>(null);

  async function upload() {
    if (!file) {
      setError("يرجى اختيار صورة أولاً");
      setToast({ msg: "يرجى اختيار صورة أولاً", type: "error" });
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(`/api/admin/categories/image/${id}`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        setError("فشل رفع الصورة");
        setToast({ msg: "فشل رفع الصورة", type: "error" });
        setLoading(false);
        return;
      }

      setToast({ msg: "تم رفع الصورة بنجاح", type: "success" });
      setTimeout(() => router.push("/admin/categories"), 1000);
    } catch {
      setError("حدث خطأ أثناء رفع الصورة");
      setToast({ msg: "حدث خطأ أثناء رفع الصورة", type: "error" });
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-4xl md:text-5xl font-black mb-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">رفع صورة الفئة</h1>
        <p className="text-muted-foreground text-lg">أضف أو عدّل صورة الفئة</p>
      </div>

      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-2xl font-black">صورة الفئة</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => { e.preventDefault(); upload(); }} className="space-y-6">
            {error && (
              <Card className="border-destructive/50 bg-destructive/10">
                <CardContent className="p-4">
                  <p className="text-destructive font-bold text-sm">{error}</p>
                </CardContent>
              </Card>
            )}

            <div>
              <Label htmlFor="image" className="text-base font-bold mb-2 block">
                اختر صورة
              </Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="h-14 text-base rounded-xl cursor-pointer"
                disabled={loading}
              />
              {file && (
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground font-bold mb-2">معاينة الصورة:</p>
                  <div className="w-32 h-32 border-2 border-border rounded-xl overflow-hidden">
                    <img
                      src={URL.createObjectURL(file)}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                variant="gold"
                size="xl"
                type="submit"
                disabled={loading || !file}
                className="uppercase tracking-wide shadow-xl hover:shadow-2xl"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin ml-2" />
                    جاري الرفع...
                  </>
                ) : (
                  <>
                    <Upload size={20} className="ml-2" />
                    رفع الصورة
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
