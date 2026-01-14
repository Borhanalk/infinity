import Link from "next/link";
import type { ReactNode } from "react";

export default function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-white text-gray-900" dir="rtl">
      
      {/* ================= SIDEBAR ================= */}
      <aside className="w-64 bg-white border-r border-gray-100 flex flex-col">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-black rounded-full"></span>
            <span className="text-2xl font-black tracking-tighter">
              الرجل الأنيق
            </span>
          </div>
          <div className="text-xs text-gray-500 mt-2">
            لوحة الإدارة
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <Link
            href="/admin"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition text-gray-600 font-bold text-sm"
          >
            <span>📊</span>
            <span>لوحة التحكم</span>
          </Link>

          <Link
            href="/admin/products"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition text-gray-600 font-bold text-sm"
          >
            <span>📦</span>
            <span>المنتجات</span>
          </Link>

          <Link
            href="/admin/categories"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition text-gray-600 font-bold text-sm"
          >
            <span>📁</span>
            <span>الكاتيجوري</span>
          </Link>

          <Link
            href="/admin/products/add"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition text-gray-600 font-bold text-sm"
          >
            <span>➕</span>
            <span>إضافة منتج</span>
          </Link>

          <Link
            href="/admin/categories/add"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition text-gray-600 font-bold text-sm"
          >
            <span>📁</span>
            <span>إضافة كاتيجوري</span>
          </Link>

          <Link
            href="/admin/campaigns"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition text-gray-600 font-bold text-sm"
          >
            <span>🎯</span>
            <span>الخصومات</span>
          </Link>

          <Link
            href="/admin/companies"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition text-gray-600 font-bold text-sm"
          >
            <span>🏢</span>
            <span>الشركات</span>
          </Link>

          <Link
            href="/admin/new-arrivals"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition text-gray-600 font-bold text-sm"
          >
            <span>✨</span>
            <span>البضاعة الجديدة</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-100">
          <Link
            href="/"
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
      <main className="flex-1 flex flex-col">
        
        {/* HEADER */}
        <header className="h-20 border-b border-gray-100 flex items-center justify-between px-6 bg-white/80 backdrop-blur-md sticky top-0 z-40">
          <div className="font-black text-gray-900 text-lg">
            لوحة إدارة المتجر
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/admin/logout"
              className="text-sm text-gray-600 hover:text-destructive transition-colors font-bold"
            >
              تسجيل الخروج
            </Link>
            <div className="text-sm text-gray-600 font-bold">
              مسؤول النظام
            </div>
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-800 font-bold">
              👤
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <section className="flex-1 p-8 bg-white">
          {children}
        </section>
      </main>
    </div>
  );
}
