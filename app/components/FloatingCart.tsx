"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "../contexts/CartContext";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function FloatingCart() {
  const pathname = usePathname();
  const { count } = useCart();

  // إخفاء FloatingCart في صفحات الإدارة
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <Button
      asChild
      size="icon"
      variant="default"
      className="fixed bottom-4 left-4 sm:bottom-8 sm:left-8 z-50 rounded-full w-16 h-16 sm:w-20 sm:h-20 shadow-2xl hover:shadow-3xl hover:scale-110 transition-all duration-300 bg-gradient-to-br from-primary to-primary/90"
    >
      <Link href="/cart" className="relative">
        <ShoppingBag size={24} className="sm:w-7 sm:h-7" />
        {count > 0 && (
          <Badge className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs sm:text-sm rounded-full w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center font-black p-0 shadow-lg">
            {count}
          </Badge>
        )}
      </Link>
    </Button>
  );
}
