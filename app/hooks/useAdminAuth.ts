"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function useAdminAuth() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // التحقق من وجود admin_token في cookies
    const checkAuth = async () => {
      try {
        const cookies = document.cookie.split(";");
        const adminToken = cookies.find((cookie) =>
          cookie.trim().startsWith("admin_token=")
        );

        if (!adminToken) {
          setIsAuthenticated(false);
          setLoading(false);
          router.push("/admin/login");
          return;
        }

        // التحقق من صحة الـ token عبر API
        const res = await fetch("/api/admin/auth", {
          method: "GET",
          credentials: "include",
        });

        if (res.ok) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          // حذف cookies غير صالحة
          document.cookie = "admin_token=; path=/; max-age=0";
          document.cookie = "admin_email=; path=/; max-age=0";
          router.push("/admin/login");
        }
      } catch (error) {
        console.error("Auth check error:", error);
        setIsAuthenticated(false);
        router.push("/admin/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  return { isAuthenticated, loading };
}
