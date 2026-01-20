"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function Hero() {
  return (
    <section className="relative flex flex-row-reverse items-center lg:flex-row min-h-[180px] sm:min-h-[250px] md:min-h-[400px] lg:min-h-[500px] xl:h-[700px] border-b border-border overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-secondary/20"></div>
      
      {/* Text Content - Left on mobile (RTL), Right on desktop */}
      <div className="relative w-1/2 lg:w-1/2 flex flex-col justify-center p-3 sm:p-4 md:p-6 lg:p-8 xl:p-24 text-right z-10 overflow-hidden">
        <h1 className="text-lg sm:text-2xl md:text-3xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-black mb-2 sm:mb-3 md:mb-4 lg:mb-6 leading-tight animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <span className="bg-gradient-to-r from-foreground via-[#D4AF37] to-foreground bg-clip-text text-transparent">
            ברוכים הבאים ל־INFINITY MOTAGEM SEVEN
          </span>
        </h1>
        <p className="text-muted-foreground text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl mb-4 sm:mb-5 md:mb-6 lg:mb-8 leading-relaxed max-w-lg animate-fade-in" style={{ animationDelay: "0.2s" }}>
          אופנת גברים יוקרתית. סטייל מודרני, איכות גבוהה ועיצובים מדויקים לכל הופעה.
        </p>
        <div className="flex flex-wrap gap-2 sm:gap-3 md:gap-4 justify-end animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <Button
            asChild
            variant="gold"
            size="default"
            className="group font-semibold"
          >
            <Link href="/collections/new">
              <ArrowRight size={16} className="group-hover:-translate-x-1 transition-transform rotate-180" />
              <span className="hidden sm:inline">קנה חדש</span>
              <span className="sm:hidden">חדש</span>
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="default"
            className="font-semibold"
          >
            <Link href="/products">
              <span className="hidden sm:inline">כל המוצרים</span>
              <span className="sm:hidden">מוצרים</span>
            </Link>
          </Button>
        </div>
      </div>
      
      {/* Image - Right on mobile (RTL), Left on desktop */}
      <div className="relative w-1/2 lg:w-1/2 bg-gradient-to-br from-secondary/30 via-accent/20 to-background flex items-center justify-center overflow-hidden min-h-[200px] sm:min-h-[280px] md:min-h-[400px] lg:min-h-[500px] xl:h-[700px]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(212,175,55,0.1),transparent_70%)]"></div>
        <div className="relative w-full h-full flex items-center justify-center">
          <img
            src="/infinity.jpeg"
            alt="Infinity"
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback if image doesn't exist
              const target = e.target as HTMLImageElement;
              target.style.display = "none";
              const fallback = document.createElement("div");
              fallback.className = "text-muted-foreground/20 font-black text-xl sm:text-2xl md:text-4xl lg:text-6xl xl:text-8xl uppercase rotate-[-5deg] select-none";
              fallback.textContent = "[صورة الواجهة]";
              target.parentElement?.appendChild(fallback);
            }}
          />
        </div>
      </div>
    </section>
  );
}
