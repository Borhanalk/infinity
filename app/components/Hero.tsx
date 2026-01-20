"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function Hero() {
  return (
    <section className="relative flex flex-col-reverse lg:flex-row min-h-[500px] sm:min-h-[600px] lg:h-[700px] border-b border-border overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-secondary/20"></div>
      
      <div className="relative w-full lg:w-1/2 flex flex-col justify-center p-6 sm:p-8 lg:p-24 text-right z-10">
        <span className="text-muted-foreground font-bold tracking-widest text-xs mb-4 sm:mb-6 uppercase animate-fade-in">EST. 2024</span>
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-black mb-4 sm:mb-6 leading-[1.1] animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            אלגנטיות
          </span>
          <br />
          <span className="text-muted-foreground">מתחילה כאן.</span>
        </h1>
        <p className="text-muted-foreground text-base sm:text-lg lg:text-xl mb-8 sm:mb-12 leading-relaxed max-w-lg animate-fade-in" style={{ animationDelay: "0.2s" }}>
          עיצובים מודרניים המתאימים לגבר המזרחי. איכות גבוהה ופרטים מדויקים.
        </p>
        <div className="flex flex-wrap gap-3 sm:gap-4 justify-end animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <Button
            asChild
            variant="gold"
            size="lg"
            className="group uppercase tracking-wide shadow-xl hover:shadow-2xl text-sm sm:text-base"
          >
            <Link href="/collections/new">
              <ArrowRight size={18} className="group-hover:-translate-x-1 transition-transform rotate-180" />
              <span>קנה חדש</span>
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="uppercase tracking-wide border-2 shadow-lg hover:shadow-xl text-sm sm:text-base"
          >
            <Link href="/products">
              כל המוצרים
            </Link>
          </Button>
        </div>
      </div>
      <div className="relative w-full md:w-1/2 bg-gradient-to-br from-secondary/30 via-accent/20 to-background flex items-center justify-center overflow-hidden">
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
              fallback.className = "text-muted-foreground/20 font-black text-6xl md:text-8xl uppercase rotate-[-5deg] select-none";
              fallback.textContent = "[صورة الواجهة]";
              target.parentElement?.appendChild(fallback);
            }}
          />
        </div>
      </div>
    </section>
  );
}
