"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2, Save, ArrowLeft } from "lucide-react";
import { Toast } from "../../../components/Toast";

type Company = {
  id: number;
  name: string;
  logoUrl?: string | null;
};

export default function EditCompanyPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  
  const [company, setCompany] = useState<Company | null>(null);
  const [name, setName] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [currentLogoUrl, setCurrentLogoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState<{ msg: string; type?: "success" | "error" } | null>(null);

  useEffect(() => {
    if (!id) return;
    
    fetch(`/api/admin/companies/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
          setLoading(false);
          return;
        }
        setCompany(data);
        setName(data.name || "");
        setCurrentLogoUrl(data.logoUrl || null);
        setLoading(false);
      })
      .catch(() => {
        setError("فشل تحميل الشركة");
        setLoading(false);
      });
  }, [id]);

  async function uploadLogo() {
    if (!logoFile) return currentLogoUrl;
    const formData = new FormData();
    formData.append("file", logoFile);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    if (!res.ok) throw new Error("فشل رفع الصورة");
    const data = await res.json();
    return data.url;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const logoUrl = await uploadLogo();

      const res = await fetch(`/api/admin/companies/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          logoUrl: logoUrl || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "فشل تحديث الشركة");
        setToast({ msg: data.error || "فشل تحديث الشركة", type: "error" });
        setSaving(false);
        return;
      }

      setToast({ msg: "تم تحديث الشركة بنجاح", type: "success" });
      setTimeout(() => router.push("/admin/companies"), 1000);
    } catch (err: any) {
      setError(err.message || "حدث خطأ أثناء تحديث الشركة");
      setToast({ msg: "حدث خطأ أثناء تحديث الشركة", type: "error" });
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

  if (error && !company) {
    return (
      <Card className="border-destructive/50 bg-destructive/10">
        <CardContent className="p-8">
          <div className="text-destructive text-lg font-bold">{error}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-4xl md:text-5xl font-black mb-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">تعديل الشركة</h1>
        <p className="text-muted-foreground text-lg">عدّل معلومات الشركة</p>
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
              {currentLogoUrl && !logoFile && (
                <div className="mb-3">
                  <img
                    src={currentLogoUrl}
                    alt="Current logo"
                    className="w-20 h-20 object-contain border border-border rounded-xl p-2"
                  />
                </div>
              )}
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
