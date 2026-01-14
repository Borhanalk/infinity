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
    <div className="min-h-screen bg-background text-foreground pt-24">
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="flex justify-between items-end mb-12 border-b border-border pb-6">
          <div>
            <span className="text-muted-foreground text-sm tracking-wider uppercase block mb-3 font-bold">السلة</span>
            <h1 className="text-5xl md:text-6xl font-black">سلة التسوق ({count})</h1>
          </div>
          <Button
            variant="ghost"
            size="lg"
            onClick={clear}
            className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
          >
            <Trash2 size={20} className="ml-2" />
            مسح الكل
          </Button>
        </div>

        <div className="space-y-6 mb-12">
          {items.map((item) => {
            const key = `${item.id}:${item.color ?? ""}:${item.size ?? ""}`;
            return (
              <Card key={key} className="group border-border hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-32 h-32 md:w-40 md:h-40 object-cover rounded-xl border border-border"
                      />
                    )}
                    <div className="flex-1 w-full">
                      <h3 className="text-2xl font-black mb-3">{item.name}</h3>
                      <div className="text-muted-foreground mb-4 text-base">
                        {item.price} ₪
                        {item.color && ` • ${item.color}`}
                        {item.size && ` • ${item.size}`}
                      </div>
                      <div className="flex items-center gap-4">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQty(item.id, item.quantity - 1, key)}
                          disabled={item.quantity <= 1}
                          className="rounded-xl"
                        >
                          <Minus size={18} />
                        </Button>
                        <span className="w-16 text-center text-lg font-bold">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQty(item.id, item.quantity + 1, key)}
                          className="rounded-xl"
                        >
                          <Plus size={18} />
                        </Button>
                      </div>
                    </div>
                    <div className="text-right md:text-left w-full md:w-auto">
                      <div className="text-3xl font-black text-foreground mb-4">
                        {(item.price * item.quantity).toFixed(2)} ₪
                      </div>
                      <Button
                        variant="ghost"
                        size="lg"
                        onClick={() => removeItem(item.id, key)}
                        className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                      >
                        <Trash2 size={18} className="ml-2" />
                        حذف
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="border-border">
          <CardContent className="p-8">
            <Separator className="mb-8" />
            <div className="flex justify-between items-center mb-8">
              <span className="text-xl uppercase tracking-wider text-muted-foreground font-bold">المجموع</span>
              <span className="text-4xl font-black text-foreground">{total.toFixed(2)} ₪</span>
            </div>
            <Button
              variant="gold"
              size="xl"
              className="w-full uppercase tracking-wide shadow-xl hover:shadow-2xl"
            >
              <ShoppingBag size={20} className="ml-2" />
              إتمام الطلب
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
