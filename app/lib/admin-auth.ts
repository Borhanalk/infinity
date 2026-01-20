import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/app/lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

export interface AdminUser {
  id: string;
  email: string;
}

export async function verifyAdminToken(request: NextRequest): Promise<AdminUser | null> {
  try {
    // محاولة الحصول على Token من Authorization header أولاً
    let token: string | null = null;
    const authHeader = request.headers.get("authorization");
    
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7);
    } else {
      // محاولة الحصول على Token من cookies
      const cookies = request.cookies.get("admin_token");
      token = cookies?.value || null;
    }

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
