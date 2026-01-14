"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2, Save, ArrowLeft, Building2 } from "lucide-react";
import { Toast } from "../../components/Toast";

export default function AddCompanyPage() {
  const [name, setName] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState<{ msg: string; type?: "success" | "error" } | null>(null);
  const router = useRouter();

  async function uploadLogo() {
    if (!logoFile) return null;
    const formData = new FormData();
    formData.append("file", logoFile);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    if (!res.ok) throw new Error("فشل رفع الصورة");
    const data = await res.json();
    return data.url;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const logoUrl = await uploadLogo();

      const res = await fetch("/api/admin/companies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          logoUrl: logoUrl || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "فشل إنشاء الشركة");
        setToast({ msg: data.error || "فشل إنشاء الشركة", type: "error" });
        setLoading(false);
        return;
      }

      setToast({ msg: "تم إنشاء الشركة بنجاح", type: "success" });
      setTimeout(() => router.push("/admin/companies"), 1000);
    } catch (err: any) {
      setError(err.message || "حدث خطأ أثناء إنشاء الشركة");
      setToast({ msg: "حدث خطأ أثناء إنشاء الشركة", type: "error" });
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-4xl md:text-5xl font-black mb-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">إضافة شركة</h1>
        <p className="text-muted-foreground text-lg">أنشئ شركة جديدة</p>
      </div>

      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-2xl font-black">معلومات الشركة</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Card className="border-destructive/50 bg-destructive/10">
                <CardContent className="p-4">
                  <p className="text-destructive font-bold text-sm">{error}</p>
                </CardContent>
              </Card>
            )}

            <div>
              <Label htmlFor="name" className="text-base font-bold mb-2 block">
                اسم الشركة *
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="اسم الشركة"
                className="h-14 text-base rounded-xl"
                required
              />
            </div>

            <div>
              <Label htmlFor="logo" className="text-base font-bold mb-2 block">
                شعار الشركة (اختياري)
              </Label>
              <Input
                id="logo"
                type="file"
                accept="image/*"
                onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
                className="h-14 text-base rounded-xl cursor-pointer"
              />
              {logoFile && (
                <p className="mt-3 text-sm text-muted-foreground font-bold">
                  تم اختيار: {logoFile.name}
                </p>
              )}
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                variant="gold"
                size="xl"
                type="submit"
                disabled={loading}
                className="uppercase tracking-wide shadow-xl hover:shadow-2xl"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin ml-2" />
                    جاري الحفظ...
                  </>
                ) : (
                  <>
                    <Save size={20} className="ml-2" />
                    إنشاء الشركة
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="xl"
                type="button"
                onClick={() => router.push("/admin/companies")}
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
