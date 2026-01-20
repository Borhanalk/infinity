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
    <Card className="group relative overflow-hidden hover:shadow-2xl transition-all duration-500 border-border/50 hover:border-border rounded-lg sm:rounded-xl lg:rounded-2xl">
      <div className="absolute top-1 right-1 sm:top-2 sm:right-2 lg:top-4 lg:right-4 z-10 flex flex-col gap-0.5 sm:gap-1 lg:gap-2">
        {product.isNew && (
          <Badge variant="new" className="text-[8px] px-1.5 py-0.5 sm:text-[10px] sm:px-2 sm:py-0.5 lg:text-xs lg:px-4 lg:py-1.5 uppercase tracking-wider shadow-lg font-black">
            NEW
          </Badge>
        )}
        {product.isOnSale && (
          <Badge variant="sale" className="text-[8px] px-1.5 py-0.5 sm:text-[10px] sm:px-2 sm:py-0.5 lg:text-xs lg:px-4 lg:py-1.5 uppercase tracking-wider shadow-lg font-black">
            SALE
          </Badge>
        )}
      </div>
      {/* Image wrapper: مربع على جميع الشاشات */}
      <div className="relative w-full aspect-square bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center overflow-hidden rounded-t-lg sm:rounded-t-xl lg:rounded-t-2xl">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/placeholder-image.jpg";
          }}
        />
      </div>
      <CardContent className="p-1.5 sm:p-2 md:p-3 lg:p-4 xl:p-6 text-right">
        <div className="flex items-center justify-between mb-1 sm:mb-1.5 lg:mb-3">
          {categoryName && (
            <p className="text-muted-foreground text-[9px] sm:text-[10px] md:text-xs font-bold uppercase tracking-wider line-clamp-1">{categoryName}</p>
          )}
          {product.company && (
            <div className="flex items-center gap-0.5 sm:gap-1 lg:gap-2">
              {product.company.logoUrl ? (
                <img
                  src={product.company.logoUrl}
                  alt={product.company.name}
                  className="w-3 h-3 sm:w-4 sm:h-4 lg:w-6 lg:h-6 object-contain"
                />
              ) : (
                <span className="text-[9px] sm:text-[10px] md:text-xs text-muted-foreground font-bold line-clamp-1">{product.company.name}</span>
              )}
            </div>
          )}
        </div>
        <Link href={`/products/${product.id}`} className="block group/link">
          <h3 className="font-black text-foreground text-[10px] sm:text-xs md:text-sm lg:text-base xl:text-lg mb-1 sm:mb-1.5 lg:mb-3 xl:mb-4 group-hover/link:text-foreground/80 transition-colors leading-tight line-clamp-2 cursor-pointer">
            {product.name || "מוצר"}
          </h3>
        </Link>
        <div className="flex items-center justify-start gap-1 sm:gap-2 lg:gap-3 xl:gap-4 mb-1.5 sm:mb-2 lg:mb-3 xl:mb-4">
          {product.isOnSale && displayPrice && displayPrice > product.price && (
            <span className="text-destructive text-[9px] sm:text-[10px] md:text-xs lg:text-sm xl:text-base line-through font-medium">{displayPrice.toFixed(2)} ₪</span>
          )}
          <span
            className={cn(
              "text-[11px] sm:text-sm md:text-base lg:text-xl xl:text-2xl font-black",
              product.isOnSale ? "text-destructive" : "text-foreground"
            )}
          >
            {product.price.toFixed(2)} ₪
          </span>
        </div>

        {/* Details Button */}
        <div className="mt-1.5 sm:mt-2 lg:mt-3 xl:mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleViewDetails}
            className="w-full font-semibold text-[10px] sm:text-xs md:text-sm h-7 sm:h-8 lg:h-9 xl:h-10"
          >
            <Eye size={12} className="ml-1 sm:ml-1.5 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4" />
            פרטים
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
