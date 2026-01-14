"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogoutPage() {
  const router = useRouter();

  useEffect(() => {
    // حذف cookies
    document.cookie = "admin_token=; path=/; max-age=0";
    document.cookie = "admin_email=; path=/; max-age=0";
    
    // إعادة التوجيه إلى صفحة تسجيل الدخول
    router.push("/admin/login");
  }, [router]);

  return null;
}
