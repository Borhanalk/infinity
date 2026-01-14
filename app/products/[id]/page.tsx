"use client";

import { useEffect, useMemo, useState } from "react";
import { useCart } from "../../contexts/CartContext";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type Product = {
  id: string;
  name: string;
  price: number;
  description: string;
  isNew?: boolean;
  isOnSale?: boolean;
  discountPercent?: number | null;
  originalPrice?: number | null;
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
  const id = params?.id as string;
  const { addItem } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

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
          throw new Error(data.details || data.error || `فشل تحميل المنتج (${res.status})`);
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

  return (
    <div className="min-h-screen bg-background text-foreground pt-24">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
          {/* IMAGES SECTION */}
          <div>
            {/* Main Image */}
            {displayImage ? (
              <Card className="mb-6 overflow-hidden border-border">
                <div className="relative aspect-square">
                  <img
                    src={displayImage}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 flex gap-2">
                    {product.isNew && (
                      <Badge variant="new" className="text-xs px-4 py-1.5 uppercase tracking-wider font-black">
                        NEW
                      </Badge>
                    )}
                    {product.isOnSale && (
                      <Badge variant="sale" className="text-xs px-4 py-1.5 uppercase tracking-wider font-black">
                        SALE
                      </Badge>
                    )}
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="mb-6 border-border">
                <div className="aspect-square bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                  <span className="text-6xl opacity-30">🛍️</span>
                </div>
              </Card>
            )}

            {/* Thumbnail Images */}
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 md:grid-cols-5 gap-3">
                {product.images.map((img, index) => (
                  <Button
                    key={img.url}
                    variant="outline"
                    size="icon"
                    onClick={() => setSelectedImage(img.url)}
                    className={cn(
                      "h-24 w-full rounded-xl overflow-hidden p-0 border-2 transition-all",
                      selectedImage === img.url
                        ? "border-[#D4AF37] scale-105"
                        : "border-border hover:border-border/80"
                    )}
                  >
                    <img
                      src={img.url}
                      alt={`${product.name} - Image ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </Button>
                ))}
              </div>
            )}
          </div>

          {/* PRODUCT INFO */}
          <div className="space-y-8">
            <div>
              {product.company && (
                <div className="flex items-center gap-3 mb-4">
                  {product.company.logoUrl ? (
                    <img
                      src={product.company.logoUrl}
                      alt={product.company.name}
                      className="w-10 h-10 object-contain"
                    />
                  ) : null}
                  <div>
                    <p className="text-sm text-muted-foreground font-bold">العلامة التجارية</p>
                    <p className="text-base font-black text-foreground">{product.company.name}</p>
                  </div>
                </div>
              )}
              <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">{product.name}</h1>
              <div className="flex items-center gap-4 mb-6">
                {displayPrice && displayPrice > product.price && (
                  <span className="text-2xl text-muted-foreground line-through font-medium">{displayPrice} ₪</span>
                )}
                <span className={cn(
                  "text-4xl font-black",
                  product.isOnSale ? "text-destructive" : "text-foreground"
                )}>
                  {product.price} ₪
                </span>
              </div>
            </div>

            <Separator />

            <div>
              <h2 className="text-xl font-black mb-4 text-foreground">الوصف</h2>
              <p className="text-muted-foreground leading-relaxed text-lg">{product.description}</p>
            </div>

            {product.colors && product.colors.length > 0 && (
              <div>
                <Separator className="mb-6" />
                <div className="text-sm text-muted-foreground mb-4 uppercase tracking-wider font-bold">اللون</div>
                <div className="flex gap-4">
                  {product.colors.map((c) => (
                    <Button
                      key={c.id}
                      variant="outline"
                      size="icon"
                      onClick={() => setSelectedColor(c.name)}
                      className={cn(
                        "w-16 h-16 rounded-full border-2 transition-all",
                        selectedColor === c.name
                          ? "border-[#D4AF37] scale-110"
                          : "border-border hover:border-border/80"
                      )}
                      style={{ backgroundColor: c.hex }}
                      aria-label={c.name}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>
            )}

            {product.sizes && product.sizes.length > 0 && (
              <div>
                <Separator className="mb-6" />
                <div className="text-sm text-muted-foreground mb-4 uppercase tracking-wider font-bold">المقاس</div>
                <div className="flex flex-wrap gap-3">
                  {product.sizes.map((s) => (
                    <Button
                      key={s.id}
                      variant={selectedSize === s.size ? "default" : "outline"}
                      size="lg"
                      onClick={() => s.quantity > 0 && setSelectedSize(s.size)}
                      disabled={s.quantity === 0}
                      className={cn(
                        "min-w-[80px]",
                        selectedSize === s.size && "bg-[#D4AF37] hover:bg-[#C9A961] text-black border-[#D4AF37]",
                        s.quantity === 0 && "opacity-50 cursor-not-allowed"
                      )}
                    >
                      {s.size}
                      {s.quantity === 0 && " (نفذ)"}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <Separator />

            <Button
              variant="gold"
              size="xl"
              className="w-full uppercase tracking-wide shadow-xl hover:shadow-2xl"
              onClick={() =>
                addItem({
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  image: displayImage,
                  color: selectedColor || undefined,
                  size: selectedSize || undefined,
                })
              }
            >
              <ShoppingBag size={20} className="ml-2" />
              הוסף לעגלה
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
