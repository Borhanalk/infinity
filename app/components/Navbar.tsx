"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import { Search, Heart, ShoppingBag, User, Menu, X, LogOut } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { count } = useCart();
  const { user, signOut, loading: authLoading } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // إخفاء Navbar في صفحات الإدارة
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const links = [
    { href: "/", label: "בית" },
    { href: "/collections/new", label: "חדש" },
    { href: "/sale", label: "מבצעים" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-xl border-b border-border shadow-sm">
      <nav className="container mx-auto px-4 sm:px-6 h-20 sm:h-24 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-2xl sm:text-3xl font-black tracking-tight flex items-center gap-2 group">
          <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-gradient-to-br from-[#D4AF37] to-[#C9A961] rounded-full shadow-lg group-hover:scale-110 transition-transform"></span>
          <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">הגבר האלגנטי</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-6 xl:gap-8 text-sm xl:text-base font-semibold">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "relative py-2 px-1 transition-colors",
                pathname === link.href
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground",
                link.href === "/sale" && "text-destructive hover:text-destructive/90"
              )}
            >
              {link.label}
              {pathname === link.href && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#D4AF37] to-[#C9A961] rounded-full"></span>
              )}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Button variant="ghost" size="icon" className="rounded-full">
            <Search size={20} />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full relative" asChild>
            <Link href="/cart">
              <ShoppingBag size={20} />
              {count > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-[10px]">
                  {count}
                </Badge>
              )}
            </Link>
          </Button>
          
          {/* User Menu */}
          {!authLoading && (
            <>
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full relative">
                      <User size={20} />
                      {user.email && (
                        <span className="absolute -bottom-1 -right-1 w-2 h-2 bg-green-500 rounded-full border-2 border-background"></span>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col">
                        <span className="font-black text-base">
                          {user.user_metadata?.full_name || 
                           user.user_metadata?.name || 
                           user.email?.split("@")[0] || 
                           "مستخدم"}
                        </span>
                        {user.email && (
                          <span className="text-xs text-muted-foreground truncate mt-1">
                            {user.email}
                          </span>
                        )}
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={async () => {
                        await signOut();
                        router.push("/");
                      }}
                      className="cursor-pointer"
                    >
                      <LogOut size={16} className="ml-2" />
                      <span>تسجيل الخروج</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button variant="ghost" size="icon" className="rounded-full" asChild>
                  <Link href="/auth/login">
                    <User size={20} />
                  </Link>
                </Button>
              )}
            </>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu size={20} />
          </Button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-card border-b shadow-lg p-6 space-y-3 animate-fade-in">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMenuOpen(false)}
              className={cn(
                "block w-full text-right py-3 px-4 rounded-lg font-semibold transition-colors",
                pathname === link.href
                  ? "bg-accent text-accent-foreground"
                  : "hover:bg-accent/50"
              )}
            >
              {link.label}
            </Link>
          ))}
          {!authLoading && (
            <div className="border-t border-gray-200 pt-4 mt-4">
              {user ? (
                <div className="space-y-2">
                  <div className="mb-2">
                    <p className="text-base font-black text-gray-900">
                      {user.user_metadata?.full_name || 
                       user.user_metadata?.name || 
                       user.email?.split("@")[0] || 
                       "مستخدم"}
                    </p>
                    {user.email && (
                      <p className="text-xs text-gray-500 mt-1">{user.email}</p>
                    )}
                  </div>
                  <button
                    onClick={async () => {
                      await signOut();
                      setIsMenuOpen(false);
                      router.push("/");
                    }}
                    className="w-full text-right py-2 font-bold text-gray-800 flex items-center gap-2"
                  >
                    <LogOut size={16} />
                    <span>تسجيل الخروج</span>
                  </button>
                </div>
              ) : (
                <Link
                  href="/auth/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="block w-full text-right py-2 font-bold text-gray-800"
                >
                  تسجيل الدخول
                </Link>
              )}
            </div>
          )}
        </div>
      )}
    </header>
  );
}
