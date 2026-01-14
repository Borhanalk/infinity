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
      
      // Extract error message from different possible formats
      const errorMsg = error.message || error.msg || error.error_description || "حدث خطأ أثناء تسجيل الدخول";
      
      // Provide user-friendly error messages
      let userFriendlyMsg = errorMsg;
      if (errorMsg.includes("provider is not enabled") || 
          errorMsg.includes("Unsupported provider") ||
          error.code === "validation_failed" ||
          error.error_code === "validation_failed") {
        userFriendlyMsg = "❌ Google provider غير مفعّل في Supabase Dashboard. يرجى تفعيله من: Authentication → Providers → Google";
      }
      
      return NextResponse.redirect(`${origin}/auth/login?error=${encodeURIComponent(userFriendlyMsg)}`);
    }
  }

  // Redirect to home page
  return NextResponse.redirect(new URL("/", origin));
}
