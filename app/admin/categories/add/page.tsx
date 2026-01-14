"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2, Save, ArrowLeft } from "lucide-react";

export default function AddCategoryPage() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });

    router.push("/admin/categories");
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-4xl md:text-5xl font-black mb-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">إضافة فئة</h1>
        <p className="text-muted-foreground text-lg">أنشئ فئة جديدة</p>
      </div>

      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-2xl font-black">معلومات الفئة</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="name" className="text-base font-bold mb-2 block">اسم الفئة</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="اسم الفئة"
                className="h-14 text-base rounded-xl"
                required
              />
            </div>

            <div className="flex gap-4">
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
                    إنشاء الفئة
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
    </div>
  );
}
