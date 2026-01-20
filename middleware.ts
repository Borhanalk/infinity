// هذا الملف يستدعي proxy من proxy.ts
// Next.js يتطلب middleware.ts بالاسم الصحيح
import { proxy } from "./proxy";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  return proxy(req);
}

// تصدير config من proxy.ts
export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
