"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Category = {
  id: number;
  name: string;
  imageUrl?: string | null;
};

export function CategoryGrid() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCategories(data);
        } else {
          setCategories([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching categories:", err);
        setCategories([]);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-48 bg-gray-100 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-7xl mx-auto">
      {categories.map((category) => {
        return (
          <Card
            key={category.id}
            asChild
            className={cn(
              "relative h-48 sm:h-56 lg:h-64 overflow-hidden group hover:shadow-2xl transition-all duration-500 border-border/50 hover:border-border rounded-xl sm:rounded-2xl"
            )}
          >
            <Link href={`/categories/${category.id}`}>
              {category.imageUrl && (
                <img
                  src={category.imageUrl}
                  alt={category.name}
                  className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity duration-500 group-hover:scale-110 transition-transform duration-700"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-br from-background/80 via-background/60 to-background/40 group-hover:from-background/70 group-hover:via-background/50 group-hover:to-background/30 transition-all duration-500"></div>
              <div className="absolute inset-0 flex items-center justify-center font-black text-3xl sm:text-4xl lg:text-6xl opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all duration-500">
                {category.name.toUpperCase()}
              </div>
              <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-black mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-300">{category.name}</h3>
                <span className="text-xs sm:text-sm font-bold text-muted-foreground group-hover:text-foreground transition-colors">קנה עכשיו</span>
              </div>
            </Link>
          </Card>
        );
      })}
      {/* Add Sale Category */}
      <Card
        asChild
        className={cn(
          "relative h-48 sm:h-56 lg:h-64 overflow-hidden group hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-destructive via-destructive/90 to-destructive/80 text-destructive-foreground border-2 border-destructive/50 hover:border-destructive rounded-xl sm:rounded-2xl"
        )}
      >
        <Link href="/sale">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_70%)]"></div>
          <div className="absolute inset-0 flex items-center justify-center font-black text-3xl sm:text-4xl lg:text-6xl opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all duration-500">
            SALE
          </div>
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-black mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-300">מבצעים</h3>
            <span className="text-xs sm:text-sm font-bold opacity-90 group-hover:opacity-100 transition-opacity">קנה עכשיו</span>
          </div>
        </Link>
      </Card>
    </div>
  );
}
