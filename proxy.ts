import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

// ✅ Singleton Prisma لتجنب اتصالات كثيرة
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

// ✅ لازم تضيف JWT_SECRET في Vercel Environment Variables
const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";

const ADMIN_PATHS = ["/admin", "/api/admin"];

function needsAuth(pathname: string) {
  return ADMIN_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

async function verifyAdmin(request: NextRequest) {
  try {
    // ✅ Token من cookies
    const token = request.cookies.get("admin_token")?.value;

    if (!token) {
      return null;
    }

    // التحقق من صحة Token
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string };

    if (!decoded || !decoded.id) {
      return null;
    }

    // ✅ تحقق من وجود الأدمن في DB
    const admin = await prisma.admin.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true },
    });

    return admin;
  } catch (error) {
    // في حالة خطأ في JWT أو قاعدة البيانات، نعيد null
    console.error("Error verifying admin:", error);
    return null;
  }
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ✅ السماح لصفحات الدخول والخروج و API تسجيل الدخول
  if (
    pathname === "/admin/login" ||
    pathname === "/admin/logout" ||
    pathname === "/api/admin/auth"
  ) {
    return NextResponse.next();
  }

  // ✅ لو مش مسار admin لا نعمل شيء
  if (!needsAuth(pathname)) {
    return NextResponse.next();
  }

  // ✅ تحقق من الأدمن
  const admin = await verifyAdmin(req);

  // ❌ غير مسجل دخول
  if (!admin) {
    // صفحات admin: Redirect للـ login
    if (pathname.startsWith("/admin")) {
      const loginUrl = new URL("/admin/login", req.url);
      loginUrl.searchParams.set("returnTo", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // API admin: JSON 401
    return NextResponse.json(
      { error: "غير مصرح. يرجى تسجيل الدخول" },
      { status: 401 }
    );
  }

  return NextResponse.next();
}

// تصدير middleware لـ Next.js (proxy.ts يعمل كـ middleware)
export async function middleware(req: NextRequest) {
  return proxy(req);
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
