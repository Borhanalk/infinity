import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const origin = requestUrl.origin;

  if (code) {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("Error exchanging code for session:", error);

      // اجمع كل الاحتمالات بدون كسر TypeScript
      const anyErr = error as unknown as {
        message?: string;
        error_description?: string;
        error?: string;
        code?: string;
        error_code?: string;
        status?: number;
      };

      const errorMsg =
        anyErr.message ||
        anyErr.error_description ||
        anyErr.error ||
        "Authentication failed";

      const errCode = anyErr.code || anyErr.error_code;

      // رسالة مفهومة للمستخدم
      let userFriendlyMsg = errorMsg;

      if (
        errorMsg.includes("provider is not enabled") ||
        errorMsg.includes("Unsupported provider") ||
        errCode === "validation_failed"
      ) {
        userFriendlyMsg =
          "❌ Google provider غير مفعّل في Supabase Dashboard. فعّله من: Authentication → Providers → Google";
      }

      return NextResponse.redirect(
        `${origin}/auth/login?error=${encodeURIComponent(userFriendlyMsg)}`
      );
    }
  }

  return NextResponse.redirect(new URL("/", origin));
}
