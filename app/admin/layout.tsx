"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-white text-gray-900" dir="rtl">
      
      {/* ================= MOBILE OVERLAY ================= */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* ================= SIDEBAR ================= */}
      <aside
        className={`
          fixed lg:static inset-y-0 right-0 z-50
          w-64 bg-white border-r border-gray-100 flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"}
        `}
      >
        <div className="p-4 lg:p-6 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-black rounded-full"></span>
            <span className="text-xl lg:text-2xl font-black tracking-tighter">
              الرجل الأنيق
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X size={20} />
          </Button>
        </div>
        <div className="text-xs text-gray-500 px-4 lg:px-6 pb-2 lg:pb-0">
          لوحة الإدارة
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <Link
            href="/admin"
            onClick={() => setIsSidebarOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition text-gray-600 font-bold text-sm"
          >
            <span>📊</span>
            <span>لوحة التحكم</span>
          </Link>

          <Link
            href="/admin/products"
            onClick={() => setIsSidebarOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition text-gray-600 font-bold text-sm"
          >
            <span>📦</span>
            <span>المنتجات</span>
          </Link>

          <Link
            href="/admin/categories"
            onClick={() => setIsSidebarOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition text-gray-600 font-bold text-sm"
          >
            <span>📁</span>
            <span>الكاتيجوري</span>
          </Link>

          <Link
            href="/admin/products/add"
            onClick={() => setIsSidebarOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition text-gray-600 font-bold text-sm"
          >
            <span>➕</span>
            <span>إضافة منتج</span>
          </Link>

          <Link
            href="/admin/categories/add"
            onClick={() => setIsSidebarOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition text-gray-600 font-bold text-sm"
          >
            <span>📁</span>
            <span>إضافة كاتيجوري</span>
          </Link>

          <Link
            href="/admin/campaigns"
            onClick={() => setIsSidebarOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition text-gray-600 font-bold text-sm"
          >
            <span>🎯</span>
            <span>الخصومات</span>
          </Link>

          <Link
            href="/admin/companies"
            onClick={() => setIsSidebarOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition text-gray-600 font-bold text-sm"
          >
            <span>🏢</span>
            <span>الشركات</span>
          </Link>

          <Link
            href="/admin/new-arrivals"
            onClick={() => setIsSidebarOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition text-gray-600 font-bold text-sm"
          >
            <span>✨</span>
            <span>البضاعة الجديدة</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-100">
          <Link
            href="/"
            onClick={() => setIsSidebarOpen(false)}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-black transition font-bold"
          >
            <span>🏠</span>
            <span>عرض الموقع</span>
          </Link>
          <div className="text-xs text-gray-400 mt-2">
            © {new Date().getFullYear()} الرجل الأنيق
          </div>
        </div>
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-1 flex flex-col w-full lg:w-auto">
        
        {/* HEADER */}
        <header className="h-16 lg:h-20 border-b border-gray-100 flex items-center justify-between px-4 lg:px-6 bg-white/80 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={20} />
            </Button>
            <div className="font-black text-gray-900 text-base lg:text-lg">
              لوحة إدارة المتجر
            </div>
          </div>

          <div className="flex items-center gap-2 lg:gap-4">
            <Link
              href="/admin/logout"
              className="text-xs lg:text-sm text-gray-600 hover:text-destructive transition-colors font-bold"
            >
              <span className="hidden sm:inline">تسجيل الخروج</span>
              <span className="sm:hidden">خروج</span>
            </Link>
            <div className="text-xs lg:text-sm text-gray-600 font-bold hidden sm:block">
              مسؤول النظام
            </div>
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-800 font-bold">
              👤
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <section className="flex-1 p-4 lg:p-8 bg-white overflow-x-auto">
          {children}
        </section>
      </main>
    </div>
  );
}
