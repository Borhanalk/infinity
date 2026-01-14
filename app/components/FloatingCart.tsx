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
      className="fixed bottom-8 left-8 z-50 rounded-full w-20 h-20 shadow-2xl hover:shadow-3xl hover:scale-110 transition-all duration-300 bg-gradient-to-br from-primary to-primary/90"
    >
      <Link href="/cart" className="relative">
        <ShoppingBag size={28} />
        {count > 0 && (
          <Badge className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-sm rounded-full w-7 h-7 flex items-center justify-center font-black p-0 shadow-lg">
            {count}
          </Badge>
        )}
      </Link>
    </Button>
  );
}
