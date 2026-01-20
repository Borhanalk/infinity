"use client";

import { useCart } from "../contexts/CartContext";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";

export default function CartPage() {
  const { items, total, count, updateQty, removeItem, clear } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background text-foreground pt-32 flex items-center justify-center px-4">
        <Card className="w-full max-w-md text-center p-12">
          <div className="text-6xl mb-6 opacity-30">🛒</div>
          <h2 className="text-3xl font-black mb-4">السلة فارغة</h2>
          <p className="text-muted-foreground mb-8 text-lg">ابدأ بإضافة منتجات إلى سلتك</p>
          <Button
            variant="gold"
            size="xl"
            asChild
            className="uppercase tracking-wide"
          >
            <Link href="/products">
              تصفح المنتجات
            </Link>
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground pt-20 sm:pt-24">
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 lg:py-16">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 sm:mb-12 border-b border-border pb-4 sm:pb-6 gap-4">
          <div>
            <span className="text-muted-foreground text-xs sm:text-sm tracking-wider uppercase block mb-2 sm:mb-3 font-bold">السلة</span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black">سلة التسوق ({count})</h1>
          </div>
          <Button
            variant="ghost"
            size="lg"
            onClick={clear}
            className="text-destructive hover:text-destructive/90 hover:bg-destructive/10 w-full sm:w-auto"
          >
            <Trash2 size={18} className="ml-2" />
            مسح الكل
          </Button>
        </div>

        <div className="space-y-4 sm:space-y-6 mb-8 sm:mb-12">
          {items.map((item) => {
            const key = `${item.id}:${item.color ?? ""}:${item.size ?? ""}`;
            return (
              <Card key={key} className="group border-border hover:shadow-lg transition-all duration-300">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 sm:gap-6">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full sm:w-32 sm:h-32 lg:w-40 lg:h-40 object-cover rounded-xl border border-border"
                      />
                    )}
                    <div className="flex-1 w-full">
                      <h3 className="text-xl sm:text-2xl font-black mb-2 sm:mb-3">{item.name}</h3>
                      <div className="text-muted-foreground mb-3 sm:mb-4 text-sm sm:text-base">
                        {item.price} ₪
                        {item.color && ` • ${item.color}`}
                        {item.size && ` • ${item.size}`}
                      </div>
                      <div className="flex items-center gap-3 sm:gap-4 mb-4 lg:mb-0">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQty(item.id, item.quantity - 1, key)}
                          disabled={item.quantity <= 1}
                          className="rounded-xl h-9 w-9"
                        >
                          <Minus size={16} />
                        </Button>
                        <span className="w-12 sm:w-16 text-center text-base sm:text-lg font-bold">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQty(item.id, item.quantity + 1, key)}
                          className="rounded-xl h-9 w-9"
                        >
                          <Plus size={16} />
                        </Button>
                      </div>
                    </div>
                    <div className="flex flex-row lg:flex-col justify-between lg:justify-start items-center lg:items-end w-full lg:w-auto gap-4">
                      <div className="text-2xl sm:text-3xl font-black text-foreground">
                        {(item.price * item.quantity).toFixed(2)} ₪
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.id, key)}
                        className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                      >
                        <Trash2 size={16} className="ml-2" />
                        <span className="hidden sm:inline">حذف</span>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="border-border">
          <CardContent className="p-6 sm:p-8">
            <Separator className="mb-6 sm:mb-8" />
            <div className="flex justify-between items-center mb-6 sm:mb-8">
              <span className="text-lg sm:text-xl uppercase tracking-wider text-muted-foreground font-bold">المجموع</span>
              <span className="text-3xl sm:text-4xl font-black text-foreground">{total.toFixed(2)} ₪</span>
            </div>
            <Button
              variant="gold"
              size="lg"
              className="w-full uppercase tracking-wide shadow-xl hover:shadow-2xl text-sm sm:text-base"
            >
              <ShoppingBag size={18} className="ml-2" />
              إتمام الطلب
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
