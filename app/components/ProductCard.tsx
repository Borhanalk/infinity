"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { cn } from "@/lib/utils";

type Product = {
  id: string;
  name: string;
  price: number;
  description: string;
  isNew: boolean;
  isOnSale: boolean;
  discountPercent?: number | null;
  originalPrice?: number | null;
  categoryId: number;
  category?: {
    id: number;
    name: string;
  };
  company?: {
    id: number;
    name: string;
    logoUrl?: string | null;
  } | null;
  images: Array<{
    id: string;
    url: string;
  }>;
  colors: Array<{
    id: string;
    name: string;
    hex: string;
  }>;
  sizes: Array<{
    id: string;
    size: string;
    quantity: number;
  }>;
};

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();

  const imageUrl = product.images && product.images.length > 0
    ? product.images[0].url
    : "/placeholder-image.jpg";

  const categoryName = product.category?.name || "";
  
  // حساب السعر الأصلي والسعر بعد التنزيل
  const displayPrice = product.isOnSale && product.originalPrice && product.originalPrice > product.price
    ? product.originalPrice
    : null;

  const handleViewDetails = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push(`/products/${product.id}`);
  };

  return (
    <Card className="group relative overflow-hidden hover:shadow-2xl transition-all duration-500 border-border/50 hover:border-border rounded-xl sm:rounded-2xl">
      <div className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10 flex flex-col gap-1 sm:gap-2">
        {product.isNew && (
          <Badge variant="new" className="text-[10px] px-2 py-0.5 sm:text-xs sm:px-4 sm:py-1.5 uppercase tracking-wider shadow-lg font-black">
            NEW
          </Badge>
        )}
        {product.isOnSale && (
          <Badge variant="sale" className="text-[10px] px-2 py-0.5 sm:text-xs sm:px-4 sm:py-1.5 uppercase tracking-wider shadow-lg font-black">
            SALE
          </Badge>
        )}
      </div>
      {/* Image wrapper: صغيرة على الهاتف، متوسطة على الديسكتوب */}
      <div className="relative w-full aspect-[3/4] bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center overflow-hidden rounded-t-xl sm:rounded-t-2xl">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/placeholder-image.jpg";
          }}
        />
      </div>
      <CardContent className="p-2 sm:p-4 lg:p-6 text-right">
        <div className="flex items-center justify-between mb-1.5 sm:mb-3">
          {categoryName && (
            <p className="text-muted-foreground text-[10px] sm:text-xs font-bold uppercase tracking-wider line-clamp-1">{categoryName}</p>
          )}
          {product.company && (
            <div className="flex items-center gap-1 sm:gap-2">
              {product.company.logoUrl ? (
                <img
                  src={product.company.logoUrl}
                  alt={product.company.name}
                  className="w-4 h-4 sm:w-6 sm:h-6 object-contain"
                />
              ) : (
                <span className="text-[10px] sm:text-xs text-muted-foreground font-bold line-clamp-1">{product.company.name}</span>
              )}
            </div>
          )}
        </div>
        <Link href={`/products/${product.id}`} className="block group/link">
          <h3 className="font-black text-foreground text-xs sm:text-base lg:text-lg mb-1.5 sm:mb-3 lg:mb-4 group-hover/link:text-foreground/80 transition-colors leading-tight line-clamp-2 cursor-pointer">
            {product.name || "منتج"}
          </h3>
        </Link>
        <div className="flex items-center justify-start gap-2 sm:gap-3 lg:gap-4 mb-2 sm:mb-3 lg:mb-4">
          {product.isOnSale && displayPrice && displayPrice > product.price && (
            <span className="text-destructive text-xs sm:text-sm lg:text-base line-through font-medium">{displayPrice.toFixed(2)} ₪</span>
          )}
          <span
            className={cn(
              "text-sm sm:text-xl lg:text-2xl font-black",
              product.isOnSale ? "text-destructive" : "text-foreground"
            )}
          >
            {product.price.toFixed(2)} ₪
          </span>
        </div>

        {/* Details Button */}
        <div className="mt-2 sm:mt-3 lg:mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleViewDetails}
            className="w-full uppercase tracking-wide text-[10px] sm:text-xs h-8 sm:h-10"
          >
            <Eye size={12} className="ml-1 sm:w-3.5 sm:h-3.5" />
            التفاصيل
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
