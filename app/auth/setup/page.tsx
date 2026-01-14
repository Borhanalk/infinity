"use client";

import { ExternalLink, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function AuthSetupPage() {
  const steps = [
    {
      title: "تفعيل Google Provider في Supabase",
      items: [
        "اذهب إلى Supabase Dashboard",
        "اختر مشروعك",
        "Authentication → Providers",
        "فعّل Google",
        "أدخل Client ID و Client Secret",
      ],
      link: "https://app.supabase.com/",
      linkText: "افتح Supabase Dashboard",
    },
    {
      title: "الحصول على Google OAuth Credentials",
      items: [
        "اذهب إلى Google Cloud Console",
        "أنشئ مشروع جديد أو اختر موجود",
        "APIs & Services → Credentials",
        "Create Credentials → OAuth client ID",
        "اختر Web application",
        "أضف Authorized redirect URI: https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback",
        "انسخ Client ID و Client Secret",
      ],
      link: "https://console.cloud.google.com/",
      linkText: "افتح Google Cloud Console",
    },
    {
      title: "إضافة Redirect URLs في Supabase",
      items: [
        "في Supabase Dashboard → Authentication → URL Configuration",
        "أضف Redirect URLs:",
        "http://localhost:3002/auth/callback (للتطوير)",
        "https://yourdomain.com/auth/callback (للإنتاج)",
      ],
    },
    {
      title: "التحقق من متغيرات البيئة",
      items: [
        "تأكد من وجود ملف .env.local في جذر المشروع",
        "أضف المتغيرات التالية:",
        "NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co",
        "NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here",
        "أعد تشغيل السيرفر بعد التعديل",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background py-12 px-4" dir="rtl">
      <div className="max-w-4xl mx-auto">
        <Card className="border-border shadow-2xl mb-8">
          <CardContent className="p-10">
            <div className="text-center mb-10">
              <h1 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                إعداد تسجيل الدخول مع Google
              </h1>
              <p className="text-muted-foreground text-lg">
                اتبع الخطوات التالية لإعداد Google Authentication في Supabase
              </p>
            </div>

          <div className="space-y-6">
            {steps.map((step, index) => (
              <Card key={index} className="border-blue-200 bg-blue-50/50">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-black text-base">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h2 className="text-xl font-black text-blue-900 mb-4">
                        {step.title}
                      </h2>
                      <ul className="space-y-3 mb-6">
                        {step.items.map((item, itemIndex) => (
                          <li
                            key={itemIndex}
                            className="flex items-start gap-3 text-sm text-blue-800"
                          >
                            <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                      {step.link && (
                        <Button
                          asChild
                          variant="default"
                          size="lg"
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <a
                            href={step.link}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {step.linkText}
                            <ExternalLink className="w-4 h-4 mr-2" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="mt-8 border-yellow-200 bg-yellow-50/50">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-black text-yellow-900 mb-4 text-lg">ملاحظات مهمة:</h3>
                  <ul className="space-y-3 text-sm text-yellow-800">
                    <li>
                      • Authorized redirect URI في Google Cloud Console يجب أن يكون:
                      <code className="block mt-2 p-3 bg-yellow-100 rounded-lg text-xs font-mono">
                        https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback
                      </code>
                    </li>
                    <li>
                      • Redirect URLs في Supabase يجب أن تكون:
                      <code className="block mt-2 p-3 bg-yellow-100 rounded-lg text-xs font-mono">
                        http://localhost:3002/auth/callback
                      </code>
                    </li>
                    <li>• استبدل YOUR_PROJECT_REF بمعرف مشروع Supabase الخاص بك</li>
                    <li>• بعد إجراء أي تغييرات، أعد تشغيل السيرفر</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Button
              variant="default"
              size="xl"
              asChild
              className="uppercase tracking-wide"
            >
              <Link href="/auth/login">
                <ArrowRight className="w-5 h-5 rotate-180 mr-2" />
                العودة إلى صفحة تسجيل الدخول
              </Link>
            </Button>
            <Button
              variant="outline"
              size="xl"
              asChild
              className="uppercase tracking-wide"
            >
              <a
                href="/FIX_GOOGLE_AUTH.md"
                target="_blank"
              >
                اقرأ الدليل الكامل
                <ExternalLink className="w-5 h-5 mr-2" />
              </a>
            </Button>
          </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
