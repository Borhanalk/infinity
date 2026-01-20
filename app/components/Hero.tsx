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
      <div className="relative w-1/2 lg:w-1/2 flex flex-col justify-center p-2 sm:p-3 md:p-4 lg:p-6 xl:p-24 text-right z-10">
        <span className="text-muted-foreground font-bold tracking-widest text-[9px] sm:text-[10px] md:text-xs mb-1.5 sm:mb-2 md:mb-4 lg:mb-6 uppercase animate-fade-in">EST. 2024</span>
        <h1 className="text-base sm:text-lg md:text-2xl lg:text-4xl xl:text-6xl 2xl:text-8xl font-black mb-1.5 sm:mb-2 md:mb-4 lg:mb-6 leading-[1.1] animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            אלגנטיות
          </span>
          <br />
          <span className="text-muted-foreground text-xs sm:text-sm md:text-base lg:text-lg xl:text-2xl 2xl:text-3xl">מתחילה כאן.</span>
        </h1>
        <p className="text-muted-foreground text-[10px] sm:text-xs md:text-sm lg:text-base xl:text-lg mb-3 sm:mb-4 md:mb-6 lg:mb-12 leading-relaxed max-w-lg animate-fade-in hidden md:block" style={{ animationDelay: "0.2s" }}>
          עיצובים מודרניים המתאימים לגבר המזרחי. איכות גבוהה ופרטים מדויקים.
        </p>
        <div className="flex flex-wrap gap-1.5 sm:gap-2 md:gap-3 lg:gap-4 justify-end animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <Button
            asChild
            variant="gold"
            size="sm"
            className="group uppercase tracking-wide shadow-xl hover:shadow-2xl text-[9px] sm:text-[10px] md:text-xs lg:text-sm xl:text-base h-7 sm:h-8 md:h-10 lg:h-12 px-2 sm:px-3 md:px-4"
          >
            <Link href="/collections/new">
              <ArrowRight size={10} className="group-hover:-translate-x-1 transition-transform rotate-180 sm:w-3 sm:h-3 md:w-4 md:h-4" />
              <span className="hidden sm:inline">קנה חדש</span>
              <span className="sm:hidden">חדש</span>
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="sm"
            className="uppercase tracking-wide border-2 shadow-lg hover:shadow-xl text-[9px] sm:text-[10px] md:text-xs lg:text-sm xl:text-base h-7 sm:h-8 md:h-10 lg:h-12 px-2 sm:px-3 md:px-4"
          >
            <Link href="/products">
              <span className="hidden sm:inline">כל המוצרים</span>
              <span className="sm:hidden">מוצרים</span>
            </Link>
          </Button>
        </div>
      </div>
      
      {/* Image - Right on mobile (RTL), Left on desktop */}
      <div className="relative w-1/2 lg:w-1/2 bg-gradient-to-br from-secondary/30 via-accent/20 to-background flex items-center justify-center overflow-hidden min-h-[180px] sm:min-h-[250px] md:min-h-[400px] lg:min-h-[500px] xl:h-[700px]">
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
