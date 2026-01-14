"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import type { User, Session } from "@supabase/supabase-js";

type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      // Check if Supabase URL is configured
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
        throw new Error(
          "NEXT_PUBLIC_SUPABASE_URL غير موجود في متغيرات البيئة. يرجى إضافته إلى ملف .env.local"
        );
      }

      if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        throw new Error(
          "NEXT_PUBLIC_SUPABASE_ANON_KEY غير موجود في متغيرات البيئة. يرجى إضافته إلى ملف .env.local"
        );
      }

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });

      if (error) {
        console.error("Error signing in with Google:", error);
        
        // Extract error message from different possible formats
        const errorMsg = error.message || "";
        const errorCode = error.status?.toString() || "";
        
        // Check for provider not enabled error
        if (errorMsg.includes("provider is not enabled") || 
            errorMsg.includes("Unsupported provider") ||
            errorCode === "validation_failed" ||
            errorMsg.includes("validation_failed")) {
          throw new Error(
            "❌ Google provider غير مفعّل في Supabase Dashboard. يرجى تفعيله من: Authentication → Providers → Google"
          );
        }
        
        // Check for invalid redirect URL
        if (errorMsg.includes("Invalid redirect URL") || 
            errorMsg.includes("redirect_uri_mismatch")) {
          throw new Error(
            "❌ Redirect URL غير صحيح. يرجى إضافة http://localhost:3002/auth/callback في Supabase → Authentication → URL Configuration"
          );
        }
        
        // Generic error message
        throw new Error(errorMsg || "حدث خطأ أثناء تسجيل الدخول مع Google");
      }
    } catch (error: any) {
      console.error("Error signing in with Google:", error);
      throw error;
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signInWithGoogle,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
