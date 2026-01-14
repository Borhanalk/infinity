"use client";

import { useAuth } from "../../contexts/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { Loader2, AlertCircle, ExternalLink, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

function LoginContent() {
  const { signInWithGoogle, user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSetupGuide, setShowSetupGuide] = useState(false);
  const urlError = searchParams.get("error");

  useEffect(() => {
    if (!loading && user) {
      router.push("/");
    }
    if (urlError) {
      const decodedError = decodeURIComponent(urlError);
      setError(decodedError);
      
      // Show setup guide automatically if provider is not enabled
      if (decodedError.includes("provider is not enabled") || 
          decodedError.includes("غير مفعّل") ||
          decodedError.includes("Unsupported provider")) {
        setShowSetupGuide(true);
      }
    }
  }, [user, loading, router, urlError]);

  const handleGoogleSignIn = async () => {
    try {
      setIsSigningIn(true);
      setError(null);
      await signInWithGoogle();
      // Note: signInWithOAuth redirects, so we won't reach here on success
    } catch (error: any) {
      console.error("Error signing in:", error);
      
      // Extract error message from different possible formats
      const errorMessage = error?.message || error?.msg || error?.error_description || "حدث خطأ أثناء تسجيل الدخول. يرجى المحاولة مرة أخرى.";
      setError(errorMessage);
      
      // Show setup guide if provider is not enabled
      if (errorMessage.includes("provider is not enabled") || 
          errorMessage.includes("غير مفعّل") ||
          errorMessage.includes("Unsupported provider") ||
          error?.code === "validation_failed" ||
          error?.error_code === "validation_failed") {
        setShowSetupGuide(true);
      }
      
      setIsSigningIn(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-12 h-12 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (user) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12" dir="rtl">
      <Card className="w-full max-w-lg border-border shadow-2xl">
        <CardContent className="p-10">
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">تسجيل الدخول</h1>
            <p className="text-muted-foreground text-lg">سجل دخولك للوصول إلى حسابك</p>
          </div>

        {error && (
          <Card className="mb-6 border-destructive/50 bg-destructive/10">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-destructive flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-destructive font-bold mb-2">{error}</p>
                  {(error.includes("provider is not enabled") || error.includes("غير مفعّل")) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowSetupGuide(!showSetupGuide)}
                      className="text-xs text-destructive hover:text-destructive/90 p-0 h-auto"
                    >
                      {showSetupGuide ? "إخفاء" : "عرض"} تعليمات الإعداد
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {showSetupGuide && (
          <Card className="mb-6 border-blue-200 bg-blue-50/50">
            <CardContent className="p-6">
              <h3 className="text-xl font-black text-blue-900 mb-6 flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6" />
                خطوات تفعيل Google Provider
              </h3>
            <ol className="space-y-3 text-sm text-blue-800">
              <li className="flex items-start gap-2">
                <span className="font-black text-blue-600">1.</span>
                <span>
                  اذهب إلى{" "}
                  <a
                    href="https://app.supabase.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 font-bold underline inline-flex items-center gap-1"
                  >
                    Supabase Dashboard
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-black text-blue-600">2.</span>
                <span>اختر مشروعك → Authentication → Providers</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-black text-blue-600">3.</span>
                <span>فعّل Google وأدخل Client ID و Client Secret</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-black text-blue-600">4.</span>
                <span>
                  في Authentication → URL Configuration، أضف:
                  <code className="block mt-1 p-2 bg-blue-100 rounded text-xs font-mono">
                    http://localhost:3002/auth/callback
                  </code>
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-black text-blue-600">5.</span>
                <span>
                  إذا لم يكن لديك Google OAuth credentials، اذهب إلى{" "}
                  <a
                    href="https://console.cloud.google.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 font-bold underline inline-flex items-center gap-1"
                  >
                    Google Cloud Console
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </span>
              </li>
            </ol>
            <div className="mt-4 pt-4 border-t border-blue-200 flex items-center gap-4">
              <Link
                href="/auth/setup"
                className="text-xs text-blue-700 hover:text-blue-900 font-bold underline inline-flex items-center gap-1"
              >
                صفحة إعداد مفصلة
                <ExternalLink className="w-3 h-3" />
              </Link>
              <span className="text-blue-300">|</span>
              <a
                href="/FIX_GOOGLE_AUTH.md"
                target="_blank"
                className="text-xs text-blue-700 hover:text-blue-900 font-bold underline inline-flex items-center gap-1"
              >
                اقرأ الدليل الكامل
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            </CardContent>
          </Card>
        )}

        <Button
          onClick={handleGoogleSignIn}
          disabled={isSigningIn}
          variant="outline"
          size="xl"
          className="w-full border-2 rounded-2xl shadow-lg hover:shadow-xl"
        >
          {isSigningIn ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" />
              <span>جاري تسجيل الدخول...</span>
            </>
          ) : (
            <>
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span>تسجيل الدخول مع Google</span>
            </>
          )}
        </Button>

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            بالضغط على الزر، أنت توافق على{" "}
            <a href="/terms" className="text-foreground font-bold hover:underline">
              شروط الاستخدام
            </a>{" "}
            و{" "}
            <a href="/privacy" className="text-foreground font-bold hover:underline">
              سياسة الخصوصية
            </a>
          </p>
        </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-12 h-12 animate-spin text-muted-foreground" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
