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

    // إضافة timeout للطلب
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 ثانية

    fetch(`/api/products/${id}`, {
      signal: controller.signal,
      cache: "no-store",
    })
      .then(async (res) => {
        clearTimeout(timeoutId);
        const data = await res.json();

        if (!res.ok) {
          const errorMsg = data.details || data.message || data.error || `فشل تحميل المنتج (${res.status})`;
          // إذا كان الخطأ متعلق بقاعدة البيانات، لا نرمي خطأ بل نعرض رسالة واضحة
          if (errorMsg.includes("Database connection") || errorMsg.includes("قاعدة البيانات")) {
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
        clearTimeout(timeoutId);
        if (err.name === 'AbortError') {
          setError("انتهت مهلة الاتصال. يرجى المحاولة مرة أخرى.");
        } else {
          setError(err.message || "فشل تحميل المنتج");
        }
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
            <div className="text-muted-foreground text-lg">טוען...</div>
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
              <h2 className="text-2xl font-black mb-2 text-destructive">נכשל בטעינת המוצר</h2>
              <p className="text-muted-foreground mb-4">{error}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const displayImage = selectedImage || mainImage;
  const displayPrice = product.isOnSale && product.originalPrice && product.originalPrice > product.price
    ? product.originalPrice
    : null;

  const discountPercent = displayPrice && displayPrice > product.price
    ? Math.round(((displayPrice - product.price) / displayPrice) * 100)
    : (product.discountPercent || 0);

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
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-secondary/20 text-foreground pt-16 sm:pt-20 lg:pt-24 overflow-x-hidden" dir="rtl">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-6 lg:py-8 xl:py-16 overflow-hidden">
        {/* Breadcrumb */}
        <div className="mb-4 sm:mb-6 lg:mb-8 flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">בית</Link>
          <ArrowRight size={14} className="rotate-180 sm:w-4 sm:h-4" />
          <Link href="/products" className="hover:text-foreground transition-colors">מוצרים</Link>
          {product.category && (
            <>
              <ArrowRight size={14} className="rotate-180 sm:w-4 sm:h-4" />
              <Link href={`/categories/${product.category.id}`} className="hover:text-foreground transition-colors">
                {product.category.name}
              </Link>
            </>
          )}
        </div>

        {/* Mobile Layout: Horizontal (Image Right, Details Left) */}
        <div className="flex flex-row-reverse items-start gap-3 sm:gap-4 lg:hidden mb-6">
          {/* Small Image on Right */}
          {displayImage ? (
            <div className="flex-shrink-0">
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-xl overflow-hidden border-2 border-border/50 bg-gradient-to-br from-muted/50 to-muted">
                <img
                  src={displayImage}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/placeholder-image.jpg";
                  }}
                />
                <div className="absolute top-1 right-1 flex flex-col gap-1 z-10">
                  {product.isNew && (
                    <Badge variant="new" className="text-[10px] px-1.5 py-0.5 uppercase tracking-wider font-black shadow-lg">
                      חדש
                    </Badge>
                  )}
                  {product.isOnSale && discountPercent > 0 && (
                    <Badge variant="sale" className="text-[10px] px-1.5 py-0.5 uppercase tracking-wider font-black shadow-lg">
                      {discountPercent}%
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-shrink-0 w-28 h-28 sm:w-32 sm:h-32 rounded-xl bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center border-2 border-border/50">
              <Package className="w-8 h-8 text-muted-foreground/30" />
            </div>
          )}

          {/* Product Details on Left */}
          <div className="flex-1 min-w-0 space-y-3">
            {/* Company & Title */}
            {product.company && (
              <div className="flex items-center gap-2 p-2 bg-secondary/30 rounded-lg border border-border/50">
                {product.company.logoUrl && (
                  <img
                    src={product.company.logoUrl}
                    alt={product.company.name}
                    className="w-6 h-6 object-contain rounded bg-background p-1"
                  />
                )}
                <p className="text-xs font-black text-foreground line-clamp-1">{product.company.name}</p>
              </div>
            )}

            <h1 className="text-lg sm:text-xl font-black leading-tight line-clamp-2">
              {product.name || "منتج"}
            </h1>

            {/* Price Section */}
            <div className="flex items-center gap-2 p-3 bg-gradient-to-br from-secondary/20 to-secondary/10 rounded-lg border border-border/50">
              {product.isOnSale && product.originalPrice && product.originalPrice > product.price && (
                <span className="text-sm text-destructive line-through font-medium">{product.originalPrice.toFixed(2)} ₪</span>
              )}
              <span className={cn(
                "text-xl sm:text-2xl font-black",
                product.isOnSale ? "text-destructive" : "text-foreground"
              )}>
                {product.price.toFixed(2)} ₪
              </span>
            </div>
          </div>
        </div>

        {/* Desktop Layout: Grid */}
        <div className="hidden lg:grid lg:grid-cols-2 gap-8 xl:gap-16 mb-12 xl:mb-16">
          {/* IMAGES SECTION */}
          <div className="sticky top-24">
            {/* Main Image */}
            {displayImage ? (
              <Card className="mb-6 overflow-hidden border-2 border-border/50 shadow-2xl rounded-3xl group">
                <div className="relative w-full aspect-[3/4] bg-gradient-to-br from-muted/50 to-muted overflow-hidden">
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
              <div className="grid grid-cols-4 xl:grid-cols-5 gap-3">
                {product.images.map((img, index) => (
                  <button
                    key={img.url}
                    onClick={() => setSelectedImage(img.url)}
                    className={cn(
                      "h-20 xl:h-24 w-full rounded-xl overflow-hidden border-2 transition-all duration-300 relative group",
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
          <div className="space-y-6 xl:space-y-8">
            {/* Company & Title - Desktop Only */}
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
                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-1">מותג</p>
                    <p className="text-lg font-black text-foreground">{product.company.name}</p>
                  </div>
                </div>
              )}

              <h1 className="text-4xl xl:text-5xl 2xl:text-6xl font-black mb-6 leading-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                {product.name || "מוצר"}
              </h1>

              {/* Price Section */}
              <div className="flex items-center gap-4 mb-8 p-6 bg-gradient-to-br from-secondary/20 to-secondary/10 rounded-2xl border border-border/50">
                {product.isOnSale && product.originalPrice && product.originalPrice > product.price && (
                  <div className="flex flex-col">
                    <span className="text-xl text-destructive line-through font-medium">{product.originalPrice.toFixed(2)} ₪</span>
                    <span className="text-sm text-destructive font-black">חסכת {Math.round(product.originalPrice - product.price)} ₪</span>
                  </div>
                )}
                <div className="flex items-baseline gap-2">
                  <span className={cn(
                    "text-4xl xl:text-5xl font-black",
                    product.isOnSale ? "text-destructive" : "text-foreground"
                  )}>
                    {product.price.toFixed(2)}
                  </span>
                  <span className="text-xl text-muted-foreground font-bold">₪</span>
                </div>
              </div>
            </div>

            <Separator className="bg-border/50" />

            {/* Description */}
            <div className="p-4 sm:p-5 lg:p-6 bg-secondary/10 rounded-xl lg:rounded-2xl border border-border/30">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-black mb-3 sm:mb-4 text-foreground flex items-center gap-2">
                <Package className="w-5 h-5 sm:w-6 sm:h-6 text-[#D4AF37]" />
                תיאור
              </h2>
              <p className="text-muted-foreground leading-relaxed text-sm sm:text-base lg:text-lg whitespace-pre-line">{product.description}</p>
            </div>

            {/* Colors */}
            {product.colors && product.colors.length > 0 && (
              <div className="p-6 bg-secondary/10 rounded-2xl border border-border/30">
                <div className="text-sm text-muted-foreground mb-4 uppercase tracking-wider font-bold flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#D4AF37]" />
                  בחר צבע
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
                  <p className="mt-3 text-sm text-muted-foreground">הצבע שנבחר: <span className="font-black text-foreground">{selectedColor}</span></p>
                )}
              </div>
            )}

            {/* Sizes */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="p-6 bg-secondary/10 rounded-2xl border border-border/30">
                <div className="text-sm text-muted-foreground mb-4 uppercase tracking-wider font-bold flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  בחר מידה
                </div>
                <div className="flex flex-wrap gap-3">
                  {product.sizes.map((s) => (
                    <Button
                      key={s.id}
                      variant={selectedSize === s.size ? "default" : "outline"}
                      size="default"
                      onClick={() => s.quantity > 0 && setSelectedSize(s.size)}
                      disabled={s.quantity === 0}
                      className={cn(
                        "min-w-[80px] font-bold transition-all duration-300",
                        selectedSize === s.size
                          ? "bg-[#D4AF37] hover:bg-[#C9A961] text-black border-2 border-[#D4AF37] shadow-lg"
                          : "hover:border-[#D4AF37]/50",
                        s.quantity === 0 && "opacity-40 cursor-not-allowed line-through"
                      )}
                    >
                      {s.size}
                      {s.quantity > 0 && s.quantity < 5 && (
                        <span className="text-xs text-destructive mr-1">({s.quantity} נותרו)</span>
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
                      ? `✓ זמין (${selectedSizeData.quantity} יחידות)`
                      : "✗ לא זמין"}
                  </p>
                )}
              </div>
            )}

            {/* Quantity Selector */}
            <div className="p-6 bg-secondary/10 rounded-2xl border border-border/30">
              <div className="text-sm text-muted-foreground mb-4 uppercase tracking-wider font-bold">כמות</div>
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  className="font-bold"
                >
                  −
                </Button>
                <span className="text-xl sm:text-2xl font-black min-w-[50px] sm:min-w-[60px] text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                  disabled={isOutOfStock || (selectedSizeData && quantity >= selectedSizeData.quantity)}
                  className="font-bold"
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
                size="lg"
                disabled={isOutOfStock}
                className={cn(
                  "w-full font-bold",
                  addedToCart && "bg-green-600 hover:bg-green-700",
                  isOutOfStock && "opacity-50 cursor-not-allowed"
                )}
                onClick={handleAddToCart}
              >
                {addedToCart ? (
                  <>
                    <CheckCircle2 size={20} className="ml-2" />
                    נוסף לעגלה!
                  </>
                ) : isOutOfStock ? (
                  <>
                    <AlertCircle size={20} className="ml-2" />
                    לא זמין
                  </>
                ) : (
                  <>
                    <ShoppingBag size={20} className="ml-2" />
                    הוסף לעגלה
                  </>
                )}
              </Button>

              {addedToCart && (
                <Button
                  variant="outline"
                  size="default"
                  className="w-full font-semibold"
                  onClick={() => router.push("/cart")}
                >
                  <ShoppingBag size={18} className="ml-2" />
                  הצג עגלה
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

        {/* Mobile Details Section (Below Image) */}
        <div className="lg:hidden space-y-4">
          {/* Description */}
          <div className="p-3 bg-secondary/10 rounded-lg border border-border/30">
            <h2 className="text-base font-black mb-2 text-foreground flex items-center gap-2">
              <Package className="w-4 h-4 text-[#D4AF37]" />
              الوصف
            </h2>
            <p className="text-muted-foreground leading-relaxed text-sm whitespace-pre-line line-clamp-3">{product.description}</p>
          </div>

          {/* Colors */}
          {product.colors && product.colors.length > 0 && (
            <div className="p-3 bg-secondary/10 rounded-lg border border-border/30">
              <div className="text-xs text-muted-foreground mb-3 uppercase tracking-wider font-bold flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                اختر اللون
              </div>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedColor(c.name)}
                    className={cn(
                      "relative w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 transition-all duration-300 transform hover:scale-110",
                      selectedColor === c.name
                        ? "border-[#D4AF37] scale-110 shadow-lg ring-2 ring-[#D4AF37]/30"
                        : "border-border hover:border-[#D4AF37]/50"
                    )}
                    style={{ backgroundColor: c.hex }}
                    aria-label={c.name}
                    title={c.name}
                  >
                    {selectedColor === c.name && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-white drop-shadow-lg" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
              {selectedColor && (
                  <p className="mt-2 text-xs text-muted-foreground">צבע: <span className="font-black text-foreground">{selectedColor}</span></p>
              )}
            </div>
          )}

          {/* Sizes */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="p-3 bg-secondary/10 rounded-lg border border-border/30">
              <div className="text-xs text-muted-foreground mb-3 uppercase tracking-wider font-bold flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5" />
                בחר מידה
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <Button
                    key={s.id}
                    variant={selectedSize === s.size ? "default" : "outline"}
                    size="sm"
                    onClick={() => s.quantity > 0 && setSelectedSize(s.size)}
                    disabled={s.quantity === 0}
                    className={cn(
                      "min-w-[60px] h-9 sm:h-10 text-xs sm:text-sm font-black transition-all duration-300",
                      selectedSize === s.size
                        ? "bg-[#D4AF37] hover:bg-[#C9A961] text-black border-2 border-[#D4AF37] shadow-lg scale-105"
                        : "hover:border-[#D4AF37]/50",
                      s.quantity === 0 && "opacity-40 cursor-not-allowed line-through"
                    )}
                  >
                    {s.size}
                    {s.quantity > 0 && s.quantity < 5 && (
                      <span className="text-[10px] text-destructive mr-0.5">({s.quantity})</span>
                    )}
                  </Button>
                ))}
              </div>
              {selectedSizeData && (
                <p className={cn(
                  "mt-2 text-xs font-bold",
                  selectedSizeData.quantity > 0 ? "text-green-600" : "text-destructive"
                )}>
                  {selectedSizeData.quantity > 0
                    ? `✓ זמין (${selectedSizeData.quantity})`
                    : "✗ לא זמין"}
                </p>
              )}
            </div>
          )}

          {/* Quantity Selector */}
          <div className="p-3 bg-secondary/10 rounded-lg border border-border/30">
            <div className="text-xs text-muted-foreground mb-3 uppercase tracking-wider font-bold">כמות</div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
                className="h-9 w-9 font-bold"
              >
                −
              </Button>
              <span className="text-lg sm:text-xl font-black min-w-[45px] sm:min-w-[50px] text-center">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(quantity + 1)}
                disabled={isOutOfStock || (selectedSizeData && quantity >= selectedSizeData.quantity)}
                className="h-9 w-9 font-bold"
              >
                +
              </Button>
            </div>
          </div>

          <Separator className="bg-border/50" />

          {/* Add to Cart Button */}
          <div className="space-y-3">
            <Button
              variant="gold"
              size="lg"
              disabled={isOutOfStock}
              className={cn(
                "w-full h-11 sm:h-12 text-sm sm:text-base uppercase tracking-wide shadow-xl hover:shadow-2xl transition-all duration-300",
                addedToCart && "bg-green-600 hover:bg-green-700",
                isOutOfStock && "opacity-50 cursor-not-allowed"
              )}
              onClick={handleAddToCart}
            >
              {addedToCart ? (
                <>
                  <CheckCircle2 size={18} className="ml-2" />
                  נוסף לעגלה!
                </>
              ) : isOutOfStock ? (
                <>
                  <AlertCircle size={18} className="ml-2" />
                  לא זמין
                </>
              ) : (
                <>
                  <ShoppingBag size={18} className="ml-2" />
                  הוסף לעגלה
                </>
              )}
            </Button>

            {addedToCart && (
              <Button
                variant="outline"
                size="sm"
                className="w-full font-semibold"
                onClick={() => router.push("/cart")}
              >
                <ShoppingBag size={16} className="ml-2" />
                הצג עגלה
              </Button>
            )}
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-2 pt-4">
            <div className="flex flex-col items-center gap-1.5 p-2 bg-secondary/10 rounded-lg border border-border/30">
              <Truck className="w-5 h-5 text-[#D4AF37]" />
                  <p className="text-[10px] text-muted-foreground font-bold text-center">משלוח חינם</p>
            </div>
            <div className="flex flex-col items-center gap-1.5 p-2 bg-secondary/10 rounded-lg border border-border/30">
              <Shield className="w-5 h-5 text-[#D4AF37]" />
                  <p className="text-[10px] text-muted-foreground font-bold text-center">אחריות 30 יום</p>
            </div>
            <div className="flex flex-col items-center gap-1.5 p-2 bg-secondary/10 rounded-lg border border-border/30">
              <Package className="w-5 h-5 text-[#D4AF37]" />
                  <p className="text-[10px] text-muted-foreground font-bold text-center">החזר קל</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
