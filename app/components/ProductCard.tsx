"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "../contexts/CartContext";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Eye, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

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
  const { addItem } = useCart();
  const router = useRouter();
  const [addedToCart, setAddedToCart] = useState(false);
  
  const imageUrl = product.images && product.images.length > 0 
    ? product.images[0].url 
    : "/placeholder-image.jpg";
  
  const categoryName = product.category?.name || "";
  const displayPrice = product.originalPrice && product.originalPrice > product.price
    ? product.originalPrice
    : null;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: imageUrl,
    });
    
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleViewDetails = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push(`/products/${product.id}`);
  };

  return (
    <Card className="group relative overflow-hidden hover:shadow-2xl transition-all duration-500 border-border/50 hover:border-border rounded-2xl">
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        {product.isNew && (
          <Badge variant="new" className="text-xs px-4 py-1.5 uppercase tracking-wider shadow-lg font-black">
            NEW
          </Badge>
        )}
        {product.isOnSale && (
          <Badge variant="sale" className="text-xs px-4 py-1.5 uppercase tracking-wider shadow-lg font-black">
            SALE
          </Badge>
        )}
      </div>
      <div className="h-64 sm:h-80 bg-gradient-to-br from-muted to-muted/50 relative flex items-center justify-center overflow-hidden rounded-t-2xl">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/placeholder-image.jpg";
          }}
        />
      </div>
      <CardContent className="p-4 sm:p-6 text-right">
        <div className="flex items-center justify-between mb-3">
          {categoryName && (
            <p className="text-muted-foreground text-xs font-bold uppercase tracking-wider">{categoryName}</p>
          )}
          {product.company && (
            <div className="flex items-center gap-2">
              {product.company.logoUrl ? (
                <img
                  src={product.company.logoUrl}
                  alt={product.company.name}
                  className="w-6 h-6 object-contain"
                />
              ) : (
                <span className="text-xs text-muted-foreground font-bold">{product.company.name}</span>
              )}
            </div>
          )}
        </div>
        <Link href={`/products/${product.id}`} className="block group/link">
          <h3 className="font-black text-foreground text-base sm:text-lg mb-3 sm:mb-4 group-hover/link:text-foreground/80 transition-colors leading-tight line-clamp-2 cursor-pointer">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center justify-start gap-3 sm:gap-4 mb-3 sm:mb-4">
          {displayPrice && displayPrice > product.price && (
            <span className="text-muted-foreground text-sm sm:text-base line-through font-medium">{displayPrice} ₪</span>
          )}
          <span
            className={cn(
              "text-xl sm:text-2xl font-black",
              product.isOnSale ? "text-destructive" : "text-foreground"
            )}
          >
            {product.price} ₪
          </span>
        </div>
        
        {/* Always Visible Buttons */}
        <div className="flex gap-2 mt-3 sm:mt-4">
          <Button
            variant="gold"
            size="sm"
            onClick={handleAddToCart}
            className={cn(
              "flex-1 uppercase tracking-wide text-xs",
              addedToCart && "bg-green-600 hover:bg-green-700"
            )}
          >
            {addedToCart ? (
              <>
                <CheckCircle2 size={14} className="ml-1" />
                تمت الإضافة
              </>
            ) : (
              <>
                <ShoppingBag size={14} className="ml-1" />
                أضف للسلة
              </>
            )}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleViewDetails}
            className="flex-1 uppercase tracking-wide text-xs"
          >
            <Eye size={14} className="ml-1" />
            التفاصيل
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
