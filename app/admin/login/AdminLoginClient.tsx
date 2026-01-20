"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2, AlertCircle, Lock, Mail } from "lucide-react";

export default function AdminLoginClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      // التحقق من نوع الـ response
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("Non-JSON response:", text);
        setError("حدث خطأ في الاتصال بالخادم");
        setLoading(false);
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.error || data.details || "حدث خطأ أثناء تسجيل الدخول";
        setError(errorMessage);
        setLoading(false);
        return;
      }

      if (data.success && data.token) {
        // حفظ Token في cookie
        document.cookie = `admin_token=${data.token}; path=/; max-age=${
          7 * 24 * 60 * 60
        }; SameSite=Lax`;
        document.cookie = `admin_email=${data.admin.email}; path=/; max-age=${
          7 * 24 * 60 * 60
        }; SameSite=Lax`;

        // إعادة التوجيه إلى لوحة التحكم أو الصفحة المطلوبة
        const returnTo = searchParams.get("returnTo") || "/admin";
        router.push(returnTo);
      } else {
        setError("حدث خطأ أثناء تسجيل الدخول - لم يتم استلام token");
        setLoading(false);
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "حدث خطأ أثناء تسجيل الدخول. يرجى التحقق من الاتصال بالخادم.");
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-secondary/20 to-background px-4"
      dir="rtl"
    >
      <Card className="w-full max-w-md border-border shadow-2xl">
        <CardHeader className="text-center pb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-[#D4AF37] to-[#C9A961] rounded-full flex items-center justify-center mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-3xl md:text-4xl font-black bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            تسجيل دخول المسؤول
          </CardTitle>
          <p className="text-muted-foreground mt-2">
            أدخل بيانات الدخول للوصول إلى لوحة الإدارة
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Card className="border-destructive/50 bg-destructive/10">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-destructive font-bold">
                      {error}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            <div>
              <Label htmlFor="email" className="text-base font-bold mb-2 block">
                البريد الإلكتروني
              </Label>
              <div className="relative">
                <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@infinity.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-14 pr-12 text-base rounded-xl"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <Label
                htmlFor="password"
                className="text-base font-bold mb-2 block"
              >
                كلمة المرور
              </Label>
              <div className="relative">
                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-14 pr-12 text-base rounded-xl"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="gold"
              size="xl"
              className="w-full uppercase tracking-wide shadow-xl hover:shadow-2xl"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin ml-2" />
                  جاري تسجيل الدخول...
                </>
              ) : (
                <>
                  <Lock size={20} className="ml-2" />
                  تسجيل الدخول
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-muted-foreground">
              هذه الصفحة للمسؤولين فقط
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
