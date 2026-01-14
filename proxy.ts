import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

// استخدام singleton pattern لتجنب إنشاء اتصالات متعددة
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

const ADMIN_PATHS = ["/admin", "/api/admin"];

function needsAuth(pathname: string) {
  return ADMIN_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

async function verifyAdmin(request: NextRequest) {
  try {
    // الحصول على Token من cookies
    const token = request.cookies.get("admin_token")?.value;

    if (!token) {
      return null;
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string };

    // التحقق من وجود المسؤول في قاعدة البيانات
    const admin = await prisma.admin.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true },
    });

    return admin;
  } catch (error) {
    return null;
  }
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // السماح بالوصول إلى صفحة تسجيل الدخول و logout و API تسجيل الدخول
  if (
    pathname === "/admin/login" || 
    pathname === "/admin/logout" ||
    pathname === "/api/admin/auth"
  ) {
    return NextResponse.next();
  }

  // التحقق من الحاجة للمصادقة
  if (!needsAuth(pathname)) {
    return NextResponse.next();
  }

  // التحقق من المسؤول
  const admin = await verifyAdmin(req);

  if (!admin) {
    // للصفحات، إعادة التوجيه إلى صفحة تسجيل الدخول
    if (pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
    // للـ API routes، إرجاع خطأ JSON
    return NextResponse.json(
      { error: "غير مصرح. يرجى تسجيل الدخول" },
      { status: 401 }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
