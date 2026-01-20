"use client";

import { useEffect, useMemo, useState } from "react";
import { useCart } from "../../contexts/CartContext";
import { useAuth } from "../../contexts/AuthContext";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, Loader2, AlertCircle, CheckCircle2, ArrowRight, Package, Truck, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

type Product = {
  id: string;
  name: string;
  price: number;
  description: string;
  isNew?: boolean;
  isOnSale?: boolean;
  discountPercent?: number | null;
  originalPrice?: number | null;
  categoryId: number;
  category?: {
    id: number;
    name: string;
  } | null;
  company?: {
    id: number;
    name: string;
    logoUrl?: string | null;
  } | null;
  images: Array<{ id?: string; url: string }>;
  colors: Array<{ id: string; name: string; hex: string }>;
  sizes: Array<{ id: string; size: string; quantity: number }>;
};

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const { addItem } = useCart();
  const { user, loading: authLoading } = useAuth();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [addedToCart, setAddedToCart] = useState(false);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!id) {
      setError("معرف المنتج مفقود");
      setLoading(false);
      return;
    }

    fetch(`/api/products/${id}`)
      .then(async (res) => {
        const data = await res.json();

        if (!res.ok) {
          const errorMsg = data.details || data.error || `فشل تحميل المنتج (${res.status})`;
          // إذا كان الخطأ متعلق بقاعدة البيانات، لا نرمي خطأ بل نعرض رسالة واضحة
          if (errorMsg.includes("Database connection")) {
            throw new Error("لا يمكن الاتصال بقاعدة البيانات. يرجى المحاولة لاحقاً.");
          }
          throw new Error(errorMsg);
        }

        if (data.error) {
          throw new Error(data.error);
        }

        return data;
      })
      .then((data) => {
        setProduct(data);
        if (data.colors?.length) setSelectedColor(data.colors[0].name);
        if (data.sizes?.length) setSelectedSize(data.sizes[0].size);
        if (data.images?.[0]?.url) setSelectedImage(data.images[0].url);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "فشل تحميل المنتج");
        setLoading(false);
      });
  }, [id]);

  const mainImage = useMemo(() => product?.images?.[0]?.url, [product]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground pt-24 flex items-center justify-center">
        <Card className="p-12 text-center">
          <CardContent>
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-muted-foreground" />
            <div className="text-muted-foreground text-lg">جاري التحميل...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background text-foreground pt-24">
        <div className="max-w-2xl mx-auto px-6 py-20">
          <Card className="border-destructive/50 bg-destructive/10">
            <CardContent className="p-8">
              <AlertCircle className="w-12 h-12 text-destructive mb-4" />
              <h2 className="text-2xl font-black mb-2 text-destructive">فشل تحميل المنتج</h2>
              <p className="text-muted-foreground mb-4">{error}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const displayImage = selectedImage || mainImage;
  const displayPrice = product.originalPrice && product.originalPrice > product.price
    ? product.originalPrice
    : null;

  const discountPercent = displayPrice && displayPrice > product.price
    ? Math.round(((displayPrice - product.price) / displayPrice) * 100)
    : product.discountPercent || 0;

  const selectedSizeData = product.sizes?.find(s => s.size === selectedSize);
  const isOutOfStock = selectedSizeData ? selectedSizeData.quantity === 0 : false;

  const handleAddToCart = () => {
    if (isOutOfStock) return;

    // التحقق من تسجيل الدخول
    if (!user && !authLoading) {
      // إعادة التوجيه إلى صفحة تسجيل الدخول مع returnTo
      const currentUrl = `/products/${id}`;
      router.push(`/auth/login?returnTo=${encodeURIComponent(currentUrl)}`);
      return;
    }

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: displayImage,
      color: selectedColor || undefined,
      size: selectedSize || undefined,
      quantity: quantity,
    });

    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-secondary/20 text-foreground pt-24" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
        {/* Breadcrumb */}
        <div className="mb-8 flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">الرئيسية</Link>
          <ArrowRight size={16} className="rotate-180" />
          <Link href="/products" className="hover:text-foreground transition-colors">المنتجات</Link>
          {product.category && (
            <>
              <ArrowRight size={16} className="rotate-180" />
              <Link href={`/categories/${product.category.id}`} className="hover:text-foreground transition-colors">
                {product.category.name}
              </Link>
            </>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 mb-16">
          {/* IMAGES SECTION */}
          <div className="sticky top-24">
            {/* Main Image: أصغر على الديسكتوب، واضحة على الجوال بدون أن تكون ضخمة */}
            {displayImage ? (
              <Card className="mb-6 overflow-hidden border-2 border-border/50 shadow-2xl rounded-3xl group">
                <div className="relative w-full aspect-[3/4] sm:aspect-[4/5] lg:aspect-[3/4] bg-gradient-to-br from-muted/50 to-muted overflow-hidden">
                  <img
                    src={displayImage}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/placeholder-image.jpg";
                    }}
                  />
                  <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
                    {product.isNew && (
                      <Badge variant="new" className="text-xs px-4 py-2 uppercase tracking-wider font-black shadow-lg animate-pulse">
                        جديد
                      </Badge>
                    )}
                    {product.isOnSale && discountPercent > 0 && (
                      <Badge variant="sale" className="text-xs px-4 py-2 uppercase tracking-wider font-black shadow-lg">
                        خصم {discountPercent}%
                      </Badge>
                    )}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              </Card>
            ) : (
              <Card className="mb-6 border-2 border-border/50 rounded-3xl">
                <div className="aspect-square bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center rounded-3xl">
                  <Package className="w-24 h-24 text-muted-foreground/30" />
                </div>
              </Card>
            )}

            {/* Thumbnail Images */}
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 md:grid-cols-5 gap-3">
                {product.images.map((img, index) => (
                  <button
                    key={img.url}
                    onClick={() => setSelectedImage(img.url)}
                    className={cn(
                      "h-20 md:h-24 w-full rounded-xl overflow-hidden border-2 transition-all duration-300 relative group",
                      selectedImage === img.url || (!selectedImage && index === 0)
                        ? "border-[#D4AF37] scale-105 shadow-lg ring-2 ring-[#D4AF37]/50"
                        : "border-border hover:border-[#D4AF37]/50 hover:scale-105"
                    )}
                  >
                    <img
                      src={img.url}
                      alt={`${product.name} - Image ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                    {selectedImage === img.url || (!selectedImage && index === 0) && (
                      <div className="absolute inset-0 bg-[#D4AF37]/20" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* PRODUCT INFO */}
          <div className="space-y-8">
            {/* Company & Title */}
            <div>
              {product.company && (
                <div className="flex items-center gap-3 mb-6 p-4 bg-secondary/30 rounded-2xl border border-border/50">
                  {product.company.logoUrl ? (
                    <img
                      src={product.company.logoUrl}
                      alt={product.company.name}
                      className="w-12 h-12 object-contain rounded-lg bg-background p-2"
                    />
                  ) : null}
                  <div>
                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-1">العلامة التجارية</p>
                    <p className="text-lg font-black text-foreground">{product.company.name}</p>
                  </div>
                </div>
              )}

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                {product.name}
              </h1>

              {/* Price Section */}
              <div className="flex items-center gap-4 mb-8 p-6 bg-gradient-to-br from-secondary/20 to-secondary/10 rounded-2xl border border-border/50">
                {displayPrice && displayPrice > product.price && (
                  <div className="flex flex-col">
                    <span className="text-xl text-muted-foreground line-through font-medium">{displayPrice} ₪</span>
                    <span className="text-sm text-destructive font-black">وفر {Math.round(displayPrice - product.price)} ₪</span>
                  </div>
                )}
                <div className="flex items-baseline gap-2">
                  <span className={cn(
                    "text-4xl md:text-5xl font-black",
                    product.isOnSale ? "text-destructive" : "text-foreground"
                  )}>
                    {product.price}
                  </span>
                  <span className="text-xl text-muted-foreground font-bold">₪</span>
                </div>
              </div>
            </div>

            <Separator className="bg-border/50" />

            {/* Description */}
            <div className="p-6 bg-secondary/10 rounded-2xl border border-border/30">
              <h2 className="text-2xl font-black mb-4 text-foreground flex items-center gap-2">
                <Package className="w-6 h-6 text-[#D4AF37]" />
                الوصف
              </h2>
              <p className="text-muted-foreground leading-relaxed text-lg whitespace-pre-line">{product.description}</p>
            </div>

            {/* Colors */}
            {product.colors && product.colors.length > 0 && (
              <div className="p-6 bg-secondary/10 rounded-2xl border border-border/30">
                <div className="text-sm text-muted-foreground mb-4 uppercase tracking-wider font-bold flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#D4AF37]" />
                  اختر اللون
                </div>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedColor(c.name)}
                      className={cn(
                        "relative w-16 h-16 rounded-full border-2 transition-all duration-300 transform hover:scale-110",
                        selectedColor === c.name
                          ? "border-[#D4AF37] scale-110 shadow-lg ring-4 ring-[#D4AF37]/30"
                          : "border-border hover:border-[#D4AF37]/50"
                      )}
                      style={{ backgroundColor: c.hex }}
                      aria-label={c.name}
                      title={c.name}
                    >
                      {selectedColor === c.name && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <CheckCircle2 className="w-6 h-6 text-white drop-shadow-lg" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
                {selectedColor && (
                  <p className="mt-3 text-sm text-muted-foreground">اللون المختار: <span className="font-black text-foreground">{selectedColor}</span></p>
                )}
              </div>
            )}

            {/* Sizes */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="p-6 bg-secondary/10 rounded-2xl border border-border/30">
                <div className="text-sm text-muted-foreground mb-4 uppercase tracking-wider font-bold flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  اختر المقاس
                </div>
                <div className="flex flex-wrap gap-3">
                  {product.sizes.map((s) => (
                    <Button
                      key={s.id}
                      variant={selectedSize === s.size ? "default" : "outline"}
                      size="lg"
                      onClick={() => s.quantity > 0 && setSelectedSize(s.size)}
                      disabled={s.quantity === 0}
                      className={cn(
                        "min-w-[90px] h-14 text-base font-black transition-all duration-300",
                        selectedSize === s.size
                          ? "bg-[#D4AF37] hover:bg-[#C9A961] text-black border-2 border-[#D4AF37] shadow-lg scale-105"
                          : "hover:border-[#D4AF37]/50",
                        s.quantity === 0 && "opacity-40 cursor-not-allowed line-through"
                      )}
                    >
                      {s.size}
                      {s.quantity > 0 && s.quantity < 5 && (
                        <span className="text-xs text-destructive mr-1">({s.quantity} متبقي)</span>
                      )}
                    </Button>
                  ))}
                </div>
                {selectedSizeData && (
                  <p className={cn(
                    "mt-3 text-sm font-bold",
                    selectedSizeData.quantity > 0 ? "text-green-600" : "text-destructive"
                  )}>
                    {selectedSizeData.quantity > 0
                      ? `✓ متوفر (${selectedSizeData.quantity} قطعة)`
                      : "✗ غير متوفر"}
                  </p>
                )}
              </div>
            )}

            {/* Quantity Selector */}
            <div className="p-6 bg-secondary/10 rounded-2xl border border-border/30">
              <div className="text-sm text-muted-foreground mb-4 uppercase tracking-wider font-bold">الكمية</div>
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  className="w-12 h-12 text-xl font-black"
                >
                  −
                </Button>
                <span className="text-2xl font-black min-w-[60px] text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setQuantity(quantity + 1)}
                  disabled={isOutOfStock || (selectedSizeData && quantity >= selectedSizeData.quantity)}
                  className="w-12 h-12 text-xl font-black"
                >
                  +
                </Button>
              </div>
            </div>

            <Separator className="bg-border/50" />

            {/* Add to Cart Button */}
            <div className="space-y-4">
              <Button
                variant="gold"
                size="xl"
                disabled={isOutOfStock}
                className={cn(
                  "w-full h-16 text-lg uppercase tracking-wide shadow-2xl hover:shadow-3xl transition-all duration-300",
                  addedToCart && "bg-green-600 hover:bg-green-700",
                  isOutOfStock && "opacity-50 cursor-not-allowed"
                )}
                onClick={handleAddToCart}
              >
                {addedToCart ? (
                  <>
                    <CheckCircle2 size={24} className="ml-2" />
                    تمت الإضافة إلى السلة!
                  </>
                ) : isOutOfStock ? (
                  <>
                    <AlertCircle size={24} className="ml-2" />
                    غير متوفر
                  </>
                ) : (
                  <>
                    <ShoppingBag size={24} className="ml-2" />
                    أضف إلى السلة
                  </>
                )}
              </Button>

              {addedToCart && (
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full"
                  onClick={() => router.push("/cart")}
                >
                  <ShoppingBag size={20} className="ml-2" />
                  عرض السلة
                </Button>
              )}
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8">
              <div className="flex items-center gap-3 p-4 bg-secondary/10 rounded-xl border border-border/30">
                <Truck className="w-6 h-6 text-[#D4AF37]" />
                <div>
                  <p className="text-xs text-muted-foreground font-bold">شحن مجاني</p>
                  <p className="text-sm font-black">لجميع الطلبات</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-secondary/10 rounded-xl border border-border/30">
                <Shield className="w-6 h-6 text-[#D4AF37]" />
                <div>
                  <p className="text-xs text-muted-foreground font-bold">ضمان الجودة</p>
                  <p className="text-sm font-black">ضمان 30 يوم</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-secondary/10 rounded-xl border border-border/30">
                <Package className="w-6 h-6 text-[#D4AF37]" />
                <div>
                  <p className="text-xs text-muted-foreground font-bold">إرجاع سهل</p>
                  <p className="text-sm font-black">خلال 14 يوم</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
